---
layout: post
title:  "Processor Architecture"
date:   2019-07-06 9:30:00 -0500
categories: blog_posts
---

# Introduction

What we're studying and why - basic layout of processors - what components are commonly expected - how they interact

# History

ENIAC and special purpose computers

the quest for the "general purpose" computer

Von Neumann & Turing

"Von Neumann" can mean different things

## Stored Program

Concept of stored program

Advantages and disadvantages

# The Von Neumann Architecture

## Overall

Memory, processor unit, control unit, IO

## The System Data Bus

System Data bus is a common set of wires that transfers data from one device to another

### Tri-State Buffer

Connects/disconnects devices to a circuit

Similar to a MUX in goal, different in operation

Used to 

### Register Load and Store

Registers are like before

Addition of enable pin to choose whether they load a new value from their inputs or now.

## Control Unit

microcode,

Abstraction into RTL

program counter, instruction register

### Concept of an instruction

opcode, arguments



## Memory

LOAD and STORE operations

## Processing Unit

Arithmetic Logic Unit

Add multiply subtract divide negate

Overflow underflow

Bitwise Boolean AND OR NOT

Logic - compare values (GT/LT/EQ) - status register

Linkage back to control unit


## IO


# Concrete examples of architecture

## LC-3

## x86

## ARM


## Tradeoffs

Power complexity cost 

x86 complex, legacy, high-power, efficient computation, power hungry, 

ARM more efficient


## The place of the special-purpose computing device

graphics cards, high speed computation

