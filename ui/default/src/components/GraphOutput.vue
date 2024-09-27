<template>
<div class='container-fluid m-2 practable-component'>
    <div class="row mb-5 justify-content-center" id="chart-canvas">
        <div class="col">
            <canvas id='graph-canvas' @mousedown="startLine" @mouseup="endDrag" @mousemove="endLine"></canvas>
        </div>
    </div>

    <div class="row m-2 d-flex-sm" id="chart-functions" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
        <div class="col-sm-6 flex-column">
            <!-- Graph type -->
            <div>
                <label class='m-2' for="graphSelect">Graph:</label>
                <select class='button-sm button-primary col-sm-6' name="graphSelect" id="graphSelect" v-model="currentDataParameter" @change="getAllData(true)">    
                    <option value="theta">Angle</option>
                    <option value="omega">Angular Velocity</option>
                </select> 
            </div>

            <!-- Gradient -->
            <div>
                <label class='m-2' for="gradient">Gradient:</label>
                <input class='input-disabled col-sm-4' id="gradient" :value="gradient" readonly> 
            </div>
            <!-- Error bars -->
            <!-- <div>
                <label class='m-2 txt-primary' for="errorbars">Error bars</label>
                <input type='checkbox' class='col-sm' id="errorbars" v-model="areErrorBarsOn" @change='toggleErrorBars'> 
            </div> -->

            <!-- <div v-if='areErrorBarsOn'>
                <label class='m-2 txt-primary' for="xerrorrange">+/- X</label>
                <input type='number' step='0.01' class='input col-sm-3' id="xerrorrange" v-model="x_error_range" @change='updateErrorBars'> 
            </div>

            <div v-if='areErrorBarsOn'>
                <label class='m-2 txt-primary' for="yerrorrange">+/- Y</label>
                <input type='number' step='0.01' class='input col-sm-3' id="yerrorrange" v-model="y_error_range" @change='updateErrorBars'> 
            </div> -->
        </div>
        
        <div class='col-sm-6 flex-column'>
            <label class='m-2' for="function">Plot function: </label>
            <select class='button-sm button-primary col-sm-6' name="function" id="function" v-model="currentFunction">
                <option value="linear">Linear</option>
                <option value="quadratic">Quadratic</option>
                <option value="trigonometric">Trigonometric</option>
                <option value="exponential">Exponential</option>
            </select> 

            <div v-if="currentFunction === 'linear'">
               
                <div class='row justify-content-center'>
                    <img id='linear_function' src='/images/LinearFunction.png' alt="linear function equation">
                </div>


                <div class='row justify-content-center'>
                    <div>
                        <label class='m-2' for="func_a">a = </label>
                        <input type='number' class='input col-sm-3' id="func_a" v-model="func_a">
                    </div>
                    

                    <div>
                        <label class='m-2' for="func_b">b = </label>
                        <input type='number' class='input col-sm-3' id="func_b" v-model="func_b">                
                    </div>
                </div>


                <div class="row-sm justify-content-center">
                    <button class="button-sm button-primary m-1" id="plotFunctionButton" @click="plotFunc(linear)">Plot</button>
                    <button class="button-sm button-danger m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
                <div v-else-if="currentFunction === 'quadratic'">

                    <div class='row justify-content-center'>
                    <img id='linear_function' src='/images/QuadraticFunction.png' alt="quadratic function equation">
                </div>


                <div class='row justify-content-center'>
                    <div>
                        <label class='m-2' for="func_a">a = </label>
                        <input type='number' class='input col-sm-3' id="func_a" v-model="func_a" size="3">
                    </div>
                    

                    <div>
                        <label class='m-2' for="func_b">b = </label>
                        <input type='number' class='input col-sm-3' id="func_b" v-model="func_b" size="3">                
                    </div>
                </div>

                <div class="row-sm justify-content-center">
                    <button class="button-sm button-primary m-1" id="plotFunctionButton" @click="plotFunc(quadratic)">Plot</button>
                    <button class="button-sm button-danger m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
            <div v-else-if="currentFunction === 'trigonometric'">

                <div class='row justify-content-center'>
                    <img id='trig_function' src='/images/TrigFunction.png' alt="trigonometric function equation">
                </div>


                <div class='row justify-content-center'>
                    <div>
                        <label class='m-2' for="func_a">A</label>
                        <input type='number' class='input col-sm-3' id="func_a" v-model="func_a" size="3">
                    </div>
                    
                    <div>
                        <label class='m-2' for="func_b">&omega;</label>
                        <input type='number' class='input col-sm-3' id="func_b" v-model="func_b" size="3">
                    </div>

                    <div>
                        <label class='m-2' for="func_c">&phi;</label>
                        <input type='number' class='input col-sm-3' id="func_c" v-model="func_c" size="3">                
                    </div>
                </div>

                <div class="row-sm justify-content-center">
                    <button class="button-sm button-primary m-1" id="plotFunctionButton" @click="plotFunc(trigonometric)">Plot</button>
                    <button class="button-sm button-danger m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
            <div v-else-if="currentFunction === 'exponential'">

                 <div class='row justify-content-center'>
                    <img id='linear_function' src='/images/ExpFunction.png' alt="exponential function equation">
                </div>


                <div class='row justify-content-center'>
                    <div>
                        <label class='m-2' for="func_a">A = </label>
                        <input type='number' class='input col-sm-3' id="func_a" v-model="func_a" size="3">
                    </div>
                    

                    <div>
                        <label class='m-2' for="func_b">b = </label>
                        <input type='number' class='input col-sm-3' id="func_b" v-model="func_b" size="3">                
                    </div>
                </div>

                <div class="row-sm justify-content-center">
                    <button class="button-sm button-primary m-1" id="plotFunctionButton" @click="plotFunc(exponential)">Plot</button>
                    <button class="button-sm button-danger m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
        </div>

    </div>

    <div class="d-flex flex-row">
        <div class="col-auto me-2">
            <toolbar parentCanvasID="graph-canvas" parentComponentName="graph" parentDivID="graph" :showDownload='true' :showPopupHelp="false" :showOptions="false"></toolbar>
        </div>
        <div class="col-auto mt-2">
            <p v-if="getNumData < maxDataPoints">Data plotted: {{ getNumData }} / {{ maxDataPoints }}</p>
            <p v-else>Data plotted: {{ maxDataPoints }} / {{ maxDataPoints }} MAX REACHED</p>
        </div>
        
    </div>
    


</div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { Chart } from 'chart.js';
import 'chartjs-chart-error-bars'

import Toolbar from './elements/Toolbar.vue';
var scatterChart = null;        //if part of the responsive Vue data then causes a recursion error on dynamically adding datasets.
export default {
    
    name: 'GraphOutput',
    props: ['type'],
    components:{
        Toolbar,
    },
    emits:['newselectedobject'],
    data(){
        return{
            //chart: null,
            currentDataParameter: 'theta',
            gradient_start_point: {x:0, y:0},
            gradient_end_point: {x:0, y:0},
            gradient: 0,
            mouseDragging: false,
            currentFunction: "linear",
            func_a: 0,
            func_b: 0,
            func_c: 0,
            funcTimeStep: 0.01,
            YAxisMax: 0,
            YAxisMin: 0,
            XAxisMax: 0,
            XAxisMin: 0,
            maxDataPoints: 1200,
            current_data_index: 0,
            data_index_interval: 100,
            latest_index: 0,
            areErrorBarsOn: false,
            x_error_range: 0,
            y_error_range: 0.1,
            light_colours: ['rgba(0, 0, 0, 1)', 'rgba(255, 0, 0, 1)', 'rgba(0, 0, 255, 1)', '#A3A3A3', '#F5A300', '#5B5F97'],
            dark_colours: ['rgba(255, 255, 255, 1)', 'rgba(255, 0, 255, 1)', 'rgba(0, 255, 0, 1)', 'rgba(0, 255, 255, 1)', 'rgba(255, 255, 0, 1)', 'rgba(255, 0, 0, 1)']
            
        }
    },
    mounted() {
        this.createChart();
        //this.getAllData();
        this.updateChart();
    },
    computed:{
        ...mapGetters([
            'getData',
            'getNumData',
            'getIsRecording',
            'getDarkTheme'
        ]),
        getAxisLabel(){
            if(this.currentDataParameter == 'theta'){
                return 'Angle [rad]';
            } else if(this.currentDataParameter == 'omega'){
                return 'Angular Velocity [rad/s]'
            } else{
                return ''
            }
        },
    },
    watch:{
        getData(){
            this.clearData(); //only runs if data array gets reset to [];
        },
        getDarkTheme(){
            this.clearData();
        }
    },
    methods: {
        ...mapActions([
            'setDraggable'
        ]),
        updateChart(){
            let max_index = this.getNumData;
            if(max_index < this.maxDataPoints){
                if(this.latest_index < max_index /*&& this.getIsRecording*/){
                    for(let i=this.latest_index; i < max_index; i++){
                        this.getDataAtIndex(i);
                    }
                    this.latest_index = max_index;
                    if(scatterChart.ctx != null){
                        scatterChart.update(0);                       //actually updating the chart moved to here!
                        scatterChart.options.scales.yAxes[0].scaleLabel.labelString = this.getAxisLabel;
                    } else{
                        console.log('error updating chart');
                    }
                    
                } 
            }

            setTimeout(this.updateChart, 50);
        },
        createChart() {
            let _this = this;
            const canvas = document.getElementById('graph-canvas');
            const ctx = canvas.getContext('2d');
            scatterChart = new Chart(ctx, {
            type: _this.getChartType(),
            data: {
                datasets: []
            },
            options: {
                legend:{
                    display: true
                },
                scales: {
                    xAxes: [{
                        scaleLabel:{
                            display: true,
                            labelString: 'time/s',
                            fontColor: _this.getDarkTheme ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
                        },
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            callback : (value,index,values) => {
                                this.updateXAxisMax(value, index, values);
                                this.updateXAxisMin(value, index);
                                return value;
                            },
                            fontColor: _this.getDarkTheme ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
                        },
                        gridLines: {
                            zeroLineColor: _this.getDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                            color: _this.getDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
                        }
                    }],
                    yAxes: [{
                        scaleLabel:{
                            display: true,
                            labelString: this.getAxisLabel,
                            fontColor: _this.getDarkTheme ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
                        },
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            callback : (value,index,values) => {
                                this.updateYAxisMax(value, index);
                                this.updateYAxisMin(value, index, values);
                                return value;
                            },
                            fontColor: _this.getDarkTheme ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
                        },
                        gridLines: {
                            zeroLineColor: _this.getDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                            color: _this.getDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
                        }
                    }],
                },
                responsive: true
            }
        });
            //this.chart = scatterChart;

            // canvas.onclick = function(event){
            //     let active_points = scatterChart.getElementsAtEvent(event);
            //     if(active_points[0]){
            //         _this.$emit('newselectedobject', active_points[0]._index);       //data point selected so send event to let other elements know.
            //     }
                
            // };
        },
        getChartType(){
            if(this.areErrorBarsOn){
                return 'scatterWithErrorBars';
            } else{
                return 'scatter';
            }
        },
        updateYAxisMax(value, index){
            if(index == 0){
                this.YAxisMax = value;
            }
            
        },
        updateYAxisMin(value,index,values){
            if(index == values.length - 1){
                this.YAxisMin = value;
            }
        },
        updateXAxisMin(value, index){
            if(index == 0){
                this.XAxisMin = value;
            }
            
        },
        updateXAxisMax(value,index,values){
            if(index == values.length - 1){
                this.XAxisMax = value;
            }
        },
        addDataToChart(data, dataset_index) {
            //check if the next dataset doesn't exist and create it
            if(dataset_index == this.countDataSets()){
                this.deleteFunctionDataset();
                this.addEmptyDataSet(dataset_index);
            }
            //add data to the existing dataset
            try{
                scatterChart.data.datasets[dataset_index].data.push(data);
            } catch(e){
                console.log(e);
            }
        },
        clearData(resetIndex = true){
            if(resetIndex){
                this.latest_index = 0;          
            }

            scatterChart.destroy();
            this.createChart();
            scatterChart.update(0); //make sure chart is displayed again, even with no data
        },
        //By default will not clear the graph of previous data
        //If passed true, will clear all data first and then get new data.
        getAllData(toClear = false){
                if(toClear){
                    this.clearData(false);
                }
                
                let data = this.getData;
                
                for(let i=this.current_data_index; i<this.getNumData;i++){
                    let x_data = data[i].t;
                    let y_data;
                    switch(this.currentDataParameter){
                        case 'theta':
                            y_data = data[i].theta;
                            break;
                        case 'omega':
                            y_data = data[i].omega;
                            break;

                    }

                    if(this.areErrorBarsOn){
                        this.addDataToChart({x: x_data, y: y_data, xMax: x_data + this.x_error_range, xMin: x_data - this.x_error_range, yMax: y_data + this.y_error_range, yMin: y_data - this.y_error_range}, data[i].set);
                    } else{
                        this.addDataToChart({x: x_data, y: y_data}, data[i].set);
                    }
                    

                    if(i >= this.current_data_index + this.data_index_interval || i == this.getNumData - 1){
                        this.current_data_index = i + 1;
                    
                        break;
                    }
                    
                }

                    if(this.current_data_index < this.getNumData && this.current_data_index <= this.maxDataPoints){
                        scatterChart.update(0);
                        setTimeout(this.getAllData(false), 20);
                    } else{
                        scatterChart.update(0);
                        this.current_data_index = 0;
                    }
                    
                
            },
            getLatestData(){
                let index = this.getNumData - 1;
                let data = this.getData[index];
                let y_data;
                if(index >= 0){
                    
                    let x_data = data.t;
    
                    switch(this.currentDataParameter){
                            case 'theta':
                            y_data = data.theta;
                            break;
                        case 'omega':
                            y_data = data.omega;
                            break;

                        }
                        if(this.areErrorBarsOn){
                            this.addDataToChart({x: x_data, y: y_data, xMax: x_data + this.x_error_range, xMin: x_data - this.x_error_range, yMax: y_data + this.y_error_range, yMin: y_data - this.y_error_range}, data.set);
                        } else{
                            this.addDataToChart({x: x_data, y: y_data}, data.set);
                    }
                    } else{
                        //console.log("no data");
                    }
                
            },
            getDataAtIndex(index){
                let y_data;
                if(index >= 0){
                    let data = this.getData[index];
                    let x_data = data.t;
                
                    switch(this.currentDataParameter){
                            case 'theta':
                            y_data = data.theta;
                            break;
                        case 'omega':
                            y_data = data.omega;
                            break;

                        }
                        if(this.areErrorBarsOn){
                            this.addDataToChart({x: x_data, y: y_data, xMax: x_data + this.x_error_range, xMin: x_data - this.x_error_range, yMax: y_data + this.y_error_range, yMin: y_data - this.y_error_range}, data.set);
                        } else{
                            this.addDataToChart({x: x_data, y: y_data}, data.set);
                    }
                    } else{
                        //console.log("no data");
                    }
            },
            toggleErrorBars(){
                this.getAllData(true);      //need to recreate the whole graph with a different graph type. getAllData(true) will do this.
            },
            updateErrorBars(){
                for(let i=0; i < scatterChart.data.datasets[0].data.length; i++){
                    let point = scatterChart.data.datasets[0].data[i];
                    point.xMax = point.x + this.x_error_range;
                    point.xMin = point.x - this.x_error_range;
                    point.yMax = point.y + this.y_error_range;
                    point.yMin = point.y - this.y_error_range;
                }   

                scatterChart.update(0);
            },
            removeChart(){
                scatterChart.destroy();
            },
            startLine(event){
                event.preventDefault();
                this.gradient_start_point.x = event.offsetX;
                this.gradient_start_point.y = event.offsetY;

                this.mouseDragging = true;
                
            },
            endDrag(){
                this.mouseDragging = false;
            },
            endLine(event){
                if(this.mouseDragging){
                    //get ratio of y axis to x axis scales, get ratio of y difference in mouse positions and x difference in mouse positions.
                    this.gradient_end_point.x = event.offsetX;
                    this.gradient_end_point.y = event.offsetY;

                    let pointer_ratio = (this.gradient_start_point.y - this.gradient_end_point.y) / (this.gradient_end_point.x - this.gradient_start_point.x);  //pointer ratio

                    let canvas_offset = 32;         //might need to change/check this 
                    let canvas = document.getElementById('graph-canvas');
                    let canvas_height = canvas.clientHeight - canvas_offset;
                    let canvas_width = canvas.clientWidth;
                    let canvas_ratio = canvas_height/canvas_width;      //canvas ratio
                    
                    
                    // let min_x = Infinity;
                    // let min_y = Infinity;
                    // let max_x = -Infinity;
                    // let max_y = -Infinity;
                    // this.chartData.forEach(element => {
                    //     if(element.x < min_x){
                    //         min_x = element.x;
                    //     }
                    //     if(element.x > max_x){
                    //         max_x = element.x;
                    //     }

                    //     if(element.y < min_y){
                    //         min_y = element.y;
                    //     }
                    //     if(element.y > max_y){
                    //         max_y = element.y;
                    //     }

                    // });

                    // if(min_x > 0){       //if two data points set then limits are set to min and max dataset points
                    //     min_x = 0;
                    // }
                    // if(min_y > 0){
                    //     min_y = 0;
                    // }

                    // let y_diff = max_y - min_y;
                    // let x_diff = max_x - min_x;
                    let y_diff = this.YAxisMax - this.YAxisMin;
                    let x_diff = this.XAxisMax - this.XAxisMin;
                    let axis_ratio = y_diff/x_diff;         //axis ratio

                    if(this.getNumData > 1){
                        this.gradient = axis_ratio*pointer_ratio/canvas_ratio;
                        this.drawLine(this.gradient_start_point, this.gradient_end_point);
                    }
                }
                
            },
            drawLine(from, to){
                
                //draw the gradient line
                //only draw anything if at least 2 data points have been plotted
                let canvas = document.getElementById('graph-canvas');
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
                scatterChart.update(0);       //instantly update with no animation

                context.beginPath(); 
                // Staring point 
                context.moveTo(from.x, from.y);
                // End point 
                context.lineTo(to.x, to.y);
                context.lineWidth = 5;
                // set line color
                context.strokeStyle = 'red';
                // Make the line visible
                context.stroke();
                
            },
            plotFunc(func){
                let min = this.XAxisMin;
                let max = this.XAxisMax;
                let t_delta = max-min;
                let num_plots = t_delta/this.funcTimeStep;
                let new_data = [];
                let new_t;
                let new_y;
                for(let i=0; i<num_plots;i++){
                    new_t = min + i*this.funcTimeStep;
                    new_y = func(new_t);
                    let data = {
                        x: new_t,
                        y: new_y
                    };
                    new_data.push(data);
                }
                
                this.addFunctionPlot('rgba(224, 0, 0, 0.5)', new_data);
            },
            linear(t){
                return (parseFloat(this.func_a)*t + parseFloat(this.func_b));
            },
            quadratic(t){
                return parseFloat(this.func_a)*t*t + parseFloat(this.func_b);
            },
            trigonometric(t){
                return parseFloat(this.func_a)*Math.sin(parseFloat(this.func_b)*t + parseFloat(this.func_c));
            },
            exponential(t){
                return parseFloat(this.func_a)*Math.exp(parseFloat(this.func_b)*t);
            },
            addFunctionPlot(colour, data){
                scatterChart.data.datasets.push({
                    label:"function",
                    pointBackgroundColor: colour,
                    borderColor: colour,
                    data: data
                    });
                    scatterChart.update(0);
            },
            addEmptyDataSet(new_index){
                scatterChart.data.datasets.push({
                    label:`dataset${new_index}`,
                    pointBackgroundColor: this.getDarkTheme ? this.dark_colours[new_index % this.dark_colours.length] : this.light_colours[new_index % this.light_colours.length],
                    borderColor: this.getDarkTheme ? this.dark_colours[new_index % this.dark_colours.length] : this.light_colours[new_index % this.light_colours.length],
                    data: []
                    });
                    scatterChart.update(0);
            },
            deleteFunctionDataset(){
                scatterChart.data.datasets = scatterChart.data.datasets.filter(set => set.label !== "function");
                scatterChart.update(0);
            },
            countDataSets(){
                let datasets = scatterChart.data.datasets.filter(set => set.label.includes("dataset"));
                return datasets.length;
            }
            

      },
      
}
</script>



<style scoped>
#transfer_function{
    width: 120px;
    height: 50px;
}

#second_order_transfer_function{
    width: 160px;
    height: 50px;
}

#linear_function{
    width: 120px;
    height: 30px;
}

#trig_function{
    width: 150px;
    height: 30px;
}


#chart-canvas{
    cursor: crosshair;
    background-color: var(--background-color)
}


</style>
