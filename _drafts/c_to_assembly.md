---
layout: post
title:  "C to Assembly"
date:   2019-08-09 09:30:40 -0500
categories: blog_posts
---

_"Programs must be written for people to read, and only incidentally for machines to execute." - H. Abelson and G. Sussman (in ["The Structure and Interpretation of Computer Programs"](https://web.mit.edu/alexmv/6.037/sicp.pdf))_

## Introduction

This post is going to be like the ending of a Hallmark movie. If you've been even mildly following so far, you could have predicted it from a mile away. What we're about to do is show how C code gets transformed into x86 assembly. With this keystone topic in place we now see the full cascade:

1. C syntax is built into assembly instructions
2. Assembly instructions are built into bits
3. Bits are loaded into RAM
4. RAM is used to evolve the state of registers in a processor over time
5. Registers in the processor, and the logic gluing them together, are built up from logic gates
6. Logic gates are built up from transistors
7. Transistors are analog electrical components that follow basic laws of physics

With this capstone, you'll have a _very_ good grasp of the same background knowledge that's sitting inside my head as I write code. Not all the knowledge, and not all the answers for sure - but you'll know enough to _know how to ask questions_. This is probably the biggest thing I run into while doing technical work. For better or worse, _you don't know what you don't know_. It's impossible to get all the knowledge into your head at once. What you do want to get into your head is a framework for how things work - this way, when it matters, you know what to go look up - how to start a search for the info you actually need. We'll always have textbooks and the Internet for that.

Finding the answer is easy. Finding the question is hard.

[But I digest.](https://en.wikiquote.org/wiki/Family_Guy/Season_6) On to our inevitable conclusion...

## C code to x86

Even though it's not directly applicable to FRC robots, let's do a brief description of how C code turns into bits on a processor. If you're in C++ the process will be extremely similar. Java a little bit less similar (the tools have different names and act at different times, but ultimately do the same job). Labview will be out of scope for now, [though NI does have some good documentation on how they do their thing](http://www.ni.com/tutorial/11472/en/).

### Basics of the Compilation Process

#### Toolchain

In C code land, the there are two tools that work together to create bits. 

The _Compiler_ is responsible for converting the .c text files into _mostly_ 1's and 0's which can be run on the processor. However, it doesn't compute the final layout in memory - it's designed to work on single .c files at a time. In a multi-file project, files frequently access variables defined in other files. To account for this, the compiler will assign placeholders to things it knows about, or is _promised_ will exist elsewhere. The results of this operation produces _object files_, frequently named the same as the source code file, with the file extension _.o_.

The _Linker_ is responsible pulling together all the various .o files created by the compiler, along with any built-in system libraries (like, where functions like `printf()` are implemented for your machine), and creating the final .exe. This means the _linker_ creates the final memory address layout, and is what actually confirms that all the variable placeholders that were promised actually exist.

For simple projects, these steps often happen together in the same executable, right after each other, transparent to the user. More complex projects split the steps up and manually coordinate them using a _make_ utility. 

For our discussion, we're going to focus on how the _Compiler_ does its work, carefully avoiding some of the hoops the linker has to jump through. It will be an abbreviated process that works for small files, which will be sufficient to start learning.

#### Parsing

### Examples

#### Variables and Math

#### If Statements

#### For Loop


## Next Steps - Where are we going?