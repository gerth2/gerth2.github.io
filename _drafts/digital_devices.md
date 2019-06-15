---
layout: post
title:  "Digital Devices"
date:   2019-06-15 9:30:00 -0500
categories: blog_posts
---

## On Word Problems

As engineers, we almost always start with word problems. You know those paragraphs that your math teacher writes out that you have to *read* and then they make you extract the useful information to formulate some formulas, then solve them, then get the actual answer? Yea, those. I used to love those, because the paragraph-format meant the teacher couldn't fit as many problems on one page, which meant shorter homework assignments!

Never in my professional life have I ever been asked "what's $$465 + 236$$?". Many times, I've had someone come to my desk and ask me a question that took ten sentences to explain, but at the end of the day all I had to do was calculate $$465 + 236$$. That and listen to them, which is a whole skill (nay, art?) unto itself.

In previous posts, we've seen how logic gates can be combined to manipulate bits. There's obviously a ton of different ways you could combine a set of bits... OR'ing them together, AND'ing them together, some combination of the two... But, why would you do such things?

Word problems. Every engineering problem starts as a word problem. So to learn about digital devices, we're going to frame a couple word problems. Some of them may seem a bit odd at first, but I promise they're building up to something very useful. Keep in mind, we're laying the foundation for understanding the guts of a computer, which is going to help us write better software.

## Rocket Launch Controller

Well, a contrived one at least. Part of one, not the whole thing. 

Let's imagine a usual rocket launch. We're sending some people into space atop a very _very_ powerful flaming pushy thing. You want to be sure everyone is OK with going to space before you actually try to go to space.

Mission control is keeping track of the launch, and  has the responsibility of initiating it. Maybe we could give them one big launch button. But, this could be problematic - what if someone trips and falls and lands on the button? Then our rocket gets launched unexpectedly. This could be bad $$^{citation needed}$$.

For safety's sake, let's build two buttons and put them on opposite sides of the room. The rocket shouldn't launch unless two *different* launch control engineers push both the buttons at the same time. "Hey Bob, ya ready?" "Yea Joe, let's light this candle!" "Ok, push the button" "Sounds good!" BWWWUWUSUSHSHSHSHSHSHSHSHHHHhhhhhhh......

But, we also have astronauts in the capsule. Mission control is pretty good at their jobs, but they aren't at the rocket. Despite all their instruments, they still don't hear, feel, or smell[^1] the behavior of the rocket. Maybe it's wise to give our astronaut friends a "kill switch" of sorts inside the capsule. That way, if something seems off, they can activate some sort of "emergency stop" or "override" to prevent launch control from starting the rocket.

Buttons make great sources of boolean inputs. Though we won't go into the details just yet, suffice to say that you have three boolean inputs, representing each of our three buttons. We'll call the two in the launch control room $$L_1$$ and $$L_2$$. We'll call the "emergency-stop" button near the astronauts $$E$$. For all buttons, a value of True indicates the button is pressed, and False indicates it's not pressed.

We will have a single output called $$A$$. When it's True, it will trigger the ignitors to start the rocket, and send the thing to space. When False, the rocket remains on the launch pad.

How do we want to design this digital circuit to control the launch functionality as described? Let's break it down into little chunks.

The launch room is kind of its own entity, with its own behavior, and own set of inputs. Let's deal with that one first.

What is the information that comes out of the launch room that the rocket ignitors care about? I'd say that the information the rocket cares about is "Both buttons or pressed" - either they're both pressed, or their not both pressed. Let's call this intermediate value $$B$$.

Looking inside the launch room, the logic should be pretty simple. Two inputs, one output. Let's enumerate what we want to happen for each input:

| $$L_1$$ | $$L_2$$ || $$B$$ | |
|-----|-----||-----|-----|
|   0 |   0 ||   0 | No button is pressed. Don't Launch. |
|   0 |   1 ||   0 | Only one button is pressed. Don't Launch Yet. |
|   1 |   0 ||   0 | Only one button is pressed. Don't Launch Yet. |
|   1 |   1 ||   1 | Both buttons are pressed. Go for Launch! |

Astute readers will notice that this actually is a very familiar function - it's just an AND gate! 

$$ B = L_1 \cdot L_2 $$

INSERT PICTURE HERE

There we go, quite simple!

Now let's move on to the astronauts. They've got one button that when pressed should indicate "inhibit launch".

It's generally a good idea to try to keep things as similar as possible. Since Launch Control has a single output that indicates "Go for Launch", lets give our astronauts the same output. We need to design a circuit that takes their inhibit button value and converts it into a "Go for launch" output. We'll call the astronaut output $$C$$. Again enumerating with a truth table:

| $$E$$ || $$C$$ |  |
|-----||-----|-----|
|   0   ||   1   | Astronauts are not pushing their button. Everything must be ok, go for launch! |
|   1   ||   0   | Astronauts detected a problem and pushed their button! Don't Launch! |

Astute readers will again notice this is actually a very familiar function - it's just a NOT gate.

$$ C = \overline{E} $$

INSERT PICTURE HERE

Excellent! We have now devices for both the Launch Control room and the Astronauts capsule controls, each with an output that says "Light the rocket" or "Don't light the rocket". The rocket ignition mechanism now has to take these two signals, and combine them together. Note from our initial requirement, we know we don't want to launch the rocket unless both the astronauts and launch control decide it's time to go.

| $$B$$ | $$C$$ || $$A$$ | |
|-----|-----||-----|-----|
|   0 |   0 ||   0 | No one wants to launch the rocket. Don't Launch. |
|   0 |   1 ||   0 | Astronauts say they're ok to launch, but Launch Control doesn't agree. Don't Launch Yet. |
|   1 |   0 ||   0 | Launch Control wants to go, but astronauts saw a problem. Don't Launch Yet. |
|   1 |   1 ||   1 | Astronauts say they are good to go, and Launch Control says good to go!  Light the Rocket! |

Even the least astute of readers should be able to recognize this now. It's another AND gate!

$$ A = B \cdot C $$

We can now put all 3 pieces of the puzzle together. Substituting equations:

$$ A = (B) \cdot (C) $$


$$ A = (L_1 \cdot L_2) \cdot \overline{E} $$

In diagrams, we'd draw this as:


INSERT DIAGRAM HERE

This simple logic diagram shows how we could implement logic to accomplish our basic launch control system.

### Notes on Subdividing

Admittedly, this is a pretty simple system, and we took a very verbose and roundabout way to design it. I bet many of you saw the ending well before we got there. That's perfectly fine! The big takeaway is not just the answer itself, but rather dividing the problem up into useful pieces. In this context, "useful" implies that each one is solvable on its own, and represents some meaningful small piece of computation. If you notice, you can easily draw boxes around the three physical locations we discussed:

INSERT PICTURE HERE

The individual pieces may not be implemented by the same computer! You might have to have each piece on a different machine, since they're in physically different places. This diagram and design doesn't at all get into how one might transfer a boolean value from one place to another (radio? super long wire?), but for lots of purposes that doesn't matter. Imagine your boss came up and asked "What does the system do"? They don't care about the implementation details, they care about functionality. This would be a great diagram to show the high level behavior of the system, without getting bogged down on communication, button size, or other implementation details.

The wise engineer says to create designs (and present designs) at the easiest and most useful level of abstraction. The experienced and artful engineer can identify exactly what that level of abstraction is in their sleep.

### Design Flaw

The critical student will have noticed that there may be a few gaps in our design.

One of them that I'll address - the astronaut button. Let's say that our friends detect a problem and want to prevent launch. With our current logic, if they tap their button, they'll momentarily inhibit the launch, but as soon as they take their finger away the button springs back, allowing the launch again. It would stink to force them to have to hold down the button the whole time. We'd probably want to remember whether they've pressed it or not, and inhibit launch until someone corrects the issue that caused them to hit the inhibit button in the first place.

I can think of two ways to do this "remembering". One is mechanically - don't use a button, use something more like a light switch that doesn't "spring-back" to the off position when you're done. THe other is to remember the button press in software. This requires using *memory*, which is a concept we'll cover later in this post.

## Adders

We're going to move on to a slightly more abstract, but much more realistic example.

### Binary Addition

Recall from the [boolean](link me!!) lesson how we can add together boolean numbers the same way we add together 

### Single Bit Adder

### Ripple-carry Adder

Test text

### Joining chunks together

Test text

## Flip Flop

Test text

### Gate Propagation Delay

Test text

### Basic Flip Flop Ideas

Test text

### The J/K Flip FLop from Gates

Test text

### Abstraction

Test text

## RAM

Test text

## Counter

Test text

### The Clock Signal

Test text

### A Simple Alarm Clock

Test text


[^1]: Yes, smell. A good engineer uses *most* of their senses! Learn the smell of burning electronics, and learn to shut off the power as soon as you smell it! It's a great way to identify the source of issues, and get early detection of a failure - you can often smell it before you see smoke. Of course, be careful not to inhale anything super toxic. For that same toxic ingestion reason, I don't usually recommend the sense of taste for writing software.