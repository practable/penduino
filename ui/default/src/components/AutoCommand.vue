<template>
<div class="container-fluid m-2 practable-component">
    <div class="row d-flex flex-row align-items-top">
        <div class='col-md-3 d-flex flex-column align-items-center'>
            <label class='txt-bold m-1' for="addCommand">Command</label>
            <select class='button-sm button-primary col-sm-12' name="addCommand" id="addCommand" v-model="command_to_add" @change="checkCommandParameter">
                <option value="start">Start</option>
                <option value="updateDrive">Drive Param</option>
                <option value="brake">Brake</option>
                <option value="updateBrake">Brake Param</option>
                <option value="load">Load</option>
                <option value="free">Free</option>
            </select> 
        </div>

        <div class='col-md-3 d-flex flex-column align-items-center' @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
            <label class='txt-bold m-1' for="command_parameter" v-if="command_to_add == 'updateDrive' || command_to_add == 'updateBrake'">Value</label>
            <input v-if="command_to_add == 'updateDrive' || command_to_add == 'updateBrake'" type="text" class='input col-sm-6' id="command_parameter" v-model="command_parameter">
        </div>

        <div class='col-md-3 d-flex flex-column align-items-center' @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
            <label class='txt-bold m-1' for="time_interval">After</label>
            <input type="number" class='input col-sm-6' id="time_interval" v-model="time_to_add">
            <label class='txt-bold m-1' for="time_interval">seconds</label>
        </div>

        <div class='col-md-3'>
            <div class='d-grid gap-2 d-sm-block'>
                <button class="button-sm button-primary" id="addButton" @click="addCommand" aria-label="add command">Add</button>
                <button class="button-sm button-danger" id="deleteButton" @click="deletePreviousCommand" aria-label="delete command">Delete</button>
            </div>
        </div>

    </div>

    <div v-if='commands.length > 0' class='h-divider'></div>

    <div class="row justify-content-center" v-for="command in commands" :key="command.id">     <!--command structure command = {id=0, com:"start", time: 5, parameter: 0} -->
        <div v-if="command.parameter != null">
            <h3>{{command.id + 1}}) {{command.com}} after {{command.time}} seconds to {{command.parameter}}&nbsp;</h3>
        </div>
        <div v-else>
            <h3>{{command.id + 1}}) {{command.com}} after {{command.time}} seconds</h3>
        </div>
    </div>

    <div v-if='commands.length > 0' class='h-divider'></div>

    <div class="row m-2 d-flex flex-row justify-content-center">
        <button v-if='commands.length > 0' class="button-sm button-primary col-sm-2" id="startCommands" @click="runCommands" aria-label="start commands">Start</button>
        <button v-if='commands.length > 0' class="button-sm button-warning col-sm-2" id="stopCommands" @click="stopCommands" aria-label="stop commands">Stop</button>
        <button v-if='commands.length > 0' class="button-sm button-danger col-sm-2" id="clearCommands" @click="clearCommands" aria-label="clear commands">Clear</button>
    </div>


    <div class="d-flex flex-row mt-2 toolbar-bottom">
        <popup-help class="me-2" id="popup-help-snapshot">
            <template v-slot:header>
                <h5> Autocommands </h5>
            </template>
            <template v-slot:body>
                <p> 
                    This tools enables you to create a series of commands that are sent, without the need to manually update the UI, after defined times.
                    Use the <b>Command</b> dropdown to select a command, enter a parameter value (if appropriate for that command) and a time after the previous command 
                    at which this will be sent (or after <b>Start</b> is clicked if the first command). Click <b>Add</b> to add the new command to the list of commands.
                    Clicking <b>Delete</b> will remove the latest command in the series. Continue adding commands if necessary and then click <b>Start</b> to run your command series. 
                    <b>Stop</b> will stop any remaining commands from running. <b>Clear</b> will remove all commands from your command sequence.
                </p>
            </template>
        </popup-help>
    </div>

</div>   
</template>

<script>

import { mapActions } from 'vuex'
import PopupHelp from './elements/PopupHelp.vue';

export default {

  name: 'AutoCommand',
  data () {
    return {
      commands: [],
      command_to_add: "",
      time_to_add: 0,
      command_parameter: null,
      //timeout_ids: [],
      stopping: false,
      
    }
  },
  components: {
    PopupHelp
  },
  computed:{

  },
  mounted(){

  },
  methods: {
      ...mapActions([
          'setDraggable'
      ]),
     addCommand(){
         let id = this.commands.length;
         let new_command = {id: id, com:this.command_to_add, time:this.time_to_add, parameter:this.command_parameter};
         this.commands.push(new_command);
     },
     async runCommands(){
         this.stopping = false;
         let time = 0;
         let eventName = "";
            for(let i=0; i<this.commands.length; i++){
                time = parseFloat(this.commands[i].time);
                eventName = this.commands[i].com;

                if(this.stopping){
                    return;
                }

                await new Promise((resolve) => {
                    if(eventName == 'updateDrive')
                    {
                        setTimeout(() => {
                            this.$store.dispatch('updateDrive', this.commands[i].parameter);
                            this.$store.dispatch('sendDrive')
                            resolve();
                            }, time*1000);
                    } 
                    else if(eventName == 'updateBrake')
                    {
                        setTimeout(() => {
                            this.$store.dispatch('updateBrake', this.commands[i].parameter);
                            this.$store.dispatch('sendBrake')
                            resolve();
                            }, time*1000);
                    } 
                    else
                    {
                        setTimeout(() => resolve(this.$store.dispatch(eventName, this.commands[i].parameter)), time*1000);
                    }
                    
                });
            }
             
     },
     stopCommands(){
         this.stopping = true;

        //  for(let i=0; i<this.timeout_ids;i++){
        //      clearTimeout(this.timeout_ids[i]);
        //  }
     },
     deletePreviousCommand(){
         let index = this.commands.length - 1;
         this.commands.splice(index, 1);
     },
     clearCommands(){
         this.commands = [];
     },
     checkCommandParameter(){
         if(this.command_to_add != "updateDrive" && this.command_to_add != "updateBrake"){
             this.command_parameter = null;
         }
     },
  }
}
</script>

<style scoped>

</style>