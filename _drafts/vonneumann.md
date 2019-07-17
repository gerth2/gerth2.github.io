---
layout: post
title:  "Processor Architecture"
date:   2019-07-06 9:30:00 -0500
categories: blog_posts
---

## Introduction

Things are starting to get very real now. We've introduced a ton of topics in boolean logic - how to manipulate bits, store them, and use them to represent numbers. It's time to start digging into how all this comes together to build a real device which can do computation!

## History

Way back in the day, if you had a lot of math to do, you would hire a [human computer](https://en.wikipedia.org/wiki/Human_computer) - literally, a person whose job it was to do computations. You gave them a set of instructions as to what math to do, and they came back with a set of numbers. Not a glamorous job, but it did pay the bills. If you had big calculations to do, you'd hire lots of them and find ways to divide the work. If you wanted to ensure accuracy, you'd hire twice as many as needed and have them both independently solve the same problem (and check the results).

Obviously, there are some big limitations to this system. Humans make mistakes, grueling hours of arithmetic isn't exactly the most fun way to spend your work day, and there's only so fast that a human can do math. You can't take a big problem and subdivide it efficiently between a million people, as the complexity of re-combining the results starts to outweigh the benefits of doing work in parallel. Due to these limitations, and the ever-increasing scope of work, there was a need to expand the computing capability of the scientific community in general.

Toward the end of World War I and into World War II, there was an expanding notion of using machines to do rapid computation. The proximity to war-time meant a lot of the computation applications were, well, war-driven. [Cryptography](https://en.wikipedia.org/wiki/Enigma_machine), [attempting to break cryptography](https://en.wikipedia.org/wiki/Bomba_(cryptography)), calculating artillery trajectories, analyzing the feasibility of an atomic bomb.... Some simply calculated differential equations, but again the majority of the funding was pushed toward war-time effort.

These machines were quite large. Remember that the transistor had not yet been invented. The logic gates we have studied were conceptually still in use, but to implement them engineers had to use vacuum tubes or electro-mechanical switches. Additionally, the first machines were effectively hard-coded to do one single job. The government would come in and say "Johnson! We need a machine to help shoot shells at the enemy better! Here's the equations, figure it out!" And then Johnson would go wire up one machine to do the job, and come back with an answer, and then the machine would be useless. Well, not entirely useless. But still, to do a different job (or even just tweak the equations), you had to spend lots of time re-designing parts of the circuitry, have technicians come in and physically re-wire the thing, test it all out, and hope you didn't make any mistakes in the process. 

Given the need for speed in reprogramming, a group of engineers set out to design a machine which was much more easily reprogrammable. The quest was for a "general purpose" computer, which could do arbitrary computations as needed, and did not take a team of technicians to re-wire every time computational problem changed.

[Alan Turing](https://en.wikipedia.org/wiki/Alan_Turing) provided a key portion of the theoretical background for the general purpose computer. The ("Turing Machine")[https://en.wikipedia.org/wiki/Turing_machine] is a formal mathematical description of what sorts of devices can perform general computation. His papers show both what sorts of problems are "computable" (ie solved with an algorithm, acting only with numbers, math, and logic), and what criteria a machine must have to solve an arbitrary problem. This ability to solve an arbitrary problem is what makes a computer "general-purpose".

The classic demonstration of a simple Turing Machine involves a very large piece of magnetic tape, and a *Head* - a device capable of moving along the tape, with the ability to read and write information from defined locations on the tape. The simple implementation is still problem specific - the instructions for how it reads, writes, and moves are hard-coded into the specific Turing Machine. Turing himself showed the possibility of a ["Universal Turing Machine"](https://en.wikipedia.org/wiki/Universal_Turing_machine), which has a single programmed behavior to read the actual instructions from the tape itself. Therefor, the machine did not have to be changed, only the instructions stored in the tape. This is the basis of the "stored program" concept.

As-described, the actual turing machine is [not particularly practical to build](https://www.youtube.com/watch?v=FTSAiF9AHN4). It presumes a mechanical analogy, which fundamentally limits speed and size. Still, the theoretical background was required to provide the constraints on _how_ to hook up an electronic circuit such that the end result would ultimately solve the problem. Turing effectively provided the input constraints, and pass-fail criteria for the stored-program, general-purpose computer.

[John Von Neumann](https://en.wikipedia.org/wiki/John_von_Neumann) was another other major player in the early development of these stored-program computers. He is usually credited for leading the charge of transforming Turing's theoretical work into a practical implementation of a general-purpose computer. He was highly involved in the design and development of [EDVAC](https://en.wikipedia.org/wiki/EDVAC) and later [ENIAC](https://en.wikipedia.org/wiki/ENIAC), two of the first useful stored-program machines.

As a side note, both Turing and Von Neumann were crazy smart people, with scientific contributions well beyond the processor architecture we are studying.. Given all they did, its almost a disservice to think of them as the founders of the modern computer, as their influence in the scientific community was much broader.

### Stored Program

The "stored program" is really the key to unlocking programming efficiency and making computers general-purpose. A stored program is exactly what it sounds like. The program, or set of instructions for operation, is stored in a memory bank somewhere. 

This memory bank has to be purpose-designed to be easily manipulated. Data must be stored and retrieved at will, usually without direct human intervention (ie, no technician coming by to move wires).

A stored program machine has to have the ability to know where these instructions are at, read them, determine their meaning, and carry out that meaning. This adds a bit of complexity to the machine, but it's a one-time effort to add the complexity. It's also a bit slower - any stored program machine has to spend at least some of its time just determining what the next instruction is, rather than carrying out "useful" computations. Finally, stored-program will always be less optimized. Since it's not always possible to know exactly what the next set of instructions will be, it takes away some opportunities to optimize the speed & resource utilization of the algorithm.

For this reason, there are still many special-purpose computers out there - high speed network interfaces and graphics cards are two common examples. The need for speed outstrips the need for flexibility.

Still though, the stored-program, general purpose machine is the de-facto standard. Despite the potential limitations, it's still much better than the alternatives. Just remember how much effort it takes to wire your whole robot up. Now imagine software team had a bug, so the only way to fix it is to re-wire the whole thing. That wouldn't be fun. Stored program is the way to go.

## The Von Neumann Architecture

### Overall

Through his work, Von Neumann described a generic _architecture_ for how to construct and lay-out electronic components to fulfill Turing's requirements. This description has been coined the "Von Neumann Architecture". It should be noted that since almost all modern processors follow the architecture to some extent, the phrase "Von Neumann Architecture" actually refers more to the set of ideas, rather than one particular design.

Von Neumann divided his world up into four very-high-level components:

* **Memory** - A device capable of saving and recalling pieces of information.
  * Might be broken into multiple parts
    * Read-only vs. Read/Write
  * Roughly analogous to the "Tape" in the Turing Machine
* **Processor Unit** - A device capable of performing a calculation on pieces of information. 
  * Possible calculations:
    * Math (add subtract multiply divide etc.)
    * Logic (and or not)
    * Comparison (greater than, less than, equal to)
  * Roughly equivalent to the "Head" in the Turing Machine
* **Control Unit** - A device to provide coordination between all other units
  * Produces the control signals that configure all other units
  * Produces the _correct_ signals to implement the Universal Turing Machine 
* **IO** - A set of devices capable of transforming information between representations useful to computers, and representations useful to humans.
  * Screens, mice, keyboards, etc.
  * Implementation is device specific, but the key is that on one end is an interface that works well with the computer (bits and bytes), and on the other end is a physical thing a human can manipulate or sense.
  * In our Turing Machine association, this is just the way a human can manipulate or interact with the device or the tape.

#### Tri-State Buffer

Before we start digging into how Von Neumann specified these components should interact with each other, we will want to cover one more digital device. Actually, it's not _technically_ digital because sit has three states, but it's very commonly used.

The Tri-State buffer introduces a third state to our binary system [^1]: "Z". Z stands for ["High Impedance"](https://en.wikipedia.org/wiki/High_impedance), which (in this context) is an excessively formal way of saying "not plugged in".

![Tri state buffer symbol](/assets/triState.png)

| CTRL |  In  || Out |
|------|------||-----|
|   0  |   0  ||   Z |
|   0  |   1  ||   Z |
|   1  |   0  ||   0 |
|   1  |   1  ||   1 |

The device has two inputs - one for data (In) and one for controlling the state of the output (CTRL). When CTRL is 1, the input is passed straight to the output without alteration - basically, a *wire*.

When CTRL is 0, the output is forced to the Z "High impedance" state, effectively "unplugging" input from output. Basically, a *broken wire*.

The usefulness of such a device is that it enables us to physically connect multiple digital device outputs to the same physical wire, and select which one of them is _electrically connected_ to the wire. This selection ability means we can control which device dictates the binary 1/0 state of the bus.

![Tri state buffer Usage - C on the bus](/assets/triStateUsageSimple.png)

Here we see three digital devices with outputs linked. Since the buffer at the output of C has a control signal of 1, we know the final output will be the same as C. It can be said then that Digital Device C is controlling Output.

![Tri state buffer Usage - A on the bus](/assets/triStateUsageSimple2.png)

Similarly, we can setup A to control Output by turning off CTRL for C, and then turning on CTRL for A.

When you have a setup like this:
* The wire downstream of all of the tri-state buffers is referred to as the "Bus".
* When the tri-state buffer is active, the device is said to _assert_ its output onto the bus.
* When the tri-state buffer is active, the device is _active_ on the bus.

Obviously this is a 1-bit demonstration, but you can easily put 8, 32, or 64 of these together to make a bus that is one _word_ wide. The number of bits in a bus is its _width_.

As readers may have already noticed - only one device can assert its output onto the bus at the same time. If two devices attempt to assert onto the bus at the same time, and they assert different boolean values, you'll find yourself with a short circuit and magic smoke in no time. For this reason, the devices have to be coordinated somehow to ensure only one is active on the bus at a time.

### The System Data Bus

System Data bus is a common set of wires that transfers data from one device to another. At the core of the Von Neumann architecture is a data bus that is used by all components to transfer data back and forth. Each device has a set of tri-state buffers on its output so it can selectively take control of the bus, or allow some other device to assert its data. Additionally, each device has some ability to read the value from the bus, and pull it internally (to do something useful with it, presumably?).

![Basic system bus concept](/assets/systemBusBasic.png)

In this case we've chosen to draw a 32-bit wide bus (like most processors up till a few years ago had).

#### Register Load and Store

From previous, we know how to "gang" multiple D flip flops together to make what we call a "register", which can store one _word_'s worth of bits.

![4 bit register](/assets/register.png)

Since we started with a 32-bit bus, let's also keep 32 bits here.

Along with the system bus, imagine if each device is a slightly modified register. We'll go ahead and use the little circuit created as part of an alarm clock to put a mux on the input to the register. We'll also add our tri-state buffer output.

![useful Von Neumann architecture register](/assets/registerWithWriteEnable.png)

We have the addition of the "Write Enable" enable input to choose whether the register is to load a new value from the data input or preserve its previous value. The "Output Enable" signal allows us to choose whether the output is active or not, allowing this register to be placed as a device on a system data bus with other registers.

We can draw the following symbol for an abstraction of this device:

![32 bit register](/assets/32bitRegister.png)

These registers will make up the core of data storage on the processor, and will be a key component going forward.

To demonstrate how they are used, take as an example 3 registers sharing a 32-bit data bus:

![registers on a bus](/assets/registersOnABus.png)

We now have a system where we can systematically transfer data from one register to another. We have to have something coordinating the write & output enables for all of the registers together - however, assuming you do, it's actually quite easy to move data around now. 

Say you have a number in register A that you want to move to register C. Before the clock has a rising edge, you simply set register A's _Output Enable_ to 1, and register C's _Write Enable_ to 1 (and everything else to 0). Then, on the rising edge of the clock, the value from A will end up in register C, while B remains unchanged. 

We will notate this sort of transfer with a shorthand description:

$$A \rightarrow C$$

This simply indicates that on this particular clock cycle, we transfer the value from A into C. 

This is often called "Register Transfer Language", and is the basis of the way we'll describe how data gets transferred around in a processor. The key to remember is that behind every description of $$A \rightarrow C$$ or $$B \rightarrow A$$, it's just a set of enable bits getting set correctly, such that data flows from from the source to the destination.


### Processing Unit

Storing data is cool, but to do useful processing we have to, well, process the data. Back when we learned about boolean logic, we saw all sorts of ways to mash bits together. The goal now is to build a circuit which can do all the useful things for us.

The collection of circuitry which does the calculations is generally referred to as the _Arithmetic Logic Unit_, or ALU. It gets its own fancy-pants symbol that looks like a sideways pair of pants:

![ALU](/assets/alu.png)

Implementations on various processors will vary slightly, but conceptually they all have to have at least 3 inputs:

* A and B - the operands. A and B are the binary numbers we're going to mash together
* CTRL - the signals that say _how_ to mash A and B together. 

And of course, the set of these three inputs produces the result of the requested calculation.

Keeping with our 32-bit theme, we assume that the ALU is set up to do calculations on 32-bit inputs, and produces a 32-bit result. Other processors may assume otherwise, but this is just our example for now.

CTRL can be any number of bits - it just depends on how many different ways you want to be able to combine the inputs A and B together. For example, if you have 12 combination strategies implemented, you'll need $$\lceil log_{2}(12) \rceil = 4$$ bits.

The simplest practical architecture I've seen has a very small ALU with only three operations supported:

* Bitwise AND
* Bitwise NOT
* Addition

It's pretty bare-bones. FOr example, to do $$A - B$$, , you have to first negate the B operand (which requires a bitwise NOT, then adding 1), then adding A and (-B). Subtraction is a 3 step process, which kinda stinks.

Larger ALU's will support more operations, including:

* Bitwise OR/NOR/NAND, Subtraction
  * Keeps common operations down to a single step
* Multiplication, Integer Division, Remainder after division
  * Expanded math abilities on integers
  * Note that floating point (decimal) numbers are frequently handled by a different unit
* Bitwise XOR
  * Super useful for cryptographic and computer security operations
* Shift bits left and right by one 
  * super fast way to multiply or divide by 2
* Increment, decrement
  * Super-optimized versions of common math operations

What set of operations are supported really just depends on processor design. Increasing the number of supported operations increases speed to a point, but always at increased cost and increased potential for things to break. 

In addition to these combination operations, the ALU will often have additional outputs to indicate if the operation resulted in overflow or underflow (ie, result was outside the min or max range of the numbers that can be represented by the 32 bits of the ALU)

### Control Unit

The control unit is the heart of this whole system, coordinating the action of registers and the ALU together to do actual calculation. The design of the unit is special tailored to implement the stored-program concept. Again, the exact design of the control unit can vary, but all have to have at least a few basic components and abilities.

#### Registers

Fundamentally, every control unit will have a set of registers to store information. These will be faster than the bulk RAM chips you're familar with, and serve special uses within the processor. But, fundamentally, they just store a specific set of bits representing some specific, meaningful quantity.

The _Memory Address Register_ (MAR) and _Memory Data Register_ (MDR) are two of the key registers. They are connected directly to the RAM circuitry, and allow the control unit to command unit to read or write from a specific memory address. Along with a couple control signals, the basic process is that the memory address register is first loaded with the desired address. Then, control signals are sent to memory to read or write that address. For read, the data is pulled off the RAM chip and placed into the MDR. Write does similarly, but propagates whatever value was in the MDR (from the control unit's other parts) and puts it into the address in RAM specified by the MAR. Using this, the control unit can _read and write RAM data_.

Two more registers form the core of the stored program concept. The processor fundamentally assumes that the instructions it is supposed to execute exist in memory at a certain set of memory instructions. The _program counter register_ (PCR) stores the memory address of the current instruction being worked on. The _instruction_ register holds the actual instruction while its being worked on.

There are also a set of registers called _General Purpose Registers_. These don't have a very specific purpose, they are left open for the programmer to use as they see fit while writing programs.

Depending on how the IO devices are designed, there may be some dedicated registers attached to physical, user-interaction input or output devices.

#### The Execution Cycle

Most control units follow a repeating three-step process while running:

1) Fetch
2) Decode
3) Execute.

During the _Fetch_ phase, the control unit fetches the next instruction. The Program Counter Register is used to populate the Memory Address Register. Then a read is commanded from the RAM chip, and the result in the Memory Data Register is moved to the Instruction Register.

During the _Decode_ phase, the contents of the instruction are analyzed to see what is commanded. Control signals to other parts of the processor are adjusted based on the contents of the instruction.

During the _Execute_ phase, the actual requested actions are carried out. The Program Counter is updated to a new value (usually the next memory address in sequence).

#### Decoding an instruction

Generally, instructions will command manipulations to registers. Some examples of these:

* Math - Add two general purpose registers, and store the result in a 3rd general purpose register
* Memory - Load a general purpose register from RAM, or store its contents to RAM
* "Branching" - Manually adjust the Program Counter if the previous instruction's result was positive
* IO - reading/writing from some input or output device.

Instructions will always have two main components: the _opcode_ and the _arguments_.

Remember that each instruction is just a set of bits. Usually, the first couple bits is the _opcode_, which identify what the instruction is requesting.

The exact mapping of _which_ bits equate to _which_ operations is dependant on the details of the processor construction. [Here's an example from x86](http://ref.x86asm.net/coder32.html), which is by far one of the more complex versions.

Simpler machines might have a mapping more like:

| opcode || Abrev.  | Meaning |
|--------||---------|---------|
| 0001   || Add     | Add two numbers | 
| 0010   || Sub     | Subtract two numbers | 
| 0011   || OR      | Bitwise OR of two numbers | 
| 0100   || AND     | Bitwise AND of two numbers | 
| 0101   || NOT     | Bitwise NOT of a numbers | 
| 0111   || STR     | Store a value to memory | 
| 1000   || LD      | Load a value from memory | 
| 1001   || BRN     | Branch to a different instruction if the previous result was negative | 
| 1010   || BRZ     | Branch to a different instruction if the previous result was zero |

And so on. Note that when you see assembly instructions, you'll almost always see it referred to by its abbreviation, not by the 1's and 0's of the opcode. It's hard to stare at the 1's a 0's, your eyes start to go crossed after a while. 

The remaining bits are dedicated to the arguments to the opcode. They indicate the specifics of how the processor is to carry out the instruction.

For instructions like Add, Subtract, AND, OR, etc. - the simplest set of arguments indicates a trio of general purpose registers to work with. Usually the arguments will be specified to say "source 1 register", "source 2 register", and "result register". NOT would only need two registers, but is conceptually the same. When the Instruction Register has AND for an opcode, the control unit will use the arguments to configure the signal routing in the processor to pipe the two source register outputs into the ALU, and then the ALU's output into the result register. One tick of the system clock goes by, the result register is updated, and the instruction is completed!

Opcodes that work with memory addresses (BRN/BRZ,LD/STR) will often make one of the arguments the memory address to work with. More complex "addressing modes" allow the address to be specified relative to the program counter, or some general purpose register.

### IO techniques

In general, any input and output device will have to interact with the processor via some set of bits. For example, a mouse might report its X/Y coordinates as two integers. A screen might require representing every pixel color with one byte of data. Regardless of how it's actually done, just keep in mind that at the end of the day, it's just a set of bits that are read from, or go to, the device.

How the processor gets access to these bits happens through two primary methods:

#### Port Mapped

Some processors will have dedicated registers inside the control unit for reading and writing data associated with a user IO device. This also means there will have to be dedicated assembly instructions for manipulating that data as part of a program. THis is a very fast method, but can be a bit inflexible, as the processor has to be designed with assumptions about what its IO devices will be. This is bad if you plug or unplug a device from your computer.

#### Memory Mapped

Sometimes, a more flexible technique is to use the same interface the RAM circuitry uses. The IO device "poses" as part of the RAM chip, responding to processor read and write requests just as a RAM chip would. But, rather than storing and recalling data as requested by a processor, the "other end" of each byte is hooked up to some IO device.

This means there are no special assembly instructions required to do IO interaction. As a software writer, you just have to know things like "Memory addresses 0x0000154A and 0x0000154B are mouse X/Y" and "Memory addresses 0x00002000 through 0x00002FFF control the pixels on the screen". Don't use these special memory addresses like normal memory (ie, writing to the mouse addresses will probably not end well). But, it's much more flexible than forcing a Port Mapped architecture.

But, there are plenty of tradeoffs on both sides. You'll probably see both as you adventure into this wonderful world of processors!

## Concrete examples of architecture

So far, we've stuck to generic descriptions of the common things you find inside a processor. Lots of descriptions have just been these hand-wavey "well the actual implementation depends on the processor type". For the curious, we now present three concrete examples of computer architecure.

### LC-3

The "LC-3", or "Little Computer 3", is a "fake" architecture. You'll not find an off-the-shelf chip that implements the "LC-3" architecture. But, it's a dirt simple architecture - fixed opcode and word widths, simple operations, conveniently sized RAM... the list goes on.

[There are a good number of online resources](https://www.cs.utexas.edu/users/fussell/courses/cs310h/lectures/Lecture_10-310h.pdf) that explain the architecture - some even down to the gate level. It's simple enough that the blog author implemented the processor, gate level up, as part of a sophomore year elective class.[^2]

It's a great place to start, but unfortunately doesn't directly map to any real architecture. However, the concepts you learn while studying it definitely do apply!

### x86

### ARM


### Tradeoffs

Power complexity cost 

x86 complex, legacy, high-power, efficient computation, power hungry, 

ARM more efficient


### The place of the special-purpose computing device

graphics cards, high speed computation


[^1]: For the curious, formal systems of modeling the state of analog electronics in a "digital-useful" way can [go up to having 9 states](https://en.wikipedia.org/wiki/Logic_level).

[^2]: Lots of students [post their solutions on github](https://www.google.com/search?safe=active&rlz=1C1CHBF_enUS840US840&ei=JIUuXcOzF8m4tAbC4bv4Cw&q=uiuc+ece+385+github&oq=uiuc+ece+385+github&gs_l=psy-ab.3..0i22i30.3858.5509..6305...0.0..0.107.585.6j1......0....1..gws-wiz.......0i71j0.a87FJGr1gW8), which seems like a violation of academic integrity, if you ask me.