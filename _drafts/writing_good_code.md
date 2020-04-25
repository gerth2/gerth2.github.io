---
layout: default
title:  "Good Code"
date:   2019-08-10 09:30:40 -0500
categories: blog_posts
---

![code qualify](https://imgs.xkcd.com/comics/code_quality.png)
_source - xkcd.com_

## Introduction

One of the most common things I hear whenever I talk to other software teams, both in FRC and professionally - _"We want to write good code."_ 

What is this "good code" thing that folks keep chasing? Or conversely, when someone looks at your code and describes it as "bad", what are they really saying? There are... a lot.. of [folks](https://softwareengineering.stackexchange.com/questions/17443/what-does-it-mean-to-write-good-code) [out on the](https://medium.com/@navdeepsingh_2336/good-code-vs-bad-code-35624b4e91bc) [internet who have written](https://developerzen.com/how-do-you-define-good-code-c8a383c207a4) [on this topic.](https://hackernoon.com/few-simple-rules-for-good-coding-my-15-years-experience-96cb29d4acd9) Lots of them have some good ideas. Lots are just opinions, informed by highly specific scenarios. But what can we learn from all these 

True to this blog's bottom-up approach, I want to spend some time going through what makes for "good" FRC code.

## Defining Good Code

When I think about what makes code good or bad, there's one overarching concept that I believe applies universally:

**Good Code helps you deliver functionality better**

This is the most specific I am willing to say is a universal truth. Everything beyond this requires defining, for _your_ team, at this _present time_, what *better delivery of functionality* means. 

## The Definition of Good

Having a team manifesto of missions and goals is, in my mind, a key component to the success of any team. You can't work toward a goal together if team members are not clear on what that goal is. Usually teams write down high level goals in a mission and vision statement.

I think it is a very valuable exercise for every software team to regularly discuss what *better delivery of functionality* means for them, writing it down if needed.

There are very few wrong answers in the discussion. Therefor, your team's list will likely not be identical to my team's list.

Even still, there are also a lot of super common examples, which are worthwhile discussing. 

### Delivery Units

To discuss how to improve *delivery*, we should probably levelset on what we're talking about when we say "delivery". When I "deliver" software, it means that I provide a set of functionality to some other team, for them to use. Robot software, like most embedded software, rarely is useful on its own. It has to be combined with a physical device to have meaning. Therefor, as a software team, our job is to *deliver* functional pieces of software for the rest of the team to use.

*Delivery* should occur exactly as often as needed - no more, no less. Frequent delivery of new software which fixes unimportant issues will quickly annoy folks who really need time to develop on the robot. The time needed to flash the robot, test new functionally, and even just keep track of the fact the "correct" software to use has changed adds lots of overhead. In a time-boxed build (like FRC is), adding overhead is rarely something you want to do. Think about it - what if electrical team changed the wiring of the motor controllers to the roboRIO every day on you? You wouldn't like that very much. Too much churn is a bad thing. 

On the flip side, if the current robot lacks some key functionality, or has a large bug, either of which is preventing driver practice or training, you want to deliver new, fixed software.... _as soon as possible!_ Work has stopped, which again is a bad thing for the robot build overall - competition deadlines aren't moving out simply because the software team isn't done yet.

Software teams need to deliver full sets of functionality at the exact pace expected by other subteams. This delivery pace allows them to work software development and testing into the broader robot build schedule with minimal disruption.

Delivery units in FRC tend to be pretty straightforward. For my team, when we "deliver" software, it implies a few things:

0. All promised functionality has been merged together in version control
1. The software has been built locally on a PC
2. Any unit tests we have to run have been run, and pass
3. Software has been checked out to the maximum extent possible on a test electrical system.
4. Source code has been tagged in version control and pushed to the server
5. Software has been deployed to the robot

Note that we are using _git_ to do software _version control_ - a topic we'll cover in a later post. For now, if you aren't familiar, it's a methodology for keeping track of changes to files over time.

These requirements on what a "delivery" means for our team drives a few requirements for what we call _good_ software:

**Good software is version controlled, preferably with git**

**Good software can be tested, and has been tested, prior to delivery**

### Velocity of Delivery

When discussing software delivery, being able to deliver fast is a key criteria for most teams. It's not because you _always_ need to deliver fast, but simply that when duty calls, getting functionality out the door as rapidly as possible is a key desired ability.

Velocity in software development can come from a few different areas

#### Requirements

There are a few out there who might hate me for saying this - that's ok. Time and time again, my personal experience has shown me that if the goal of the software is not well defined prior to writing it, you'll be in a world of hurt later on down the road. Similarly, if you want to write software as _fast as possible_, a key component is to know what your end goal is before you start. Ideally, have some intermediate checkpoints defined too. 

A big chunk of this is talking with other team members - what does the mechanical team expect the mechanism to be able to do? What assumptions did the electrical team make while wiring it? What does the drive team expect to do on their gamepad controllers, and what effect are they expecting to see on the robot itself?

Another big chunk of this is talking with your software teammates - which parts of code will have to interact with other parts to get the funcitonality desired? What assumptions will your code make about other parts of code? Do you have to change someone else's work? Is anyone else already working on this task? What names will we choose for new functions, classes, and variables, so that everyone understands them?

Finally, a smaller chunk is sitting with some quality time of just you and the software. Exactly where will you be making changes? Will the names decided on work well? What do you already know how to do, what do you have to look up, what do you have to ask a mentor about?

Once you have all these requirements for functionality and code implementation, then you can start changing code files.

For me, all this comes down to another rule of _good_ software:

**Good software is tied to precise and documented requirements**

I like to point teams to the [github "Issues" list that comes with every repo](https://guides.github.com/features/issues/). Its a wonderful tool for tracking not just bugs, but also the functionality changes you have to make. Create one "issue" per chunk of functionality you are modifying, and document all the requirements in it. You can add comments, categorize changes, interact in a documented way with teammates, and mark when the issue has been "closed" (software writing is done).  

#### Maintainability

Oh boy, there is a ton to talk about here.

In the context of software writing, _maintainability_ refers to how easy it is to _change_ functionality later on. This could be two hours after the initial code was written, or two months, or (if you work for my employer) two decades. For me, it doesn't make a difference - if I'm going back and looking at code a second time, I've almost always forgotten what the code initially did. The key to maintainability is _minimizing_ the amount of _analysis_ that has to be re-done prior to making the software change.

Analysis occurs when a developer cannot quickly scan through code and determine functionality. It's inevitable to some extent - that's why we do write our code in a language humans can comprehend. Still, the less you keep the next person guessing, the better.

Code comments are the first line of defense in minimizing re-analysis. Marking the code you write with _useful_ annotation can jog memory, and help give reason to the _why_ in the sea of _what_. More on this in a future blog post.

### Quality



## Practical Examples