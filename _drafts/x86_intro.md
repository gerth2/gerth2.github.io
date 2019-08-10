---
layout: post
title:  "x86 Assembly Introduction"
date:   2019-08-08 09:30:40 -0500
categories: blog_posts
---

_"It is well-known that the x86 instruction set is baroque, overcomplicated, and redundantly redundant." - [Stephen Dolan](https://github.com/stedolan)_

## Introduction

In our grand arc of introductory topics, this sadly is nearing the end.

We now most of the basic required components to analyze how a high-level C code program can get translated into 1's and 0's on a processor. One last piece of the puzzle - we'll introduce a particular assembly language - x86 - and then show how C code constructs are implemented using the assembly language. 

## x86

*x86* (pronounced "ecks - eighty - six") is the name for one of the most ubiquitous processor architectures in the world today. x86 is very old, dating back to some of the initial processors that Intel manufactured. Intel has been very rigirous about keeping it backward compatible, so the full specification carries most of the legacy functionality of processors manufactured 20 to 30 years ago. THis makes the full specification around 2900 pages long - not exactly light reading.

When learning about x86, it's better to start not with the actual documentation, but one of [the many helpful guides](https://www.cs.virginia.edu/~evans/cs216/guides/x86.html) out there. [Here is another good one.](https://en.wikibooks.org/wiki/X86_Assembly/X86_Architecture)

### The Basics

In order to introduce how your C code gets executed on a processor, we're going to start by a basic overview of how programming in x86 assembly works.

As a basic review, recall that when we write assembly code, there is a _one for one_ mapping from assembly instructions to bits that go into and out of the processor. Whenever we describe some particular _assembly instruction_ in this post, just remember that you can go straight from that to bits.

_Which bits_ is described within the [x86 software developer's reference manual](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-instruction-set-reference-manual-325383.pdf). This behemoth of documentation describes, in great detail, the operation of every assembly instruction, and how to encode it into bits. Diagrams like this one explain the mapping:

![Intel instruction set bit format](/assets/intel_inst_format.png)

Which, as you are probably guessing, is not the most straightforward of methodologies. It's totally feasable to figure out though, but that figuring will be left as an exerices to the user. It's all there in that manual though, I promise.

Again though, at least for the sake of this post, keep in mind that given an assembly instruction, you can get bits which go into a processor. All such that we can define what the starting layout of 1's and 0's in our RAM looks like:

![Control Unit RAM](/assets/controlUnitMemoryLayout.png)

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

We'll now attempt to describe the General Purpose registers of interest to us in x86 processor architecture.

![Control Unit GPRs](/assets/controlUnitRegisters.png)

Accessing memory addresses can be slow, so for rapid access of heavily-manipulated values, it's common place to use a _general purpose_ register to store the quantity. Physically located close to the center of the processor and implemented with high-speed circuitry, these registers are limited in quantity but abundant in speed and capiability. Additionally, some assembly instructions can only work with certain registers, so it's required to populate the register first before running the restricted assembly instruction.

There are a lof these on the x86 architecture, but there's just a handful we'll focus on for now. Their names are:

1. `EAX`
2. `EBX`
3. `ECX`
4. `EDX`

These four in particular can be used to store pretty much whatever values you want. Other registers have more restrictions, but these are the most general-purpose of all the general-purpose registers.

#### Memory and Register Transfer

To do anything useful, we'll first want to know how to assign and move data values around in the processor.

![Control Unit Memory Operations](/assets/controlUnitMemoryOps.png)

`mov` is the first assembly instruction we will cover. `mov` stands for _move_. It's the true workhorse of the x86 assembly language. [^1] It's primary job - move values from one place to another. Fundamentally the syntax is:

`mov <dst> <src>`

It can move constant values into registers or memory, move between registers, or move between registers and memory:
```nasm
{% include_relative _samples/sample_mov_asm/sample.asm %}
```

Note due to hardware restrictions, direct memory-to-memory moves are not allowed. You have to store in a register first.

Similarly to before, `.text` is a marker to indicate the things which come next are code to be executed.

We've also introduced a special label `_main` to tell the compiler exactly where our code begins. This is required for running this on Windows, so Windows knows how to place our bits into RAM such that they will be executed.

Finally, the final `retn` instruction is how we say our code is done. It _returns_ from the main function, which returns control to the operating system to clean up as needed and do something else. If you had no operating system, you might use `hlt` to actually halt the processor.

After all this, we can assemble, link, and run the code. Using a special tool (called a debugger), we inspect the results of the registers after our code is run and see the result:

![Code run result](/assets/sample_mov_asm_run_result.png)

As expected, our variables and registers got updated as promised in the comments! Our new unused variable friend `myBeefVariable` remains as it was when we started.


#### Math And Logic

Moving values from here to there is all well and good, but we generally also want to do math on those values.

![Control Unit Math](/assets/controlUnitMath.png)

Fortunately, x86 provides a wide array of math operations for us to choose from. These include, but are not limited to:

1. `add` and `sub` - Adds or Subtracts two values
2. `imul` and `idiv` - performs integer multiplication or division on two values
3. `and`, `or`, `not` - performs bit-wise boolean operations on one or two values.

There are many more, some involving floating point numbers. While super useful they're beyond the scope of this discussion.

Usually these take two or three operands - `<operation> <input1> <inputs2>`. Here, _operation_ is performed on _input1_ and _input2_, and the result gets stored back into _input1_. This is convenient if you are keeping a running total of something, and just requires an extra `mov` if your destination is different than the inputs.

For example, to add `eax` and `ebx` together, and store the result into `ecx`, you would provide the assembly code:

```nasm
mov ECX, EAX  ; Copy first operand into the output location
add ECX, EBX  ; Add the value in ECX (same as EAX) to EBX, storing back into ECX
```

`sub` works very similarly. As a worked example:

```nasm
{% include_relative _samples/sample_math_asm/sample.asm %}
```

True to the comments, add and subtract operations put the results into `ECX` and `EDX`.

![Code run result](/assets/sample_math_asm_run_result.png)

Similarly, we can do bitwise logic operations on values. Instructions like `and`, `or`, and `not` do exactly what you'd expect, and follow very similar formatting to our math instruction friends. Yet another worked example of their operation:

```nasm
{% include_relative _samples/sample_logic_asm/sample.asm %}
```

The bitwise action performs the corresponding logic operation on the two numbers, one bit at a time, never inter-mixing the bits. Despite how painful it is to look at theses 32-bit sequences, the results are what you'd expect:

![Code run result](/assets/sample_logic_asm_run_result.png)



#### Conditional Execution

So far our code is very linear in execution - we start at the top, execute all instructions in order, and then we are done. However, to actually make decisions and be more than a glorified calculator, we need to be able to tell the processor to skip or repeat instructions. This functionality is accomplished by the paired set of operations - _Compare_ and _jump_.

`cmp`, or _Compare_, is probably the easiest to understand. It takes two inputs, and compares them! In x86, the result of the comparison is stored in a very special register that is called the _EFLAGS_ register. On our diagram for processor architecture, we had a "P/N/Z" register that served the same purpose. It is just a set of bits to indicate if the previous operation resulted in overflow or underflow, a positive or negative result, a zero or non-zero result, and a number of other things. 

Since `cmp` sets the _EFLAGS_ register, we can call a _Jump_ right after it to use the result.

_Jump_ comes in many different flavors, but all do the same thing - they alter the value of the next-address to be decoded as an instruction. By interrupting the normal "add-one-to-instruction-register" behavior of the processor, it enables you (the user) to change the order of execution.

![Compare and jum processor data flow](/assets/controlUnitCompareJump.png)


The instruction `jmp` itself is called an _unconditional jump_ - no matter what _EFLAGS_ is set to, it will always go to the provided memory address. For example, consider the following:

```nasm
_countBeverage:
    add [numBottlesBeverageOnWall], 0x01  ; put one additional bottle of beverage on the wall
    jmp _countBeverage                    ; do it again.

; ??? ummmmm when do we end?

section .data
    numBottlesBeverageOnWall      DD 0x0 ; Zero beverage to start.
```

Like that annoying singing brother in the car ride, this code just keeps counting the number of bottles of beverage on the wall. Maybe this is what you wanted to do - doom your machine to an eternity of counting. But, let's say we want to do something a bit more meaningful....

The other flavors of Jump use the value in _EFLAGS_ to _conditionally_ go to the provided memory address. If the condition is not met, the usual "add-one" behavior is kept. The most common flavors are:

1. `je` - Jump if Equal
2. `jne` - Jump if not Equal
3. `jl` - Jump if less than
4. `jle` - Jump if less than or equal to
5. `jg` - Jump if greater than
6. `jge` - Jump if greater than or equal to

Obviously there's some redundancy here, but it does let your assembly code be more intuitive to look at.

To show how to use these, let's do a bit of a contrived, but still useful, example. We'll load numbers into `EAX` and `EBX` and compare them. Based on the outcome of the result, we'll set `ECX` - using (very convinenetly) `0x0A` for "`EAX` bigger", `0x0B` for "`EBX` bigger", and `0xAB` for "`EAX` equals `EBX`". 

```nasm
{% include_relative _samples/sample_jmp_asm/sample.asm %}
```

Running this produces the expected output - since $$ 5 > 2 $$, we expect `0x0A` in `ECX`, and that's what we get:

![Code run result](/assets/sample_jmp_asm_run_result.png)

Also as you'd expect - if you tweak the initial values of `EAX` and `EBX`, you get different results in `ECX`:

![Code run result](/assets/sample_jmp_asm_run_result_b_greater.png)

![Code run result](/assets/sample_jmp_asm_run_result_eq.png)

A couple things of interest in this example: Note that `jmp` or its flavors do _not_ set _EFLAGS_, so you can do a "chain" of jump instructions after one cmp instruction as above. Based off of just that one comparison, we branch off to the most-appropriate of the three subsections for manipulating `ECX`.

Also note that at the end of each small "chunk" where `ECX` is set, we have an unconditional `jmp` down to `_done`. Remember that without `jmp` calls, assembly instructions happen one after another. The assembler doesn't know (or care) that we divided our code up with different labels like `_a_big` or `_b_big` - it just goes through instructions one after another. Without unconditional `jmp _done` instructions, we'd potentailyl be setting `ECX` multiple times, which would be incorrect.

However, the astute reader may be saying "Hey, one of those isn't actually needed!" and you're 100% right. In `_same`, the last `jmp _done` instruction is totally unnecessary from a functionality point of view.

This chunk of code:
```nasm
_same:
    mov ECX, 0xAB
    jmp _done
_done:
    retn 
```

Is functionally the exact same thing as:
```nasm
_same:
    mov ECX, 0xAB
_done:
    retn 
```

Because jumping to the next instruction is, well, exactly what the processor does by default.

**HOWEVER**. A key component of "good" code usually is _consistency_. If you have three chunks of code that are _supposed_ to do similar things, you should make them _look_ very similar. Even if it works just fine, removing that `jmp _done` line forces the next person looking at your code to stop and think "Wait, why is this one different? Is that OK? Is this actually a bug?" and then a little while later come to the same conclusion as the original author did that, no, this still works fine. But, that was just some time that was wasted. Obviously, in a small case like this, it's pretty easy to see and prove the equivalency. But, as you write more and more (and bigger and bigger) code, making a similar determination is not nearly as trivial. Best practice is to keep similar things as similar as possible.

Finally. It should be noted that lots of other instructions set the _EFLAGS_ register - most math and logic operations, actually. Always check the manual. However, you can use this to skip the `cmp` instruction sometimes. Doing so will produce smaller and faster code, though sometimes at the loss of readability.... sometimes. Buyer beware.


## What We Skipped

Stack, CALL, RET

## Next Steps - Where are we going?



[^1]: When I say workhorse, I really do mean it works hard, and can do a lot! Turns out, [`mov` by itself is _Turing Complete_](https://youtu.be/R7EEoWg6Ekk?t=39). That's right, you could build a computer that only know how to do `mov`, or limit yourself to only using `mov`, and still be able to _compute anything you want to_. And even more so, [_someone did it_](https://github.com/xoreaxeaxeax/movfuscator). Seriously, this is one of my favorite exercises in all of computer science, just for its simultaneous absurdity and technical prowess. The video is long, but actually worthwhile, and totally approachable to someone who has kept pace with this blog thus far!