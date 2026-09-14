const config = {
    //Most likely leave the below as is:
    logging_path: '/addLog',
    definitions_path: '/verbs',

    //UPDATE this with your remote lab version
    remote_lab_ui: 'pendulum-2.0',
    hardware_code_prefix: 'pend',   //the short code for hardware that is used for each experiment code, e.g. spin in spin30

    click_logs_on: true,
    mouse_enter_logs_on: false,
    
    //For generating graphs in the analytics system, you need to map the appropriate buttons (that send hardware commands to the lab) with the 
    // names of the nodes that will appear on the graph (or a coded name)
    graph_nodes: {
        "start": 'start',
        "s": 'start',
        "brake": 'brake',
        "b": 'brake',
        "load": 'load',
        "l": 'load',
        "free": 'free',
        "f": 'free',
        "dataSlider": 'sampling',
        "driveSlider": 'drive_perc',
        "brakeSlider": 'brake_perc',
        "recordButton": 'record',
        "r": 'record',
        "rulermenu": 'measuring_tools',
        "protractormenu": 'measuring_tools',
    },
    
    //Add any hotkeys that you want to log
    hotkeys: [
      "s",
      "b",
      "l",
      "f",
      "r"
    ],
    // If you include an object below, it will be sent on an interval
    interval_logs: [
      //{"interval": 5000, "payload": {"msg": "5 second health check", 'state': 6}},
      // {"interval": 30000, "payload": {"msg": "30 second health check"}}
    ]
}

export default config;