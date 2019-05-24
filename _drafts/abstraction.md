---
layout: post
title:  "Abstraction"
date:   2019-05-23 9:30:00 -0500
categories: abstraction fundamentals
---

*"The more I learn, the more I realize how much I don't know." - Albert Einstein*

## Methodologies for Thinking about Big Problems

The world is full of huge problems. Lots of folks would say these require huge solutions. I'm not so sure.

As humans, we have a finite amount of information we can process. You may notice that really smart coworker or kid in your class who can seemingly process, memorize, and store vast amounts of information. They might be good, but they're not perfect, and they too have their limits.

The problems we get asked to solve are frequently larger than we can contemplate "all at once". They're too big to keep every fact, detail, and item in your head at once, and to contemplate every relationship.

When it comes to big problems, you have to break them down into smaller problems to deal with effectively.

When you are in school, your good teachers are actively doing this for you. By presenting material one day at a time, and in a well-defined sequence, they lead you through a logical sequence of steps to the final answer.

You probably do it yourself already too! Think about the last time that you played a sport. Did you think about exactly which muscles you were moving in order to throw a ball, or run down a field? Probably not. You don't need to - you've mastered the basic motor skills already, so you don't think about them. You spend most of your time thinking about strategy, technique, and reflexes specific to the game. But, unless you're working with a doctor or a really specific coach on a very specific problem, you rarely think about the contraction of individual muscles.

The key takeaway is this: solving big problems requires breaking them down into their components, and focusing on one component at a time. Effective problem solvers learn the skills (perhaps even artistry) of breaking down a big problem into smaller ones.

## Abstraction, in the Context of Robotics

As we start on this adventure of learning about computer systems, **abstraction** is the first vocabulary term I'd like you to learn.

An **abstraction** is a particular way of breaking down a big problem into smaller problems. In particular, to **abstract** a particular concept is to remove all extraneous details about the concept, and focus in only on a very select few of interest.

# Slice N Dice

Practically, this occurs when you divide a big problem into small ones, and then for each small problem, divide it into "internal concepts" and "interface concepts".

insert drawing here

Why do this? it allows you to analyze each small problem individually. Rather than think about the whole big problem at once, you instead pick a single small problem and consider:

 1) The internals of the small problem
 2) The interface of the small problem
 3) The interfaces of other related small problems
 
This technique works well under the following assumptions:
 
 1) Interface layers are as "thin" as possible - ie, you reduce all but the _absoluetly most essential_ info
 2) Internals are right-sized
 3) The number of inter-small-problem connections is right-sized

# Right-sizing Internals

This is why the abstraction process often has a bit of "artistry" to it. There's a fine balance at choosing how to sub-divide our big problem. 

If you make your divisions too small, each small problem ceases to have meaning on its own, and cannot be analyzed without context of the full problem. This defeats the purpose of subdividing.

Conversely, if you make your divisions too big, each small problem becomes prohibitively complex to analyze by one person, again defeating the purpose of breaking it down.

Exactly what the correct size is varies depending on the person solving the problem, how familiar they are with the subject matter, how much coffee they've had today, and numerous other factors. The good news is that the division doesn't have to be absolutely perfect to help you create better engineered systems, and there are often many "good enough" answers. Furthermore, if you play your cards right, you can often re-do the problem division in the future, as you learn more.
 


## Conclusion

Abstraction, without concrete examples, is by definition an "abstract" concept. Don't worry too much about it, we'll get some great examples in the coming posts. 

Simply remember that when we talk about **abstractions**, we're talking about removing details we don't care about, to focus on the small parts that we do.

The world is full of huge problems. Lots of folks would say these require huge solutions. I say they require lots of small solutions, linked in just the right way.
 
 
