---
layout: post
title:  "Digital Devices Part Two - Sequential Logic"
date:   2019-06-15 9:30:00 -0500
categories: blog_posts
---

This post is the continuation of [Part 1](/blog_posts/2019/06/26/digital_devices.html) in our series on digital devices. 

## Combinational versus Sequential Logic

So far, we have discussed circuits which take a set of inputs, and produce an output. They do not "remember" any particular piece of information - their outputs are a function current inputs only. They keep no record of past inputs. These are called *Combinational Logic* circuits.

As we mentioned earlier in the case of the astronaut button, sometimes it is useful to remember information about past information. Circuitry which accomplishes this memory is called *Sequential Logic*.

All the logic gates we've shown so far are by themselves combinational devices. However, we'll now introduce a class of devices where outputs are *carefully* fed back into inputs, allowing the device to retain information over time. We will be able to build these up into a full RAM chip, just like you have on your computer to store information!

## Flip Flop

The most fundamental unit of memory storage is usually referred to as a [*flip flop*](https://en.wikipedia.org/wiki/Flip-flop_(electronics)). Much like the beach-oriented footwear, they flip and flop back and forth between true and false, with transitions triggered by certain input conditions. They also come in a number of different flavors. The easiest to analyze at first is often called the "SR Latch", which we'll look into as an example. Then we'll abstract away the details and talk about a few other varieties.

### Gate Propagation Delay

One thing we haven't touched on yet - how long does it take a gate to do a calculation? So far we've kinda just ignored it - effectively assumed the answer is "infinitely fast". Of course, nothing is infinitely fast. Voltages can't change instantaneously, electrons take time to move around! When you apply a certain input combination to a gate, the reaction is quite quick - usually on the order of *nanoseconds*. However, it's not literally instantaneous. [*Propagation delay*](https://en.wikipedia.org/wiki/Propagation_delay) is the name given to this duration between applying inputs, and seeing the correct output.

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

Note how the loop-back of outputs back into input only makes sense if you assume gate delays are present. There is a *very* slight delay between a change in input and a change in output, as shown in the gif. If you assume things change instantaneously, you get logical conflicts and are setting 1 equal to 0 (which implies a short circuit, which usually means [magic smoke](https://en.wikipedia.org/wiki/Magic_smoke) is getting out ). But, due to gate delays, for carefully designed circuits this is not a problem. When you buy the real chips that have SR Latches in them, the silicon has been carefully designed to make the gate delays *just right* so this all works out. And then you as the user don't have to worry about it. Yay abstraction!

The astute reader may notice that there is a key flaw [^1] to this configuration: Look what happens if you set both inputs to 1. Starting near $$R$$ - $$ \overline{1 + Q} = \overline{Q} $$, meaning $$Q$$ is equal to $$\overline{Q}$$. Wait a minute. True can't be equal to False. Huh.

In reality what happens here depends on how your gates are constructed with transistors (you have to go one layer down in the layers of abstraction). You might get oscillation, or maybe short circuits and magic smoke. Depends. No matter what, setting both inputs to 1 is a bad idea. Due to this, it's common to put additional gates in front of the S and R inputs to facilitate ensuring you never get the latch into a wacky state.

### The Clock Signal

To properly motivate the specific flavor of flip-flop that we will be talking about, we will first take a tangent into a bit of processor design.

Think about when you read about specifications for a processor. One of the most common specs you read about is the processor's speed, which is measured in some units of *Hertz*. Modern desktop processors are rated to run at around 2 to 3 GHz (Giga-Hertz, or $$10^{9}$$ Cycles per Second). This speed rating roughly corresponds to the number of operations the processor can do per second. But what it *really* references to is the *clock speed* of the processor [^2].

The [*clock*](https://en.wikipedia.org/wiki/Clock_signal) in a digital circuit is just a specially-designated signal. The clock cycles repeatedly between 1 and 0 and 1 and 0 at some specific frequency. Digital devices are designed to take a clock signal as one of their inputs to help it to stay in synchronization with other devices in the system.

Circuits are designed such that at every *edge* of the clock, or every transition from 0 to 1 (or so we will assume for now), it is assumed that all inputs to a particular digital device are *stable* and therefore *available*

The maximum clock speed is dictated by the worst-case propagation delay from the circuits that make up the system. If you have constructed some circuit with 10 AND gates passing each output to the next one's input - you have to wait 10 times the gate delay before you know that your output is stable. Assuming that output goes to another circuit's input, and they share a clock, you can't run your clock faster than each portion of the circuit can update the inputs of the next portion. 

This is why reducing the number of layers of gates is important - the fewer layers you have, the less input to output delay you have, and the faster you can run your digital circuit's clock. This means faster computation, which is generally regarded as a good thing![^3].

#### But Mommy, Where do Baby Clocks Come From?

Don't worry child, we will tell you when you are older.

Actually, it doesn't matter too much for our design purposes. This is the beauty of abstraction - you don't need to know *how* a clock signal is generated to *use* it. But for the curious, we will indulge you momentarily. 

A clock is just a repeating waveform, and can be derived from any repeating pattern in nature. Common ways of generating it include:

1. Getting it from the power line (usually a nice 60Hz in north america, unless your power company screws up.)
2. Repeatedly charging and discharging a capacitor through a resistor (for example, see ["555 timer" circuit design](INSERT WIKI LINK HERE)).
3. Amplifying the vibrations of a specially-designed [crystal made of quartz.](LINK HERE AS WELL)
4. Watching atomic vibrations of a [cesium atom.](LINK TO NIST STANDARD HERE)
5. A whole host of other things

In addition, there's a whole science to distributing this clock signal carefully to all the circuit elements, so they actually receive nice clean 0-to-1 transitions at the same time. Especially when clock frequencies get high, those wires inside your processor start to act less like ideal wires, and more like radio antennas. It gets mucky fast. 

We don't like to think about all this at once. So we use our powers of *abstraction* to simply say *we trust a clock signal exists and works well, now we will use it*. 

### The D flip-flop from Gates.

Here's our design goal - we want to build a device where we can predictably control when the output changes based on some clock signal input. We will have a single input that dictates when the *next* output will be, and when the clock input *changes* from 0 to 1, we will update our output to match our input. At all other times, the output should retain its state.

We do this by cascading multiple SR latches together, such that an input, or some feedback value, "drops through" each layer as the clock swings from 0 to 1. Neglecting gate propagation delay, the 0 to 1 *rising edge* of the clock will be the event that ultimately causes a new input to appear at the output.

I am again in debt to Wikipedia for providing some images of gate configurations. Far easier than drawing it myself, and equally correct.

![Edge Triggered D Flip Flop](https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Edge_triggered_D_flip_flop.svg/1920px-Edge_triggered_D_flip_flop.svg.png)

It might be a bit hard to trace the functionality, but it's actually pretty straightforward. When the input labeled *Clock* goes from a 0 to a 1, the output $$Q$$ takes on whatever value is applied at the $$D$$ input. $$\overline{Q}$$ is of course always the inverse of $$Q$$.

### Abstraction

When you draw out one of these devices in a circuit diagram, it's actually confusing to do it with gates. Astute document readers might recognize "oh that's a D flip flop!". But in reality, you don't want to make people think about that, you just want them to know it. So, there's a fairly generic symbol that gets drawn:

INSERT WIKI IMAGELINK HERE

The ports are labeled about as you'd expect from above. The little notched $$>$$ by the Clock input indicates that it is in fact a clock.

The $$S$$ and $$R$$ ports are often omitted. They will force the output to 1 ($$S$$) or 0 ($$R$$) immediately, regardless of the value of $$C$$ or $$D$$. This is useful for a *reset* circuit, which (when activated) puts all the devices into a known state. This is useful when first powering on (or rebooting) your computer - depending on the exact transistor layout, the state of each flip flop may not be guaranteed when you first apply power to the circuit. Some might be 1, some might be 0...who knows. To get around this, designers usually just build in the ability to force every piece of the circuit to a known state.

### But, Why a Clock?

The reason for triggering on the rising edge is for *synchronization* across the larger system. Think about a computer chip - you'll have many many many of these memory components spread throughout your processor, RAM, peripherals, device drivers, etc. You want to be sure that they all change state at the same time, so you design your circuit with a rising-edge paradigm in mind. Namely - when the clock is not having a rising edge, you have that whole time to do all the combinational logic. Signals propagate around, change gate state, do calculations and whatnot.... you can do whatever you like in this time, just as long as *all Flip Flop inputs* and stable before the *next clock rising edge*.

For the sake of completeness, it should be noted that digital circuits are often *falling edge* triggered. This changes the circuit design a bit, but the concept remains the same. It doesn't matter if your clock goes "1 0 1 0..." or "0 1 0 1...". General design principles would say to keep all your devices the same - all rising edge or all falling edge triggered. But even this can be violated if you're careful enough. Not worth focusing on too much now, but just for awareness - rising-ege isn't the only option.

## Counter

Let's put together a circuit combining two things we have just learned about - adders and flip flops. Our goal will be to build a device which keeps track of time, counting the number of clock cycles. To keep things simple, we're going to pretend that we're building a clock for planet Zorgon. It's a zippy but precise planet, circling its sun every 256 seconds exactly. Our Zorgon clock therefor just needs to count up from 0 to 255 to track all the seconds in the day, then reset back to 0 after the 255th second (when it is the next day).

If you recall from the binary lesson, if we have 8 bits and treat them as an unsigned integer, we can exactly represent the numbers 0 through 255 (since $$255 = (2^{8}-1$$)). They don't call Zorgon the "Planet of Simplifying Mathematical Coincidences" for nothing!




### A Zorgon Alarm Clock

Test text


## RAM

Test text


## Next Steps - Where are we going?

TBD


[^1]: Flaw - or *limitation* or *opportunity*. All words could apply, just pick the one that says what you want to say.
[^2]: Or at least, it ought to. Sometimes the marketing department has other ideas. But we still like them, because they help sell the things, which makes money, and lets the engineers make more things, and have food to eat.
[^3]: Turns out, because of gate delay, the ripple-carry adder is actually a bad design for an adder circuit. Think about what happens if you had 1000 stages. How long do you have to wait for the full result to be available? Think about how many gate propagations are needed to calculate the final carry-out signal. Dis nasty.