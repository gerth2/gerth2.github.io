---
layout: post
title:  "Control Theory - Supplemental - Vertical Arm"
date:   2019-10-20 9:30:00 -0500
categories: blog_posts
---

<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/assets/sidenav/sidenav.css">
<script src="/assets/sidenav/sidenav.js"></script>
<div id="mySidenav" class="sidenav" onclick="openNav()">
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
    <div id="plots">
        <div id="plot5a"></div>
        <div id="plot5b"></div>
    </div>
    <div id="visualization" style="padding: 20px;">
        <div style="position:relative; width:500px; height:500px">
            <canvas id="staticCanvas" width="500" height="500" style="border:1px solid #000000; position:absolute; top:0; left:0"> </canvas>
            <canvas id="animatedCanvas" width="500" height="500" style="background:transparent; position:absolute; top:0; left:0"> </canvas>
        </div>
        <input value="Play" type="button" onClick="playAnimation()"/>
        <input value="Pause" type="button" onClick="pauseAnimation()"/>
        <input value="Reset" type="button" onClick="resetAnimationToStart()"/>
    </div>
    <div id="user_interaction" class="gainsDisplay">
        <div id="gains"></div>
        <br>
        <input value="Reset" type="button" onClick="resetPIDF()"/>
    </div>
    <br><br><br><br>
</div>


## Introduction

For context, this post came about when one of our students asked for info on tuning the other main type of system in FRC - one where a motor powers a mechanism, and the desired _position_ is the setpoint.

A common example is an arm on the top of a robot. For our arm, we'll assume it's _vertical_ - that is to say, it lifts things from floor height to some higher elevation - Think like the 2018 game robots:

INSERT ARGOS PICTURE HERE.

Our _desired_ input (or _setpoint_) will come in terms of _degrees above or below the horizon_, rather than rotational velocity. As we'll see, this leads to a different tuning methodology, but the underlying PID concept still works.

## System Model

#### Basic Description

mass on a stick

motor powers the center through a gearbox

#### Mathematical Description

Since this is a bit abbreviated, I won't go through the full derivation of this system. However, it's not too bad to build up an equation from the bits and pieces we already have. 

To do so, we'll use the _shoulder joint_ of the arm as our origin and reference point. All torques, speeds, accelerations, and angular positions will be measured _about_ this point. Additionally, we'll use kinda-standard angle notation, such that $$0^\circ$$ is pointed "straight out in front" of the robot, $$90^\circ$$ is straight up in the air, and $$-90^\circ$$ is pointed at the ground.

Overall, the acceleration of the arm is determined from the following forces acting on it:

1. $$T_{m}$$ - The _motor_ (via a gearbox), which in turn in impacted by an _applied voltage_ which we can control as we please.
2. $$T_{f}$$ - Friction (works against rotational motion of the arm)
3. $$T_{g}$$ - Gravity (pulls the arm toward the $$-90^\circ$$ point)

Using Newton's second law for rotational forces, we can assemble our basic equation:

$$ T_{m}(t) + T_{f}(t) + T_{g}(t) = I \alpha(t) $$

And expanding each term, we arrive at the monster:

$$ \frac{N_{out}}{N_{in}} \frac{K_T}{R} \left( V_{in}(t) - \frac{N_{in}}{N_{out}} K_{V} \omega(t) \right) - K_{f} \omega(t) - m g \cos(\theta(t)) = m r^{2} \alpha(t) $$

Where:
* $$\frac{N_{out}}{N_{in}}$$ is the gearbox ratio
* $$K_T$$ is the motor torque constant
* $$V_{in}(t)$$ is the motor input voltage
* $$K_V$$ is the motor voltage constant
* $$\theta(t)$$, $$\omega(t)$$, and $$\alpha(t)$$ are the angular position, speed, and acceleration of the shoulder joint shaft.
* $$K_{f}$$ is the effective kinetic rotational friction constant of the system
* $$m$$ is the mass of the end-effector on the tip of the arm
* $$g$$ is the gravitational constant ($$9.81 m/s^2$$)
* $$r$$ is the length of the arm

Notice the minus sign on the frictional term is chosen to ensure the frictional torque _opposes_ motion, and the gravitational torque always _pushes toward $$-90^\circ$$_.

Re-arranging to group terms, pulling constants into nice buckets, substituting continuous time $$t$$ for discrete samples $$n$$:

$$\alpha[n] = C_1 V_{in}[n] - C_2 \omega[n] - C_3 cos(\theta[n]) $$

With

$$ C_1 = \frac{N_{out} K_T}{mr^2N_{in}R} $$

$$ C_2 = \frac{K_T K_V}{mr^2R} + \frac{K_f}{mr^2} $$

$$ C_3 = \frac{g}{r^2} $$


Since acceleration is the derivative of velocity, we can approximate $$\alpha[n]$$ in terms of $$\omega[n]$$:

$$\alpha[n] = \frac{\omega[n] - \omega[n-1]}{T_s} $$

And similarly, since velocity is the derivative of position, we can approximate $$\omega[n]$$ in terms of $$\theta[n]$$

$$\omega[n] = \frac{\theta[n] - \theta[n-1]}{T_s} $$

Math sticklers, avert your eyes for a paragraph.

If you were to substitute these into our equation, you'd end up with an equation that _stinks_ to solve symbolically for $$\theta[n]$$, because $$\theta[n]$$ appears both inside and outside a $$\cos()$$ function. Maybe there's a good way to solve it. I don't know offhand. What I do know is I can cheat a bit and use some one-sample-delayed assumptions that, for sufficiently small $$T_s$$, make our equation much more workable. There's enough sensor delay in our feedback (relative to $$T_s$$) that I honestly don't think it will mess up the solution too much. I think. Let's just go with it, Wild West style. Shoot math from the hip. That's how we roll. I guess. Remember, all models are wrong.

Ok, math people, come back, and don't try to check my work.

The final equation for position, in terms of things we know already or can control, is:

$$ \theta[n] = \frac{T_s^2 C_1 V_{in}[n] - T_s^2 C_3 \cos(\theta[n-1]) + \theta[n-1]\left( T_s C_2 + 2 \right) - \theta[n-2]}{T_s C_2 + 1} $$

If that doesn't make my eyes ooze out of their sockets, I don't know what will.

## Step Response

We're definitely going to want to play around with this guy to get some intuition for how it works. We've got another sidebar with our system behavior in it.

<input value="Open that sidebar now!" type="button" onclick="openNav()"/>

Since that equation is ever so intuitive, let's see what happens when we put our arm at horizontal, then let the system rip with some constant voltage applied.

<div class="slidecontainer">
    Voltage Applied:
    <input type="range" min="0" max="1200" value="100" class="slider" id="voltageSlider">
    <div id="voltsDisplay"></div>
</div>
<br>

Start by moving this slider to zero volts - no motor command at all. You should notice the arm fall down to the $$-90^\circ$$ position and stay there. It swings back and forth a bit till friction stops it.

This should totally make sense - in this configuration, the arm is like a pendulum. Pendulums oscillate due to the pull of gravity.

Try bumping up the voltage by a volt or two. You should also see something logical - the motor causes the arm to settle out at some position "higher up" than before, as the motor fights gravity.

Eventually if you give enough voltage, your arm can swing all the way around in a circle. Wheeee!

Clearly, for any position, our controller will have to find that nice happy voltage at which the arm maintains the proper position. It may also have to adjust the voltage a bit higher at first to get it to the setpoint.

## Controller setup

PID

Is F useful?

### First pass at tuning

We can get it decent.

### Varying the Setpoint

System is non-linear, so the tunings don't work great against a wide range of locations

What to do? One option is to pick the point at which you want to hold the arm, and keep it there.


### Removing Non-Linearity

Linearization = process of making non-linear system linear.

Since we know our system, we can use a _more complex_ F term to remove the nonlinearity. We get clever to eliminate gravity. Gravity is proportional to $$cos(\theta_{act}(t))$$. So make an F term which is also proprtional to $$cos(\theta_{act}(t))$$. Should effectively "cancel out" gravity.

### Re-tuning

Need to start again, because P no longer should be accounting for gravity.

F, then P, then D, then I.

F can be calculated as the voltage required to hold the arm level (easy to empiraclly determine on a robot).

Remainder of tuning is the same.

<script src="/assets/js/pidArm.js"></script>
