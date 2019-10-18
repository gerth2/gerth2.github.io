---
layout: post
title:  "Control Theory - Tuning PID"
date:   2019-10-12 9:30:00 -0500
categories: blog_posts
---

## Introduction

In this final installment of our series on Control Theory, we'll walk through the details of tuning a PID algorithm. We'll cover two of the most common cases in FRC - controlling the _rotational velocity_ of a mechanism with a motor (like our shooter wheel), and controlling the _position_ of a mechanism with a motor (like an arm). 

## Shooter Wheel System Tuning

We'll start by going over how to properly tune our old friend, the shooter wheel.

### System Review

If you haven't gone through the other blog posts, it would definitely be good to check out [Part 1](link me), [Part 2](link me), and [Part 3](link me) to get some basic understanding of the whole control theory thing we're describing. But in case you didn't, know that we're tuning a shooter wheel, powered by a motor, attempting to get it to a certain rotational velocity prior to injecting a ball to launch.

The mathematical model for how this system works is described by this equation:

$$ \omega_{wheel}[n] = \frac{T_s C_1 V_{in}[n] + \omega_{wheel}[n-1]}{( 1 + T_s C_2 )} $$

And when you jam 12 volts into this system (via $$V_{in}$$), you get motion that looks like this:

<div id="plot2a"></div>
<div id="plot2b"></div>

The red line shows the _setpoint_ - the desired speed command. Our goal will be to get the shooter wheel as close to that speed, as quickly as possible.

### Basic Technique

As we've mentioned, _Tuning_ a PID controller is the process of determining the numeric values of the proportional, integral, derivative, and feed forward gains for the controller. The exact values will be dependant on the physical system and its behavior. 

The basic technique we'll cover is effectively _guess and check_. There are some more algorithmic approaches, but I find its best to start with the guess-and-check method, to get the best intuitive understanding of what each gain does. Everything we describe here is a _rule of thumb_, not a _rule_. I'm sure the greybeards reading this will have lots of alternate advice, and it's probably better than what I have to offer. But you're here reading my blog, so I'll tell you what I know for now :).

For our shooter wheel, or for any velocity control, there is a prescribed order that you should generally follow: first F, then P, then D, then I. Lets walk through the process.

One quick note on technique - for all these values, start _small_. If the value is too low, double it. If it's too big, cut it in half. Continue this process till you get close. At that point, you can start to fine-tune the value. But, the fastest and safest way to ge to the ideal value that I've found is the doubling/halving technique.

Here's our graph we'll be manipulating through the tuning process. Not doing too much now, since all the gains are set to zero.

<div id="plot4a"></div>
<div id="plot4b"></div>
<div id="gains"></div>
<input value="Reset" type="button" onClick="resetPIDF()"/>

#### F Gain

Ok then. We'll be starting with F. Choose F such that the _steady state_ speed, with no disturbances, gets _fairly close_ to the setpoint. Within about 10% is usually fine. For something like a shooter wheel, err on the side of "slightly too high" if possible. 

<input value="Double F" type="button" onClick="adjustF(2.0)"/>
<input value="Half F" type="button" onClick="adjustF(0.5)"/>
<input value="Bump Up F" type="button" onClick="adjustF(1.05)"/>
<input value="Bump Down F" type="button" onClick="adjustF(0.95)"/>
<input value="Zero-out F" type="button" onClick="adjustF(0)"/>

At this point, if you were to fire up your shooter, you'll get kinda close, but you won't be getting there very fast. Nor will you be able to reject a constant disturbance, like changing friction or a sagging battery voltage. We need to start adding some feedback.

_Hint: On this system, a good value is around 0.01_

#### P Gain

P is next. Same thing as F - start near zero, and double the value each iteration. When P is zero, it will have no impact on behavior. When P is very very small, it has very very little impact on behavior.

<input value="Double P" type="button" onClick="adjustP(2.0)"/>
<input value="Half P" type="button" onClick="adjustP(0.5)"/>
<input value="Bump Up P" type="button" onClick="adjustP(1.05)"/>
<input value="Bump Down P" type="button" onClick="adjustP(0.95)"/>
<input value="Zero-out P" type="button" onClick="adjustP(0)"/>

As you increase P, you should start to see your rate of approaching the setpoint get better and better. When you have a disturbance, even like a ball entering the shooter, you'll see it bounce back pretty fast. As you start to raise P, you'll notice a big improvement at first, as we're _actually_ going toward the setpoint. 

You'll be able to increase it quite a bit with much more marginal gains. Finally, at a certain point, the output starts to _oscillate_. 

You could keep going, but eventually the output becomes very unstable.

For P, your target is to tune _just barely at the point_ where the output starts to oscillate.

_Hint: On this system, a good value is around 2.28_

#### D gain

Then we can bring on D. D should start at about 1/100th of where you set P at. Same as before, start doubling the D gain until it _takes away_ most of the oscillation from the P gain. 

<input value="Double D" type="button" onClick="adjustD(2.0)"/>
<input value="Half D" type="button" onClick="adjustD(0.5)"/>
<input value="Bump Up D" type="button" onClick="adjustD(1.05)"/>
<input value="Bump Down D" type="button" onClick="adjustD(0.95)"/>
<input value="Zero-out D" type="button" onClick="adjustD(0)"/>

Similar to P, if you make D too high, you get instability. 

_Hint: On this system, a good value is around 0.047_

#### I Gain

Once you've got F, P, and D, it's time to tune I. We actually don't have any real friction modeled in this system, so we have very little steady state error to correct for. Given a response that looks like the above, I'd actually recommend skipping it.

If to do have to tune I, do it similarly to D. Start at 1/10th of P, and double until the steady-state error has been eliminated.

<input value="Double I" type="button" onClick="adjustI(2.0)"/>
<input value="Half I" type="button" onClick="adjustI(0.5)"/>
<input value="Bump Up I" type="button" onClick="adjustI(1.05)"/>
<input value="Bump Down I" type="button" onClick="adjustI(0.95)"/>
<input value="Zero-out I" type="button" onClick="adjustI(0)"/>

Once you're at this point - the best advice I can give - STOP. Don't keep fiddling at random. Good enough is good enough. PID will never get quite perfect. If you are at a point that looks like this, there's admittedly not much else you can expect.



### Varying the Setpoint

Choose different RPM. Still works well. Good!

<div class="slidecontainer">
    Setpoint:
    <input type="range" min="0" max="2000" value="1000" class="slider" id="setpointSlider">
    <br>
</div>


## Second Example - Arm Position

We'll now look a second major application of PID control in FRC - controlling a mechanism's _position_ using a motor. A common example is an arm on the top of a robot. For our arm, we'll assume it's _vertical_ - that is to say, it lifts things from floor height to some higher elevation - Think like the 2018 game robots:

INSERT ARGOS PICTURE HERE.

Our _desired_ input (or _setpoint_) will come in terms of _degrees above or below the horizon_, rather than rotational velocity. As we'll see, this leads to a different tuning methodology, but the underlying PID concept still works.

### System Model

#### Basic Description

#### Mathematical Description


### PID Tuning

P, then D, then I

### Why not F, Like Before?

F causes voltage proportional to setpoint. Setpoint is in terms of position - not what we want in this case.

### Varying the Setpoint

System is non-linear, so the tunings don't work great against a wide range of locations

What to do? One option is to pick the point at which you want to hold the arm, and keep it there.


### Removing Non-Linearity

Linearization = process of making non-linear system linear.

Since we know our system, we can use a _more complex_ F term to remove the nonlinearity. We get clever to eliminate gravity. Gravity is proportional to $$sin(\theta_{act}(t))$$. So make an F term which is also proprtional to $$sin(\theta_{act}(t))$$. Should effectively "cancel out" gravity.

### Re-tuning

Need to start again, because P no longer should be accounting for gravity.

F, then P, then D, then I.

F can be calculated as the voltage required to hold the arm level (easy to empiraclly determine on a robot).

Remainder of tuning is the same.

## Next Steps - Modern Control Theory

The thing we did to to F is called "plant model inversion". It's one topic of many in modern control theory. Linear algebra, LQR, etc, all await.

Start with PID, see how far you can get. Once you've mastered PID, maybe try something more complex. Keep in mind the goal is functionality and learning. PID might be good enough for both. Up to you.

## Conclusion

Go tune your controllers!


<script src="/assets/js/pidTune.js"></script>

