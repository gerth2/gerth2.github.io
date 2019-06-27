---
layout: post
title:  "Digital Devices Part Two - Sequential Logic"
date:   2019-06-15 9:30:00 -0500
categories: blog_posts
---

## Combinational versus Sequential Logic

So far, we have discussed circuits which take a set of inputs, and produce an output. They do not "remember" any particular piece of information - their outputs are a function current inputs only. They keep no record of past inputs. These are called *Combinational logic* circuits.

As we mentioned earlier in the case of the astronaut button, sometimes it is useful to remember information about past information. Circuitry which accomplishes this memory is called *sequential logic*.

All the logic gates we've shown so far are by themselves combinational devices. However, we'll now introduce a class of devices where outputs are *carefully* fed back into inputs, allowing the device to retain information over time. We will be able to build these up into a full RAM chip, just like you have on your computer to store information!

## Flip Flop

The most fundamental unit of memory storage is usually referred to as a "flip flop". Much like the beach-oriented footwear, they flip and flop back and forth between true and false, depending on inputs. They also come in a number of different flavors. The easiest to analyze at first is often called the "SR Latch", which we'll look into as an example. Then we'll abstract away the details and talk about a few other varieties.

### Gate Propagation Delay

One thing we haven't touched on yet - how long does it take a gate to do a calculation? So far we've kinda just ignored it - effectively assumed the answer is "infinitely fast". Of course, nothing is infinitely fast. Voltages can't change instantaneously, electrons take time to move around! When you apply a certain input combination to a gate, the reaction is quite quick - usually on the order of *nanoseconds*. However, it's not literally instantaneous. *Propagation delay* is the name given to this duration between applying inputs, and seeing the correct output.

This is yet another example of abstraction. For combinational logic, we are able to ignore this gate delay - assuming it is faster than anything we would ever care about (ie *instantaneous*). For sequential logic, understanding the function of our new flip-flop friends requires we at least keep this delay in mind. 

### Basic Flip Flop Ideas

The key to any flip-flop - we take the output, and route it back to an input. Due to gate delay, this effectively makes the "previous output" an input. When the previous output is an input, we can use it to remember what the output *used* to be. With some clever design, we can in fact make some useful memory happen.

The SR Latch consists of two *cross-coupled* NAND gates, hooked up like this:

![SR Latch](https://upload.wikimedia.org/wikipedia/commons/c/c6/R-S_mk2.gif)

Wikipedia has the best picture of this I've seen so far, so I use theirs.

The $$S$$ input is for "Set", and the $$R$$ input is for "Reset". The output is named $$Q$$. Note by the GIF:

1. When you set $$S$$ to 1 and $$R$$ to 0, this will cause the $$Q$$ output to go to 1
2. When you set $$S$$ to 0 and $$R$$ to 1, this will cause the $$Q$$ output to go to 0
3. When you set both $$R$$ and $$S$$ to 0, it causes $$Q$$ to maintain its value

Number 3 is the magic of the device - by leaving both inputs at 0, your output retains its previous value. This illustrates how you can hook gates up in a way to remember something about the previous inputs.

Note that there is a key flaw to this configuration: Look what happens if you set both inputs to 1. Starting near $$R$$ - $$ \overline{1 + Q} = \overline{Q} $$, meaning $$Q$$ is equal to $$\overline{Q}$$. Wait a minute. True can't be equal to False. Huh.

In reality what happens here depends on how your gates are constructed with transistors (you have to go one layer down in the layers of abstraction). You might get oscillation, or maybe short circuits and magic smoke. Depends. No matter what, setting both inputs to 1 is a bad idea. Due to this, it's common to put additional gates in front of the S and R inputs to facilitate ensuring you never get the latch into a wacky state.

### The Clock Signal

To properly motivate the specific flavor of flip-flop that we will be talking about, we will first take a tangent into a bit of processor design.

Think about when you read about specifications for a processor. One of the most common specs you read about is the processor's speed, which is measured in some units of *Hertz*. Modern desktop processors are rated to run at around 2 to 3 GHz (Giga-Hertz, or $$10^{9}$$ Cycles per Second). This speed rating roughly corresponds to the number of operations the processor can do per second. But what it *really* referrs to is the *clock speed* of the processor.

The *clock* in a digital circuit is just a specially-designated signal. The clock cycles repeatedly between 1 and 0 and 1 and 0 at some specific frequency. Digital devices are designed to take a clock signal as one of their inputs to help it to stay in synchronization with other devices in the system.

Circuits are designed such that at every *edge* of the clock, or every transition from 0 to 1 (or so we will assume for now), it is assumed that all inputs to a particular digital device are *stable* and therefore *available*

The maximum clock speed is dictated by the worst-case propagation delay from the circuits that make up the system. If you have constructed some circuit with 10 AND gates passing each output to the next one's input - you have to wait 10 times the gate delay before you know that your output is stable. Assuming that output goes to another circuit's input, and they share a clock, you can't run your clock faster than each portion of the circuit can update the inputs of the next portion. 

This is why reducing the number of layers of gates is important - the fewer layers you have, the less input to output delay you have, and the faster you can run your digital circuit's clock. This means faster computation, which is generally regarded as a good thing!

### The Gated D Latch from Gates.

Here's our design goal - we want to build a device where we can predictably control when the output changes based on some clock input. We will have a single input that dictates when the *next* output will be, and when the clock input *changes* from 0 to 1, we will update our output to match our input. At all other times, the output should retain its state.

I am again in debt to Wikipedia for providing some images of gate configurations.

![Gated D latch](https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Edge_triggered_D_flip_flop.svg/1920px-Edge_triggered_D_flip_flop.svg.png)

### Abstraction

Test text

## RAM

Test text

## Counter

Test text


### A Simple Alarm Clock

Test text


## Next Steps - Where are we going?

TBD