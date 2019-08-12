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

#### Lexing & Parsing & Compiling & Linking, oh my!

The compiler's job is generally divided into 3 phases. 

The first step is to walk through the input file line by line, and separate out each part of each statement. For example, given `out = in * 6.0 + 5/in2;`, the first step is to identify that the character strings `out`, `in`, and `in2` are variables, `6.0` and `5` are constants, and `=`, `*`, `+`, and `/` are all math and assignment operations. Sometimes, when you see _syntax errors_, they come from this first step, where the compiler can't properly separate out a line into known components. Each of these components is called a _token_.

The second step is to build up a representation of which variables are related to each other, into something called an [_abstract syntax tree_](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (or AST). In our previous example, this representation would show the hierarchy of how `in` is being multiplied by `6`, and how that result must be added with `5` divided by another variable named `in2`, and how that whole thing gets stored into a variable named `out`.

The advantage of generating this intermediate representation is having the ability to further understand how each element of code is related to each other. It is the representation that makes it easy to identify when variables haven't been declared properly (or were misspelled), when variables are read before they are written to, or when code statements don't actually have any effect on program execution.

After generating and analyzing the AST, the compiler can finally start to generate assembly instructions. Memory locations for variables are laid out as needed, appropriate assembly functions are chosen to perform the associations described by the tree.

The _exact_ specifics, of course, will vary language to language, and compiler to compiler. Digging into the specifics of how a particular version of a particular compiler is academically interesting, but actually violates the intent - the Compiler is a tool to be trusted to take your C code, and turn it into executable files. You can always deconstruction what happened if you need to, but generally you won't need to do that! 

### Examples

Still though, let's dig into a few examples concretely of how this would play out. We'll be doing things simply enough such that we won't be simmulating the full compiler process, but jumping straight to assembly code.

#### Variables and Math

Let's take a super simple example. In C code:

```c
int output = 5;
int input1 = 25;
int input2 = 43;

void main(void){
    output = input1 + input2*5;
    return;
}
```

This super trivial program calculates a new value for the variable `output`. It's good that all the variables we're using are declared, and the program is free of syntax errors.

To get something like this in assembly code, we'll need a few things:

1. Three memory addresses to hold our three variables
2. A segment of code to implement the `main()` function
3. Assembly instructions that work from the _inside outward_ on our one line of code that does real computation.

Since this is pretty straightforward, let's just jump right in!

```nasm
section .text

_main:
    mov  EAX, [input2]   ; Load the inner-most input
    imul EAX, 5          ; perform input2*5
    add  EAX, [input1]   ; add input1 to that result
    mov  [output], EAX   ; move the full calculation out to the output variable

    ; We are done executing - return control to the operating system
    retn 

; ----------------------------------------------------------------------------
; Global Variables

section .data
    output      DD 5
    input1      DD 25
    input2      DD 43
```

#### If Statements

#### For Loop


## Next Steps - Where are we going?