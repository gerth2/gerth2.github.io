---
layout: post
title:  "Math Primer, Part 2"
date:   2019-06-01 9:31:00 -0500
categories: math calculus trigonometry fundamentals
---

This post is the continuation of our introduction to some of the math that will be useful for the purpose of this blog. 

## Functions as Representations of Physical Behavior

When working on robots, we largely deal with a specific class of function - one which takes *time*, *system conditions*, and *starting conditions* as input, and transforms them into some physical quantity about the robot we care about. It could be pneumatic pressure in a tank, robot speed, arm location, anything really. All of the questions you could ask about "how fast" or "how much" or "what position" could be answered by functions of this class.

### Model Creation & Analysis

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

### Deductions

Let's say you were given this plot. You can answer a lot of questions about your robot right away, just by looking at it. For example,
 
 1. The general behavior of pressure it to start at whatever initial value you give, ramp up quickly at first, then level out at the maximum pressure value (120psi for FRC robots)
 2. The compressor must not be as good at pumping air when pressure gets higher (since the pressure doesn't keep going up as fast when pressure gets higher)
 3. From zero pressure, it takes around 14 seconds to pressurize to ~120psi. This is useful info to have in the pit!


## Calculus

The concepts covered in Calculus were simultaneously formalized by Sir Isaac Newton and Gottfried Wilhelm Leibniz in the late 1600s. Calculus is often taken in early college, or as a high-level math elective in high school. Despite having a reputation for difficulty, the fundamental concepts we'll need from it are pretty trivial, and geometrically focused: *slope of a curve* and *area under a curve*. These lead very naturally to working with physical phenomenon are related to *rate of change* and *accumulation of previous values*.

### Slope of a Curve & Rate of Change

What is more commonly known as *Differential Calculus* is really the study of the behavior of tangent lines to curves. In our previous example of pressure in a tank, we referred to the fact that pressure builds quickly at first, and tapers out as the pressure approaches the maximum value. 

That rate of pressure change is related to a physical quantity - it's the number of air molecules per second the compressor is placing into the air tanks.

Mathematically, we know any rate is some quantity that changes over time. Let us define a few things:

Let the function $$P(t)$$ denote the pressure at a time given by $$t$$. 

We will pick some particular time, and call it $$t_0$$. We will also pick some very small duration of time called $$\Delta t$$.

Differential Calculus is how you go about finding the "instantaneous" rate of change at some particular time $$t_0$$. Doing so is fairly simple. Simply look at the change of pressure over a small duration starting at time $$t_0$$, and ending at time $$t_0 + \Delta t$$.

#### Calculating Rate of Change

Let us introduce the notation $$\dot{P}(t)$$ to denote the *rate of change* of our function $$P$$ at the given time $$t$$. Let us further introduce the vocabulary word *derivative* for the "dotted" version of any function. In this case, $$\dot{P}(t)$$ is the derivative of $$P(t)$$.

From studies of algebra, we should know that a line's slope is defined as "rise over run" or "Change in Y over Change in X". This concept of slope is analogous to rate of change. We use this fact to define the derivative:

$$\dot{P}(t) = \frac{P(t+\Delta t) - P(t)}{(t+\Delta t) - (t)}$$

Simplifying a bit,

$$\dot{P}(t) = \frac{P(t+\Delta t) - P(t)}{\Delta t}$$

#### Calculation at a Specific Point

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

#### The General Solution

We have just calculated the derivative at a specific time $$t_0$$. But, how should we calculate $$\dot{P}(t)$$, over all time? 

If you have an exact formula, there are various symbolic manipulation techniques that you can apply to get an exact formula for a functions derivative, given the function as input. This is rarely the technique used inside software.

Rather, if you have a series of measurements, you simply let a computer calculate $$\dot{P}(t)$$ one value at a time, for every measurement you have taken. 

#### Visual Interpretation

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

#### Tangent Lines

Note in the mouseover that we are also drawing a line tangent to the curve for $$P(t)$$. "Tangent" means intersecting at exactly one point, not two or zero or any other number of points. This is the geometric interpretation of the derivative, which should be apparent from the definitions we've gone through so far:

*A line drawn through the point $$(t_0, P(t_0))$$ with slope $$\dot{P}(t_0)$$ will be **tangent** to the curve P(t).*

Using the [point-slope line equation](https://www.mathsisfun.com/algebra/line-equation-point-slope.html), along with the definitions we have presented thus far, this statement can be proven to be true, but only when you make $$\Delta t$$ very very very small. The act of taking $$\Delta t$$ *almost* to zero but not quite there is the calculus concept of "*taking the limit* as $$\Delta t$$ goes to zero." Though the concept of a *limit* is an essential concept for understanding calculus deeply, we will skip it for now, as it can often be ignored when writing software.


### Area Under a Curve

*Integral Calculus* is the other half of calculus that most high school students encounter. It primarily concerns itself with determining the area of the space bounded by the X axis, Y axis, the curve of some function, and some end-time. 

It has many applications in Robotics, but is a bit more limited. Two aspects are worth considering:

1. Integral Calculus is a method for "undoing" the action of taking a derivative.
2. Integral Calculus is a method for calculating how much of something has "accumulated" over time.

These are really the same thing, as we'll see going forward.

#### Another Motivating Example

To provide some basis for integral calculus, let us assume we have a robot with a standard tank-drive drivetrain. We've written some code to allow us to measure its forward or reverse motion. We'll assume we're only driving forward and backward for now. 

If you haven't heard yet, when it comes to motion, calculus is frequently involved. There are three quantities that often come into play. We'll discuss them further later on, but as a brief introduction, we will define the following:

1. $$ x(t) $$ is the robot's *position* in feet at time $$t$$.
2. $$ v(t) = \dot{x}(t) $$ is the robot's *velocity* in feet per second at time $$t$$.
    1. *velocity* is the rate of change of *position*.
3. $$ a(t) = \dot{v}(t) = \ddot{x}(t) $$ is the robots *acceleration* in feet per second, per second. Again, at time $$t$$.
    1. *acceleration* is the rate of change of *velocity*

As an example, say the driver operates the robot such that the measured velocity follows this curve:


<div id="plot5"></div>
<script>
functionPlot({
  target: '#plot5',
  title: '',
  grid: true,
  yAxis: {
      label: "Velocity (ft/sec)",
      domain: [0, 10]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 25]
  },
  data: [
    {
      fn: '8*exp(-1*pow((x-10),2)/15)',
      title: 'Robot Velocity v(t)',
    }
  ]
})
</script>

Think about what this physically means:

1. The robot starts sitting still at $$t = 0.0$$
2. The robot begins moving forward within the first second, slowly at first
3. The robot goes faster and faster
4. Around $$t = 10.0$$ the robot is moving the fastest it did during the run. 
5. The fastest the driver got the robot to was ~8ft/sec
6. After the $$t = 10.0$$ mark, the robot slows down
7. By $$t = 20.0$$, the robot has again stopped.

Since the robot was only moving forward, where do you expect it to be at $$t = 24.0$$ ?

#### Calculating Area with Stripes

For very simple curves this calculation of area under a curve is very simple. However, winding, jagged curves require a bit more thought.

Calculating the area of a single rectangle is easy:

$$ A = wh $$

Where

1. $$w$$ is the height of the rectangle.
2. $$h$$ is the width of the rectangle.
3. $$A$$ is the area.

If you were to make a shape out of $$N$$ many rectangles which do not overlap, the total area of that shape is just the sum of the areas:

$$ A = \sum_{i=0}^{N} w_i h_i $$

We can use this concept to calculate the area under more complex curves.

Let's say we want to calculate the distance the robot has traveled, and all we have is the set of velocity measurements referenced in the above examples. Recall from the introduction:

1. Velocity is the *derivative* of position
2. Integrals undo derivative
3. An integral is calculated by finding area under a curve

So let's get the area under the given curve! That will tell us the distance the robot traveled from its starting point.

We'll start by picking a very specific set of rectangles to approximate the region

<div id="plot6"></div>
<script>
functionPlot({
  target: '#plot6',
  title: '',
  grid: true,
  disableZoom:true,
  yAxis: {
      label: "Velocity (ft/sec)",
      domain: [0, 10]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 25]
  },
  data: [
    {
      fn: '8*exp(-1*pow((x-10),2)/15)',
      title: 'Robot Velocity v(t)',
      range: [0,20],
      nSamples:11,
      closed: true
    },
    {
      fn: '8*exp(-1*pow((x-10),2)/15)',
      title: 'Robot Velocity v(t)',
    }
  ]
})
</script>

This particular choice of subdividing the area under the curve is a bit arbitrary, but was chosen to work well for example. We are creating 10 rectangles, each 2 seconds long. The height of each rectangle is defined to be $$v({t_{end})}$$ where $$t_{end}$$ is defined to be the end-time for each rectangle.

There are subtle other ways we could choose to subdivide the area, but we won't get into that now.

If we were to add up all these rectangular areas, we'd get a number that's a decent guess at the error under the curve. However, it wouldn't be perfect. As you can clearly see, there is shaded blue outside the red curve area. How do we make it better?

Similar to derivatives, we will "take the limit". In this case, we'll try to drive the width of the rectangles to be smaller and smaller.

Trying 1 second width:

<div id="plot7"></div>
<script>
functionPlot({
  target: '#plot7',
  title: '',
  grid: true,
  disableZoom:true,
  yAxis: {
      label: "Velocity (ft/sec)",
      domain: [0, 10]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 25]
  },
  data: [
    {
      fn: '8*exp(-1*pow((x-10),2)/15)',
      title: 'Robot Velocity v(t)',
      range: [0,20],
      nSamples:21,
      closed: true
    },
    {
      fn: '8*exp(-1*pow((x-10),2)/15)',
      title: 'Robot Velocity v(t)',
    }
  ]
})
</script>

And 0.25 second width:

<div id="plot8"></div>
<script>
functionPlot({
  target: '#plot8',
  title: '',
  grid: true,
  disableZoom:true,
  yAxis: {
      label: "Velocity (ft/sec)",
      domain: [0, 10]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 25]
  },
  data: [
    {
      fn: '8*exp(-1*pow((x-10),2)/15)',
      title: 'Robot Velocity v(t)',
      range: [0,20],
      nSamples:81,
      closed: true
    },
    {
      fn: '8*exp(-1*pow((x-10),2)/15)',
      title: 'Robot Velocity v(t)',
    }
  ]
})
</script>

Suddenly, this is looking much better. Let's try that magic 0.02 second interval:

<div id="plot9"></div>
<script>
functionPlot({
  target: '#plot9',
  title: '',
  grid: true,
  disableZoom:true,
  yAxis: {
      label: "Velocity (ft/sec)",
      domain: [0, 10]
  },
  xAxis: {
      label: "Time (s)",
      domain: [-1, 25]
  },
  data: [
    {
      fn: '8*exp(-1*pow((x-10),2)/15)',
      title: 'Robot Velocity v(t)',
      range: [0,20],
      nSamples:4001,
      closed: true
    },
    {
      fn: '8*exp(-1*pow((x-10),2)/15)',
      title: 'Robot Velocity v(t)',
    }
  ]
})
</script>

Pretty darn good. We've got something that is clearly a workable approximation, with a trivial-to-calculate sum of rectangle areas as the methodology.

Plugging in our named functions, we arrive at the following relationship:

$$x(t_0) = \sum_{i=1}^{\frac{t_0}{\Delta t}}\dot{x}(i\Delta t) *\Delta t$$

Note the summation just goes over all rectangles: $$\frac{t_0}{\Delta t}$$ is just a precise way to count the number of rectangles with the quantities we have. Note also that the quantity $$i\Delta t$$ just means "time at the end of each rectangle".

As we take the limit as $$\Delta t$$ goes to zero, standard calculus textbooks will introduce the more-familiar integral notation:

$$x(t_0) = \int_{0}^{t_0}\dot{x}(t)dt$$

This is about as far as we'll need to take the concept of an integral for now. Just remember it involves adding up lots of little bits of previous values to acquire the current value.


## Further Learning

Obviously, we are just barely scratching the surface of these topics. For the early learner looking to go further, I have a few recommendations.

If you tend to learn well from lectures, animations, an emphasis on making things intuitive, or anthropomorphic greek letters, I *highly* recommend the [youtube channel of Grant Sanderson, "3blue1brown"](https://www.youtube.com/channel/UCYO_jab_esuFRV4b17AJtAw). In Particular, his [series on Calculus](https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr) is a good start, bringing excellent visualization to some of the less-intuitive calculation aspects of the symbolic manipulation side of the topic.

If you learn better from reading books and visualizing at your own pace, or like 100-year-old textbooks, [Calculus Made Easy](http://www.gutenberg.org/files/33283/33283-pdf.pdf) is a surprisingly hilarious option.

![Calculus made easy & subtitle](/assets/calc_made_easy.png)

If a title like that doesn't make you at least want to take a peek, I'm not sure what will.



