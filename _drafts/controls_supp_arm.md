---
layout: post
title:  "Control Theory - Supplemental - Vertical Arm"
date:   2019-10-24 9:30:00 -0500
categories: blog_posts
---

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

Here's an equation.

## Step Response

Putting in zero causes it to fall down

Putting in a bit causes it to still fall down.

Putting in more causes it to spin in circles

Controller gets to find the happy medium.

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

Since we know our system, we can use a _more complex_ F term to remove the nonlinearity. We get clever to eliminate gravity. Gravity is proportional to $$sin(\theta_{act}(t))$$. So make an F term which is also proprtional to $$sin(\theta_{act}(t))$$. Should effectively "cancel out" gravity.

### Re-tuning

Need to start again, because P no longer should be accounting for gravity.

F, then P, then D, then I.

F can be calculated as the voltage required to hold the arm level (easy to empiraclly determine on a robot).

Remainder of tuning is the same.