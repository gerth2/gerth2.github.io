---
layout: post
title:  "Binary"
date:   2019-06-07 9:31:00 -0500
categories: math binary alternate numbers
---

## Representing Ideas with Symbols

Consider the following:

$$16.$$

When you read that, what did you think? You probably said "sixteen" in your head, assuming you think in English. This is a very good answer.

What is "sixteen", though? It's a number, that's for sure. It's also an idea - a concept.

Here's what I think of when you say "sixteen":

![sixteen boxes](/assets/sixteen.png)

Sixteen represents a quantity. There are sixteen boxes. 

We are using the sequence of symbols $$16$$ to represent this quantity. You're already very familiar with how this works, but it's important to dig into the details - it will lead us to a natural way to define the binary system used in computers.

THere's two things to take away from the symbol sequence $$16.$$:

1. It uses two symbols, $$1$$ and $$6$$, anchored around the decimal point $$.$$
2. It puts them together in a particular order to give meaning to the quantity. $$16.$$ and $$61.$$ are not the same.

The number system we're talking about is commonly referred to as the [Hindu-Arabic number system](https://en.wikipedia.org/wiki/Hindu%E2%80%93Arabic_numeral_system). It was invented in India in the first century, and quickly its way through the Middle East and into Europe by the Middle Ages.

It has a particular advantage over predicessor methods for representing numbers in two ways:

1. There is a limited set of symbols to remember. For most modern mathematics, there are 10 symbols - $$0$$, $$1$$, $$2$$, $$3$$, $$4$$, $$5$$, $$6$$, $$7$$, $$8$$, $$9$$. Each represents a particular quantity. 
2. The symbols are combined to represent quantities beyond the range of the symbol set. How it accomplishes this is really the [secret sauce](https://en.wikipedia.org/wiki/Secret_ingredient) to the whole system.

Each symbol is in some position relative to the "decimal point". In english, we usually refer to them (from right to left) as the "ones place", the "tens place", the "hundreds place", etc.

Because there is a $$1$$ in the tens place, we multiply the quantity represented by $$1$$ by ten. Then, this quantity is added in with the quantity represented by $$6$$, which because it is in the ones place, is multiplied by one (aka nothing is done to it). Together, ten and six make for a quantity of 16.

![sixteen in base 10](/assets/sixteen_base_10.png)

### The concept of "Base"

What's the point of splitting like this? Note that any number in base 10 can be broken into a sum of its component digits.

$$16 = 1*10 + 16*1$$

THis works, no matter how big the number gets.

$$1736 = 1*1000 + 7*100 + 3*10 + 6*1$$

Notice the pattern on the $$*1000$$ and $$*100$$ and $$*10$$ and such?

$$1736 = 1*10^{3} + 7*10^{2} + 3*10^{1} + 6*10^{0}$$

Here's the takeaway: in a positional number system, any quantity is represented by a sum of the digits, each multiplied by some "potency" factor associated with its position in the sequence.

This is why we say we are using a *Base 10* number system - the "base" of the number raised to some power to get the "potency" of each digit.

You can create a generic formula using a summation:

$$value = \sum_{i=0}^{i=N}D_i * 10^{i}$$

Where

 * $$N$$ is the number of digits in the symbol sequence
 * $$D_i$$ is the $$i$$'th digit in the symbol sequence, with 0 being nearest the decimal point.

But here's the crucial question - *why is 10 the base*?

There's lots of argument as to why it is the way it is - some say because you have 10 fingers. But the Mayans used base 20 (apparently they used their toes as well?), and the Babylonians used base 60 (???). Maybe the people who liked base 10 also happened to be the best at winning wars. For better or for worse, that's how this sort of thing often gets decided. 

However, the takeaway you should have - *it doesn't have to be 10*. And indeed in designing computing systems, there are better answers.

### True/False

Back in the 1800's there was this guy named [George Boole](https://en.wikipedia.org/wiki/George_Boole) was creating a mathematical computation for logical reasoning. Key to this line of thought was describing, associating, and combining the concepts of "True" and "False". Two opposite fundamentals. Two. Hey, maybe Two is a good number.

Two is also a nice "minimum viable product" for a set of symbols. Let's think about what you can express using numbering systems that have varying numbers of symbols:

#### The zero-symbol system
This system does not let you even write anything down. It is useless. Let us not waste another moment considering this.

#### The one-symbol system
This is effectively talley marks. Fair enough that it lets you start to express some ideas. However, you have to draw exactly the same number of symbols as the quantity you wish to express. You haven't really gained anything here. If you already have sixteen boxes, do you need to draw sixteen lines somewhere to indicate that you have sixteen boxes? Seems sort of redundant. Why not just go out and count your boxes, and save the time of writing the talley marks? Maybe if you want to keep your own records. But then the other cavemen just make fun of you for being a nerd. 

Strictly speaking, this isn't a positional number system, since the position doesn't matter ($$1^{anything} = 1$$).

On the upside, addition just becomes string concatenation.

We need to go one higher to realize the benefits of the positional number system.

#### The two-symbol system

Let's use this one.

### True/False in Circuitry

Unfortunately for Boole, electricity wasn't fully understood yet - certainly not to the point where people were looking for creative ways to harness it. The "algebra of logic" portion of his work didn't realize its full potential during his lifetime. It wasn't till the 1930's that another fellow by the name of [Claude Shannon](https://en.wikipedia.org/wiki/Claude_Shannon) realized that these True/False concepts could be mapped to voltages and currents, and controlled be switches. As part of his Masters thesis, he showed circuitry that could perform the calculations described by Boole and his contemporaries. 

The idea was extremely valuable. Perhaps not revolutionary - folks had been fiddling with analog devices that could do math, and later attempted trinary (base 3) and other exotic computer formats. However, the simplicity of designing circuits which only interpret "Voltage" or "No Voltage" has made such two-state designs far superior to any other option. Especially after the invention of the consumer-ready transistor later in the 1940s and 50s, true/false was here to stay. 

For this reason, almost all modern computers do math and logic using a base-2 system.

Until we get to quantum computing. At which point, I'll have to write another blog post.

## Math and Conversions in Binary

The formula for a number's value is:

$$value = \sum_{i=0}^{i=N}D_i * B^{i}$$

Where

 * $$N$$ is the number of digits in the symbol sequence
 * $$D_i$$ is the $$i$$'th digit in the symbol sequence, with 0 being nearest the decimal point.
 * $$B$$ is the "base" of the number system. 

Since we're using base-2, the formula becomes

$$value = \sum_{i=0}^{i=N}D_i * 2^{i}$$

Let's take a quick example of a binary number:

$$10010.$$

Note the trailing $$.$$ for the anchor point - usually it's left off, so we'll start to do that here.

What quantity is $$10010$$ ? let's plug and chug with our formula from above. The summation would unroll to:

$$value = 1*2^{4} + 0*2^{3} + 0*2^{2} + 1*2^{1} + 0*2^{0}$$

Which simplifies down to:

$$value = 2^{4} + 2^{1} = 16+2 = 18$$

There we go! A first conversion from binary to base 10!

If you want to go back the other way, all you have to do is decompose a base-10 number into powers of two. I'll just write out the algorithm here, and then leave it as an exercise to the reader to attempt:

0. Start with your number being the number to convert.
1. Find the largest position $$i$$ such that $$2^i$$ is _equal to or less than_ your number
2. Place a 1 in this position.
3. Subtract 1 from $$i$$., subtract $$2^i$$ from your number.
4. If $$i$$ is not yet zero, go to step 1.

What I find super slick about this is that since binary is also a positional number system, just like the base-10 one you're used to, all the arithmetic tricks and algorithms you learned in first through third grade still apply! Adding by lining up the digits, carrying spill-over to the next place, subtraction with borrowing, even long division - they all still work!

### A note on Notation

There are a lot of notations used "out in the wild" to indicate what base number system you are using. If you see a number, it's sometimes safe to assume base 10, but sometimes not.

*There are 10 types of people in the world. Ones who understand binary, and ones who don't*

Let's not let this T-shirt prophecy come true.

Little subscripts on a number indicate it's base. So $$10_{10}$$ is Ten. $$10_{2}$$ is Two. $$100_{10}$$ is one hundred, while $$100_{2}$$ is four. Obviously, something like $$4523_{2}$$ is nonsense and meaningless, and you should tell the author right away so they can correct their error.


## Representing Ideas with Bytes

### Conventions

### True/False

### Positive Integers

### Negative Integers

### Decimal Numbers

### Letters


*There are 10 types of people in the world. Ones who understand binary, ones who don't, and ones who don't expect base-3*