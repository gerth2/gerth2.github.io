---
layout: post
title:  "Good Comments"
date:   2019-08-10 09:30:40 -0500
categories: blog_posts
---

![the 99 percent](https://i.redd.it/fqq6ummu09431.png)

## Introduction

Code comments are one of those things that you have to see lots of wrong examples, before you get good at making them right.

Full disclosure - by most standards, I am _horrible_ at writing code comments. However, my problem is the opposite that most newbies have - I write far too much in comments. 

I'm hoping to share a tidbit of the wisdom I've gotten so far. Rather than corrupt young minds with my excessively verbose ways, I'm hoping we can sorta meet in the middle - get an idea for what "good" or "too much" might look like, and land somewhere in the vicinity of "optimal".

FYI all this does tie back to our prior discussion on what "good code" is. It's one sub-component of making sure your code is easily comprehensible, which allows for faster modification, which allows for faster delivery, which generally keeps the other subteams happy.

## What to comment on

The first thing folks should know is that the text inside a comment needs to be helpful. The golden rule of commenting:

**COMMENTS SAY _WHY_ THE CODE IS THE WAY IT IS, NEVER _WHAT_ IT IS DOING**

The absolute worst form of code commenting, that I truly and utterly abhor:

```c
double periodic(){

    //Declare two local variables for speed and encoderReading
    double speed;
    double encoderReading;

    //set Encoder reading to the return value from the function getSensorValue()
    encoderReading = getSensorValue();

    //Divide encoderReading by ten and then multiply by sixty.
    speed = encoderReading / 10 * 60;

    //Return the value within the variable Speed
    return speed;
}
```

Well, ok. Maybe you've seen comments like these on the blog. But that's different- when I explain _what_ code is doing, it's to help teach new people.

Production robot code is not the place to put tutorials on the nuances of Java/C++/Kotlin/insert-obscure-language-here. 

The comments in the above example contain _literally_ zero additional information. You are literally sucking up bits of storage on your PC's hard drive with no added benefit. Even worse, you have written code that _appears_ to have at least some volume of contents, but on closer inspection has _lied_ about its usefulness. 

Please please please please please never ever ever write comments like this.

Here's a much better approach:
```c
double periodic(){

    double speed; //Stores Speed in RPM
    double encoderReading; //Stores encoder measured speed in pulses per second

    // Read all inputs
    // Sample from the encoders
    encoderReading = getSensorValue();

    // Convert to RPM
    // Encoder is measuring a target which produces 10 pulses per revolution
    //  and speed is supposed to be per-minute, not per-second.
    speed = encoderReading / 10 * 60;

    return speed;
}
```

The comments are like a good tour guide in the art gallery - they never describe the actual painting itself, but rather give context to the author's thought process, and how it connects to the broader culture and time in which it was created. Write your comments to be good tour guides to your own thought process, assumptions, and desires.

A good practice is to leave a note when you still need to come back and finish something:

```c
double periodic(){
    if(condition1){
        print("Got condition 1!\n");
    } else {
        //TODO
    }
}
```

This helps you and the next person recall that the code isn't finished, and there will be more functionality. It also means that if you're ever wondering "what else should I do?", one quick answer is search for all occurrences of the string `TODO` in your code files. If you find `//TODO` comments, well, you've got something to do!

## ASCII-Aesthetics for Visual Separation

I've been a fan of using comments, whitespace, and ascii art to visually separate different parts of a source code file, as I wish a user to see them separately. This means I'll usually add some extra spaces between function definitions, maybe an extra newline here or there within a function to mark off different segments of execution.  It's all about communication - if you want the reader to see two things together, remove whitespace. If you want them to see two things separately, add more whitespace.

For example:

```c
if((condition1==1&&condition2==0)||input3>=10){
    do_the_thing();
}
```

While this C code works just fine, I personally like to add a bit more whitespace to separate out the components of the `if()` statement condition, into the parts that a human more easily parses:

```c
if( (condition1==1 && condition2==0) || input3>=10 ){
    do_the_thing();
}
```

Not everyone is like me, though, and I'm not even super consistent with my own styles. Still, I feel there's some value in visually separating things that are (somehow) separate, and visually aligning things which are (somehow) aligned. Communicating intent. That's all we're doing here.

When doing the same thing with comments, I've got some favorite ascii-art style ways of doing this visual separation as well:

```c
//----------------------------------------------
// This is a block of comment, hard to miss
//----------------------------------------------

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Here is another block, even harder to miss.
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!! HERE IS A SUPER URGENT WARNING YOU CANNOT MISS !!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~ Here is a new section of code
void myCode(){
    print("yay!");
}
//~~ Now the code is done.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

Feel free to take and tweak these as you prefer.

## Standardization strategies