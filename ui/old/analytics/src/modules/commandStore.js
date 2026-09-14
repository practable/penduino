//Store for sending commands through the dataSocket


const commandStore = {
    state: () => ({
        dataSocket: null,
        currentMode: '',
        drive: 50,
        brake: 50,
        start: 50,
        interval: 50,

       }),
       mutations:{
        SET_DATA_SOCKET(state, socket){
            state.dataSocket = socket;
        },
        START(state){
            state.dataSocket.send(JSON.stringify({
				cmd: "start",
				param: state.start
			}));
        },
        BRAKE(state){
            state.dataSocket.send(JSON.stringify({
				cmd: "stop",
				param: "brake"
			}));
        },
        FREE(state){
            state.dataSocket.send(JSON.stringify({
				cmd: "stop",
				param: "unloaded"
			}));
        },
        LOAD(state){
            state.dataSocket.send(JSON.stringify({
				cmd: "stop",
				param: "loaded"
			}));
        },
        CALIBRATE(state){
            state.dataSocket.send(JSON.stringify({
				cmd: "calibrate"
			}));
        },
        UPDATE_START(state, value){
            state.start = value;
        },
        UPDATE_DRIVE(state, value){
            state.drive = value;
        },
        SEND_DRIVE(state){
            state.dataSocket.send(JSON.stringify({
				cmd: "drive",
				param: state.drive
			}));
        },
        UPDATE_BRAKE(state, value){
            state.brake = value;
        },
        SEND_BRAKE(state){
            state.dataSocket.send(JSON.stringify({
				cmd: "brake",
				param: state.brake
			}));
        },
        UPDATE_INTERVAL(state, value){
            state.interval = value;
        },
        SEND_INTERVAL(state){
            state.dataSocket.send(JSON.stringify({
				cmd: "interval",
				param: state.interval
			}));
        },
        SET_CURRENT_MODE(state, mode){
            state.currentMode = mode;
         },
            

       },
       actions:{
        setDataSocket(context, socket){
            context.commit("SET_DATA_SOCKET", socket);
        },
        start(context, value){
            context.commit('START', value)
        },
        brake(context){
            context.commit('BRAKE');
        },
        free(context){
            context.commit('FREE');
        },
        load(context){
            context.commit('LOAD');
        },
        calibrate(context){
            context.commit('CALIBRATE');
        },
        updateStart(context, value){
            context.commit('UPDATE_START', value);
        },
        updateDrive(context, value){
            context.commit('UPDATE_DRIVE', value);
        },
        sendDrive(context){
            context.commit('SEND_DRIVE');
        },
        updateBrake(context, value){
            context.commit('UPDATE_BRAKE', value);
        },
        sendBrake(context){
            context.commit('SEND_BRAKE');
        },
        updateInterval(context, value){
            context.commit('UPDATE_INTERVAL', value)
        },
        sendInterval(context){
            context.commit('SEND_INTERVAL');
        },
        setCurrentMode(context, mode){
            context.commit("SET_CURRENT_MODE", mode);
        },


       },
       getters:{
        getDataSocket(state){
            return state.dataSocket;
        },
        getCurrentMode(state){
            return state.currentMode;
        },
        getDrive(state){
            return state.drive;
        },
        getBrake(state){
            return state.brake;
        },
        getStart(state){
            return state.start;
        },
        getInterval(state){
            return state.interval;
        },
          
       },  
  
  }

  export default commandStore;