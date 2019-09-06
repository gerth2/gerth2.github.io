---
layout: post
title:  "Control Theory - Mathematical Models of the World "
date:   2019-09-06 9:30:00 -0500
categories: blog_posts
---


## Introduction

All models are wrong some are useful

## What is a Model?

Mathemtaical models

Relationship to abstractions

## Techniques for Building up a Model

First-principles physics based

Experimental Data

The need for Validation

## Practical Example - Gearbox

input = ratio * output

## Practical Example - Wheel with Mass

speed = torque * moment of inertia

## Practical Example - Brushed DC Motor

torque = electrical input & speed

speed = torque & whatever it's hooked up to

## Practical Example - Wheeled Shooter System

Combine gearbox, motor, mass

## Practical Example - Lead Acid Battery

output voltage = current draw & internal discharge params

## Practical Example - Pneumatics System

### Compressor & Storage Tank

compressor provides volumetric flow as a function of pressure

Tank has pressure as a function of total moles of air (integral of volumetric flow over time)

### Pneumatic Cylinder

volumetric flow as a function of volume change

Volume change as a function of piston position

piston position as a function of force acting on the rod (both from pressure and external force)

## Non-time-domain Analysis Methods

What is the time domain. Why we've stuck to using Time Domain. Why you might need to go beyond time domain.

Fourier Transform, S transform, Z transform

## Conclusion

Now that we know how to describe components of our plant, let's look at how to design a controller ot make them work well together.

