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

C syntax also allows you to perform the basic boolean operations [we described earlier](link me!). Just like regular math, special symbols are reserved to indicate the operation.

  * `&&` performs the AND operation between two values
  * `||` performs the OR operation between  two values
    * `|` is the symbol on the key right below backspace, accessed when you hit shift.
  * `!` performs the NOT operation on a single value

All of these are called the "Logical" operators, since they treat their numbers like a single boolean value. The reason we say "treat" is because C doesn't have a dedicated "boolean" type - the best we can do is just use one byte (named `char`, as we will see later). Given these bite-sized variables, the value of `0` is treated as FALSE, while any other value is TRUE. As it turns out, these are the more commonly used set of boolean operators.

Lesser used, but worth a mention, are the _bitwise_ operators - they do the same boolean operation, but work bit-by-bit on the number. For example, the bitwise-NOT of `0b1100` is `0b0011` (note how each bit is flipped to the opposite value). Similarly, the bitwise-OR of `0b1100` and `0b0101` is `0b1101` (each bit in the first number OR'ed with the corresponding bit in the second number).

  * `&` performs the bitwise AND operation between two numbers
  * `|` performs the bitwise OR operation between two numbers
  * `~` performs the bitwise NOT on a number.

See examples of the usage of these things later on. The key for now - these operators provide ways of combining boolean values to create new boolean values.

##### Creating Boolean values from Numbers with Comparison

Just like in math that you've probably done in high school, there are a set of operators that will do comparison between two integer numbers to create boolean values. These operators do almost exactly what you would expect:

  * `>` and `>=` check if one number is greater than (or equal to) another number.
  * `<` and `<=` check if one number is less than (or equal to) another number.
  * `==` will check if two numbers are exactly equal
  * `!=` will check if two numbers are not equal

Note this distinction between the action of `=` and `==`, it's a very common thing that gets lots of new software developers. `=` performs _assignment_ - it takes one number and stores it into a memory address. `==` performs _comparison_ - it checks whether two numbers are equal or not, creating a boolean from the result.

#### Comments 

Some special statements are called *comments*. These are wrapped in special characters that tell the compiler to completely ignore the statement. The statement is only there to help human beings.

`// Some comments begin with two slashes`

`/* Others are between slash and star sequences */`

Put comments wherever you want to remember (or tell the next developer) what your code is doing. Use comments to describe the "why", and not the "what".

### Grouping

A flat list of instructions is just fine for a computer, but generally humans like to visually organize their code a bit more. Therefor, in most programming languages, _statements_ are grouped together into clumps called _blocks_ based on the functionality that is desired.

#### Blocks

A _block_ of code is simply a logical subset of statements which form one cohesive action, and are meant to be run together. _Which_ statements belong together and _why_ will be discussed in due time, but for now consider just that statements will be grouped into units called _blocks_.

C code uses the symbols `{` and `}` to mark the start and end of each block. By convention, the contents of the block are indented with whitespace by some amount (the author is a [strong advocate for 4 spaces](https://stackoverflow.blog/2017/06/15/developers-use-spaces-make-money-use-tabs/)).

```C
{
    //This is the start of a block

    //Here is some code
    var = 25*input;
    output = var & 0b00001111;

    //This is the end of a block of code.
}
```

Note that multiple blocks can be nested together:

```
{
    // start of outer block
  
    {
        // Inner block 1
    }
  
    {
        // Inner block 2
    }
  
    // end of outer block
}
```

Blocks are used to group pieces of code together to defining when certain parts of logic should be executed or skipped based on conditions (_conditional flow_), or for doing a chunk of code multiple times (_Releating Flow_).

#### Grouping for Conditional Flow

In C, you can use a set of statement as a prefix to a block, to define conditions on which the block should be run. The prefix statement must use some value or quantity that resolve to a boolean. Then, when the boolean is True, the block is executed. Otherwise, the block is skipped. 

The basic syntax for the prefix is `if(<condition>) { <code to execute> }`. For a more concrete example:

```C
int condition = TRUE;

if(condition){
  // This code will be run.
}

condition = FALSE;

if(condition){
  // Now this code will be skipped.
}
```

C also provides a few other tools for making more complex combinations of these if- blocks. The `else` statement is the alternative to `if` - when `if`'s condition is false, then the code for `else` is run instead. Concretely:


```C
int condition = TRUE;

if(condition){
  // This code will be run.
} else {
  // This code will be skipped.
}

condition = FALSE;

if(condition){
  // Now this code will be skipped.
} else {
  // and this code will be run.
}
```

There is one more construct, which allows you to stack many if statements together, if the conditions should be mutually exclusive (zero or one are true), or a priority is needed (if multiple conditions are true, only one is acted on). 

```C
int condition1 = TRUE;
int condition2 = TRUE;

if(condition1){
  // This code will be run.
} else if(condition2){
  // This code will be skipped, since we "hit" the condition1 statement first.  
} else {
  // This code will be skipped.
}

condition1 = FALSE;
condition2 = TRUE;

if(condition1){
  // This code will be skipped
} else if(condition2){
  // This code will be run
} else {
  // This code will be skipped.
}
```

As we go forward we will see more and more practical examples of this usage, so don't worry too much about understanding the nuance and memorizing it now. Just keep in mind that there is a construct that uses `if` to control if certain pieces of code get executed or not!

#### Grouping for Repeating Flow

The other common usage for grouping blocks of statements is for when you want to have a chunk of code repeat many times over and over. Admittedly this is less common for robots, but still happens. As a simple example, say you had 20 numbers you wanted to print to the screen - using loops, you can use the same print code many times, minimizing the amount of copy/paste or rewrite work you have to do.

A block of code which is run many times over and over is called a _loop_. There are two main types of loops available in C. 

The _while_ loop repeats a chunk of code so long as a condition is TRUE. The syntax used in C is `while(<condition>) { <code to repeat> }`. In a more concrete example:

```C
int condition = TRUE;
int counter = 0;

while(condition){
  //Code to repeat
  if(counter >= 10){
    condition = FALSE;
  } else {
    counter++;
  }
}
```

If you trace the code execution, you should see that the code on the inside of the while loop runs until our counter is 10 or larger. THe counter starts at 0, and gets incremented every loop until we exit.

The condition of `counter >= 10` is referred to as the _terminal condition_ of the loop - it's the condition which triggers the loop to stop running, and allows execution to continue past the final `}` of the block.

Now, of course, `condition` doesn't have to be tied to a fixed number of loops - it could be some event on the robot (like receiving a packet over ethernet) or user interaction (driver pushes a button), for example. But for when you are looking to run for a set number of loops, there is a syntax which allows expressing it more concisely.

Enter the _for_ loop in C. It looks way more complex than it actually is. For loops are used when you know the exact number of times you want to iterate, rather than simply _wait_ for some external event (for an unknown duration).

Just like _while_ loops, _for_ loops cause a block of code to get executed many times. The prefix to that block has extra syntax to provide a concise way of describing how long you will loop for. 

This syntax is `for(<init action>; <loop condition>; <loop action>){ <Code to be executed> }`. THe Init action is simply a statement to be done right before starting the loop, and the loop action is a statement to be run at the end of the loop.

99% of the time, _for_ loops will be written something like this:

```C


```

#### Grouping for Delegating Functionality

## Building Code into Assembly Instructions

### The Instruction Set

### Examples

#### Working with Local Variables

#### Working with Global Variables

#### If Statement 

#### For Loop

#### Boolean Values

A very common use-case of the bitwise operators is forcing a single bit to 1 or to 0 in a number. For example:

```C
//Force the least-signifigant bit of value to 0, but leave the rest untouched.
value = value & 0b11111110;
//Force the least-signifigant bit of value to 1, but leave the rest untouched.
value = value | 0b00000001;
```

Another usecase is to check if a particular bit is 1 or 0:
```C
// Check if the most-signifigant bit is set to 1
bit_is_set = value & 0b10000000;
if(bit_is_set){
  // bit was 1
} else {
  // bit was 0
}
```

In this example, the constant `0b10000000` is referred to as the "bitmask" since it masks off all bits except the first one (aka forces the to 0). This way, if the top bit is zero, `bit_is_set` will be non-zero, and can be used in the `if()` statement to change the action of the program.

## Next Steps - Where are we going?
