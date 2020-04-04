---
layout: post
title:  "Robust Tools for Robust Software Development"
date:   2020-03-30 9:30:00 -0500
categories: blog_posts
---

# Introduction

If you ever go do software development for a big company, you'll inevitably have to deal with metrics related to _development velocity_. This is reasonable - companies that are paying people to make software for them want to understand how the money is being spent. The question is, effectively, what rate is money being converted to _functional_ software.

Even though we're not paying our students to write software (ah the dream...), development velocity is still a huge thing. Of course, it's primarily driven by the competition deadlines - you have finite time between receiving the challenge, and having to produce functional software for the robot. Additionally, even within this time constraint, there's multiple teams who need to work on the robot. Every hour spent debugging software on the robot is an hour that could have been spent improving a mechanism, cleaning up some wiring, or getting drivers more time to practice driving the robot.

The bottom line: For most forms of software development, it's worthwhile to invest time in ensuring you're making progress as fast as possible. When actually writing software, this often involves scripting repetitive build processes, using code-generation design paradigms, utilizing integrated development environments, and using a plethora of industry-standard tools for getting multiple computers to do your work for you at the same time. Companies often have separate teams that manage this _environment_ in which software is developed.

For embedded controls software development, there are two major portions of the cycle. One is writing the software itself, but the other is _tuning_ the software on the actual robot. Most folks have done this already - especially if you've tried a PID or anything similar, you're at least aware of these two modes of software development. Depending on your industry, these two processes may be tied at the hip and done by the same people. ALternatively, they could be done by people who never talk to each other, on opposite sides of the world. Despite the variety of how the work is divided, The two share the same requirement of _development velocity_. 

All that being said, there are some very unique challenges to the tuning process that at least hint that you'd want a more specialized toolset. Generally you need to view how values change in real time. You can't quite halt the behavior of the robot physics like you can with software execution and a single step debugger. You also only manipulate a _subset_ of the software's functionality during the tuning process, which implies you don't need a "full-blown" build and reload process to get the job done.

With this in mind, anyone looking to improve there software development velocity should be looking into toolsets that support the development process they're doing. WPIlib, especially in the vsCode era, does an absolute bang-on job of delivering effective tools for both software development and tuning. The solution that Casserole uses, and I'll describe here, was started back in the Eclipse era, when the tools still had a number of gaps that we wanted to solve. 

We've continued to develop them and stick with them - we've invested the time, and it's not been too much of a pain to maintain. Combined with the fact that they're designed around our exact development process, it's been worthwhile to continue down the current path. That very well may change, even in 2021, as better and better tools are developed. All to be seen. Still, the lessons learned and architecture chosen are worthwhile to document, and it's a fun non-traditional robotics project for any of you go-getter students.

## The World Model

The best way to understand the system we put together is to start with how we model our world of "software development".

### Separating Data from Code

As mentioned, there's fundamentally two categories of work that get done related to software. 

One is actually writing the logic that controls the robot. Which joystick goes to which motor, which button controls the intake, which autonomous path happens before the arm gets raised.... things like this are definitely in the realm of what people traditionally think of when you describe the "software developer" role. It's done through writing code (in Java, for us), running it on some computer, stepping through it with a debugger, injecting test inputs, and making sure the outputs correspond to your expectations.

The other step is tuning. Here, we assume the logic has been written and tested. We're looking to empirically discover (or at least confirm) what _exact_ values for constants need to be in the software. The most universal example of this is in PID controllers: the P, I, D (and maybe F) gains are just numbers that you have to figure out, and prove that they work on the real mechanism. There's other examples too: _thresholds and debounces_ are another common one for us. How long should the operator be pressing a button before we confirm that, yes, they do in fact mean to command the arm up? How many RPM of error is acceptable before our shooter wheel is "ready"?

Subtle, unexpected disturbances in the mechanism mean it's not usually practical for and FRC team to completely and totally determine these up front. That means that at least _some_ time will be spent working on the actual robot, solving for the best values for these constants by some educated guess-and-check methodology. That educated process will definitely have some up-front work to make reasonable guesses, but (at least for us) always requires some iteration on the actual robot.

We facilitate speed in this iteration through picking a specific "model" of the world to inform our tool design. Namely:

1) We divide work done by "software engineers" from "tuning engineers". Though frequently the same actual person, we try to divide the work and job role as much as possible.
2) We create software constructs that allow the software engineer to bridge the robot to the tuning engineer. "Calibrations" form the engineer->robot bridge, while "Signals" form the robot->engineer bridge. 
3) The software engineer chooses where to apply the calibrations & signals in the software implementation step to provide "just the right" number of "knobs" for the tuning engineer to use. The tuning engineer uses those knobs to get the robot working as desired, and feeds the values back to the software engineer.

#### Calibrations

A `calibration` object is a class which represents a number that should be treated as some numeric constant by software implementation, but should be easily and rapidly adjustable during the tuning process, without rebuilding and reloading code.

Calibrations must support a software-facing `.get()` method where the value is returned to the code at runtime. They must support a set-like ability in some software-developer-facing interface, along with things to make it easier for humans to interact with. This includes a nice English description of the purpose of the calibration, physical units (if applicable), and (optional) min/max reasonable values.

The user-facing interface would need to allow a software developer to rapidly enter new values for these calibrations, and save/restore values over code restarts. This is to ensure a mid-tuning battery swap doesn't wipe out a few hours of work.

#### Signals

A `signal` object is a class which represents the value of some meaningful state on the robot. Usually it's tied to some physical measurement (ex: _left drivetrain wheel velocity in RPM_), but it can be more abstract (ex: _current step in a sequence of 10 things to do in an auto routine_). 

Signals need to be able to retain a history of values, since the change of the value over time is often of interest. Signals also need to have some notion of _timestamping_ - end users will care _when_ the signal had a particular value. 


Signals must present a clean software-facing interface, which we call `.addSample()`. The software developer writes the logic in such a way as to provide a meaningful value and timestamp at runtime. Usually this "new-value" providing happens once a loop. However, since robot code often involves multiple asynchronous loops running in parallel, not all samples are guaranteed to be added at the same rate.

Signals must be presented to the tuning engineer in a meaningful way. For us, this means a "timeseries" plot, or a cartesian plane with the X axis representing time, and the Y axis representing signal value.

### Tracking and Recording Data

The "next step" past single-step debugging

timestamped data samples - the Bridging step between software implementation and controls theory

# Motivation 

## "Uniqueness" of Robot Software Development

What's not unique - the need to track how values change over time, the need to separate data calibration data from implementation

What is unique: Limited hardware resources. Simplistic requirements over flexibility. Runtime stability and speed over universal applicability.

RoboRIO sits somewhere between traditional bare-bones embedded controller and full-blown server
--don't want robot runtime functionality tied directly to some SQL database working right
--Can still utilize advanced-ish filesystems, linux, networking stack

# Other tools that serve basically the same purpose

Industry tools

Shuffleboard + Network Tables

ROS

# Specific Requirements

## Calibration Specific

Deterministic data load and save times

Optional Range limiting

Value save over power cycle

## Data Acquisition specific

Timestamped data samples, served to consumers in a queue
--Queue architecture allows asynchronous operation without loss of information

Signals need names and units
--Units help ensure Y axis on charts can be chosen reasonably

Multiple simultaneous consumers
--File writer
--Data Plotter
--Driver Dashboard...kinda?
--Mass Data display
--Robot actual/desired pose map

Flexibility in network bandwidth usage
--If no data is needed, no data should be transmitted
--Two degrees of freedom - sample decimation & TX rate
---Decimation ensures only the data that the client will actually be displaying travels over the network
---TX rate ensures data only shows up on the network at the time when client actually needs it

Prioritize runtime velocity
--If no one is consuming the value, no recording should happen
--Recording a new sample needs to be _fast_
--Serving data to clients is lower priority - mostly just to maintain visual niceness

Execution time is more important than memory, but don't go overboard
--tracking stored samples
--trimming samples after no consumers want them anymore.


## Joint Requirements

Unifying Web-based architecture
--All configuration & functionality maintained with robot code
--No installation on client devices required
--Leverages flexibility built into ethernet networks
--Works on anything with a (reasonably) modern web browser
--- Tablets :D
--Consistent, unified interface

Sim works same as actual
--Particularly important for auto tuning

## Out of scope

Driver Dashboard - for now
--Lots of additional meta-data and non-data info required for formatting
--Similar robot-code-centric and web-centric design, but data and protocols probably make sense to be different



# Server Client architecture

## Server Design

### Embedded-code facing side

### Websockets API


## Client Designs

Required to run asynchronously
--Including data logger - very low priority 200ms-write-to-disk queue

CCP-inspired DAQ architecture
--Client make connection, requests information of available signals
--User/client interaction causes client to select a subset of signals it wants, transmission and decimation rate
--Client controls data flow with stop/start messages
--Server asynchronously sends samples when requested
---Key point - server is allowed to define the timing of how samples get sent. Not dependant on some client-driven "give me a sample now" signal

# Server Implementation

Java/Jetty

254 in 2016 as the start point 

Multiple threads - asynchronous

## The master sample queue

# Client Implementation

## Data Logger Thread

## Data Plotter

Highcharts = :) (link to blog post)

Local storage to remember the selected signals

## Mass Data Display

## Robot Pose Map

# Conclusion

Doing something like this from the ground up is not for everyone

If I were to roll this system out to all FRC teams, I'd redesign it. 
--Cleaner multithreading implementation 
--C++ implementation wrappered to other languages
--Unit tests including stress test
--More flexible data viewer


# On the practice field

Multi-computer flow
--Calibration Computer
--Driver PC
--SW dev PC

Helps get multiple folks involved

