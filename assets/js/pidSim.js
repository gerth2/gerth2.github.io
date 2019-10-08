
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

    constructor(plot1Name, plot2Name){
        this.speedGraph = null;
        this.voltsGraph = null;
        this.plot1Name = plot1Name;
        this.plot2Name = plot2Name;
    }

    updatePlot(rpmData, voltageData){
        if(this.speedGraph == null){
            this.speedGraph = functionPlot({
                target: this.plot1Name,
                disableZoom:true,
                title: '',
                grid: true,
                yAxis: {
                    label: "Wheel Speed (RPM)",
                    domain: [-100, 4000]
                },
                xAxis: {
                    label: "Time (s)",
                    domain: [-1, 10]
                }
              })
        }
        if(this.voltsGraph == null){
            this.voltsGraph = functionPlot({
                target: this.plot2Name,
                disableZoom:true,
                title: '',
                grid: true,
                yAxis: {
                    label: "Input Voltage (V)",
                    domain: [-1, 14]
                },
                xAxis: {
                    label: "Time (s)",
                    domain: [-1, 10]
                }
              })
        }


        this.speedGraph.options.data =
        [
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

        this.voltsGraph.options.data = 
        [
            {
                points: voltageData,
                fnType: 'points',
                graphType: 'polyline'
            }
          ]
          
          this.speedGraph.addLink(this.voltsGraph);
          this.voltsGraph.addLink(this.speedGraph);

          this.speedGraph.draw()
          this.voltsGraph.draw()
    }
    

}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Simulation Constants and state variables.
//////////////////////////////////////////////////////////////////////////////////////////////////////

//Motor & shooter wheel configuration constants

//Gearbox
var GEARBOX_RATIO = 50.0/10.0; //output over input - 5:1 gear ratio

//775 Pro Motor
var Rc = 0.08; //Coil & Wiring Resistance in Ohms
var Kt = 0.71/134; //Nm/A torque constant -  Calculated from Stall Torque/Stall Current
var Kv = (12-(0.7*Rc))/(18730*2*3.14159/60); //V/(rad/s). Calculated from Vemf@FreeSpeed/(2pi/60*RPM@FreeSpeed). Steady-state Vemf = Vs - I@FreeSpeed*Rc, for Vs = 12
var mass = 0.75; //shooter wheel mass in Kg
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
var fullVoltPlot = new DualPlot('#plot2a', '#plot2b')
runSimFullVoltage();
fullVoltPlot.updatePlot(motorSpeedArray, inputVoltageArray)

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

var fullVoltDistPlot = new DualPlot('#plot5a', '#plot5b')
runSimFullVoltageDisturbances();
fullVoltDistPlot.updatePlot(motorSpeedArray, inputVoltageArray)


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

var bangBangPlot = new DualPlot('#plot3a', '#plot3b')

// Update the current slider value (each time you drag the slider handle)
sampTimeSlider.oninput = function() {
    sampTimeDisp.innerHTML = this.value + "ms";
    runSimBangBang(this.value/1000);
    bangBangPlot.updatePlot(motorSpeedArray, inputVoltageArray)
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
    ERROR_CAP = 1000;

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

var pidPlot = new DualPlot('#plot4a', '#plot4b')

// Update the plots (each time you drag any slider handle)
function rePlot(){
    FGain = parseFloat(FGainSlider.value)/70000;
    PGain = parseFloat(PGainSlider.value)/350;
    IGain = parseFloat(IGainSlider.value)/35;
    DGain = parseFloat(DGainSlider.value)/3500;

    FGainDisplay.innerHTML = FGain;
    PGainDisplay.innerHTML = PGain;
    IGainDisplay.innerHTML = IGain;
    DGainDisplay.innerHTML = DGain;

    runSimPID(FGain, PGain, IGain, DGain);
    pidPlot.updatePlot(motorSpeedArray, inputVoltageArray)
}


FGainSlider.oninput = rePlot;
PGainSlider.oninput = rePlot;
IGainSlider.oninput = rePlot;
DGainSlider.oninput = rePlot;


//Init
rePlot()


