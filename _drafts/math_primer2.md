---
layout: post
title:  "Math Primer, Part 2"
date:   2019-05-26 9:30:00 -0500
categories: math calculus trigonometry fundamentals
---

This post is the continuation of our introduction to some of the math that will be useful for the purpose of this blog. 

## Functions as Representations of Physical Behavior

When working on robots, we largely deal with a specific class of function - one which takes *time*, *system conditions*, and *starting conditions* as input, and transforms them into some physical quantity about the robot we care about. It could be pneumatic pressure in a tank, robot speed, arm location, anything really. All of the questions you could ask about "how fast" or "how much" or "what position" could be answered by functions of this class.

For a given situation, you can often create a *model* of the behavior you expect to see by writing down a specific equation. Using basic laws like $$F = ma$$, you can create a formula that predicts the behavior of a part of your robot. This model will never be perfect - there will always be "real-world" influences on the robot that cause slightly different behavior. However, as long as the model is sufficiently correct, it can be used to learn about the behavior of the robot prior to actually building it. This ability to analyze and learn without spending money is, for FRC purposes, the key benefit to creating these models.

Whether you're looking to analyze a particular model you created, or look at real-world measurements of behavior, you usually used some form of 2d graph to visualize what is going on. On a cartesian plane, the X axis becomes "Time", and the Y axis becomes "physical quantity you care about".

For example, here is a model of pressure in a pneumatic tank, visualized how it changes over time:

<div id="plot2"></div>
<script>
functionPlot({
  target: '#plot2',
  title: '',
  grid: true,
  yAxis: {
      label: "Pressure (psi)",
      domain: [0, 150]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-3, 20]
  },
  data: [{
    fn: 'max(0,120-120*exp(-x*0.3))',
    title: 'Tank Pressure'
  }]
})
</script>

Aside from time, additional inputs to this model include the volume of the tanks, the on/off state of the compressor, the physical capabilities and limitations of the compressor, and the fact the outflow rate is assumed to be zero - ie no cylinder movement, and you're a *really* good plumber. Also assumed is that the initial pressure is zero.

Let's say you were given this plot. You can answer a lot of questions about your robot right away, just by looking at it. For example,
 
 1. The general behavior of pressure it to start at whatever initial value you give, ramp up quickly at first, then level out at the maximum pressure value (120psi for FRC robots)
 2. The compressor must not be as good at pumping air when pressure gets higher (since the pressure doesn't keep going up as fast when pressure gets higher)
 3. From zero pressure, it takes around 14 seconds to pressurize to near-120psi. This is useful info to have in the pit!


## Calculus

The concepts covered in Calculus were simultaneously formalized by Sir Isaac Newton and Gottfried Wilhelm Leibniz in the late 1600s. Calculus is often taken in early college, or as a high-level math elective in high school. Despite having a reputation for difficulty, the fundamental concepts we'll need from it are pretty trivial, and geometrically focused: *slope of a curve* and *area under a curve*. These lead very naturally to working with physical phenomenon are related to *rate of change* and *accumulation of previous values*.

# Slope of a curve

What is more commonly known as *Differential Calculus* is really the study of the behavior of tangent lines to curves. In our previous example of pressure in a tank, we referred to the fact that pressure builds quickly at first, and tapers out as the pressure approaches the maximum value. 

That rate of pressure change is related to a physical quantity - it's the number of air molecules per second the compressor is placing into the air tanks.

Mathematically, we know any rate is some quantity that changes over time. Let us define a few things:

Let the function $$P(t)$$ denote the pressure at a time given by $$t$$. 

We will pick some particular time, and call it $$t_0$$. We will also pick some very small duration of time called $$\Delta t$$.

Differential Calculus is how you go about finding the "instantaneous" rate of change at some particular time $$t_0$$. Doing so is fairly simple. Simply look at the change of pressure over a small duration starting at time $$t_0$$, and ending at time $$t_0 + \Delta t$$.

Let us introduce the notation $$\dot{P}(t)$$ to denote the *rate of change* of our function $$P$$ at the given time $$t$$. Let us further introduce the vocabulary word *derivative* for the "dotted" version of any function. In this case, $$\dot{P}(t)$$ is the derivative of $$P(t)$$.

From studies of algebra, we should know that a line's slope is defined as "rise over run" or "Change in Y over Change in X". This concept of slope is analogous to rate of change. We use this fact to define the derivative:

$$\dot{P}(t) = \frac{P(t+\Delta t) - P(t)}{(t+\Delta t) - (t)}$$

Simplifying a bit,

$$\dot{P}(t) = \frac{P(t+\Delta t) - P(t)}{\Delta t}$$


Graphically, we can pick a particular time $$t_0$$ on our plot of pressure over time, and start to think about what value our defined $$\dot{P}(t)$$ would have there. We'll start by picking $$t_0 = 2.00$$.

<div id="plot3"></div>
<script>
functionPlot({
  target: '#plot3',
  title: '',
  grid: false,
  yAxis: {
      label: "Pressure (psi)",
      domain: [0, 150]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-3, 20]
  },
  data: [
    {
      fn: 'max(0,120-120*exp(-x*0.3))',
      title: 'Tank Pressure'
    }
  ],
  annotations: [{
    x: 2,
    text: "t_0 = 2.00s"
  }]
})
</script>

For now, let's choose $$\Delta t$$ to be exactly $$0.02$$ sec. Later posts on control theory will explain why this is a good choice.

Also, I'll give you two important pieces of information:

$$P(2.00) = 54.1426$$

$$P(2.02) =  54.5365$$

On a real robot, these are numbers you'd get from a pressure sensor. If you were working with an equation that described the model of your pneumatics system, you could just plug in the times $$2.00$$ and $$2.02$$ to get the numbers. That's actually what I did.

From here, it's just plug and chug:

$$\dot{P}(t_0) = \frac{P(t_0+\Delta t) - P(t_0)}{\Delta t} = \frac{54.5365-54.1426}{0.02} = 19.7 $$

So, we have calculated that around the 2.0 second mark, the compressor is increasing the pressure in the system at a rate of 19.7 psi/second.

We have just calculated the derivative at a specific time $$t_0$$. But, how should we calculate $$\dot{P}(t)$$, over all time? 

If you have an exact formula, there are various symbolic manipulation techniques that you can apply to get an exact formula for a functions derivative, given the function as input. This is rarely the technique used inside software.

Rather, if you have a series of measurements, you simply let a computer calculate $$\dot{P}(t)$$ one value at a time, for every measurement you have taken. 

In either case, here's the picture of $$\dot{P}(t)$$ (red) and $$P(t)$$ (blue) look like:


<div id="plot4"></div>
<script>
functionPlot({
  target: '#plot4',
  title: '',
  grid: false,
  yAxis: {
      label: "Value",
      domain: [0, 150]
  },
  xAxis: {
      label: "Time (s)",
      domain: [0, 20]
  },
  data: [
    {
      fn: '120-120*exp(-x*0.3)',
      title: 'Tank Pressure (psi)',
      derivative: {
        fn: '36*exp(-x*0.3)',
        updateOnMouseMove: true
      }
    },
    {
      fn: '36*exp(-x*0.3)',
      title: 'Derivative of Tank Pressure (psi/sec)' 
    }
  ],
  annotations: [{
    x: 2,
    text: "t_0 = 2.00s"
  }]
})
</script>

Note in the mouseover that we are also drawing a line tangent to the curve for $$P(t)$$. "Tangent" means intersecting at exactly one point, not two or zero or any other number of points. This is the geometric interpretation of the derivative, which should be apparent from the definitions we've gone through so far:

*A line drawn through the point $$(t_0, P(t_0))$$ with slope $$\dot{P}(t_0)$$ will be **tangent** to the curve P(t).*

Using the [point-slope line equation](https://www.mathsisfun.com/algebra/line-equation-point-slope.html), along with the definitions we have presented thus far, this statement can be proven to be true, but only when you make $$\Delta t$$ very very very small. The act of taking $$\Delta t$$ *almost* to zero but not quite there is the calculus concept of "*taking the limit* as $$\Delta t$$ goes to zero." Though the concept of a *limit* is an essential concept for understanding calculus deeply, we will skip it for now, as it can often be ignored when writing software.


# Area Under a Curve

## Beyond

Multi-dimensional calculus

Linear algebra

## Further Learning

Obviously, we are just barely scratching the surface of these topics. For the early learner looking to go further, I have a few recommendations.

If you tend to learn well from lectures, animations, an emphasis on making things intuitive, or anthropomorphic greek letters, I *highly* recommend the [youtube channel of Grant Sanderson, "3blue1brown"](https://www.youtube.com/channel/UCYO_jab_esuFRV4b17AJtAw). In Particular, his [series on Calculus](https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr) is a good start, bringing excellent visualization to some of the less-intuitive calculation aspects of the symbolic manipulation side of the topic.

If you learn better from reading books and visualizing at your own pace, or like 100-year-old textbooks, [Calculus Made Easy](http://www.gutenberg.org/files/33283/33283-pdf.pdf) is a surprisingly hilarious option.

![Calculus made easy & subtitle](/assets/calc_made_easy.png)

If a title like that doesn't make you at least want to take a peek, I'm not sure what will.



