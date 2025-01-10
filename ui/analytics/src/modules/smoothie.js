//Store for variables that are common amongst multiple UI components. 


const smoothieStore = {
    state: () => ({
        chart_theta: null,
        canvas_theta: null,
        y_min_pos: -135,
        y_max_pos: 135,
        millis_per_pixel: 10
       }),
       mutations:{
        SET_CHART_THETA(state, chart){
            state.chart_theta = chart;
         },
         SET_CANVAS_THETA(state, canvas){
            state.canvas_theta = canvas;
         },
         SET_Y_MIN_POS(state, value){
            state.y_min_pos = value;
            state.chart_theta.options.minValue = value;
         },
         SET_Y_MAX_POS(state, value){
            state.y_max_pos = value;
            state.chart_theta.options.maxValue = value;
         },
         SET_MILLIS_PER_PIXEL(state, value){
            state.millis_per_pixel = value;
            state.chart_theta.options.millisPerPixel = value;
         },
       },
       actions:{
         setChartTheta(context, chart){
            context.commit('SET_CHART_THETA', chart);
         },
         setCanvasTheta(context, canvas){
            context.commit('SET_CANVAS_THETA', canvas);
         },
         setYMinPos(context, value){
            context.commit('SET_Y_MIN_POS', value)
         },
         setYMaxPos(context, value){
            context.commit('SET_Y_MAX_POS', value)
         },
         setMillisPerPixel(context, value){
            context.commit('SET_MILLIS_PER_PIXEL', value)
         },
         resetSmoothieSettings(context){
            context.dispatch('setYMinPos', default_settings.y_min_pos)
            context.dispatch('setYMaxPos', default_settings.y_max_pos)
            context.dispatch('setMillisPerPixel', default_settings.millis_per_pixel)
         }
       },
       getters:{
        getChartTheta(state){
            return state.chart_theta;
         },
         getCanvasTheta(state){
            return state.canvas_theta;
         },
         getYMinPos(state){
            return state.y_min_pos;
         },
         getYMaxPos(state){
            return state.y_max_pos;
         },
         getMillisPerPixel(state){
            return state.millis_per_pixel;
         },
       },  
  }

  export const default_settings = {
      y_min_pos: -135,
      y_max_pos: 135,
      millis_per_pixel: 10
  }

  export default smoothieStore;
