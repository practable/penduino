<template>
<div class='container-fluid m-2 practable-component'>
	<div>
		<canvas id="smoothie-chart" width="640" height="120"></canvas>
	</div>
	<div id="buttons">
		<article>
			<!-- <button id="start" class="btn btn-default btn-lg" @click="start">Start</button> -->
            <button id="start" class="button-lg button-primary" @click="start">Start</button>
			<button id="brake" class="button-lg button-primary" @click="brake">Brake</button>
			<button id="load" class="button-lg button-primary" @click="load">Load</button>
			<button id="free" class="button-lg button-primary" @click="free">Free</button>
			<button id="cal" class="button-lg button-warning" @click="calibrate">Cal</button>
		</article>
	</div>

<article>

<h2 class='m-2'> Settings </h2>

<div class="row mb-4">
	<label class="col-4 sliderlabel" for="driveSlider"> Drive ({{driveParam}}%)</label>
	<div class="col-6" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
		<input type="range" min="0" max="100" v-model="driveParam" class="slider" id="driveSlider" @change="sendDrive">
	</div>
</div>

<div class="row mb-4">
	<label class="col-4 sliderlabel"> Brake ({{brakeParam}}%)</label>
	<div class="col-6" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
		<input type="range" min="0" max="100" v-model="brakeParam" class="slider" id="brakeSlider" @change='sendBrake'>
	</div>
</div>

<div class="row mb-4">
	<label class="col-4 sliderlabel"> Start bump ({{startParam}}ms)</label>
	<div class="col-6" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
		<input type="range" min="1" max="100" v-model="startParam" class="slider" id="startSlider" > 
	</div>
</div>

<div class="row">
	<label class="col-4 sliderlabel"> Report every {{intervalParam}}ms</label> 
	<div class="col-6" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
		<input type="range" min="20" max="200" v-model="intervalParam" class="slider" id="dataSlider" @change='sendInterval'>
	</div>
</div>



</article>



</div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

import { SmoothieChart } from 'smoothie';
import { TimeSeries } from 'smoothie';

//import Tooltip from "./Tooltip.vue";


export default {
	name: "ControlPanel",
	components:{
		//Tooltip,
		
	},
	props:{
		url: String,
	},
    data(){
        return{
			dataSocket: null,
			canvas: null,
        }
    },
    computed:{
        ...mapGetters([
            'getDataURLObtained',
            'getDrive',
            'getStart',
            'getBrake',
            'getInterval'

        ]),
        driveParam: {
            get(){
                return this.getDrive;
            },
            set(val){
                this.updateDrive(val);
            }
        },
        brakeParam: {
            get(){
                return this.getBrake;
            },
            set(val){
                this.updateBrake(val);
            }
        },
        intervalParam: {
            get(){
                return this.getInterval;
            },
            set(val){
                this.updateInterval(val);
            }
        },
        startParam: {
            get(){
                return this.getStart;
            },
            set(val){
                this.updateStart(val);
            }
        }
    },
	watch:{
		url(){
            try{
				if(this.url != '' && this.getDataURLObtained){
					this.connect();	
				} else{
					console.log('disconnecting: ' + this.url);
				}
				
			} catch(e){
				console.log(e);
			}
            
			
		},
		
	},
    mounted(){
		


	},
	methods:{
		...mapActions([
			'setDraggable',
            'updateDrive',
            'updateBrake',
            'updateStart',
            'updateInterval',
            'sendDrive',
            'sendBrake',
            'sendInterval'
		]),
		start(){
			this.$store.dispatch('start', this.startParam);
		},
		brake(){
			this.$store.dispatch('brake');
		},
		free(){
			this.$store.dispatch('free');
		},
		load(){
			this.$store.dispatch('load');
		},
		calibrate(){
			this.$store.dispatch('calibrate');
		},
		hotkey(event){
			if(event.key == "f"){
				this.free();
            } else if(event.key == "b"){
				this.brake();
			} else if(event.key == "l"){
				this.load();
			} else if(event.key == 's'){
				this.start();
			}
		},
		test(){
			console.log('SECOND');
		},
		connect(){

			let _this = this;

			this.dataSocket = new WebSocket(this.url);
			//console.log(this.dataSocket);
			this.$store.dispatch('setDataSocket', this.dataSocket);

			//let dataOpen = false;
			var delay = 0;
			let delay_sum = 0;
			// let avgDelay = 0;
			// let delays = [];
			var messageCount = 0;
			let a;
			let b;
			let debug = false;
			let wrapEncoder = true;

			var initialSamplingCount = 1200 // 2 mins at 10Hz
			var delayWeightingFactor = 60  // 1 minute drift in 1 hour
			let encoderPPR = 2400

			let responsiveSmoothie = true;
			let thisTime;

			var chart = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:10,grid:{fillStyle:'#ffffff'}, interpolation:"linear",maxValue:135,minValue:-135,labels:{fillStyle:'#0024ff',precision:0}}); //interpolation:'linear
			this.canvas = document.getElementById("smoothie-chart");
			let series = new TimeSeries();
			chart.addTimeSeries(series, {lineWidth:2,strokeStyle:'#0024ff'});
			chart.streamTo(this.canvas, 0);

			this.dataSocket.onopen = () =>  {
				//dataOpen = true; 
                _this.updateDrive(50);
                _this.sendDrive(false);
                console.log('drive');

                setTimeout(() => {
                    _this.updateInterval(50);
                    _this.sendInterval(false);
                    console.log('interval');
                }, 1000)
                
                setTimeout(() => {
                    _this.updateBrake(50);
                    _this.sendBrake(false);
                    console.log('brake');
                }, 2000)
                
                
				
                
                
                console.log('sent starting parameters');
				
			};

			
			this.dataSocket.onmessage = (event) =>  {
				
				try {
					
					var obj = JSON.parse(event.data);
					var msgTime = obj.time;
					var thisDelay = new Date().getTime() - msgTime;

					var enc = obj.enc;

					if(messageCount == 0){
                        _this.$store.dispatch('setStartTime', msgTime);
						delay = thisDelay
						delay_sum += thisDelay;
					} else{
						if(!isNaN(thisDelay)){
							delay_sum += thisDelay;
							delay = delay_sum / (messageCount + 1);
						} else{
							delay_sum += delay;
							delay = delay_sum / (messageCount + 1);
							
						}
						
					}

					
					
					a = 1 / delayWeightingFactor
					b = 1 - a

					
					if (messageCount < initialSamplingCount) {
						thisDelay = ((delay * messageCount) + thisDelay) / (messageCount + 1)
					} else {
						thisDelay = (delay * b) + (thisDelay * a)
					}
					
					messageCount += 1

					//https://stackoverflow.com/questions/4633177/c-how-to-wrap-a-float-to-the-interval-pi-pi
					if (wrapEncoder){ //wrap and convert to degrees
						enc = Math.atan2(Math.sin(obj.enc / (encoderPPR/2) * Math.PI), Math.cos(obj.enc / (encoderPPR/2) * Math.PI)) / Math.PI * 180
						enc = Math.min(135, enc)
						enc = Math.max(-135, enc)
					}
					else{ //convert to degrees only
						enc = enc * 360.0 / encoderPPR;
					}

					thisTime = msgTime + thisDelay
					
					if (!isNaN(thisTime) && !isNaN(enc)){
						series.append(msgTime + thisDelay, enc)

                        //Calculate angular velocity using new data sent through as well as currently stored values - before updating those values
                        let values = {theta_1: enc * Math.PI / 180, theta_0:_this.$store.getters.getCurrentAngle, t_1:msgTime, t_0:_this.$store.getters.getCurrentTime}
                        _this.$store.dispatch('setCurrentAngVel', values)
                        
                        _this.$store.dispatch('setCurrentAngle',enc * Math.PI / 180);		//for output graph, convert to radians
						_this.$store.dispatch('setCurrentTime', msgTime);			//for output graph

						if(debug) {
							console.log(delay,thisDelay,msgTime, enc)
						}
					}
					else {
						if (debug) {
							console.log("NaN so not logging to smoothie",delay,thisDelay,msgTime, enc)
						}
					} 

				} catch (e) {
                    if(debug) {
                        console.log(e)
                    }
				}
			}


			
			window.addEventListener('keydown', this.hotkey, false);
			//window.addEventListener('pagehide', this.free);				//closing window
			//window.addEventListener('beforeunload', this.free);			//refreshing page, changing URL
	
		
	},

	},
}




</script>

<style scoped>

#smoothie-chart{
	width:100%;
	height: 120px;
}

.sliderlabel{ text-align: right;}


/* Clear floats after the columns */
.row:after {
	content: "";
	display: table;
	clear: both;
}

</style>