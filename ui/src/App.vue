<template>
  <div id="app" class='container-fluid-sm m-0 background-grey'>
       <navigation-bar @togglesnapshot="toggleSnapshot" @togglegraph="toggleGraph" @toggleautocommands="toggleAutoCommands" @togglestopwatch="toggleStopwatch" @toggletable="toggleTable" @toggleworkspace="addWorkspace" @clearworkspace="clearWorkspace" @addruler="rulerAdded = true" @addprotractor="protractorAdded = true"/>

        <div v-if="isWorkspaceOn">
          <workspace :protractorAdded="protractorAdded" :rulerAdded="rulerAdded"/>
        </div>

        <streams id='streams' />

        <div class='row' id='component-grid'>

            <div class='col-lg-6' id='left-screen'>
                <div class='col drop-area' id='drop_0_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><webcam-stream id='webcam-stream' /></div>
                <div class='col drop-area' id='drop_1_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><data-stream id='data-stream' /></div>
                <div class='col drop-area' id='drop_2_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><table-output v-if='isTableOn' id='table' :selected_point="selected_graph_point"/></div>
                <div class='col drop-area' id='drop_3_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
                <div class='col drop-area' id='drop_4_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
            </div>

            <div class='col-lg-6' id='right-screen'>
                <div class='col drop-area' id='drop_0_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><data-recorder id='data-recorder' /></div>
                <div class='col drop-area' id='drop_1_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><snapshot v-if='isSnapshotOn' id='snapshot' :headings="['Time/s', 'Angle/rad', 'Ang. Vel./rad/s']"/></div>
                <div class='col drop-area' id='drop_2_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><graph-output v-if='isGraphOn' id='graph' type="graph" @newselectedobject="selectedGraphPoint"/></div>
                <div class='col drop-area' id='drop_3_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><auto-command v-if='isAutoCommandOn' id='auto-command' /></div>
                <div class='col drop-area' id='drop_4_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><stopwatch v-if='isStopwatchOn' id='stopwatch'/></div>
            </div>

        </div>
     
   
  </div>
</template>

<script>


import GraphOutput from "./components/GraphOutput.vue";
import TableOutput from "./components/TableOutput.vue";
import Stopwatch from "./components/Stopwatch.vue";
import Workspace from "./components/Workspace.vue";
import WebcamStream from "./components/WebcamStream.vue";
import DataStream from "./components/DataStream.vue";
import DataRecorder from "./components/DataRecorder.vue";
import AutoCommand from "./components/AutoCommand.vue";
import NavigationBar from "./components/NavigationBar.vue";
import Streams from "./components/Streams.vue";
import Snapshot from "./components/Snapshot.vue"

import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    Streams,
    WebcamStream,
    DataStream,
    GraphOutput,
    TableOutput,
    Stopwatch,
    Workspace,
    DataRecorder,
    AutoCommand,
    NavigationBar,
    Snapshot,

  },
  mounted(){
    
  },
  data() {
    return {
      isTableOn: false,
      isGraphOn: false,
      isStopwatchOn: false,
      isWorkspaceOn: false,
      isAutoCommandOn: false,
      isSnapshotOn: false,
      selected_graph_point: null,
      protractorAdded: false,
      rulerAdded: false
    }
  },
  computed:{
    ...mapGetters([
      'getDraggable'
    ])
  },
  methods:{
    dragComponent(event){
        event.dataTransfer.effectAllowed = 'move';
         console.log("Dragged id: " + event.target.id);
         let element = event.target;
         if(element.classList.contains('drop-area')){
           console.log(element.id);
            event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
            console.log(element.childNodes[0]);
         } else{
           while(element.parentNode){
              element = element.parentNode;
              console.log(element.id);
              if(element.classList.contains('drop-area')){
                event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
                console.log(element.childNodes[0]);
                break;
              }
            }
         }
    },
    dropComponent(event){
      event.preventDefault();
      event.stopPropagation();
      let dropData = event.dataTransfer.getData('text/html');
      let dropItems = dropData.split("|");
      let draggedZone = document.getElementById(dropItems[0]);
      let droppedElement = document.getElementById(event.target.id);
      let draggedID = dropItems[1];
      
      if(droppedElement != null && droppedElement.classList.contains('drop-area')){
        if(event.target.childNodes.length > 0){
          draggedZone.appendChild(event.target.childNodes[0]);
        }
        console.log(draggedID);
        droppedElement.appendChild(document.getElementById(draggedID));
      } 
      else if(droppedElement){
        let element = droppedElement;
        while(element.parentNode){
          element = element.parentNode;
          if(element.classList.contains('drop-area')){
            console.log(element.childNodes[0]);
            draggedZone.appendChild(element.childNodes[0]);
            element.appendChild(document.getElementById(draggedID));
            
            break;
          }
        }
      }
      return false;
    },
    selectedGraphPoint(point){
      this.selected_graph_point = point;
    },
    toggleGraph(){
      this.isGraphOn = !this.isGraphOn;
    },
    addWorkspace(){
        this.isWorkspaceOn = true;
    },
    toggleWorkspace(){
      this.isWorkspaceOn = !this.isWorkspaceOn;
    },
    toggleTable(){
      this.isTableOn = !this.isTableOn;
    },
    toggleStopwatch(){
      this.isStopwatchOn = !this.isStopwatchOn;
    },
    toggleAutoCommands(){
      this.isAutoCommandOn = !this.isAutoCommandOn;
    },
    toggleSnapshot(){
      this.isSnapshotOn = !this.isSnapshotOn;
    },
    clearWorkspace(){
      this.isWorkspaceOn = false;
      this.protractorAdded = false;
      this.rulerAdded = false;
    }
  },
}
</script>

<style>

</style>
