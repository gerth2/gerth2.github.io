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
// Steady-state behavior with max voltage applied
//////////////////////////////////////////////////////////////////////////////////////////////////////