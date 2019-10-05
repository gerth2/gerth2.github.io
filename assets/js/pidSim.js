function step(t){
    if(t < 0){
        return 0;
    } else {
        return 1;
    }
}

//Motor & shooter wheel configuration constants
//Gearbox
var GEARBOX_RATIO = 30.0/10.0; //output over input
//CIM Motor
var Rc = 0.2; //ohms, for full CIM motor
var Kt = 2.429/131.227; //Nm/A - for CIM motor. Calculated from Stall Torque/Stall Current
var Kv = (12-(2.7*Rc))/(5310*2*3.14159/60); //V/(rad/s). Calculated from Vemf@FreeSpeed/(2pi/60*RPM@FreeSpeed). Steady-state Vemf = Vs - I@FreeSpeed*Rc, for Vs = 12
var mass = 1.0; //shooter wheel mass in Kg
var radius = 0.0762; //3 inch radius, converted to meters

var C1 = 2 *  Kt / (mass * radius * radius * GEARBOX_RATIO * Rc);
var C2 = 2 * Kv * Kt / (mass * radius * radius * Rc);

var motorSpeedArray = [];
var inputVoltageArray = [];


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Steady-state behavior with max voltage applied
//////////////////////////////////////////////////////////////////////////////////////////////////////
function runSimFullVoltage(){

    var minTime = -1.0;
    var maxTime = 10.0;
    var Ts = 0.001;
    var speedPrev = 0;

    on_voltage = 12.0;

    motorSpeedArray = [];
    inputVoltageArray = [];
    
    for(t = minTime; t < maxTime; t += Ts){
        inVolts = on_voltage * step(t);
        speed = (Ts*C1*inVolts + speedPrev)/(1+Ts*C2);
        speedPrev = speed;

        speed_rpm = speed*60/2/3.14159
        motorSpeedArray.push([t, speed_rpm]);
        inputVoltageArray.push([t, inVolts]);
    }

}

runSimFullVoltage();

a = functionPlot({
  target: '#plot2a',
  title: '',
  grid: true,
  yAxis: {
      label: "Wheel Speed (RPM)",
      domain: [-100, 4000]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 10]
  },
  data: [
    {
        points: motorSpeedArray,
        fnType: 'points',
        graphType: 'polyline'
    }
  ]
})

b = functionPlot({
  target: '#plot2b',
  title: '',
  grid: true,
  yAxis: {
      label: "Input Voltage (V)",
      domain: [-1, 14]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 10]
  },
  data: [
    {
        points: inputVoltageArray,
        fnType: 'points',
        graphType: 'polyline'
    }
  ]
})

a.addLink(b);



//////////////////////////////////////////////////////////////////////////////////////////////////////
// Bang-bang controller - 20 ms
//////////////////////////////////////////////////////////////////////////////////////////////////////

function runSimBangBang(sample_time){

    var minTime = -1.0;
    var maxTime = 10.0;
    var Ts = 0.001;
    var speedPrev = 0;

    Ts_controller = 0.02;
    nextControllerRunTime = 0.0;

    on_voltage = 12.0;
    off_voltage = 0.0;

    inVolts = 0.0;

    target_speed_rpm = 1000;
    speed_rpm = 0.0;

    motorSpeedArray = [];
    inputVoltageArray = [];
    
    for(t = minTime; t < maxTime; t += Ts){

        //Simulate Controller
        if(t >= nextControllerRunTime && t > .0){

            // Bang-bang control law
            if(speed_rpm < target_speed_rpm){
                inVolts = on_voltage;
            } else {
                inVolts = off_voltage;
            }

            //Maintain separate sample rate for controller
            nextControllerRunTime += Ts_controller;
        }
        
        
        //Simulate Plant behavior
        speed = (Ts*C1*inVolts + speedPrev)/(1+Ts*C2);
        speedPrev = speed;

        speed_rpm = speed*60/2/3.14159
        motorSpeedArray.push([t, speed_rpm]);
        inputVoltageArray.push([t, inVolts]);
    }

}

runSimBangBang();

a = functionPlot({
  target: '#plot3a',
  title: '',
  grid: true,
  yAxis: {
      label: "Wheel Speed (RPM)",
      domain: [-100, 4000]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 10]
  },
  data: [
    {
        points: motorSpeedArray,
        fnType: 'points',
        graphType: 'polyline'
    }
  ]
})

b = functionPlot({
  target: '#plot3b',
  title: '',
  grid: true,
  yAxis: {
      label: "Input Voltage (V)",
      domain: [-1, 14]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 10]
  },
  data: [
    {
        points: inputVoltageArray,
        fnType: 'points',
        graphType: 'polyline'
    }
  ]
})

a.addLink(b);

//////////////////////////////////////////////////////////////////////////////////////////////////////
// PID controller - 20 ms
//////////////////////////////////////////////////////////////////////////////////////////////////////

function runSimPID(sample_time){

    var minTime = -1.0;
    var maxTime = 10.0;
    var Ts = 0.001;
    var speedPrev = 0;

    Ts_controller = 0.02;
    nextControllerRunTime = 0.0;

    inVolts = 0.0;

    target_speed_rpm = 1000;
    speed_rpm = 0.0;

    motorSpeedArray = [];
    inputVoltageArray = [];

    P_gain = 5;
    I_gain = 0;
    D_gain = 0;

    error=0;
    err_accum=0;
    err_prev=0;
    
    for(t = minTime; t < maxTime; t += Ts){

        //Simulate Controller
        if(t >= nextControllerRunTime){
            
            //Calculate error, error derivative, and error integral
            error = (target_speed_rpm - speed_rpm)*2*3.14159/60;
            err_accum += (error)*Ts_controller;
            err_delta = (error - err_prev)/Ts_controller;

            //PID control law
            inVolts = P_gain * error  +  I_gain * err_accum  +  D_gain * err_delta;

            //Cap voltage at max/min of the physically possible command
            if(inVolts > 12){
                inVolts = 12;
            } else if (inVolts < 0){
                inVolts = 0;
            }

            err_prev = error;
            //Maintain separate sample rate for controller
            nextControllerRunTime += Ts_controller;
        }
        
        
        //Simulate Plant behavior
        speed = (Ts*C1*inVolts + speedPrev)/(1+Ts*C2);
        speedPrev = speed;

        speed_rpm = speed*60/2/3.14159
        motorSpeedArray.push([t, speed_rpm]);
        inputVoltageArray.push([t, inVolts]);
    }

}

runSimPID();

a = functionPlot({
  target: '#plot4a',
  title: '',
  grid: true,
  yAxis: {
      label: "Wheel Speed (RPM)",
      domain: [-100, 4000]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 10]
  },
  data: [
    {
        points: motorSpeedArray,
        fnType: 'points',
        graphType: 'polyline'
    }
  ]
})

b = functionPlot({
  target: '#plot4b',
  title: '',
  grid: true,
  yAxis: {
      label: "Input Voltage (V)",
      domain: [-1, 14]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 10]
  },
  data: [
    {
        points: inputVoltageArray,
        fnType: 'points',
        graphType: 'polyline'
    }
  ]
})

a.addLink(b);
