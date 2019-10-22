//////////////////////////////////////////////////////////////////////////////////////////////////////
// Global constatns the user will manipulate
//////////////////////////////////////////////////////////////////////////////////////////////////////

FGain = 0;
PGain = 0;
DGain = 0;
IGain = 0;
setpoint = -45.0;
startpoint = 0;

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
        this.posGraph = null;
        this.voltsGraph = null;
        this.plot1Name = plot1Name;
        this.plot2Name = plot2Name;
    }

    updatePlot(posData, voltageData){
        if(this.posGraph == null){
            this.posGraph = functionPlot({
                target: this.plot1Name,
                disableZoom:true,
                title: '',
                grid: true,
                yAxis: {
                    label: "Arm Position (Deg)",
                    domain: [-160, 160]
                },
                xAxis: {
                    label: "Time (s)",
                    domain: [-0.5, 10]
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
                    domain: [-0.5, 10]
                }
              })
        }


        this.posGraph.options.data =
        [
          {
              points: posData,
              fnType: 'points',
              graphType: 'polyline'
          },
          {
            fn: setpoint.toString(),
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
          
          this.posGraph.addLink(this.voltsGraph);
          this.voltsGraph.addLink(this.posGraph);

          this.posGraph.draw()
          this.voltsGraph.draw()
    }
    

}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Simulation Constants and state variables.
//////////////////////////////////////////////////////////////////////////////////////////////////////

//Motor & shooter wheel configuration constants

//Gearbox
var GEARBOX_RATIO = 500.0/10.0; //output over input - 50:1 gear ratio

//775 Pro Motor
var Rc = 0.08; //Coil & Wiring Resistance in Ohms
var Kt = 0.71/134; //Nm/A torque constant -  Calculated from Stall Torque/Stall Current
var Kv = (12-(0.7*Rc))/(18730*2*3.14159/60); //V/(rad/s). Calculated from Vemf@FreeSpeed/(2pi/60*RPM@FreeSpeed). Steady-state Vemf = Vs - I@FreeSpeed*Rc, for Vs = 12

//Arm assembly
var mass = 2.0; //arm end effector mass in Kg
var radius = 0.6096; //2 ft arm length, converted to meters
var Kf = 1.25; // rotational kinetic friction coefficient in N/(rad/sec)

// Constants from the blog post equations
var C1 = GEARBOX_RATIO * Kt/(mass*radius*radius*Rc);
var C2 = Kt*Kv/(mass*radius*radius*Rc) + Kf/(mass*radius*radius)
var C3 = 9.81/(radius * radius);

var armPosArray = [];
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

    getSample()
    {
        if(this.items.length >= this.desLen){
            return this.items.shift()
        } else {
            return 0;
        }
    }
}

function radToDeg(rad){
    return rad * 180/3.14159;
}
function degToRad(deg){
    return deg * 3.14159/180;
}

var mainPlots = new DualPlot('#plot5a', '#plot5b')
function updatePlots(){
    mainPlots.updatePlot(armPosArray, inputVoltageArray)
    document.getElementById("gains").innerHTML = "<b>" + 
    "F="+FGain.toFixed(4) + " <br>" +
    "P="+PGain.toFixed(4) + " <br>" +
    "I="+IGain.toFixed(4) + " <br>" +
    "D="+DGain.toFixed(4) + " <br>" +
    "Setpoint="+setpoint.toFixed(0) + " deg" +
    "</b>";
    resetAnimationToStart();
    
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Animation
//////////////////////////////////////////////////////////////////////////////////////////////////////

//Animation behavior constants
var animationTs = 0.02;
var animationStartTime = -0.5;
var animationEndTime = 10.0;

//Animation state
var animationTime = animationStartTime;
var runAnimation = false;
var drawAngle = 0;

//Animation HTML canvases to draw on
var cs = document.getElementById("staticCanvas");
var ctxs = cs.getContext("2d");

var ca = document.getElementById("animatedCanvas");
var ctxa = ca.getContext("2d");

// Animation appearance
var WIDTH = 500;
var HEIGHT = 500;
var teamNum = Math.floor(Math.random() * 8000).toFixed(0);

function drawRobot(){
    //Supports
    ctxs.lineWidth = 5;
    ctxs.strokeStyle = '#000000';
    ctxs.beginPath();
    ctxs.moveTo(WIDTH/2, HEIGHT/2);
    ctxs.lineTo(0.3*WIDTH, 0.9*HEIGHT);
    ctxs.stroke();
    ctxs.beginPath();
    ctxs.moveTo(WIDTH/2, HEIGHT/2);
    ctxs.lineTo(0.7*WIDTH, 0.9*HEIGHT);
    ctxs.stroke();

    //Wheels
    ctxs.lineWidth = 5;
    ctxs.fillStyle="#000000"
    ctxs.strokeStyle = '#444444';
    ctxs.beginPath();
    ctxs.arc(0.2*WIDTH, 0.92*HEIGHT, 0.06*HEIGHT, 0, 2 * Math.PI, false);
    ctxs.fill();
    ctxs.stroke();
    ctxs.beginPath();
    ctxs.arc(0.5*WIDTH, 0.92*HEIGHT, 0.06*HEIGHT, 0, 2 * Math.PI, false);
    ctxs.fill();
    ctxs.stroke();
    ctxs.beginPath();
    ctxs.arc(0.8*WIDTH, 0.92*HEIGHT, 0.06*HEIGHT, 0, 2 * Math.PI, false);
    ctxs.fill();
    ctxs.stroke();

    //Bumpers
    ctxs.fillStyle="#FF0000"
    ctxs.fillRect(0.1*WIDTH, 0.9*HEIGHT, 0.8*WIDTH, 0.05*HEIGHT);
    ctxs.fillStyle="#FFFFFF"
    ctxs.font = "bold 22px Arial";
    ctxs.fillText(teamNum, 0.45*WIDTH, 0.94*HEIGHT); 
}

function drawArmAtAngle(angleDeg){
    armLenPx = WIDTH*0.40;

    armStartX = 0.5*WIDTH;
    armStartY = 0.5*HEIGHT;

    armEndX = armStartX + armLenPx*Math.cos(degToRad(angleDeg));
    armEndY = armStartY - armLenPx*Math.sin(degToRad(angleDeg)); //Cuz y axis inverted on graphics cuz computers

    //Arm
    ctxa.lineWidth = 6;
    ctxa.strokeStyle = '#22BB22';
    ctxa.beginPath();
    ctxa.moveTo(armStartX, armStartY);
    ctxa.lineTo(armEndX, armEndY);
    ctxa.stroke();

    //Shoulder Joint
    ctxa.beginPath();
    ctxa.arc(0.5*WIDTH, 0.5*HEIGHT, 0.02*HEIGHT, 0, 2 * Math.PI, false);
    ctxa.fillStyle = 'grey';
    ctxa.fill();

    //End Effector
    ctxa.beginPath();
    ctxa.arc(armEndX, armEndY, 0.035*HEIGHT, 0, 2 * Math.PI, false);
    ctxa.fillStyle = '#990099';
    ctxa.fill();
}

function drawTime(time_sec){
    //Text
    ctxa.fillStyle="#000000"
    ctxa.font = "bold 30px Arial";
    ctxa.fillText("t = " + time_sec.toFixed(2) + " sec", 0.05*WIDTH, 0.07*HEIGHT); 
    //Progress bar
    ctxa.fillStyle="#0000FF"
    ctxa.fillRect(0.0*WIDTH, 0.0*HEIGHT, ((time_sec-animationStartTime)/(animationEndTime - animationStartTime))*WIDTH, 0.02*HEIGHT);
}

function clearCanvas(){
    ctxa.clearRect(0,0,WIDTH,HEIGHT);
}




function animationLoop(){
    
    drawAngle = getAngleAtTime(animationTime);
    clearCanvas();
    drawArmAtAngle(drawAngle);
    drawTime(animationTime);

    if(runAnimation){
        //Update time in a looping format
        animationTime += animationTs;
        if(animationTime >= animationEndTime){
            animationTime = animationStartTime;
        }
    }
}

function playAnimation(){
    runAnimation = true;
}

function pauseAnimation(){
    runAnimation = false;
}

function resetAnimationToStart(){
    animationTime = animationStartTime;
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>> SIMULATIONS 
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var minTime = -0.5;
var maxTime = 10.0;
var Ts = 0.001;

var Ts_controller = 0.02;

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Steady-state behavior with disturbances
//////////////////////////////////////////////////////////////////////////////////////////////////////
function simControlSystem(on_voltage, closedLoop){

    var posPrevPrevRad = degToRad(startpoint);
    var posPrevRad = degToRad(startpoint);
    var posRad = degToRad(startpoint);
    var inVolts = 0;

    var error = 0;
    var err_prev = 0;
    var err_accum = 0;
    var err_delta = 0;

    extTorqueArray = [];
    armPosArray = [];
    inputVoltageArray = [];

    var nextControllerRunTime = 0;

    
    for(t = minTime; t < maxTime; t += Ts){

        if(t < 0){
            //"Hold" position
        } else {
            //Perform normal simulation

            
            //Simulate Controller
            if(closedLoop){
                if(t >= nextControllerRunTime){
                    
                    //Calculate error, error derivative, and error integral
                    error = (degToRad(setpoint) - posRad);
                    
                    err_accum += (error)*Ts_controller;

                    err_delta = (error - err_prev)/Ts_controller;

                    //PID control law
                    inVolts = FGain * Math.cos(posRad) + 
                              PGain * error  +  
                              IGain * err_accum  +  
                              DGain * err_delta;

                    //Cap voltage at max/min of the physically possible command
                    if(inVolts > 12){
                        inVolts = 12;
                    } else if (inVolts < -12){
                        inVolts = -12;
                    }

                    err_prev = error;
                    //Maintain separate sample rate for controller
                    nextControllerRunTime += Ts_controller;
                }
            } else {
                //"Full throttle" open-loop control law
                inVolts = on_voltage * step(t);
            }

            //Run plant model simulation
            posRad = 1/(Ts*C2 + 1) * ( Ts*Ts*C1*inVolts - Ts*Ts*C3*Math.cos(posPrevRad) + posPrevRad*(Ts*C2 + 2) - posPrevPrevRad );

            //Save previous values
            posPrevPrevRad = posPrevRad;
            posPrevRad = posRad;
        }

        //Update output arrays to plot the results
        armPosArray.push([t, radToDeg(posRad)]);
        inputVoltageArray.push([t, inVolts]);
    }

}

var voltageSlider  = document.getElementById("voltageSlider");
voltageSlider.oninput = runConstantVoltage;

function runConstantVoltage(){
    v_in = parseFloat(voltageSlider.value)/100
    simControlSystem(v_in, false);
    updatePlots();
    document.getElementById("voltsDisplay").innerHTML = v_in.toFixed(2) + " V";
}

function runClosedLoop(){
    simControlSystem(0, true);
    updatePlots();
}

function getAngleAtTime(timeSec){
    index = Math.round((timeSec-minTime)/Ts);
    try{
        val = armPosArray[index][1];
    } catch(e){
        //meh
        val = 0;
    }
    return val;
}

function resetPIDF(){
    FGain = 0;
    PGain = 0;
    DGain = 0;
    IGain = 0;
    setpoint = -45;
    startpoint = 0;
    runClosedLoop();
}

function adjustF(adj){
    if(FGain == 0 & adj != 0){
        FGain = 0.01;
    } else {
        FGain *= adj;
    }
    runClosedLoop();
}

function adjustP(adj){
    if(PGain == 0 & adj != 0){
        PGain = 0.001;
    } else {
        PGain *= adj;
    }
    runClosedLoop();
}

function adjustD(adj){
    if(DGain == 0 & adj != 0){
        DGain = 0.001;
    } else {
        DGain *= adj;
    }
    runClosedLoop();
}

function adjustI(adj){
    if(IGain == 0 & adj != 0){
        IGain = 0.001;
    } else {
        IGain *= adj;
    }
    runClosedLoop();
}

var setpointSlider  = document.getElementById("setpointSlider");
setpointSlider.oninput = adjustSetpoint;

function adjustSetpoint(){
    setpoint = parseFloat(setpointSlider.value);
    runClosedLoop();
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>> MAIN CODE STARTS HERE
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//run one sim to get some data, even if the user clicks nothing
runConstantVoltage();

drawRobot(); //Initialize static drawings
setInterval(animationLoop, animationTs*1000); //Run animation loop continuously




