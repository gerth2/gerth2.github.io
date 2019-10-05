---
layout: post
title:  "Control Theory - PID & Controller Design"
date:   2019-09-21 9:30:00 -0500
categories: blog_posts
---


## Introduction

Welcome to post 3 in our series on controls engineering. In this post, we're going to explore the behavior of the motor model we've built up, try to create an intuition for how it behaves. We'll establish a couple criteria for what we want it to do, and lead into the application of a classic PID controller.

A bit of an aside to the reader: The more I've been writing this series, the more I'm realizing what a disservice I'm actually doing to modern control theory. We're using time domain analysis to build up all our understanding. Professional controls engineers, working on modern systems, don't work in this domain. They're using things like Linear Algebra, State-Space representations, LQR, and a whole host of things that, for better or for worse, I don't have too much exposure to. I feel a bit bad that we're not getting to the point where we can explain these. 

You have to walk before you can run, and walking still gets you from point A to point B. What I always have to remind myself - This is just a high school robotics competition. Using LQR to design a super optimal control system is a valiant cause, one from which much can be learned. But it's far from required for success.

The takeaway I guess I want readers to have: Enjoy our time here in the time domain space. Build up your intuition of how things evolve over time. Know that even if you get to the end of this series of posts, and learn everything they have to offer - _there is still more_. The pro's can teach you much.

## Plant Model Response 

One of the pieces of terminology thrown around for these systems is _response_. It's a generic term that simply means "Given some input, how does the output act?". 

You can describe the response to a specific input. For example, if you apply 12V to the motor, you can say the motor's _response_ to that 12v input is to _increase speed_. Response might also be more generic - if you have an equation, you might be able to describe the _response_ to _any input_ concisely. 

When analyzing the response of a system, we generally divide the analysis into two parts: _Transient_ and _Steady-State_. _Transient Response_ refers to how the system acts _immediately following_ some disturbance in input. If you suddenly change the input voltage to a motor, its shaft will change speed - the manner in which it ramps up or ramps down is this _transient response_. Separately, after the input has been stable for some time, the output usually stabilizes as well. _Steady-state_ refers to the system behavior after all of the "transient" behavior has died down. In our motor example, if you were to adjust the input voltage from 12V to 8V, you'd see the motor slow down. The speed it settles at could be called the "Steady State" response.

To analyze system response, we generally need to expose the system to a variety of different inputs. There are a few types of input that are very good to use, because you can learn a lot about the system from just a few trials (rather than shooting in the dark a lot).

The simplest is usually called a ["unit step"](https://en.wikipedia.org/wiki/Heaviside_step_function). It's a fancy math way to describe "flipping on a switch". If you're all into formal definitions, I like the piecewise definition:

$$ u(x) = \begin{cases} 0 & x < 0 \\ 1 & x \geq 0  \end{cases} $$

The input to the function (here notated as $$x$$) is usually some function of time. You stretch and scale the function to indicate the turn-on time, and its size.

For example, if you wanted to describe "turning on" the motor (apply 12V) at time = 1 sec, you could describe the input voltage $$v(t)$$ with the equation

$$ v(t) = 12u(t-1) $$

<div id="plot1"></div>
<script>
function step(t){
    if(t < 0){
        return 0;
    } else {
        return 1;
    }
}

function plot1PointsGen(){
    var retArray = []

    var minTime = -1.0;
    var maxTime = 5.0;
    var Ts = 0.01;

    for(t = minTime; t < maxTime; t += Ts){
        newValue = 12 * step(t - 1);

        retArray.push([t, newValue]);
    }

    return retArray;
}

functionPlot({
  target: '#plot1',
  title: '',
  grid: true,
  disableZoom:true,
  yAxis: {
      label: "Motor Voltage (V)",
      domain: [-3, 15]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 5]
  },
  data: [
    {
        points: plot1PointsGen(),
        fnType: 'points',
        graphType: 'polyline'
    }
  ]
})
</script>

It should be noted that the definition of this guy doesn't change all that much when you go from continuous $$(t)$$ to discrete $$[n]$$. The output is $$0$$ for all $$ n < 0 $$ and $$1$$ for all $$n \geq 0 $$.

### Practical Example - Shooter System Response

Let's try to insert our function into the shooter wheel system we described last time. We'll choose it as the function to describe how the _voltage_ input changes over time, and see how the speed changes.

#### Intuition

Before we hit the math, let's think through what we expect to happen. 

* Before the voltage turns on ($$t < 0$$), the wheel should not be turning. 
* As soon as the voltage turns on, the wheel should start spinning.
* The higher the voltage that is passed in, the faster it should be going.
* The wheel should hit some maximum "steady state" speed, and stay there.

Of course, most folks would thing this is pretty obvious. However, it's important to keep it in mind. We can use the math equations to show our intuition to be true, or use the intuition to validate we didn't get something wrong in the math.

#### Nominal Behavior

Recall the equation we derived in part 2:

$$ \omega_{wheel}[n] = \frac{T_s C_1 V_{in}[n] + \omega_{wheel}[n-1]}{( 1 + T_s C_2 )} $$

Let's see if we can get an idea for how this thing reacts when we apply an input voltage. We do this by making two assumptions:

1. We will apply 12 volts at the time 0 seconds ($$ t = 0 $$). This can be represented using our unit step function: $$ v[n] = 12*u[n] $$
2. We will assume the wheel was stationary prior to start. This means that $$ \omega_{wheel}[-1] = 0 $$

Based on this, we can draw the following plot of wheel speed, over time:

<div id="plot2a"></div>
<div id="plot2b"></div>

As a side note, the $$C_1$$ and $$C_2$$ values have been chosen to represent a single CIM motor, through a reasonable gearbox, through a typically-sized shooter wheel. See [This javascript file](/assets/js/pidSim.js) for more details on those assumptions.

If you stare at the graph, it certanly appears our initial suppositions are confirmed:

* For times to the left of the Y axis, we see our speed is zero.
* At $$t = 0$$, on the Y axis, voltage turns on, and our speed starts to increase.
* To the right of the Y axis, speed starts to increase as time goes on.
* As time goes on, we see the speed caps out at round 3500 RPM.

#### Extracting the Steady-state behavior.

As a brief tangent - it should be noted that you can extract these conclusions from the equation itself. Even if you don't trust your eyes on the chart, you can still prove it logically.

For example - If we $$ \omega[n] $$ and $$ V_{in}[n] $$ are zero for all $$n$$ less than zero, we can see the equation becomes:

$$ \omega_{wheel}[-5] = \frac{T_s C_1 * 0 + 0}{( 1 + T_s C_2 )} = 0 $$

Additionally, if when we assume "steady-state", we assume that  $$\omega_{wheel}[n] = \omega_{wheel}[n-1] $$ - the mathematical way of expressisng "$$n$$ is large enough such that $$\omega_{wheel}[n]$$ is no longer changing".

In this case, we can state:

$$ \omega_{wheel}[n] = \frac{T_s C_1 V_{in}[n] + \omega_{wheel}[n]}{( 1 + T_s C_2 )} $$

which simplifies to:

$$ \omega_{wheel}[n] = \frac{C_1}{C_2}V_{in}[n] $$

And, again, assuming $$V_{in}[n]$$ is just a constant for large $$n$$, means that our "steady-state" $$\omega_{wheel}[n]$$ is in fact also a constant. 

Huzzah! Isn't math fun?

## A Brief Step Back - The Goal

One key thing to remember, or learn, going forward: **A consistent shooter wheel must be running at a constant, defined _velocity_, prior to injecting a ball**. That's right - you need to keep your _rotational velocity (RPM)_ steady, if you want to make sure your launched ball always travels through a consistent arc. The reason for this is again based in physics - the _energy_ imparted to the ball controlls its arc, and energy imparted is related to the _velocity_ of the shooter wheel.

Here's the key, if you haven't noticed yet - we have the ability to command the motor's _voltage_, not it's _speed_. The speed is dictated by a whole slew of additional physical parameters. Though we've built up this math model of how things are supposed to work, this isn't a perfect transform we can invert to get an answer of voltage->speed, as we shall soon see.

#### Behavior with Disturbances

Before we get to discussing how to achieve a commanded speed, there's one more thing to discuss. We've so far neglected a key portion of our physical model - the presence of an _external disturbance_. When we say _external disturbance_, we're describing any force acting on the system which is, in some way, abnormal, or unexpected. This disturbance may come in many forms. 

Maybe it's a big hit, all at once - like a ball entering the shooter mechanism. This is often called an _impullse_ disturbance.

INSERT PLOT HERE

Maybe it's something more constant over time, like friction in the bearings and gears of the rotating mechanism:

INSERT PLOT HERE

Maybe it's something electrical, like the battery losing charge over time:

INESERT PLOT HERE

In every case, the external disturbance comes at an _unpredictable time_ and with an _unpredictable magnititude_. We've made some mathematical assumptions here about the behavior of the system, but they won't capture the exact behavior of every disturbance.

## The need for Feedback - Disturbances

This really is the key for why we need our software to be able to measure anything at all - we can't 100% predict the forces and influences of the external world on our controlled system. No matter how much planning and math we do, we can't protect ourselves from Joe Freshman who forgets to grease the gearbox just right, and changes the coefficent of friction. Neither can we know the exact timing of when balls will be injected into our shooter system, nor have guarantees our batteries will discharge at some exact rate. _We cannot exactly predict disturbances_.

What we can do, however, is design our software to account for disturbances. Since we can _measure_ the speed of the wheel, we can determine if it is too high or too low, and adjust our voltage to compensate. _Exactly how_ that voltage gets adjusted is worth detailed consideration, and is what the rest of the blog post will focus on.

## Designing A Controller - Intuition

Given the behavior of the system observed so far, the relationship between voltage and speed should be somewhat obvious - More voltage leads to more speed. We can leverage this fact while we design our software.

### Bang-Bang

Let us take a first pass at desigining some software that takes in a speed command, and produces a voltage command, with the intent of getting our shooter wheel toward the commanded speed. Based on the known physical relationship between voltage and speed, we declalre the folloing very simple _control law_:

1. If the speed is too low, send full power to the motor
2. If the speed is too high, send zero power to the motor.

In this casea, "too low" implies "actual speed is less than desired speed". "Too High" is just the opposite. Full power means 12V (since we are controlling voltage), and zero power menas 0V. This leads to what is commonly called a "Bang-bang" controller - hopefully a pretty intuitive concept. Per its name, it causes the motor command to "bang" between max and min power, attempting to keep the speed right at the desired value. You can zoom in on the graph to see this behavior in more detail.

Here's an example of what such a controller would do:

<div id="plot3a"></div>
<div id="plot3b"></div>

Notice how at the beginning, the system keeps the motor on. As soon as the speed crosses the "desired" threshold of 1000RPM, the motor command drops off. The motor speed begins to decrease, and continues to do so until the speed falls below that 1000RPM bogey. Once it does, the voltage turns on again, full force. THe motor speeds back up till it is turning the shooter wheel faster than 1000RPM. At which point the voltage shuts off, and the cycle starts over.

This control logic is actually remarkably good, especially given its simplicity (it's an if/else statement). The biggest disadvantage is that it's causing _big_ swings in the electrical signal, and slightly oscillating motor speed around the desired motor speed. If these voltage swings and slight velocity oscillations are acceptable for your application, this is a great system to use for controlling your shooter wheel.

However, there are more advanced options which can produce... "nicer" behavior.

## PID Controller - What It Is

A common design that _can_ work in lots of cases

<div id="plot4a"></div>
<div id="plot4b"></div>

## PID Controller - Why it works

What the components do. Why they're used

## Other Controller Designs

### Fully Custom (Physics-based)

Using the previously mentioned non-time-domain techniques

## Conclusion

Tuning PIDs Next



<script src="/assets/js/pidSim.js"></script>