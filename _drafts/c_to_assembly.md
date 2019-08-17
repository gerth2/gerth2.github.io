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

`If` statements get a bit more complex. One basic strategy is to compute the condition on the inside of the `()`'s, then use `cmp`/`jmp` to go to different sections of code. Choose a flavor of `jmp` to match the condition. Finally, use unconditional `jmp`'s to "rejoin" code after execution has completed.

```c
int output = 5;
int input1 = 25;
int input2 = 43;

void main(void){
    if(input1 > input2){
        output = 7;
    } else {
        output = output * 2;
    }
    output = output + 5;
    return;
}
```

Similar to above, we create global variables, and produce some reasonable-looking assembly instructions:

```nasm
section .text

_main:
    mov  EAX, [input1]   ; Load the inputs
    mov  EBX, [input2]   

    cmp EAX, EBX         ; Run comparison operation
    jle _else_start      ; Jump to else if condition is not satisfied

_if_start:
    mov ECX, 7
    jmp _after_if

_else_start:
    mov ECX, [output]
    imul ECX, 2

_after_if:
    add ECX, 5
    mov [output], ECX

    ; We are done executing - return control to the operating system
    retn 

; ----------------------------------------------------------------------------
; Global Variables

section .data
    output      DD 5
    input1      DD 25
    input2      DD 43
```

There are a few interesting things to note here. 

Since we have a limited number of variables, we make the assumption that `EAX` will correspond to `input1`, `EBX` will correspond to `input2`, and `ECX` will correspond to `output`. Before using the registers we load them from their global variables, and then move back to memory at the very end.

Note that even though in C code we compare if `input1` is _greater_ than `input2`, in assembly we use a `jle` - or _jump if less than or equal to_. This is because we chose to check the _opposite_ of the C code condition, and jump to the _else_ statement. We also could have done the comparison more akin to the C code:

```nasm
_main:
    ...

    cmp EAX, EBX         ; Run comparison operation
    jg  _if_start
    jmp _else_start

_if_start:
    ...

_else_start:
    ...
```

However, this requires two assembly instructions, so it's a slightly larger program. Most compilers are capable of generating code both ways, and allow you to tell it "optimize for speed" or "optimize for program size", and it will choose between options like these to best fit your needs.

Note that `output` actually acts as an input of sorts, in the body of the `else` statement. Therefor, in the assembly code, we can _delay_ loading `ECX` from memory until we know for sure we need it - this helps prevent unnecessary operations. 

Note also the lack of a `jmp` at the end of section `_else_start`. It's not needed, since the next operation is always the `_after_if` statement. We can save a tiny bit of memory by not putting it in, as the processor will do the right thing without it naturally.


#### For Loop

A `for` loop is more or less a combination of the IF statement, with a bit of creative jumping. Take for example this simple C code:

```c
int output = 0;
int input1 = 25;
int iter = 0;

void main(void){
    for(iter = 0; iter < input1; iter++){
        output += input1;
    }
    return;
}
```

In yet another contrived example, we take some input value (25 here), and for that many loops, add the input into some other variable called `output`. After `input1` loops, we are done. In assembly, the compiler will have to add the logic of checking "if done", jumping _back_ in time if needed to repeat the code. The assembly code could produce something like this:


```nasm
section .text

_main:
    mov  EAX, [input1]   ; Load the inputs. EAX will hold input1
    mov  EBX, [iter]     ; EBX will hold our value for iter
    mov  ECX, [output]   ; ECX will hold our value for output.

    mov EBX, 0           ; Perform Loop startup code, "iter=0"

_loop_check:
    cmp EBX, EAX         ; Run comparison operation
    jl _loop_body_start  ; if iter < input1, run a loop
    jmp _loop_body_end   ; Otherwise, we are done. Skip past the loop body to the end

_loop_body_start:
    add ECX, EAX         ; Run the loop body code. In our case, this is just "output += input1" 

    add EBX, 1           ; Perform the loop iteration code, "iter++"
    jmp _loop_check      ; Go back up to check the iteration condition

_loop_body_end:

    mov [output], ECX    ; Return the newly calcualted values to their memory locations
    mov [iter], EBX

    ; We are done executing - return control to the operating system
    retn 

; ----------------------------------------------------------------------------
; Global Variables

section .data
    output      DD 0
    input1      DD 25
    iter        DD 0
```



## Notes

It should be strongly noted that the examples here are for demonstration purposes only - they show _one_ possible way to translate _specific examples_ of higher-level language (C) into a lower level language (x86 asm). More experienced readers may observe that I've casually skirted concepts like local variables, the .bss segment, function calls, debugging symbols, optimization, not-always-storing-variables-in-registers, and a whole host of other compiler-related topics that are relevant if you want to write your own compiler. However, though that may be a post one day, it's not the purpose of this post. 

All a reader should walk away with is a simple understanding - Higher level languages _can_ be translated to lower level languages. The syntax of each language defines the constraints on how such a translation will happen, which in turn is what drives the rules on why we write programs the way we do.

## Conclusion

And this, sadly, is the end of our inital training. We've walked ourselves all the way from base physics and math principles, up through the way that boolean logic can be used to perform useful computation, and how circuits can implement that logic and store data. We've looked at how to assemble the circuitry into a useful architecture, which can store and execute instructions. And finally, we've looked at how the high level languages we are familiar with get translated into those instructions. It is indeed a lot of information, and you shoudl be proud that you have made it to this point.

But, the work is not yet complete! Expect many more blog posts. We have so much more to discuss about software - both the hard technical skills, and the soft skills of working on a software development team.

Stay tuned for many more. And until next time, happy coding!

## Next Steps - Where are we going?

To be honest, I am no sure yet. Maybe go get yourself some food. 

If you're not hungry, go back to the home page and find another blog post!