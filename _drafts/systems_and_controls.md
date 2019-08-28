---
layout: post
title:  "Systems & Control Engineering"
date:   2019-08-28 09:30:40 -0500
categories: blog_posts
---

## Introduction

One of the most eye-opening courses I took in college was an introduction to control theory course. Prior to this, I had never even heard of this concept of "control theory" - it provided this brand new level of abstraction for thinking about how software fits in with the rest of the world. It gives you the tools and vision for creating software and physical devices in harmony, to produce some desired output. This output could be a desired motion.

_Software and physical devices in harmony_

Sounds sorta familiar, huh? 

I did a couple cool projects in the class, but largely didn't touch the subject much academically. But boy, did it influence the way that I approach problem solving. And it has been the single greatest driving force in my design philosophy for robotics - both in college, and into FRC.

I want to start a series of posts on the topic. We'll start by talking more about the formal definitions of "System" and "Controls", dig into a bit of the math (with lots of pictures, don't worry), and finally talk a bit about controller design - leading into the mysterious land of _PID_.

If you've spent any time around robotics, you've most certainly heard the term PID - this mystical thing that you put in code, and then it magically solves problems! Right? 

Eeeh, not so much. Only certain problems, and only under certain constraints. The study of Controls Engineering will give us the answers on _which_ problems and _which_ constraints. 

So, let's dive in!

## Defining a _System_

A _Control System_, or simply a _System_, is a carefully-selected collection of mechanical parts, electronics, and software which interact. That's it. Its super vague by itself.

Usually, a control system