---
layout: default
title:  "Robot Code Without a Robot"
date:   2020-10-12 09:30:40 -0500
categories: blog_posts
---

# Hello Again

Five months off? Whoops.

Well, I do have an excuse. There was other writing to do. We put together a fully-remote training plan for our software team to ensure we have something meaningful for our team.

[Here it is, if you're curious](TODO WEB LINK). It's on our team's github for two reasons:

1. It helps introduce students to Github.
2. It has a bunch of Casserole-specific things.

Maybe, at some point, we'll make it more generic and transfer it here. To be seen. In the mean time, it's there for reference, or training if you want to do software exactly like we do. 

As we started to put that training together, it became relevant to have the ability to develop robot code fully in simulation. Based on that and the lessons learned, I thought it might be worthwhile to put down some thoughts on the topic.

# Developing Robot Code When You Don't Have a Robot

Both out in industry and in FRC, there's this fairly generic term "Simulation". It means a lot of different things to a lot of different people.

Distilling down every definition I've seen so far, the common thread that runs through all them: 

_Simulation is the set of enabling technologies to let you run a set of source code in an alternate environment_.

I most often hear it used to refer to embedded code develompent where the real hardware that ordinarily runs and interacts with the code isn't present. Though conceptually similar to more "pure-software" environments (websites, phone apps, etc.), "emulation" or "development/production" nomenclature is more commonly used.

There's a couple different aspects to these various _enabelers_. One portion is getting the code running on different processing hardware than where it usually runs. Another is picking which pieces of code will be "in scope" for simulation, and which ones you'll have to "stub", making simulation-specific alternates. Finally, there may need to be some new code written to roughly emulate the behavior of hardware which no longer exists.

We'll delve into each of these as they relate to FRC. A few caveats: We'll be approaching this from the Java perspective, since it's the main language I know I can speak to. Also, while we'll try to talk through general concepts, we'll also be trying to give examples specific to FRC (Since, I assume, that's where you're looking to develop your solution).

# Supporing Alternate Hardware

The first barrier, especially in an embedded environment: Simulation generally takes place on a desktop PC or laptop, likely running some desktop operating system on an x86 processor. Embedded systems will often run with a different OS, on different processor architectures. This means that, since you want your source code to stay the same, you'll have to find a different toolchain that knows what to do with it on the target simulation processor & environment.

The good news is that for FRC, finding this toolchain is pretty easy. Most modern PC's support some sort of C++ compiler. Additionally, the Java virtual machine runs in almost all modern desktop systems. Python is similar. Labview also is set up to be nicely targeted at multiple environments.

This is a good example of why standards are important. You don't want a single-purpose programming language - you want source code which can be interepted by many different compiler toolchains, which in turn enables the toolchains to target different computer & hardware sets. However, _assuming_ you stick to the standard and use common languages in FRC, you'll very likely be set.

On top of all this, WPILib has been very good recently about ensuring that libraries (inculding those from vendors) can at least build for simulation on a desktop PC. You'll want to follow their instructions for how to ensure your gradle setup is functional for simulation.

TL;DR, for FRC: Unless you're doing something really funky, this part is already done for you.

One additional option in this category: You can find or create a _virtual machine_. This is an additional piece of software which can load and run your code, pretending to be the target system hardware. Though usually slower than the real hardware, it provides a decent alternative if using a different compiler & runtime environment isn't quite an option.

# Picking What's "In Scope"

This step is tightly related to the alternate hardware question above. The question really is: What things are you going to force to remain unchanged between your simulation and your "real" environment, and what things do you allow to be different? This decision process is often called "defining your boundary diagram".

The key is that everything you allow to be different is a potential inaccuracy, or thing you have to simulate. Then again, the closer you get to wanting to emulate hardware that doesn't exist, the harder the problem becomes.

The best practice in general is to draw a very clear boundary between "hardware specific" logic and "general control" logic. Add layers which are meaningful, clearly translating from something hardware specific (ex: Quadrature encoder tick counts in some specific hardware register) to something more generic, but still meaningful (ex: motor shaft speed in RPM). 

Once your software is divided like this, it becomes a bit easier to clearly draw your line between things which you want as part of your simulation, and which things get "stubbed" out. 

Again, WPILib has done a pretty good job of picking a good boundary layer. For motors and solenoids and most sensors, there are "HAL Sim" versions which you can instantiate in code, and provide an _inverse_ of the normal API. You can read the commands the robot code is passing to the speed controller, and respond with various sensor readings.

# Emulating Hardware

As a final step, when in simulation, usually we will add additional code to emulate the behavior of the pieces of hardware which don't exist in simulation. Drivetrains, arms, shooter wheelse, elevators, intakes, whatever you can think of - all might need some sort of extra software to correctly map motor controller commands back to the changes in sensor readings which are expected.

Historically in FRC, this is where solutions like Gazebo came in - they combined simulation of the physics of the system with visualization of how the system was moving around. 

There isn't a single recommended option right now, and that's with good reason: There's no single option to recommend for all teams. 

The mentality to keep: Unless you're looking to pass information back to the mechanical team to determine if you've met some design performance criteria, you don't need a _perfectly accurate_ physics model of your system. For software purposes, you just need it to be accurate enough to keep the software "Happy". Anything additional is... probably... wasted time. 

But what do you need to keep your software happy? Well, it depends. Mostly, it depends on what you're trying to do with your simulation. 

## Shooter Wheel Example

For example, take a simple shooter wheel. 

If you're trying to verify that when you command the shooter wheel to run, the motor turns on to some non-zero power level, well.... no extra software is needed. Just check that enabled shooter causes the motor command to be non-zero. 

If you want to check that your shooter wheel increases to some speed and then stops there, well, you'll need something a bit more precise. Some piece of software that causes the speed to increase for big motor commands, and decrease for small motor commands.

If you're trying to get full final tunning values for your PID controller, now you'll need a full physics simulation of the motor, battery, gearbox, rotating mass.... probably something to emulate what happens when you inject a ball... Quite a bit. You'll also need some way to validate that your choice for simulation correlates well to the real hardware. 

Again, the closer you want to get to reality, the harder it gets. The key is to only add _just as much as you need_ to achieve your simulation goals.

# What This Enables

Why even bother with any of this in the first place? Well, there are a number of advantages.

## Manual Testing & Offboard Development

The most obvious one, which most folks bring up right away - the ability to "test" your code and "write code without a robot". These are certanly true, but also deserve a bit of nuance of discussion.

Even without any simulation infrasturce, you can of course _write_ new code. The add of simulation allows you to also _build_ and (in some way) _run_ the robot code. This is indeed an extra step beyond just writing new lines, and will give a good bump in the quality of the code you put out right away. 

However, in and of itself, it's not a panacea for all issues - it doesn't prevent you from having bugs in your code. Nor does it mean that the software team suddently doesn't need any development time on the real robot.

These points might seem obvious, but you have to be careful how you sell "simulation" to other people on the team. I've seen many a time when the abilities of a simulation environment were poorly communicated, folks came in with very different expectations, and weeks later a great level of disapointment had happened.

Still, this isn't to back away from the positives. Simply letting your code run is a pretty decent way to find basic mistakes like null pointer dereferendecs, uninitalized objects, unexpected recursion.... add in just enough to let you enable in Teleop and move some joysticks, and you'll be able to actually test lots of your code before hitting the robot. That in and of itself makes it worthwile for my teams, as time on the robot is very valuable and not very abundant.

## Automated Testing

Even though basic simulation allows you to run your code, manually move some joysticks, and check the output does certain things.... it's often even better to be able to automate those checks.

We won't get into much about exactly _How_ all this gets done right now, as that's a while additional conversation. The key is that the ability to run your code in a desktop PC environment allows you to create test suites which launch your code, execute some portion of it while injecting inputs, and checking whether outputs match expectations.

Picking the _right_ set of things to test is also a whole additional conversation, but the basics is simply to be specific enough to be useful, but generic enough to not require rework every time you change code. Aim to test what you _desire the code to do_, not the _specific way you wrote it_.

When you put some form of automated testing in place, you get additional confidence above and beyond a "manual" or "by-hand" validation of the code. It helps you ensure that changing feature X didn't break feature Y. Again, it won't guarntee that you have zero bugs in your code - your quality is only as good as your tests. However, it will give you another big chunk of confidence that everything is running well.

## Visualization

When running without a robot, especially while remote, it is very helpful for new students to have a picture of what the robot is doing. Some folks do just fine with numbers and graphs, and these are important to understand. But, seeing something that looks like the "real thing" has some concrete value as well.

Having the ability to import a CAD model and watch it drive around a field is a pretty cool thing, and can help drive home the reality of the software that's being written.

Still, it's pretty hard: There also isn't any commonly-supported softaware suite I'm aware of. Still, hopefully, one of these days....

# How to Decide How to Simulate

There's been a number of options presented so far. At first glance, it is probably daunting. As a general guideline, here's some questions to help frame your state of mind as you pick what you're going to do.

## First - What are your Goals?

Are you looking to have a way for developers to be able to write code for _any_ part of the robot, whenever they want? Are there only specific things that you need them to be able to work on, and can "punt" on the others till you have the real hardware?

Do you need to be able to test the code? Will the tests run automatically, or will you manually provide inputs and evaluate outputs? Will the tests be done on just small portions of the code, or do you want to (or need to) test the full codebase at once?

Will you be using your test results to pass information back to the mechanical or othe rdesign teams? Or are they just to validate the software has some sort of functionality?

Where do you think you are most likely to find issues in the software? Will your simulation encompass those "risk spots" well?

Can the simulation environment be front-and-center in the software design process? Or does it need to be in the background and transparent as possible, so as not to distract from the learning process?

## Second - What's Easy?

What tools and infrasturcture has been provided already? How much time are you willing to invest in something bespoke?

Is there already some build infrastructure set up for an alternate environment? Is there a virtual machine setup available? How accessable is the available content - can you edit and modify easily to your own needs, or is it very rigid?

## Third - Path of Least Resistance to the Goals

Taking your answers to above, and knowing a bit about what options are available, you'll want to pick the path of least resistance to an answer that fits your goals, with minimal extra work.
