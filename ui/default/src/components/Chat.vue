<template>
  <div class="chat">
    <div class='d-flex'>
        <ul class="navbar-nav dropstart">
            
            <li class="nav-item dropdown">
            <button type='button' class='button-toolbar button-secondary dropdown-toggle' id='prompts-button' data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" id='rasabotmenubutton' width="32" height="32" fill="currentColor" class="bi bi-chat-left-dots" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                <!-- <span v-if='getPromptUpdated' class="badge rounded-pill bg-danger" id='prompt-notification' role="status" aria-hidden="false">{{ getNewPromptCount }}<span class="visually-hidden">unread messages</span></span> -->
            </button>
        
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuClickable">
  
            <chat-widget :message_list="message_list" :message_count="messageCount" @onMessageSent="handleMessageSent" class='m-3' @click.stop/>
            
        </ul>
    </li>

        </ul>




        
    </div>

    </div>
</template>

<script>
import ChatWidget from "./ChatWidget.vue";
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Chat',
  components: {
    ChatWidget,
  },
  props: {
    
  },
  data () {
        return {
           message_list: [{sender:'me', time: 0, text: 'david'}]
        }
    },
    mounted(){
      
      
    },
  computed:{
        ...mapGetters([
            
        ]),
        messageCount(){
          return this.message_list.length;
        }
    },
    watch:{
    
    },
    methods:{
        ...mapActions([

        ]),
        handleMessageSent(message){
          console.log(message);
        },
        
      }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
