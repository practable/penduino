<template>

<div class="container-fluid m-2 practable-component" id='snapshot-div'>

    <div class="row table" id='table'>

        <table>
            <thead class='table-head'>
                <tr>
                    <th v-for='heading in headings' :key="heading" scope="col">{{heading}}</th>
                </tr>
            </thead>

            <tr v-for="row in snaps" :id="row.t" :key="row.t">
                <td v-for='key in Object.keys(row)' :key="key">{{row[key].toFixed(2)}}</td>
            </tr>

            <tr class='current' id='current-row'>
                <td>{{getTime.toFixed(2)}}</td>
                <td>{{getCurrentAngle.toFixed(2)}}</td>
                <td>{{getCurrentAngularVelocity.toFixed(2)}}</td>
            </tr>    

            <div id='table-bottom'>
                <div class='white-divider'>
                </div>
            </div>  
        </table> 

        

	</div>

    <div class='d-grid gap-2 d-sm-block'>
        <button id="snapshot" type='button' class="button-sm button-primary" @click="snapshot">Record Snapshot</button>
        <button id="reset_snaps" type='button' class="button-sm button-warning" @click="toggleResetModal">Reset</button>
        <button id="download_snaps" type='button' class="button-sm button-primary" @click="outputToCSV">Download Snapshots</button>
    </div>
    
   <div class="d-flex flex-row">
        <toolbar parentCanvasID="" parentComponentName="snapshot" parentDivID="snapshot-div" :showDownload='false' :showPopupHelp="true" :showOptions="false">  
            <template v-slot:popup>
                <div class='row mb-2'>
                    <div class='col'>
                        <h3> Snapshot tool </h3>
                        <p> Click 'Record Snapshot' to save the current state to the snapshot table. Every time you click a new data set will be added. Click 'Download Snapshots'
                            to download all the snapshots as a .csv file.
                        </p>
                    </div>
                </div>
            </template>
        </toolbar>
    </div>
        

    

    <div v-if='showResetConfirmModal' class="modal modal-show" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Reset Data</h5>
              <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close" @click='toggleResetModal'>
                
              </button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to Reset? This will clear all stored data.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-sm button-danger" @click="resetSnaps(); toggleResetModal();">Reset</button>
              <button type="button" class="button-sm button-primary" data-dismiss="modal" data-bs-dismiss="modal" @click="toggleResetModal">Cancel</button>
            </div>
          </div>
        </div>
      </div>

</div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import Toolbar from './elements/Toolbar.vue';

export default {

  name: 'Snapshot',
  props:['headings'],
  data () {
    return {
        snaps: [],
        showResetConfirmModal: false
      
    }
  },
  components: {
    Toolbar
  },
  computed:{
      ...mapGetters([
          'getTime',
          'getCurrentAngle',
          'getCurrentAngularVelocity',
      ])
  },
  methods: {
      ...mapActions([
        'addData',
    ]),
      snapshot(){
          let angle = this.getCurrentAngle
          let time = this.getTime;
          console.log(this.$store.getters.getCurrentTime)
          let ang_vel = this.getCurrentAngularVelocity;
          
          let data_object = {id: this.getNumData, t: parseFloat(time), theta: parseFloat(angle), omega: ang_vel};
          let snap_object = {t: parseFloat(time), theta: parseFloat(angle), omega: ang_vel};
          //gets added to the data for plotting
          //this.addData(data_object);              //DON'T ADD SNAPSHOT TO DATA COLLECTION?
          //gets added to the snaps list
          this.snaps.push(snap_object);

      },
        resetSnaps(){
            this.snaps = [];
        },
        toggleResetModal(){
            this.showResetConfirmModal = !this.showResetConfirmModal;
        },
        scrollTo(id){
            var element = document.getElementById(id);
            //let topPos = element.offsetTop;
            element.scrollIntoView(true); 
            //document.getElementById('table').scrollTop = topPos;

        },
        outputToCSV(){
          let csv = '';
          let filename = '';
            let date = new Date();
            filename = 'SNAPSHOTs_' + date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString();
          
              csv = 'Time/s,Angle/rad,AngVel/rad/s\n';
            
            this.snaps.forEach(function(d){
                csv += d.t.toString();
                csv += ",";
                csv += d.theta.toString();
                csv += ',';
                csv += d.omega.toString();
                     
                csv += "\n";
            });
            filename += '.csv';
          
          let hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';
          hiddenElement.download = filename;
          hiddenElement.click();
      },
  }
}
</script>

<style scoped>

.current{
    border: thin;
	box-shadow: 0px 0px;
    color: green
}

.h-divider{
 margin-top:5px;
 margin-bottom:5px;
 height:1px;
 width:100%;
 border-top:1px solid gray;
}

.v-divider{
 margin-left:5px;
 margin-right:5px;
 padding: 0px;
 width:1px;
 height:100%;
 border-right:1px solid gray;
}

.modal-show{
    display: block;
}
</style>