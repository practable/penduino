//Store for variables that are common amongst multiple UI components. 


const uiStore = {
    state: () => ({
       isDataRecorderOn: false,    //is the Data Recorder element active
       isDraggable: true,
        colour_index: 0,
       }),
       mutations:{
         SET_DATA_RECORDER(state, set){
            state.isDataRecorderOn = set;
         },
         SET_DRAGGABLE(state, draggable){
            state.isDraggable = draggable;
         },
         SET_COLOUR_INDEX(state, index){
            state.colour_index = index
         }
         

       },
       actions:{
         setDataRecorder(context, set){
            context.commit("SET_DATA_RECORDER", set);
         },
         setDraggable(context, draggable){
             context.commit('SET_DRAGGABLE', draggable);
         },
         updateColourIndex(context){
            let index = (context.state.colour_index + 1) % 6
            context.commit('SET_COLOUR_INDEX', index);
         }


       },
       getters:{
         getIsDataRecorderOn(state){
            return state.isDataRecorderOn;
         },
         getDraggable(state){
             return state.isDraggable;
         },
         getColourIndex(state){
            return state.colour_index;
         }
         
         
       },  
  
  }

  export default uiStore;
