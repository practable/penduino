<template>
<div class='container-fluid practable-component'>
	<!-- <div>
		<canvas id="smoothie-chart" width="640" height="120"></canvas>
	</div> -->

	<div class="d-flex flex-column flex-lg-row align-items-center justify-content-center">
		<div class="col-lg-6" id="buttons">
			<button id="start" class="button-xlg button-primary m-2" @click="start">Start</button>
			<button id="brake" class="button-xlg button-primary m-2" @click="brake">Brake</button>
			<button id="load" class="button-xlg button-primary m-2" @click="load">Load</button>
			<button id="free" class="button-xlg button-primary m-2" @click="free">Free</button>
			<button id="cal" class="button-xlg button-warning m-2" @click="calibrate">Cal</button>
		</div>

		<div class="col-lg-6" id="control-settings">

			<div class="d-flex flex-row align-items-center justify-content-end mb-2">
				<label class="sliderlabel" for="driveSlider"> Drive ({{driveParam}}%)</label>
				<div class="ms-2" >
					<input type="range" min="0" max="100" v-model="driveParam" class="slider" id="driveSlider" @change="sendDrive" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)" @mouseleave="setDraggable(true)">
				</div>
			</div>

			<div class="d-flex flex-row align-items-center justify-content-end mb-2">
				<label class="sliderlabel" for="brakeSlider"> Brake ({{brakeParam}}%)</label>
				<div class="ms-2" >
					<input type="range" min="0" max="100" v-model="brakeParam" class="slider" id="brakeSlider" @change='sendBrake' @mousedown="setDraggable(false)" @mouseup="setDraggable(true)" @mouseleave="setDraggable(true)">
				</div>
			</div>

			<div class="d-flex flex-row align-items-center justify-content-end mb-2">
				<label class="sliderlabel" for="startSlider"> Start bump ({{startParam}}ms)</label>
				<div class="ms-2">
					<input type="range" min="1" max="100" v-model="startParam" class="slider" id="startSlider" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)" @mouseleave="setDraggable(true)"> 
				</div>
			</div>

			<div class="d-flex flex-row align-items-center justify-content-end mb-2">
				<label class="sliderlabel" for="dataSlider"> Report every {{intervalParam}}ms</label> 
				<div class="ms-2">
					<input type="range" min="20" max="200" v-model="intervalParam" class="slider" id="dataSlider" @change='sendInterval' @mousedown="setDraggable(false)" @mouseup="setDraggable(true)" @mouseleave="setDraggable(true)">
				</div>
			</div>
		</div>

	</div>

	<div class="d-flex flex-row">
        <popup-help id="popup-help-control-panel">
            <template v-slot:header>
                <h5> Control Panel </h5>
            </template>
            <template v-slot:body>
                
				<p> 
					<b>Start</b> will get the pendulum moving and drive it at an amplitude set by the <b>Drive</b> percentage. <b>Brake</b> will stop the pendulum
					at a rate set by the <b>Brake</b> percentage. <b>Load</b> short circuits the driving coil so that a current is induced when the permanent magnet
					moves passed it, removing energy and slowing the pendulum. <b>Free</b>leaves the coil open circuited, so the pendulum slows due to intrinsic resistive forces only. 
					<b>Cal</b> will calibrate the zero position. The <b>Report every</b> slider allows you to set the sampling period.
					The <b>Start bump</b> slider sets the time that the start command initially energises the coil to get it moving from a cold start - it is unlikely
					you will need to change this parameter.
				</p>
                    
            </template>
        </popup-help>
    </div>


</div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

import { SmoothieChart } from 'smoothie';
import { TimeSeries } from 'smoothie';

import PopupHelp from './elements/PopupHelp.vue';


export default {
	name: "ControlPanel",
	components:{
		PopupHelp
	},
	props:{
		url: String,
	},
    data(){
        return{
			dataSocket: null,
			//canvas: null,
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
        },
		smoothie_y_max_pos: {
			get(){
				return this.$store.getters.getYMaxPos;
			},
			set(val){
				this.$store.dispatch('setYMaxPos', val);
			}
		},
		smoothie_y_min_pos: {
			get(){
				return this.$store.getters.getYMinPos;
			},
			set(val){
				this.$store.dispatch('setYMinPos', val);
			}
		},
		smoothie_millis_per_pixel: {
			get(){
				return this.$store.getters.getMillisPerPixel;
			},
			set(val){
				this.$store.dispatch('setMillisPerPixel', val);
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
            'sendInterval',
			'setChartTheta',
			'setCanvasTheta'
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

			var initialSamplingCount = 2400
			var delayWeightingFactor = 2
			let encoderPPR = 2400

			let responsiveSmoothie = true;
			let thisTime;

			var chart = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:_this.smoothie_millis_per_pixel,grid:{fillStyle:'#eeeeee'}, interpolation:"bezier",maxValue:_this.smoothie_y_max_pos,minValue:_this.smoothie_y_min_pos,interpolation:"linear", labels:{fillStyle:'#000000',precision:2}}); //interpolation:'linear
			let canvas = document.getElementById("smoothie-chart");
			let series = new TimeSeries();
			chart.addTimeSeries(series, {lineWidth:2,strokeStyle:'#000000'});
			chart.streamTo(canvas, 200);
			_this.setChartTheta(chart);
			_this.setCanvasTheta(canvas);

			this.dataSocket.onopen = () =>  {
				//dataOpen = true; 
                _this.updateDrive(50);
                _this.sendDrive();
                console.log('drive');

                setTimeout(() => {
                    _this.updateInterval(50);
                    _this.sendInterval();
                    console.log('interval');
                }, 1000)
                
                setTimeout(() => {
                    _this.updateBrake(50);
                    _this.sendBrake();
                    console.log('brake');
                }, 2000)
                
                
                console.log('sent starting parameters');
				
			};

			
			this.dataSocket.onmessage = (event) =>  {
				
				try {
					
					var obj = JSON.parse(event.data);
					var msgTime = obj.time;
					var thisDelay = new Date().getTime() - msgTime;
					//console.log(thisDelay)

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
						//thisDelay = (b * thisDelay) + (a * delay)
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
						//series.append(new Date().getTime(), enc)
						
	
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