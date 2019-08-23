---
layout: post
title:  "Good Comments"
date:   2019-08-18 09:30:40 -0500
categories: blog_posts
---

![the 90 percent](https://i.redd.it/fqq6ummu09431.png)

*source: reddit.com*

## Introduction

Code comments are one of those things that you have to see lots of wrong examples, before you get good at making them right.

Full disclosure - by most standards, I am _horrible_ at writing code comments. However, my problem is the opposite that most newbies have - I write far too much in comments. 

I'm hoping to share a tidbit of the wisdom I've gotten so far. Rather than corrupt young minds with my excessively verbose ways, I'm hoping we can sorta meet in the middle - get an idea for what "good" or "too much" might look like, and land somewhere in the vicinity of "optimal".

All this ties back to a broader discussion of what "good code" is. It's one sub-component of making sure your code is easily comprehensible, which allows for faster modification, which allows for faster delivery of functional software, which generally keeps the other subteams happy.

## What to Comment On

The first thing folks should know is that the text inside a comment needs to be helpful. The golden rule of commenting:

**COMMENTS SAY _WHY_ THE CODE IS THE WAY IT IS, NEVER _WHAT_ IT IS DOING**

The absolute worst form of code commenting, that I truly and utterly abhor:

```c
double periodic(){
    //Here is the start of the function named "periodic"

    //I have declared two local variables named speed and encoderReading
    double speed;
    double encoderReading;

    //set encoderReading to the return value from the thing getSensorValue()
    encoderReading = getSensorValue();

    //Divide encoderReading by ten and then multiply by fifty.
    speed = encoderReading / 10 * 60;

    //Return the value within the variable Speed to the caller function
    return speed;

    //This function is now done
}
```

Well, ok. Maybe you've seen comments like these on the blog. But that's different- when I explain _what_ code is doing, it's to help teach new people.

Production robot code is not the place to put tutorials on the nuances of Java/C++/Kotlin/insert-obscure-language-here. 

The comments in the above example contain _literally_ zero additional information. You are literally sucking up bits of storage on your PC's hard drive with no added benefit. Even worse, you have written code that _appears_ to have at least some volume of contents, but on closer inspection has _lied_ about its usefulness. 

Even worse, some of the comments have _wrong_ information. You may laugh, but this happens all the time - developer A writes the code and the comment, developer B comes along and updates the code but not the comment. Then developer C is confused and frustrated. 

And, believe it or not, often developers A, B, and C are the same person. I've been there.

![it was me all the time](/assets/it_was_me.png)

*source: me.me or Stephen Hillenburg, you choose.*

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

A good practice is to [always leave a note](https://www.youtube.com/watch?v=eNZsWIzEhP4) when you still need to come back and finish something:

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
int myCode(){
    print("yay!");
    return 42;
}
//~~ Now the code is done.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

Feel free to take and tweak these as you prefer. 

## Standardization strategies

One of the key to writing good code is consistency - making similar things look similar makes your code way easier to read and comprehend, especially to someone who isn't familiar with it. It helps them know that once they've learned one thing in the code, if they see it again, they don't have to re-learn it. 

A good chunk of this consistency is keeping the _quantity_ of your comments level throughout the code. As a team, decide what an appropriate level is, and try to stick to it. Make note of it while reviewing each other's code, and add or remove as needed to keep the level even.

Once nice practice is to put a description block above every major public function or method. Include key information, such as a description of the function's usage, what its inputs are supposed to be, what its return value is, any global variables it modifies, etc.

```c
//***************************************************************
//** Function Name: myCode
//** Description: Displays a happy message, and calculates
//**               the meaning of life.
//** Inputs: None
//** Outputs: Returns the meaning to life, in an integer.
//** Globals: No interaction
//***************************************************************
int myCode(){
    print("yay!");
    return 42;
}
```

If you are super careful with how you do something like this, you can use specialized programs like [Javadoc](https://en.wikipedia.org/wiki/Javadoc) or [Doxygen](https://en.wikipedia.org/wiki/Doxygen) to convert these comment blocks into some very nice looking and easy-to-navigate HTML, producing non-code documentation of how your code works. It's super useful if someone else has to use your code (like if you were writing _for_ WPI), but is also just nice to have as a reference anyway.

One closing note - I always recommend using proper grammar, punctuation, capitalization, spelling, etc. when writing comments. Even if your meaning is communicated without these, taking the time on the comments indicates you also took time writing the code, and are competent at your job. Which, presumably, is the message you'd like to communicate outward.

## Conclusion

Code comments are a necessity of writing code which is easily comprehended by humans. Since we want our code to be first and foremost understandable to humans, it makes sense to have good comments. Hopefully you've got a few new, good ideas on how to do your commenting. Try them out yourself next time you write some software, talk about it with your team, and let this lead you toward better code!