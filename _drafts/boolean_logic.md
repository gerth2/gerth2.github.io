---
layout: post
title:  "Boolean Logic"
date:   2019-06-13 9:31:00 -0500
categories: blog_posts
---

_"All you need is NAND... ba da da da da" - Professor Michael Loui, 2010, UIUC_

## Combining Bits

In this post, we'll start to dig into how you combine bits together. [Previously](link me!) we've looked at how to interpret, generate, and analyze sets of bits. Now we want to do operations on them. Just like how you add and subtract numbers, so to can 1's and 0's be combined and manipulated.

If you remember our friend Mr. Boole from previous posts, what we're about to go through is a primer on the logical system he formulated.

## Boolean Functions

Recall from the [math primer](link me!) how we looked at the concept of a "function" as an [abstraction](link me!) of mathematical behavior. Just like with normal base-10 numbers, functions can act on boolean numbers too!

We often describe a boolean function with what's called a *truth table*. Unlike more traditional mathematical functions, it's often easy to competely enumerate the set of all possible inputs to the function. 

The functions we'll concern ourselves with take $$N$$ inputs, and produce a single output.

If you recall some of the math we learned in previous posts, you could probably have guessed that a function with $$N$$ boolean inputs has $$2^N$$ possible input combinations, which means it has $$2^N$$ outputs to describe in a truth table. Of course, each of those $$2^N$$ outputs will be simply 1 or 0, but _which ones are 1_ and _which ones are 0_ is the question a truth table answers for you.

As a sample, we will organize truth tables like this:

| In1 | In2 | In3 || Out |
|-----|-----|-----||-----|
|   0 |   0 |   0 ||   1 |
|   0 |   0 |   1 ||   1 |
|   0 |   1 |   0 ||   1 |
|   0 |   1 |   1 ||   1 |
|   1 |   0 |   0 ||   1 |
|   1 |   0 |   1 ||   1 |
|   1 |   1 |   0 ||   1 |
|   1 |   1 |   1 ||   1 |

All N inputs come first, and the output is in the last column. This isn't a particularly interesting function, as it always outputs the same thing, no matter what the input is. I like to call "a wire connected to +5V". But we'll get into more fun ones soon enough.

## Fundamental Logic Functions

Most of the basic boolean functions have particular names. There are 3 very basic ones: AND, OR, and NOT. Whoever came up with the names deserves a snickers bar, because they actually make a ton of sense.

### NOT

The simplest boolean function of interest to us has only $$N=1$$ inputs, which means there are two possible output states.

| In1 || Out |
|-----||-----|
|   0 ||   1 |
|   1 ||   0 |

As you can see, NOT performs an *inversion* of the boolean state. 1 is not 0, and 0 is not 1. 

When you are writing an equation, you'll generally use capital letters like $$A$$ or $$B$$ or $$I$$ to indicate a variable which is boolean, and can take on 1 or 0 values.

If we assume that $$A$$ is our input, and $$B$$ is our output, we would denote the NOT function as the following:

$$ B = \overline{A} $$

This is to say that $$B$$ is the logical "NOT" of $$A$$. Or, another way, to calculate $$B$$, you invert $$A$$.

### AND

AND is another fundamental function, but it takes two inputs, implying that there are four possible output states.

| In1 | In2 || Out |
|-----|-----||-----|
|   0 |   0 ||   0 |
|   0 |   1 ||   0 |
|   1 |   0 ||   0 |
|   1 |   1 ||   1 |

As you can see, AND outputs a 1 *if and only if* both inputs are 1. In all other cases, the output is 0.

This is another great name for a function. The output is 1 if the first input is 1 **and** the second input is 1.

When you describe AND in an equation, you write it like multiplication. This means you might put a dot between the inputs, or maybe just write them next to each other. For example:

$$ C = A \cdot B $$

$$ C = AB $$

Both of these equations denote that $$C$$ is calculated as the logical AND of input variables $$A$$ and $$B$$

### OR

OR is our last fundamental function. Like AND, it takes two inputs. Like AND, it is also fairly well named.

| In1 | In2 || Out |
|-----|-----||-----|
|   0 |   0 ||   0 |
|   0 |   1 ||   1 |
|   1 |   0 ||   1 |
|   1 |   1 ||   1 |

You can see that OR outputs a 1 when *either* of its inputs is true - that is to say the output is 1 if the first input is 1, or the second input is 1. 

Note that if both inputs are 1, the output remains 1 - this is a bit of a departure from how most folks interpret the word "or". If your Mom asked you "Do you want to go to Disney World or Universal Studios" she probably wouldn't be all that pleased if you said "Both!". But ignoring this for now...

When you describe OR in an equation, you write it like addition. This means you have to use a plus symbol. For example:

$$ C = A + B $$

This is the way to denote that $$C$$ is calculated as the logical OR of inputs $$A$$ and $$B$$.

## Equations, Order of Operations

This

## Gates & Drawing Diagrams

### Logic Gates

### Logic Diagrams

## 2-Level Logic


## Derived Gates




