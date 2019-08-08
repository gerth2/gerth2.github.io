---
layout: post
title:  "Compiling C to Assembly"
date:   2019-07-27 09:30:40 -0500
categories: blog_posts
---


## Introduction

In our grand arc of introductory topics, this sadly is nearing the end.

We now most of the basic required components to analyze how a high-level C code program can get translated into 1's and 0's on a processor. One last piece of the puzzle - we'll introduce a particular assembly language - x86 - and then show how C code constructs are implemented using the assembly language. 

## x86

*x86* (pronounced "ecks - eighty - six") is the name for one of the most ubiquitous processor architectures in the world today. x86 is very old, dating back to some of the initial processors that Intel manufactured. Intel has been very rigirous about keeping it backward compatible, so the full specification carries most of the legacy functionality of processors manufactured 20 to 30 years ago. THis makes the full specification around 2900 pages long - not exactly light reading.

When learning about x86, it's better to start not with the actual documentation, but one of [the many helpful guides](https://www.cs.virginia.edu/~evans/cs216/guides/x86.html) out there. [Here is another good one.](https://en.wikibooks.org/wiki/X86_Assembly/X86_Architecture)

### The Basics

In order to introduce how your C code gets executed on a processor, we're going to start by a basic overview of how programming in x86 assembly works.

As a basic review, recall that when we write assembly code, there is a _one for one_ mapping from assembly instructions to bits that go into and out of the processor. Whenever we describe some particular _assembly instruction_ in this post, just remember that you can go straight from that to bits.

_Which bits_ is described within the [x86 software developer's reference manual](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-instruction-set-reference-manual-325383.pdf). This behemoth if documentation describes, in great detail, the operation of every assembly instruction, and how to encode it into bits. Diagrams like this one explain the mapping:

![Intel instruction set bit format](/assets/intel_inst_format.png)

Which, as you are probably guessing, is not the most straightforward of methodologies. It's totally feasable to figure out though, but that figuring will be left as an exerices to the user. It's all there in that manual though, I promise.

Again though, at least for the sake of this post, keep in mind that given an assembly instruction, you can get bits which go into a processor.

When writing assembly code, what you are really doing is defining the bits that will go into memory as the _stored program_, eventually executed by a processor. Once you have the right set of bits, you just have to load them into memory at just the right spot, then fire up the processor. It will pick the first address, and start running your program from the beginning. 

_How_ these instructions are loaded into Memory will have to be a future post, as it's beyond the scope of this discussion. For now, I promise, there _is_ a way to make it happen, and it does happen.

#### Setting Aside Memory for Storage

In addition to the actual instructions to run, you'll also generally want to reserve memory locations to store values. Here's a brief hint of where we're going - remember variables from C syntax? Any time you have a variable, you'll need some memory to store it. When writing x86 assembly, you can mark off a sets of bits for usage as variables:

```nasm
.data
myVariable  DB 42
myOtherVariable DW 25
```

The `.data` directive tells the assembler that the things which follow are memory locations for variables, not code. The name of the variable comes first, followed by some string like `DB` or `DW` to indicate _how many_ bytes the variable occupies. `DB` is one byte, `DW` is two, `DD` is four... others exist. The final thing can be optional, and dictates what the memory is to be set to prior to any code running. In this case, `myVariable` gets set to [The Answer to the Ultimate Question of Life, the Universe, and Everything](https://en.wikipedia.org/wiki/Phrases_from_The_Hitchhiker%27s_Guide_to_the_Galaxy#Answer_to_the_Ultimate_Question_of_Life,_the_Universe,_and_Everything_(42)), while `myOtherVariable` gets set to 25.

It's worthwhile to note that when working with these labeled memory locations, the name (eg, `myVariable`) refers to the actual memory _address_, while putting it in brackets (eg, `[myVariable]`) refers to the _value at that address_. When working with instructions, sometimes the assembly instruction needs a memory address, and other times it needs a value. Use each form as needed.

As in all programming languages worth their salt, it is also possible to write comments in your assembly code.

```nasm
;---------------------------------------------------
; Herp Derp this is where the global variables go!
; Aren't comments the best?
;---------------------------------------------------
.data
myVariable  DB 42
myOtherVariable DW 25
```

#### Registers

Accessing memory addresses can be slow, so for rapid access of heavily-manipulated values, it's common place to use a _general purpose_ register to store the quantity. Physically located close to the center of the processor and implemented with high-speed circuitry, these registers are limited in quantity but abundant in speed and capiability. Additionally, some assembly instructions can only work with certain registers, so it's required to populate the register first before running the restricted assembly instruction.

There are a lof these on the x86 architecture, but there's just a handful we'll focus on for now. Their names are:

1. `EAX`
2. `EBX`
3. `ECX`
4. `EDX`

These four in particular can be used to store pretty much whatever values you want. Other registers have more restrictions, but these are the most general-purpose of all the general-purpose registers.

#### Memory and Register Transfer

`mov` is the first assembly instruction we will cover. `mov` stands for _move_. It's the true workhorse of the x86 assembly language. [^1] It's primary job - move values from one place to another. Fundamentally the syntax is:

`mov <dst> <src>`

It can move constant values into registers or memory, move between registers, or move between registers and memory:
```nasm
{% include_relative _samples/sample_1_asm/sample_1.asm %}
```

Note due to hardware restrictions, direct memory-to-memory moves are not allowed. You have to store in a register first.

Similarly to before, `.text` is a marker to indicate the things which come next are code to be executed.

We've also introduced a special label `_main` to tell the compiler exactly where our code begins. This is required for running this on Windows, so Windows knows how to place our bits into RAM such that they will be executed.

Finally, the final `retn` instruction is how we say our code is done. It _returns_ from the main function, which returns control to the operating system to clean up as needed and do something else. If you had no operating system, you might use `hlt` to actually halt the processor.

After all this, we can assemble, link, and run the code. Using a special tool (called a debugger), we inspect the results of the registers after our code is run and see the result:

![Code run result](/assets/sample_1_asm_run_result.png)

As expected, our variables and registers got updated as promised in the comments! Our new unused variable friend `myBeefVariable` remains as it was when we started.



#### Math And Logic

Moving values from here to there is all well and good, but we generally also want to do math on those values.

ADD SUB AND OR NOT IMUL IDIV

#### Conditional Execution

CMP, JMP, JE, JNE, etc.

## C code to x86

### Basics of the Compilation Process

### Examples

#### Variables and Math

#### If Statements

#### For Loop

## x86 - What We Skipped

Stack, CALL, RET



[^1]: When I say workhorse, I really do mean it works hard, and can do a lot! Turns out, [`mov` by itself is _Turing Complete_](https://www.youtube.com/watch?v=R7EEoWg6Ekk). That's right, you could build a computer that only know how to do `mov`, or limit yourself to only using `mov`, and still be able to _compute anything you want to_. And even more so, [_someone did it_](https://github.com/xoreaxeaxeax/movfuscator). Seriously, this is one of my favorite exercises in all of computer science, just for its simultaneous absurdity and technical prowess. The video is long, but actually worthwhile, and totally approachable to someone who has kept pace with this blog thus far!