
<template>

    <nav :class="getDarkTheme ? 'navbar navbar-dark fixed-top navbar-expand-lg navbar-background' : 'navbar navbar-light fixed-top navbar-expand-lg navbar-background'" id='navbar'>
    <div class="container-fluid">
      <div class="navbar-brand">
          <img src="/images/practable-icon.png" width="30" height="30" alt="practable.io logo">
          {{ labName }}
      </div>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto">
              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Add Component
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a :class="isGraphOn ? 'dropdown-item dropdown-checked' : 'dropdown-item'" id='graphmenu' href="#" @click='toggleComponent("graph")'>Graph</a></li>
                    <li><a :class="isSnapshotOn ? 'dropdown-item dropdown-checked' : 'dropdown-item'" id='snapshotmenu' href="#" @click='toggleComponent("snapshot")'>Snapshot</a></li>
                    <li><a :class="isTableOn ? 'dropdown-item dropdown-checked' : 'dropdown-item'" id='tablemenu' href="#" @click='toggleComponent("table")'>Table</a></li>
                    <li><a :class="isAutoCommandOn ? 'dropdown-item dropdown-checked' : 'dropdown-item'" id='autocommandsmenu' href="#" @click='toggleComponent("autocommands")'>Auto Commands</a></li>
                    <li><a :class="isStopwatchOn ? 'dropdown-item dropdown-checked' : 'dropdown-item'" id='stopwatchmenu' href="#" @click='toggleComponent("stopwatch")'>Stopwatch</a></li>
                  </ul>
              </li>

              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="toolsdropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Tools
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown2">
                    <li><a class="dropdown-item" id='rulermenu' href="#" @click='addTool("ruler")'>Ruler</a></li>
                    <li><a class="dropdown-item" id='protractormenu' href="#" @click='addTool("protractor")'>Protractor</a></li>
                  </ul>
              </li>

              <li class="nav-item" id="clearworkspace">
                  <a class="nav-link" href="#" tabindex="-1" @click='clearWorkspace'>Clear Workspace</a>
              </li>


              <!-- <li v-if='getIsLoggingOn' class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="settingsdropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Settings
                  </a>
                  <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown2">
                    <li><a class="dropdown-item" id='toggleconsentbutton' href="#" @click='this.$emit("toggleconsent")'>Change consent</a></li>
                  </ul>
              </li> -->

              <li class="nav-item">
                  <div class="nav-link">UUID: {{ getLogUUID }}</div>
              </li>


          </ul>

            <ul class="navbar-nav dropstart">

              <li class="nav-item">
                    <clock class='nav-link' />
                </li>

                <li v-if="getIsChatOn" class="nav-item me-1" id="chat">
                  <chat />
                </li>

                <li class="nav-item me-1">
                  <popup-help id="popup-help-navbar">
                      <template v-slot:header>
                        <h5>Information</h5>
                      </template>

                      <template v-slot:body>
                        <h5>Student user ID: {{ getLogUUID }}</h5>
                        <p>Your unique user ID is given above. This helps us provide support through learning analytics.</p>

                        <h5>Customise the UI (Large screens only)</h5>
                        <p>You can drag a component from one slot to another to switch their positions. Drag the component you want to move until the location you 
                          want to move to becomes highlighted, then drop.
                        </p>

                        <h5>Toggling components</h5>
                        <p>The <b>Add Component</b> menu in the navigation bar can be used to toggle components visibility. Most components are displayed by default.
                        However, the <b>data snapshot</b> and <b>data table</b> tools can be added using this menu and visble components can be hidden.</p>

                        <h5>Report issues</h5>
                        <p>If you have any problems with the remote laboratory then you can contact us at support@practable.io
                        </p>
                      </template>
                  </popup-help>
                </li>

                <li class="nav-item me-1">
                  <popup-controls-help id="popup-controls-navbar">
                      <template v-slot:header>
                        <h5>Controls</h5>
                      </template>

                      <template v-slot:body>
                          <div class='row'>
                          <div class='col-lg-6'>
                              <h2>Hotkeys:</h2>
                              <p>Start: s</p>
                              <p>Brake: b</p>
                              <p>Free: f</p>
                              <p>Load: l</p>
                              <p>Record: r</p>
                              <p>Stop (record): t</p>
                          </div>
                          <div class='col-lg-6'>
                              <h2>UI Control:</h2>
                              <p>When the Measuring Tools are added hold, 'o' whilst dragging a tool to rotate it</p>
                              <p>Press 'w' to swap between controlling the measuring tools and the background UI. Click 'Clear Workspace' to remove the measuring tools</p>
                              <p>Additional UI components can be added from the Menu bar.</p>
                              <p>Components can be swapped by dragging to new positions. Click and drag from the grey background within the dotted line of the component you want to move. Release 
                              inside the grey background of the dotted border that you want to move it to.</p>
                              
                          </div>
                          </div>
                      </template>
                  </popup-controls-help>
                </li>
              
                <li class="nav-item me-1">
                  <button type='button' class='button-toolbar button-secondary' id='toggle-dark-light-theme' @click='toggleTheme' :disabled="disableThemeButton" aria-label="dark theme toggle" data-bs-toggle="tooltip" title="Toggle Theme">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-half" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16"/>
                    </svg>
                  </button>
              </li>

            </ul>

      </div>
    </div>
  </nav>

</template>

<script>

// import Toolbar from './elements/Toolbar.vue';
import PopupHelp from "./elements/PopupHelp.vue";
import PopupControlsHelp from "./elements/PopupControlsHelp.vue";
import Clock from "./Clock.vue";
import Chat from "./Chat.vue";
import { mapGetters } from 'vuex';

export default {

  name: 'NavigationBar',
  emits:['toggleconsent', 'clearworkspace', 'togglegraph', 'togglestopwatch', 'toggletable', 'toggleautocommands', 'toggleworkspace', 'addruler', 'addprotractor', 'togglesnapshot'],
  props:['isGraphOn', 'isStopwatchOn', 'isTableOn', 'isAutoCommandOn', 'isSnapshotOn'],
  data () {
    return {
      disableThemeButton: false,
    }
  },
  components: {
    Clock,
    // Toolbar,
    PopupHelp,
    PopupControlsHelp,
    Chat
  },
  computed:{
      ...mapGetters([
        'getIsLoggingOn',
        'getLogUUID',
        'getDarkTheme',
        'getIsChatOn',
        'getConfigJSON'
      ]),
      labName(){
        return this.getLabID == '' ? 'Pendulum Lab': ('Pendulum Lab: ' + this.getLabID);
      },
      getLabID(){
        let config = this.getConfigJSON;
        if(config.parameters != undefined){
          return config.name;
        } else{
          //console.log('blank')
          return '';
        }
      },
    //   getLabTitle(){
    //   let config = this.getConfigJSON;
    //   if(config.parameters != undefined){
    //     let id = config.name;
    //     let title = config.parameters.find(parameters => {
    //     return parameters.for === "ui"
    //   })
    //     return title.are[0].v + ' (' + id + ')';
    //   } 
    //   else {
    //     return '';
    //   }
    // },
  },
  methods: {
      addTool(tool){
          this.toggleComponent('workspace');
          setTimeout(() => {this.$emit('add' + tool)}, 100);  //give the workspace time to initialise and then send tool event
          
      },
      toggleComponent(component){
          this.$emit('toggle' + component);
      },
      clearWorkspace(){
          this.$emit('clearworkspace');
      },
      // needs a short delay before can be rerun so as to enable the chart to recolour everything
      toggleTheme(){
          this.disableThemeButton = true;
          setTimeout(() => {
            this.disableThemeButton = false
          }, 1000);
          document.body.classList.toggle("dark-theme");
          this.$store.dispatch('setDarkTheme', document.body.classList.contains("dark-theme"));
      }
  }
}
</script>

<style scoped>
.dropdown-checked::before{
  position: absolute;
  left: .2rem;
  content: '✓';
  font-weight: 600;
}

</style>