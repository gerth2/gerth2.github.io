---
layout: post
title:  "Programming Languages"
date:   2019-07-23 9:30:40 -0500
categories: blog_posts
---

*Let us change our traditional attitude to the construction of programs. Instead of imagining that our main task is to instruct a computer what to do, let us concentrate rather on explaining to human beings what we want a computer to do.  - [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth)*


## Introduction

This post marks our first "pure" venture into the world of software. For most of the readers of this blog, I'm assuming you have some casual familiarity with how to write software. But even if not, don't worry - we're going to go through the basics, again using a ground-up format to explain how computer programs are put together.

### On our Selection of Introductory Languages

#### The Options

In FRC land, there are a handful of different programming languages that are commonly supported. Labview is in its own special class. Aside from this, the big players are Java and C++, followed by Python and Kotlin. These are all powerful, professional, and (relatively) modern programming languages, each rich with its own features and quirks. For *FRC* purposes, any of them make a fine choice for writing robot software.

It should be noted that [people have opinions](https://www.chiefdelphi.com/t/c-or-java/358070) on the selection of programming languages.

#### The Choice

In order to do the ground-up approach properly, we're going to not start with any of these languages, but rather with pure C. This will simplify the connection between how bits are manipulated on a processor, and the actual code we write.  Additionally, once you understand the concepts of how C is put together, it becomes easy to see how the additional features provided by C++, Kotlin, Java, or Python could be implemented in C. 

In this way, by focusing on an understanding of how C code works on a processor, we provide a pathway for understanding how _any_ programming language works on a processor.

### High Level vs. Low Level

When describing programming languages, we've already used the description *high level*. As you'd probably expect, *low level* is also a description. Loosely, these terms describe "how close to the actual silicon of the processor are you?". Closeness here refers to the number of layers of abstraction formally defined between the thing you are typing out on a keyboard, and the logic gates doing useful things in response to your typing.

The literal 1's and 0's going through your processor is probably the lowest level way to write a program. The people who truly believe this is the best way to write software are either dead, or literally crazy.

![expert keyboard](/assets/supercoder2000.jpg)

*source - reddit.com*

Just barely one step up, we can represent these 1's and 0's with much more useful pneumonics, like ADD (addition), SUB (subtract), MOV (move), LD (load), ST (store), etc. Rather than forcing a human to remember that $$0010001010011$$ means "Add general purpose register 1 to general purpose register 2 and store the result in general purpose register 3", we simply by writing something like **ADD R1 R2 R3**. Isn't that better than staring at $$0010001010011$$? I think so. This abstraction to pneumonics is called *assembly code*.

Depending on the application, it still makes sense to write code at this level. When you need very fast code, very efficient code, or very very precise code for working with specialized hardware, assembly is your go-to solution. And, if you know the hardware well, it's admittedly not bad. Chris Sawyer wrote multiple video games using it [nearly](https://en.wikipedia.org/wiki/RollerCoaster_Tycoon_(video_game)) [exclusively](https://en.wikipedia.org/wiki/RollerCoaster_Tycoon_2). People who like writing software here are still a special breed of folks, but not as crazy as the ones who have the ink on their 1 and 0 keys rubbed off from excessive usage.

For the rest of us folks, we usually use some sort of *high level* programming language. The official definition of a *High Level* programming language is simply one that attempts to abstract away the details of _exactly_ which assembly instructions are supported or needed, and hide them behind a more generalized way of describing desired behavior. The key advantage of doing this is that you can write one program, and rely on different compiler tools to take that same source code, and emit assembly instructions which can work on many different types of computers. This interoperability is a key driver in lots of the design of high level languages, but comes at a cost - it is harder to interact with specific details of the hardware you are on, and inherently less efficient to execute code.

It should be noted that you can always add more layers of abstraction. A language doesn't have to transform into assembly code - you can transfom between high level languages too. For example, MathWorks' *Simulink* is a graphical programming language, much like Labview, which can [have its block diagrams converted directly to C code](https://www.mathworks.com/help/dsp/ug/generate-c-code-from-simulink-model.html). In this way, you can say Simulink is a higher-level programming language than C. 

For specific use cases, there are other programming languages which can build into Simulink models.

![ogres are like onions](https://media.giphy.com/media/pyQV6sy5qOALu/giphy.gif)

The layers just keep going.

This is why large software projects often have to combine many programming languages together. Your ultimate goal is simply to describe to the computer what you want it to do. You always want your software development to take place at the highest-level that makes sense - this allows you to have to spend the least amount of time thinking about details that, at the end of the day, an automated tool could have done for you. Only get into the nitty-gritty when you have to. But when duty calls, don't be afraid to dive deep.

## The "C-like" Syntax

### History

[The C programming language](https://en.wikipedia.org/wiki/C_(programming_language)#History) is the OG of high level languages. It wasn't the first of its type, but it was by far the most successful. It struck just the right balance between providing nice high-level programming language abstractions, without getting so high level as to become convoluted and bloated with useless features.

It was introduced in the late 1970's, tightly tied with the development of the [Unix operating system](https://en.wikipedia.org/wiki/Unix) at [Bell Labs](https://en.wikipedia.org/wiki/Bell_Labs). The initial goal was to provide a high-level language for writing utilities for the OS. It evolved quickly to be the language that the operating system itself was written in.

The amazing thing is that as other languages have come and gone, C has remained the de-facto standard for anyone looking to write software with the highest performance, highest efficiency, or most hardware interaction. C++ and Rust are starting to supplant it in a few places, but C is still by far king for operating system and embedded system development. The fact any programming language has lasted these 40+ years is a true testament to good design.

It's worthwhile to note that many of the concepts C introduced in how a high-level language is to specify program behavior were inherited into other programming languages. For this reason, many languages are said to have "C-like syntax", meaning that the fundamental way you specify behavior follows lots of the same design patterns laid out by C. The lion's share of commonly used programming languages follow these patterns, so it seems to be a good place to start!

### Super Basics - What does a Programming Language have to Accomplish?

Any programming language's job is to bridge the worlds of human-readable description of behavior, to a machine-readable set of 1's and 0's that can flow through a processor. The *compiler* is the tool that actually does the action, and the language's *syntax* is the set of rules on the compiler input to allow the action to work. 

Remember the compiler itself is a program, and can't think creatively (or read your mind). The language *syntax* is the agreed-upon rules that you will use to communicate information with the compiler.

The syntax must be flexible enough to be Turing Complete, but constrained enough to not force the human to think about too many details. 

Good syntax design allows the programming language to describe all the calculations and logic required to establish a *relationship* between *inputs* and *outputs*. At the end of the day, that's really all your software on your robot has to do - map driver inputs, sensor inputs, and field state (teleop/auto) to motor and solenoid commands.

#### Abilities Common to all Programming Languages

To be useful, all programming languages have to have a few basic components:

  * Input & Output (IO)
    * Interacting with the “outside world”
  * Assignment
    * Storing and retrieving data from memory (aka Variables)
  * Math & Logic
    * Combining numbers and true/false conditions
  * Control flow
    * Using results of true/false conditions to control execution
    * Repeating instructions under certain conditions
  * Structural Organization
    * Functions, Classes, objects, source files, interfaces, templates, etc.

We will now look into the details of the syntax of the C programming language, to see how it implements these components to accomplish the goals of a high-level programming language.

### Storage of Source Code

C code source files are just plain-text, ASCII or utf8-encoded [text files](https://en.wikipedia.org/wiki/Text_file), which just happen to have extensions like `.c` or `.h`. They can be opened and edited by any text editor: [VS Code](https://code.visualstudio.com/), [Notepad++](https://notepad-plus-plus.org/), [VIM](https://www.vim.org/), [Emacs](https://www.gnu.org/software/emacs/), even the built-in Windows Notepad (not recommended). 

A word to the wise - choose a good text editor which knows about C code syntax, so it can properly [highlight different parts of each line](https://en.wikipedia.org/wiki/Syntax_highlighting). These visual cues are invaluable as a software developer to visualize the behavior of your code.

### C Code Statements & Their Components

Programs are fundamentally built up of a series individual statements. Each statement may contain directions to perform one or more of the common abilities of programming languages.

Every statement has some content, and is terminated by a semicolon (`;`). It's just like putting a period at the end of your sentences. We use semicolons instead of periods because some numbers have periods inside them (ex: `3.14159`), and using a unique symbol for unique meaning is easier than having to use the context around the symbol to determine meaning.

Here is an example of a simple statement:

`result = 3 + 5.7 * input;`

We will use this for reference as we go forward in the next few sections.

#### Constants

C syntax allows software writers to use numbers in statements. THese numbers can be simple integers, like `3` in the sample statement. They can also be fractional or *floating point* numbers, such `5.7` in the sample statement.

A single negative sign (`-`) in front of a number will of course make it negative - `-26` is an allowed constant.

#### Variables

C syntax also allows you to define names for memory locations. By using the name in a statement, the contents of that memory location will be used. Since a memory location can generally hold a range of numbers, these named memory locations act just like the variables in algebra. Therefor, we call them *variables*

In the statement above, `input` and `result` are both variables.

Note that C does not allow variables to simply come into existence and disappear at runtime - each variable that is required must be *declared* prior to usage. The precise manner in how you declare the variable will dictate how many bits are used to store values, whether the value is read/write or read-only, which portions of code are allowed to access the variable, and a whole slew of other properties.

#### Assignment

Once we have variables, we have to have a way to get information into them. In C code statements, the `=` equals sign character is used to perform an assignment operation. Assignment takes whatever is on the right-hand side of the `=`, and places it into the variable on the left-hand side. 

It's roughly equivalent to a "store" operation, rather than an expression of equality (more on that later). Think of it as memory movement - you do some calculation to get a number. Then, the equals sign indicates the calculation's result needs to be stored somewhere. The variable on the left hand side provides the memory address where the value is to be stored at.

In the sample statement above, the value calculated on the right-hand side of the `=` is being stored into the variable named `result` - and by this, we really mean the value is being put into the RAM memory bits associated with the variable `result`.

#### Operators

On the right-hand side of any `=` sign is a set of operations which perform the actual calculation of interest. C syntax reserves a set of characters for performing this calculation. There are a few broad categories of Operators.

##### Combining Numbers with Math

Some common math functions are implemented:

 * `+` adds the thing on the left and on the right of the symbol together
 * `*` multiplies the thing on the left and on the right of the symbol together
 * `-` subtracts the thing on right from the thing on the left of the symbol
 * `/` divides the thing on the left by the thing on the right of the symbol

In the example above, the statement says to first multiply the value stored in the variable `input` by `5.7`, then add `3` to the value. Finally, as already mentioned, that calculated value gets stored in `result`.

Normal order of operations does apply here (mult/div, then add/subtract). Parenthesis `( )` can be used to group operations if a different operation order is required.

For example, the statement `result = (3 + 5.7) * input;` simply multiplies `input` by `8.7`.

There are some "specialty" math functions that C also defines. These aren't strictly necessary, but provide useful shortcuts:

  * `variable++` will *change* the value stored in `variable` by adding 1 to it. This is called "incrementing" the variable.
  * `variable--` will *change* the value stored in `variable` by subtracting 1 from it. This is called "decrementing" the   variable.
    * Note `++` and `--` operators perform an *assignment* without an explicit `=`. This is different than other math operators.
  * The `%` symbol is called the *modulo* operator - it calculates the remainder after division. 
    * For example, `7 % 5` equals to 2 (since 7 divided by 5 is 1, remainder 2).

##### Combining Bits with Boolean Logic

C syntax also allows you to perform the basic boolean operations [we described earlier](link me!)

##### Creating Boolean values from Numbers with Comparison

#### Comments 

Some special statements are called *comments*. These are wrapped in special characters that tell the compiler to completely ignore the statement. The statement is only there to help human beings.

`// Some comments begin with two slashes`

`/* Others are between slash and star sequences */`

Put comments wherever you want to remember (or tell the next developer) what your code is doing. Use comments to describe the "why", and not the "what".


### Grouping

#### Blocks

#### Grouping for Conditional Flow

#### Grouping for Repeating Flow

#### Grouping for Delegating Functionality

## Building Code into Assembly Instructions

### The Instruction Set

### Examples

#### Working with Local Variables

#### Working with Global Variables

#### If Statement

#### For Loop

## Next Steps - Where are we going?
