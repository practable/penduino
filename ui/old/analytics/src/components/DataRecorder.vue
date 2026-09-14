<template>
    <div class='container-fluid m-2 practable-component'>

      <div class="col p-2 d-grid gap-2 d-sm-block">
      <button class="button-sm button-primary m-1" v-if="!getIsRecording" id="recordButton" @click="record">Record</button>
      <button class="button-sm button-danger m-1" v-if="getIsRecording" id="stopButton" @click="stopRecording">Stop</button>
      <button class="button-sm button-warning m-1" id="clearButton" @click="clearGraph">Reset</button>
      <button class="button-sm button-primary m-1" v-if="hasData" id="outputButton" @click="outputToCSV">Download CSV</button>
    </div>

    <div class='row m-2 justify-content-center'>
      <div v-if='getIsRecording' class='col-2'>
        <img id='red-light' src='/images/red-light.png' width='20' height='20' :hidden='!showRedLight'>
      </div>
      <div class='col-10'>  
        <p class='m-1'>Recorded: {{getNumData}}/{{max_data_points}} data points</p>
      </div>
    </div>

    <div class="d-flex flex-row">
		    <popup-help class="me-2" id="popup-help-data-recorder">
            <template v-slot:header>
                <h5> Data Recorder </h5>
            </template>
            <template v-slot:body>
                <p>Click <b>Record</b> to begin recording data. Recorded data will be plotted automatically on the graph component.</p>    
                <p>Click <b>Stop</b> to stop recording data.</p>  
                <p>Clicking <b>Reset</b> will delete all recorded data, including clearing the graph component.</p>
                <p>If you want to save data prior to resetting then click <b>Download CSV</b> to save the data to your local computer.</p>  
                <p>A maximum of 5000 data points can be recorded for download and 2000 for display in the graph component. It is recommended to perform
                  runs in batches and download data in between.
                </p>         
            </template>
        </popup-help>
	    </div>

  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import PopupHelp from './elements/PopupHelp.vue';

export default {

  name: 'DataRecorder',
  data () {
    return {
        time_interval: 0.5,
        interval_id: 0,
        data_points_count: 0,
        hasPlotted: false,
        max_data_points: 5000,
        max_reached: false,
        data_set_index: 0,      //NEW for identifying different datasets
    }
  },
  components: {
    PopupHelp
  },
  created(){
		window.addEventListener('keydown', this.hotkey, false);
	},
  computed:{
    ...mapGetters([
      'getIsRecording',
      'getNumData',
      'getCurrentAngle',
      'getCurrentAngularVelocity',
      'getTime',
      'getCurrentTime'
    ]),
      hasData(){
          return this.getNumData !== 0;
      },
      newTime(){
        return this.$store.getters.getCurrentTime;
      },
      showRedLight(){
        return this.getNumData % 20 > 10 ? true : false;
      }
  },
  watch:{
      newTime(){
        if(this.getIsRecording && this.getNumData < this.max_data_points){
            this.plot();
        } else if(this.getNumData == this.max_data_points && !this.max_reached){
            this.stopRecording();
            this.max_reached = true;
        }
    },
  },
  methods: {
    ...mapActions([
      'setIsRecording',
      'addData',
      'clearAllData',
    ]),
      record(){
          //this.$store.dispatch('setStartTime', new Date().getTime());
          this.$store.dispatch('setStartTime', this.getCurrentTime);
          this.data_points_count = 0;
          this.setIsRecording(true); 
      },
      stopRecording(){
          this.setIsRecording(false);
          this.data_set_index += 1;
      },
      plot(){
          this.data_points_count++;
          let angle = this.getCurrentAngle
          let time = this.getTime;
          let ang_vel = this.getCurrentAngularVelocity;
          
          //add in a dataSetIndex int so that each set of data can be identified
          let data_object = {id: this.getNumData, t: parseFloat(time), set: this.data_set_index, theta: parseFloat(angle), omega: ang_vel};
          this.addData(data_object);
          this.hasPlotted = true;
          

      },
      clearGraph(){
          this.clearAllData();
          this.max_reached = false;
          this.hasPlotted = false;
          this.data_set_index = 0;
      },
      outputToCSV(){
          let data = this.$store.getters.getData;
          let current_dataset = 0;
          let csv = 'Time/s,Angle/rad,AngVel/rad/s\n';
          let date = new Date();

          data.forEach(function(d){

            if(d.set == current_dataset + 1){
              let hiddenElement = document.createElement('a');
              hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
              hiddenElement.target = '_blank';
              hiddenElement.download = `pendulum-${date.getHours()}-${date.getMinutes()}-run${current_dataset}.csv`;
              hiddenElement.click();

              csv = 'Time/s,Angle/rad,AngVel/rad/s\n';
              current_dataset += 1;
            }

              csv += d.t.toString();
              csv += ",";
              csv += d.theta.toString();
              csv += ',';
              csv += d.omega.toString();
              csv += "\n";
          });
          //console.log(csv);
          //output the final dataset
          
          let hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';
          hiddenElement.download = `pendulum-${date.getHours()}-${date.getMinutes()}-run${current_dataset}.csv`;
          hiddenElement.click();
      },
      // ORIGINAL METHOD
      // outputToCSV(){
      //     let csv = 'Time/s,Angle/rad,AngVel/rad/s\n';
      //     let data = this.$store.getters.getData;
      //     data.forEach(function(d){
      //         csv += d.t.toString();
      //         csv += ",";
      //         csv += d.theta.toString();
      //         csv += ',';
      //         csv += d.omega.toString();
      //         csv += "\n";
      //     });
      //     //console.log(csv);
      //     let hiddenElement = document.createElement('a');
      //     hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
      //     hiddenElement.target = '_blank';
      //     hiddenElement.download = 'pendulum.csv';
      //     hiddenElement.click();
      // },
      hotkey(event){
			if(event.key == "r"){
        this.record();
      } else if(event.key == "t"){
        this.stopRecording();
      }
		},
      
  }
}
</script>

<style scoped>


</style>