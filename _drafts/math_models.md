---
layout: post
title:  "Control Theory - Mathematical Models of the World "
date:   2019-09-06 9:30:00 -0500
categories: blog_posts
---


## Introduction

_All models are wrong, but some are useful. - [George Box](https://en.wikipedia.org/wiki/George_E._P._Box)_

This is the start of Part 2 in our series on Control Theory. In this installation, we'll look at how we describe the interior of the blocks in our block diagram, using math equations. By doing this, we will have a representation of functionality we can analyze, manipulate, and write software with.


## What is a Model?

We briefly alluded to the concept of a _model_ in [Math Primer, part 2](/blog_posts/2019/06/01/math_primer2.html). A _mathematical model_ is one particular form of an [Abstraction](/blog_posts/2019/05/26/abstraction.html), where we create _math equations_ to describe the behavior of a particular thing in the "real world". 

Mathematical models can be built for anything which has properties you are willing to describe using numbers. This includes more conceptual things like a country's economy or a stock market, but also physical devices (like motors or gearboxes or robots). We'll be focusing on the latter.

If you've ever spent any time around a robot, you definitely have a _qualitative_ model built up in your head of how lots of parts on the robot work. For example, you probably know that when you apply 12V to a motor, it starts to spin faster. Or if you reverse the wires, it will go the opposite direction. You might also know that if you put two different size gears together and turn one of them, the smaller one will be spinning faster and in the opposite direction of the big one.

These qualitative models are super useful - these are what we engineers use on a day to day basis to help understand the systems they work on, without the need for calculation. If you've ever seen an "old-timer" with a grey beard seemingly just magically come up with an answer to a robot design question, blurting out "That will never work!" or similar, there's a good chance that person was using a mental, qualitative model. Most people refer to these simply as "intuition" - with time working on devices, you start to get a _feel_ for how they react and interact.

However, these models have limits. Often, a design may require you to describe _how fast_ a shaft will turn. "Kinda fast" is a good starting point, but isn't sufficient. You've hit the limit of the mental model, and have to go to the next level.

Here's where the mathematical models come in. By doing some analysis, determining some equations, plugging in your operating conditions, and calculating an answer, you get the exact _quantity_ you need for your design.

Here's the key to keep in mind (as our friend George Box reminds us) - _Mathematical Models_ are _more_ accurate than qualatative notions of how things work, but still do not _fully describe_ the physical things we care about. And that's ok, we don't need a full description. Like any good abstraction, a mathematical model will _hide_ the details we don't care about, allowing us to focus on what we _do_. 

For a concrete example, you will never see me construct a model for a motor that accounts for the magnetic fields of motors nearby. The "background" field strength is never large enough to make a difference in calculations used for FRC. _Qualitatively_, I can tell you that if the background magnetic field was ever was big enough to matter, we have much bigger issues on our hands than the couple percent error in our motor torque.

More detail is not always what you want. _The right_ amount of detail is always what you want.

In this post, we're going to briefly discuss how some models are built up, and quickly dive into a number of examples that will be useful for FRC.


## Techniques for Building up a Model

### First Principles

When we set out to create a model of a physical system, there are a couple different approaches.

The most "academic" approach involves analyzing the system from base physics principles. For FRC, [$$F=ma$$](https://en.wikipedia.org/wiki/Newton%27s_laws_of_motion), [Maxwell's equations](https://en.wikipedia.org/wiki/Maxwell%27s_equations), the [Ideal Gas Law](https://en.wikipedia.org/wiki/Ideal_gas_law) and friends come together with techniques like [Free Body Diagrams](https://en.wikipedia.org/wiki/Free_body_diagram), [Differential Equations](https://en.wikipedia.org/wiki/Differential_equation), and [Linear Algebra](https://en.wikipedia.org/wiki/Linear_algebra) to create a cohesive set of equations, accurately describing the quantities of interest. Or, at least, what they _in theory_ should be. 

Whether it's ever explicitly shown, every mathematical model built up from base principles can be boiled back down into a set of axiomatic equations, based in how fundamental particles of the universe are assumed to interact. I'll admit, I've never actually taken the time to take any of my models _all_ the way back to these axioms. But I learned them once in college, and know (based on the techniques involved) I always _could_, if I ever needed to.

Soapbox: This is why, even if you think its stupid, all the foundational math and physics courses you take early on in your engineering education. They lay the important parts of the groundwork that allow you to _prove_ that your work is correct later on. Study them hard, and trust they will be useful. Soapbox over.

### Experimental Data

When base principles are hard or time consuming, and you have the ability to run experiments on the device in question, there is another approach available. You can gather data from your device under carefully controlled conditions to inform your model of how the device works through pure observation. You have to run these experiments many times to ensure your results are consistent, and not being influenced by a factor beyond your control. 

For complex devices, it is often faster to go the experimental route. However, these experimental models lack the detail about the "internals" of the system. There are few (if any) equations to re-arrange and re-solve for a particular quantity of interest - you're kinda stuck with whatever you measured in the lab. Additionally, lacking details about the internals to the system, it's harder to know how to redesign a particular device if it's not working as you need. Though you've captured the "externally visible" behavior, you're lacking insight about the inside.

Then again, you don't always need that insight. It always depends.

### Google & Datasheets

This isn't exactly a "technique", as much as something someone should keep in mind. Engineers are lazy. Engineers don't like doing things twice. If you as an engineer build a new device, you should probably take the time to take some measurements on it, maybe even build up a detailed model of how it should work. 

Two bits of good news: Most engineers who are worth their salt will do this. And most of them make it available, in some form. Google is a great way to find out background info on whether someone has already done what you need to do - as long as you know what to search for. [For example, look at the plethora of information available on describing motors!](https://www.google.com/search?q=mathematical+model+of+brushed+DC+motor)

The _datasheet_ of a device is another standardized (ish) way of describing their quantitative properties. Sometimes a datasheet provides the exact mathematical model for the device. Other times, it provides the key pieces of information required for the model, and lets you build up the model as you need. Again, Google is my number-one tool for finding datasheets for parts we use.

### The need for Validation

No matter how you build up your model, you will always want to spend some time _validating_ that it is producing meaningful results. Sometimes this means running experiments on the actual device. Other times, it means running your new model in some form of _simulation_ - getting it into specific operating criteria, and checking results match some expected value.

## Practical Example - Gearbox

Let's start out with a model we can, at least in part, derive ourselves.

A set of gears is probably one of the simplest models to create. It aligns well with your intuition, has a beautifully simple formula, and can be easily verified.

When designing gearboxes, you usually want to know about speed. Given an input speed (which you can control), you want to know what the output speed will be. Since many of you probably already know the answer, let's just get that over with:

$$\omega_{out}(t) = -\frac{N_{in}}{N_{out}} \omega_{in}(t)$$

Where:

* $$\omega_{in}(t)$$ is the speed of the input shaft at time $$t$$
* $$N_{out}$$ is the number of teeth on the output gear
* $$N_{in}$$ is the number of teeth on the input gear
* $$\omega_{out}(t)$$ is the speed of the input shaft at time $$t$$

That's it - it's just the ratio of the teeth!

### Spinning Levers

The key thing to keep in mind: [_gears_ are just _spinning levers_](https://www.youtube.com/watch?v=JOLtS4VUcvQ). When you push on one, the other moves. The point at which the teeth mesh together is the fulcrum. Moving that meshpoint closer to the center of either wheel changes the ratio of motion between the two sides.

This relationship could be derived intuitively. If you assume the teeth are always in mesh, and never slip relative to each other, it stands to reason that if there are 3x the number of teeth on the output, the input would have to rotate _3 times_ to get a single rotation on the output. 

One tooth of motion on the input means one tooth of motion on the output. If you don't have this 1 to 1 relationship, it means gears are slipping. Which means that metal is shredding off in your gearboxes. Which is bad news bears. You should fix that before doing any more math.

Another way to describe this relationship is to assume that your teeth are "Ideal" - incredibly small, and super strong. In this case, just model your gears as two differently-sized pancakes.

![gears_basic](/assets/gears_basic.png)

The assumption of ideal teeth allows us to say that the _tangential velocity_ (the linear speed of the outside edge of the pancake) must be the same at their mesh point. From geometry, I'll give the equation that relates the _rotational velocity_ $$\omega(t)$$ to the _tangential velocity_ $$v(t)$$. [^1]

$$v(t) = 2 \pi R \omega(t)$$ 

We can write two equations, one for each gear:

$$v_{in}(t) = 2 \pi R_{in} \omega_{in}(t)$$

$$v_{out}(t) = 2 \pi R_{out} \omega_{out}(t)$$

Then, based on our ideal mesh assumption, we can set the two equal to each other. Note that since the tangential velocity is measured to the left of one centerpoint, but the right of the other, we need to introduce a negative sign as well. [^2]

$$v_{in}(t) = -v_{out}(t)$$

$$2 \pi R_{in} \omega_{in}(t) = -2 \pi R_{out} \omega_{out}(t)$$

Canceling terms, we find ourselves at:

$$R_{in} \omega_{in}(t) = -R_{out} \omega_{out}(t)$$

And solving for the output speed, finally, 

$$\omega_{out}(t) = -\frac{R_{in}}{R_{out}} \omega_{in}(t)$$

Sweet! Almost the same as the equation we started with.

### Radius to Teeth

But wait! Our initial equation used number of teeth, not radius. Not to worry! 

Each tooth and gap cycle contributes a certain, constant amount of radius to the circle. Additionally, the per-tooth contributed has to be the same on both gears. This is due to [some of the constraints required by good tooth design](https://www.geartechnology.com/issues/1084x/back-to-basics.pdf). Additionally, we aren't actually free to choose _any_ radius we want. If we resulted in a fractional tooth, well, that wouldn't work (Think about it for a second...).

Therefor, the equation gets quoted not in terms of actual radius, but in terms of tooth count.

$$\omega_{out}(t) = -\frac{N_{in}}{N_{out}} \omega_{in}(t)$$

Boom Shackalacka.

## Practical Example - Wheel with Mass

Here, we'll start to introduce the glory of using Google to find answers. The key is knowing what to look for.

We will attempt to create a model of a rotating wheel, such as the ones used to launch gamepieces through holes or into hoppers.

The key background info to know: Newton's second law $$F=ma$$ has a _rotational_ form.

### Background - Newton's Second Law

So, hopefully, you've at least heard the basics of Newton's laws in school. They form the basis of "classical mechanics" - the study of how bodies of mass move around (as long as they aren't too small, or move too fast). The second law is the one most commonly quoted in its equation form, but can be understood qualitatively. Whenever a _force_ $$F$$ is applied to some object with mass $$m$$, it will begin to _change velocity_ at a rate $$a$$. Forces are how we _change_ the velocity of an object.

It should be noted that $$F$$ and $$a$$ are usually _vector_ quantities. That is to say they have both magnitude _and_ a direction. You can push with 5 lbs of force upward or downward, to the left or to the right. The magnitude is always 5 lbs, but the direction changes. To denote this vector quantity, you will often see the equation written as

$$\vec{F} = m\vec{a}$$

The cute little arrows over $$\vec{F}$$ and $$\vec{a}$$ indicate they have a direction.

The key takeaway is that the acceleration happens _in the same direction_ as the force. If an object is still, and you push on it in a certain direction, it begins to accelerate (ie, go faster) _in that direction_. If an object is already moving, and you push against its motion, it _slows down_, since the force opposes the direction of motion - effectively a _negative_ acceleration.

### Newton's Second in Rotational

To me, the rotational form of $$F=ma$$ almost feels like cheating. The good news is that it makes it pretty simple, but perhaps not profound. The reason for this is that all three quantities in $$F=ma$$ have [a rotational equivalent we can use](http://hyperphysics.phy-astr.gsu.edu/hbase/mi.html).

If you hadn't noticed yet, $$F$$ and $$a$$ are both quantities that involve _linear_ measurement. This is the nature of vectors - they define _lines_ from one point to another. Acceleration is described _along a certain line_, as is force. Mass tends to just kinda "sit there" - it's a property of the object, with a value, but no real direction or information about location required. As far as Newton's Second law is concerned, all the mass is _modeled_ to be at a single point, where force is applied.[^3] 

Newton's Second Law for rotation is exactly the same as the linear version, just swapping out the linear quantities for their rotational equivalent. 

Acceleration is easy to re-define - it's just called _rotational acceleration_. Rather than measuring the rate of change of linear velocity (in m/s, per sec, for example), it measures the rate of change of rotational velocity (in deg/sec, per sec, for example). Think of it as the rate at which a rotating wheel speeds up or slows down. If you want your wheel to rotate faster, that means you want its _rotational acceleration_ to be positive. 

Rotational Acceleration is denoted with the Greek letter alpha - $$\alpha$$

Force also has a rotational analog. _Torque_ is simply rotational force. Torque is defined as a force applied at a distance to some center of rotation, tending to cause rotational motion. Whenever you turn a wrench or a screwdriver, you are applying a _torque_ to the bolt or screw, which causes it to turn. Whenever your car's engine revs up while you're in gear, a _torque_ is applied to the back wheels (often erroneously referred to as "torque to the ground"). This in turn causes the wheels to turn, and (hopefully) the car to move.

Torque is denoted with the Greek letter tau - $$\tau$$.

Mass, turns out, is where things get a bit interesting. No longer can we simply account for the total _amount_ of stuff in the moving object, we have to account for _where it is at_ relative to the center of rotation. This combined notion of quantity and position can still be calculated down to a single number, called the _moment of inertia_.

Just as mass can be thought of as "tendency of an object to resist changes in velocity", the moment of inertia is an object's tendency to resist changes in rotational velocity.


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



[^1]: For the incorrigibly questioning reader, this equation can be derived from the definition of a [radian](https://en.wikipedia.org/wiki/Radian), and the fact that, under the right conditions, you can take a [derivative of each side of an equation without changing its truthfulness](https://math.stackexchange.com/questions/407822/differentiating-both-sides-of-an-equation).

[^2]: If we were to define a proper reference frame, assign coordinates to the centers of each gear, calculate the coordinate of the meshpoint, and actually make some free body diagrams, the negative sign would result as well. Trust me. But even without the formality, it should just make sense.

[^3]: There are ways to undo this assumption as needed, but it's beyond our present discussion scope to look into them.