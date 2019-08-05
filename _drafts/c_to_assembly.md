---
layout: post
title:  "Compiling C to Assembly"
date:   2019-07-27 09:30:40 -0500
categories: blog_posts
---


## Introduction

We now most of the basic required components to analyze how a high-level C code program can get translated into 1's and 0's on a processor. One last piece of the puzzle - we'll introduce a particular assembly language - x86 - and then show how C code constructs are implemented using the assembly language.

## x86

*x86* (pronounced "ecks - eighty - six") is the name for one of the most ubiquitous processor architecutres in the world today. x86 is very old, dating back to some of the initial processors that Intel manufactured. Intel has been very rigirous about keeping it backward compatible, so the full specification carries most of the legacy functionality of processors manufactured 20 to 30 years ago. THis makes the full specification around 2900 pages long - not exactly light reading.

When learning about x86, it's better to start not with the actual documentation, but one of [the many helpful guides](https://www.cs.virginia.edu/~evans/cs216/guides/x86.html) out there.

### The Basics

How memory locations are notated

Comments

#### Setting Aside Memory for Storage

.DATA

#### Memory and Register Transfer

MOV

#### Math And Logic

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