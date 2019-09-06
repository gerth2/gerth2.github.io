---
layout: post
title:  "Control Theory - PID & Controller Design"
date:   2019-09-07 9:30:00 -0500
categories: blog_posts
---


## Introduction

## Plant Model Response 

What is system response

### Practical Example - Shooter System Response

Intuition

#### Nominal Behavior

Speed as a function of input voltage

#### Behavior with Disturbances

External impulse load (ball)

External constant load (friction)

Battery voltage sag

## The need for Feedback - Disturbances

Disturbances are unpredictable.

Disturbances which are detectable can also be correctable

## Designing A Controller - Intuition

What a controller would have to do in this case

## PID Controller - what it is

A common design that _can_ work in lots of cases

## PID Controller - Why it works

What the components do. Why they're used

## Other Controller Designs

### Bang-Bang

A simpler controller that actually works pretty well for the shooter design

A PID controller with P = Inf, I = D = 0

### Fully Custom (Physics-based)

Using the previously mentioned non-time-domain techniques

## Conclusion

Tuning PIDs Next