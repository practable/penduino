
<template>

    <nav :class="getDarkTheme ? 'navbar navbar-light fixed-top navbar-expand-lg navbar-background' : 'navbar navbar-dark fixed-top navbar-expand-lg  navbar-background'" id='navbar'>
    <div class="container-fluid">
      <div class="navbar-brand">
          <img src="/images/practable-icon.png" width="30" height="30" alt="practable.io logo">
          Remote Lab: Pendulum
      </div>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto">
              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Menu
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="#" @click='toggleComponent("graph")'>Graph</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleComponent("stopwatch")'>Stopwatch</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleComponent("table")'>Table</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleComponent("autocommands")'>Auto Commands</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleComponent("snapshot")'>Snapshot</a></li>
                    <!-- <li><a class="dropdown-item" href="#" @click='toggleComponent("workspace")'>Measuring Tools</a></li> -->
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


              <li v-if='getIsLoggingOn' class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="settingsdropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Settings
                  </a>
                  <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown2">
                    <li><a class="dropdown-item" id='toggleconsentbutton' href="#" @click='this.$emit("toggleconsent")'>Change consent</a></li>
                  </ul>
              </li>

              

          </ul>

            <ul class="navbar-nav dropstart">

                <li class="nav-item">
                    <a class="nav-link" >
                        UUID: {{ getLogUUID }}
                    </a> 
                </li>


                <li class="nav-item">
                    <clock class='nav-link' />
                </li>

                <li class="nav-item me-1">
                  <toolbar parentCanvasID="" parentDivID="navbar" parentComponentName="navbar" :showDownload="false" :showOptions="false" :showPopupHelp="true">
                      <template v-slot:popup>
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
                  </toolbar>
                </li>
              
                <li class="nav-item me-1">
                  <button type='button' class='button-toolbar button-secondary' id='download-button' @click='toggleTheme'>
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

import Toolbar from './elements/Toolbar.vue';
import Clock from "./Clock.vue";
import { mapGetters } from 'vuex';

export default {

  name: 'NavigationBar',
  emits:['toggleconsent', 'clearworkspace', 'togglegraph', 'togglestopwatch', 'toggletable', 'toggleautocommands', 'toggleworkspace', 'addruler', 'addprotractor', 'togglesnapshot'],
  data () {
    return {
        
    }
  },
  components: {
    Clock,
    Toolbar,
  },
  computed:{
      ...mapGetters([
        'getIsLoggingOn',
        'getLogUUID',
        'getDarkTheme'
      ])
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
      toggleTheme(){
        document.body.classList.toggle("dark-theme");
        this.$store.dispatch('setDarkTheme', document.body.classList.contains("dark-theme"));
        }
  }
}
</script>

<style scoped>


</style>