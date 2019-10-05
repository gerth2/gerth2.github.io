
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Standard Math Function impelmentations
//////////////////////////////////////////////////////////////////////////////////////////////////////

function step(t){
    if(t < 0){
        return 0;
    } else {
        return 1;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Graphing Utilities
//////////////////////////////////////////////////////////////////////////////////////////////////////

class DualPlot{

    constructor(plot1Name, plot2Name, rpmData, voltageData){
        this.speedGraph = NaN;
        this.voltsGraph = NaN;
        this.plot1Name = plot1Name;
        this.plot2Name = plot2Name;
        this.updatePlot(rpmData, voltageData);
    }

    updatePlot(rpmData, voltageData){
        if(self.speedGraph != NaN){
            delete this.speedGraph;
        }
        if(this.voltsGraph != NaN){
            delete this.voltsGraph;
        }

        this.speedGraph = functionPlot({
            target: this.plot1Name,
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
                  points: rpmData,
                  fnType: 'points',
                  graphType: 'polyline'
              },
              {
                fn: '1000',
                title: 'Setpoint'
              }
            ]
          })
          
          this.voltsGraph = functionPlot({
            target: this.plot2Name,
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
                  points: voltageData,
                  fnType: 'points',
                  graphType: 'polyline'
              }
            ]
          })
          
          this.speedGraph.addLink(this.voltsGraph);
          this.voltsGraph.addLink(this.speedGraph);
    }
    

}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Simulation Constants and state variables.
//////////////////////////////////////////////////////////////////////////////////////////////////////

//Motor & shooter wheel configuration constants

//Gearbox
var GEARBOX_RATIO = 30.0/10.0; //output over input

//CIM Motor
var Rc = 0.2; //ohms, for full CIM motor
var Kt = 2.429/131.227; //Nm/A - for CIM motor. Calculated from Stall Torque/Stall Current
var Kv = (12-(2.7*Rc))/(5310*2*3.14159/60); //V/(rad/s). Calculated from Vemf@FreeSpeed/(2pi/60*RPM@FreeSpeed). Steady-state Vemf = Vs - I@FreeSpeed*Rc, for Vs = 12
var mass = 1.0; //shooter wheel mass in Kg
var radius = 0.0762; //3 inch radius, converted to meters

// Constants from the blog post equations
var C1 = 2 *  Kt / (mass * radius * radius * GEARBOX_RATIO * Rc);
var C2 = 2 * Kv * Kt / (mass * radius * radius * Rc);
var C3 = 2 / (mass * radius * radius);

var extTorqueArray = [];
var motorSpeedArray = [];
var inputVoltageArray = []; 


class DelayLine
{
    constructor(num_samples)
    {
        this.items = [];
        this.desLen = num_samples;
    }
    
    addSample(val)
    {
        this.items.push(val)
        this.num_samples++;
    }

    getSample(val)
    {
        if(this.items.length >= this.desLen){
            return this.items.shift()
        } else {
            return 0;
        }
    }
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>> SIMULATIONS 
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Steady-state behavior with max voltage applied
//////////////////////////////////////////////////////////////////////////////////////////////////////
function runSimFullVoltage(){

    var minTime = -1.0;
    var maxTime = 10.0;
    var Ts = 0.001;
    var speedPrev = 0;

    on_voltage = 12.0;
    extTrq = 0;

    extTorqueArray = [];
    motorSpeedArray = [];
    inputVoltageArray = [];
    
    for(t = minTime; t < maxTime; t += Ts){

        //"Full throttle" open-loop control law
        inVolts = on_voltage * step(t);

        //Run plant model simulation
        speed = (Ts*C1*inVolts - Ts*C3*extTrq + speedPrev)/(1+Ts*C2);
        speedPrev = speed;

        //Update output arrays to plot the results
        extTorqueArray.push([t, extTrq]);
        speed_rpm = speed*60/2/3.14159;
        motorSpeedArray.push([t, speed_rpm]);
        inputVoltageArray.push([t, inVolts]);
    }

}

 //TODO - ACTUALLY USE CLASS REPRESNTATION TO STOP MEMORY LELAK
runSimFullVoltage();
makePlot('#plot2a', '#plot2b')

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Steady-state behavior with disturbances
//////////////////////////////////////////////////////////////////////////////////////////////////////
function runSimFullVoltageDisturbances(){

    var minTime = -1.0;
    var maxTime = 10.0;
    var Ts = 0.001;
    var speedPrev = 0;

    on_voltage = 12.0;

    extTorqueArray = [];
    motorSpeedArray = [];
    inputVoltageArray = [];
    
    for(t = minTime; t < maxTime; t += Ts){

        //Simulate friction
        extTrq = 0.0005*speedPrev;
        if(t > 5.0 & t < 5.1){
            //add a short "impulse" to simulate putting a ball into the shooter
            extTrq += 2;
        }
        
        //"Full throttle" open-loop control law
        inVolts = on_voltage * step(t);

        //Run plant model simulation
        speed = (Ts*C1*inVolts - Ts*C3*extTrq + speedPrev)/(1+Ts*C2);
        speedPrev = speed;

        //Update output arrays to plot the results
        extTorqueArray.push([t, extTrq]);
        speed_rpm = speed*60/2/3.14159;
        motorSpeedArray.push([t, speed_rpm]);
        inputVoltageArray.push([t, inVolts]);
    }

}

runSimFullVoltageDisturbances();
makePlot('#plot5a', '#plot5b')


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Bang-bang controller - interactive sample rate
//////////////////////////////////////////////////////////////////////////////////////////////////////

function runSimBangBang(Ts_controller){

    var minTime = -1.0;
    var maxTime = 10.0;
    var Ts = 0.001;
    var speedPrev = 0;

    nextControllerRunTime = 0.0;

    on_voltage = 12.0;
    off_voltage = 0.0;

    inVolts = 0.0;

    target_speed_rpm = 1000;
    speed_rpm = 0.0;

    speed_delay_line = new DelayLine(49)

    extTorqueArray = [];
    motorSpeedArray = [];
    inputVoltageArray = [];
    
    for(t = minTime; t < maxTime; t += Ts){

        //Simulate friction
        extTrq = 0.0005*speedPrev;
        if(t > 5.0 & t < 5.1){
            //add a short "impulse" to simulate putting a ball into the shooter
            extTrq += 2;
        }

        meas_speed = speed_delay_line.getSample();

        //Simulate Controller
        if(t >= nextControllerRunTime && t > .0){

            // Bang-bang control law
            if(meas_speed < target_speed_rpm){
                inVolts = on_voltage;
            } else {
                inVolts = off_voltage;
            }

            //Maintain separate sample rate for controller
            nextControllerRunTime += Ts_controller;
        }
        
        
        //Simulate Plant behavior
        speed = (Ts*C1*inVolts - Ts*C3*extTrq + speedPrev)/(1+Ts*C2);
        speedPrev = speed;

        speed_rpm = speed*60/2/3.14159
        motorSpeedArray.push([t, speed_rpm]);
        inputVoltageArray.push([t, inVolts]);

        speed_delay_line.addSample(speed_rpm);
    }

}

//add interactivity
var sampTimeSlider = document.getElementById("sampleTime_ms");
var sampTimeDisp   = document.getElementById("samplerate_disp");

// Update the current slider value (each time you drag the slider handle)
sampTimeSlider.oninput = function() {
    sampTimeDisp.innerHTML = this.value + "ms";
  runSimBangBang(this.value/1000);
  makePlot('#plot3a', '#plot3b');
} 

//Init
sampTimeSlider.oninput()


//////////////////////////////////////////////////////////////////////////////////////////////////////
// PID controller - 20 ms
//////////////////////////////////////////////////////////////////////////////////////////////////////

function runSimPID(F_gain, P_gain, I_gain, D_gain){

    var minTime = -1.0;
    var maxTime = 10.0;
    var Ts = 0.001;
    var speedPrev = 0;

    Ts_controller = 0.02;
    nextControllerRunTime = 0.0;

    inVolts = 0.0;

    target_speed_rpm = 1000;
    speed_rpm = 0.0;

    speed_delay_line = new DelayLine(49)

    extTorqueArray = [];
    motorSpeedArray = [];
    inputVoltageArray = [];

    error=0;
    err_accum=0;
    err_prev=0;
    
    for(t = minTime; t < maxTime; t += Ts){

        //Simulate friction
        extTrq = 0.0005*speedPrev;
        if(t > 5.0 & t < 5.1){
            //add a short "impulse" to simulate putting a ball into the shooter
            extTrq += 2;
        }

        meas_speed = speed_delay_line.getSample();

        //Simulate Controller
        if(t >= nextControllerRunTime){
            
            //Calculate error, error derivative, and error integral
            error = (target_speed_rpm - meas_speed)*2*3.14159/60;
            err_accum += (error)*Ts_controller;
            err_delta = (error - err_prev)/Ts_controller;

            //PIDF control law
            inVolts = F_gain * target_speed_rpm + 
                      P_gain * error  +  
                      I_gain * err_accum  +  
                      D_gain * err_delta;

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
        speed = (Ts*C1*inVolts - Ts*C3*extTrq + speedPrev)/(1+Ts*C2);
        speedPrev = speed;

        speed_rpm = speed*60/2/3.14159
        motorSpeedArray.push([t, speed_rpm]);
        inputVoltageArray.push([t, inVolts]);

        speed_delay_line.addSample(speed_rpm);
    }

}


//add interactivity
var FGainSlider  = document.getElementById("F_gain");
var FGainDisplay = document.getElementById("F_gain_disp");
var PGainSlider  = document.getElementById("P_gain");
var PGainDisplay = document.getElementById("P_gain_disp");
var IGainSlider  = document.getElementById("I_gain");
var IGainDisplay = document.getElementById("I_gain_disp");
var DGainSlider  = document.getElementById("D_gain");
var DGainDisplay = document.getElementById("D_gain_disp");

// Update the plots (each time you drag any slider handle)
function rePlot(){
    FGain = parseFloat(FGainSlider.value)/70000;
    PGain = parseFloat(PGainSlider.value)/350;
    IGain = parseFloat(IGainSlider.value)/3500;
    DGain = parseFloat(DGainSlider.value)/3500;

    FGainDisplay.innerHTML = FGain;
    PGainDisplay.innerHTML = PGain;
    IGainDisplay.innerHTML = IGain;
    DGainDisplay.innerHTML = DGain;

    runSimPID(FGain, PGain, IGain, DGain);
    makePlot('#plot4a', '#plot4b')
    console.log("Redraw")
}


FGainSlider.oninput = rePlot;
PGainSlider.oninput = rePlot;
IGainSlider.oninput = rePlot;
DGainSlider.oninput = rePlot;


//Init
rePlot()


