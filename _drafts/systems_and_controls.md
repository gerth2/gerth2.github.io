---
layout: post
title:  "Control Theory - Systems & Control Engineering"
date:   2019-09-05 09:31:40 -0500
categories: blog_posts
---

## Introduction

One of the most eye-opening courses I took in college was an [introduction to control theory course](https://courses.grainger.illinois.edu/ece486). Prior to this, I had never even heard of this concept of "control theory" - it provided this brand new level of abstraction for thinking about how software fits in with the rest of the world. It gives you the tools and vision for creating software and physical devices in harmony, to produce some desired output. This output could be a desired motion.

_Software and physical devices in harmony_

Sounds sorta familiar, huh? 

![software and hardware together](/assets/sw_hw_254.png)

_Source: team254.com_

I did a couple cool projects in the class, but largely didn't touch the subject much academically. But boy, did it influence the way that I approach problem solving. And it has been the single greatest driving force in my design philosophy for robotics - both in college, and into FRC.

I want to start a series of posts on the topic. We'll start by talking more about the formal definitions of "System" and "Controls", dig into a bit of the math (with lots of pictures, don't worry), and finally talk a bit about controller design - leading into the mysterious land of _PID_. 

If you've spent any time around robotics, you've most certainly heard the term PID - this mystical thing that you put in code, and then it magically solves problems! Right? 

Eeeh, not so much. Only certain problems, and only under certain constraints. The study of Controls Engineering will give us the answers on _which_ problems and _which_ constraints. 

The ultimate goal? The goal? [Make mechanical systems do our bidding](https://vimeo.com/110346531). Nothing more, nothing less. Let's dive in!

## Defining a _System_

A _Control System_, or simply a _System_, is a carefully-selected collection of mechanical parts, electronics, and software which interact. That's it. Its super vague by itself. The academic treatment is purposefully vague, so as to explore the surprising similarities between seemingly disparate situations.

Usually, a control system in robotics consists of the following components:

- An _Input Command_, which describes what the mechanism _should_ be doing.
  - This could be from a human operator's controller, or maybe an autonomous routine.
- The _Controller_, a piece of software running on a processor which you can freely adjust
  - This usually lives on the roboRIO, but the software itself can be written as you please.
- An _Actuator_, the set of electronics and motors and solenoids which exert a force on the mechanism
  - FRC rules restrict your set of choices here, but still allow some freedom.
- The _End Effector_, the part of the mechanism you are attempting to move to your 
  - This is usually the thing your mechanical team designs and builds. There is some potential to change it, but its design is often fixed.
- The _Feedback Sensor_, something which measures the mechanism, and provides information to the Controller.
  - This can often be freely chosen, though due to mechanical constraints often has to be mounted in a certain position.

As you can probably see, every control system has some parts which you can freely design (like the Controller), some components which you have much less control over (like the actuator, or the mechanism connecting the end effector. The goal is to use the components you _can_ freely design to make the components you _can't_ freely design still do what you want.

### Practical Example

As a concrete example, think about a shooter wheel from 2016 or 2017 games. In both games, a common design was to launch a ball by spinning a rubber wheel up to a certain speed, then injecting the ball into the spinning wheel. The common "control system" element was to ensure the wheel had a particular speed prior to injecting the ball, in order to keep the trajectory consistent. For systems like this, the following design of a control system commonly applied:

- The _Input Command_ came from a button on an XBOX controller. Pressed and the command is something like 1000RPM, released and the command is 0 RPM.
- The _Controller_, as always, was some software on the roboRIO. We'll delve into the design of this software later.
- The _Actuator_ was some speed controller (like a Victor SP) wired to a motor (like a CIM)
- The _End Effector_ was some rotating, rubberized wheel. Usually, this was propelled by the actuator, via a gearbox.
- The _Feedback Sensor_ was a [quadrature encoder](https://en.wikipedia.org/wiki/Rotary_encoder), splined to some rotating member in the motor/gearbox/launch wheel system.

### Vocabulary

In more standard control system terminology, the following nomenclature is used:

- The value of the _Input Command_ is called the _Desired_ value.
- The value of the _Feedback Sensor_ is called the _Actual_ value.
- The software and computer and actuator electrical components are collectively called the _Controller_
- The mechanical portion of the actuator, the end effector, and the linkage between all this and the feedback sensor are collectively called the _Plant_

The Controller/Plant terminology dates back to when control systems were primarily for Chemical Engineering processes at chemical production plants - Engineers designed controllers to make their plants do what they wanted. 

The _Actual_ and _Desired_ values must both describe the quantities associated with the end effector you are trying to control - its speed, its position, etc. In the case of the shooter wheel, it's the rotational velocity of that launch wheel end effector. 

The Controller's job is actually fairly simple: Make the _Actual_ value match the _Desired_ value as closely as needed. That's it! _How_ this is accomplished is much more less simple, and is heavily dependant on the nature of the plant.

One additional note: The feedback sensor is actually optional, and is not present in some systems. We will discuss this in more detail later.

## The Block Diagram

The core tool used while describing control systems is the _block diagram_. Teams who use labview will already be well familiar with this concept. However, for the sake of the text-based language teams, let's delve in a bit.

A block diagram uses labeled _blocks_ to show entities, and _arrows_ to show relationships between them. 

![Insert picture here](https://placekitten.com/600/400)

The blocks can be defined to be anything you like - a controller, a plant, part of a plant, your dog, etc. You choose what to put in the block so as to communicate your intent most clearly. The block is an indication of an _abstraction_ - it shows the functional part you want your reader to be thinking about. No additional, unimportant details.

Arrows indicate a quantitative relationship or flow of data from one block to another. It could be a command communicated to a motor controller, a force applied from one mechanism to another, a position detected by a sensor, an electrical signal generated by a sensor and sent to a controller... you get the picture. The key is _quantitative_ - arrows are like assignment in variables, and actually get interpreted as such when you write software or do math based in block diagrams.

In our standard construction of a control system, we usually can draw the following block diagram:

![Insert picture here](https://placekitten.com/600/500)

And in our more specific example of the shooter wheel, we could fill in each block more specifically, like this:

![Insert picture here](https://placekitten.com/550/700)

## Control System Design

We've got the basic building blocks to start looking at how these control systems are designed. The next major task is to start to fill out the contents of each box.

For standard control theory design, each one will require a mathematical description - a _model_ - of behavior. Each one will have a description of how the input impacts the output.

Finally, we can apply control theory principles to _design_ the mathematics of what we want the controller to look like, such that our _actual_ value converges to the _desired_ value in the most appropriate way.

As a next step, we'll look at some examples of how to build up these mathematical models, and what important takeaways from the models we should expect.

## Closing Note - On Other Resources

Hopefully, I've peaked your interest in this topic. Assuming so, I hope you will carry on in this sequence of posts. However, note, this will be an overview, with a focus on getting a ground up explanation of why certain concepts work the way they do.

For a _much_ more thorough and mathematically rigorous explanation of the topic, I **HIGHLY** recommend reading [Controls Engineering in FRC](https://file.tavsys.net/control/controls-engineering-in-frc.pdf) - by far the best resource I've found on this topic. I'll be making references to sections in this book throughout this series of posts. So far, we've discussed content from Chapter 1, Control System Basics.