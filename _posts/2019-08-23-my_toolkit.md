---
layout: post
title:  "My Computer Engineering Toolkit"
date:   2019-08-23 09:30:40 -0500
categories: blog_posts
---


## Introduction

This will be a bit of self promotion, but hopefully educational at the same time. Here's a confession - I have many computers in my life [^1]. They have come and gone over the years, and all played a crucial role in my education and learning, leading me toward the engineer I am today.

I wanted to spend a post talking about the machines I currently use to do my thing. 

For context, if you happen to go to my [linkedin page](https://www.linkedin.com/in/christopher-gerth-7b8b52126/), you'll notice I'm an _embedded_ software engineer by day. Basically, this just means my day job is the same as my robotics software-mentor job - just on bigger and yellower machines. My hobbies (robotics and otherwise) tend to flow straight from this occupation. 

What I'll talk through are what sorts of machines I use day to day to accomplish my personal and mentorship software development tasks. I hope that by getting some insight into how I've configured the tools around me, you may get some ideas of your own to form your own custom toolkit to support your hobbies!

## Computer Hardware

### The Main Show - the Desktop

My "daily driver" machine is my custom-built desktop. It was fairly up-to-date when I built it in 2013, but it has aged very well - it's still more than fast enough to run any internet browsing, code editing and building, and occasional video games I throw at it. 

![thePC](/assets/thePC.jpg)

Some basic specs:
 * Intel i5 3350P CPU - 3.10 GHz
 * 8GB RAM
 * 128 GB Main SSD, 1Tb expansion Drive
 * NVIDIA GeForce GTX 660
 * Windows 10 Professional
 * [Samsung 4K 28-inch monitor](https://www.amazon.com/Samsung-LU28E570DS-ZA-Led-Lit-Monitor/dp/B07FBNPTDD/ref=sr_1_1?keywords=samsung+4k+monitor&qid=1566526097&s=gateway&sr=8-1)
   * I've gone back and forth on this over the years. I really like all the screen real estate in one spot, and Windows 10 is great about managing it
 * [RAT4 Mouse](https://www.amazon.com/Mad-Catz-RAT4-Programmable-Adjustable/dp/B01JBZMGAG)
   * Gotta get something that looks cool, and has programmable buttons. If you've never experienced a mouse with a dedicated "back" button, you haven't lived!
 * [Adesso Mechanical Keyboard](https://www.amazon.com/Adesso-AKB-635UB-Easy-Touch-635/dp/B00SX4X8WW/ref=sr_1_3?keywords=adesso+mechanical+keyboard&qid=1566526455&s=gateway&sr=8-3)
   * Mine is similar to this one, I don't think they sell it anymore.
   * Mine has [Cherry Blue switches](https://www.keyboardco.com/blog/index.php/2012/12/an-introduction-to-cherry-mx-mechanical-switches/) - the really _really_ clicky ones. Drives the wife mad. But I _love_ the tactile feel.
     * Of course, it's not for everyone. Try a bunch of different keyboards to see which one you like.
 * Mousepad is a chunk of fabric-covered neoprene that was surplus from the manufacture of [Haken Continuum](https://www.hakenaudio.com/) continuous keyboard. It's a fun souvenir from one of my favorite college classes.

![thePCGuts](/assets/thePCGuts.jpg)

Again keep in mind - these specs are 6 years old at the time of writing. If I ever happen upon a spare couple hundred dollars, I this will probably be the first thing I upgrade. However, it's still running so fast, it's hard to bring myself to do so.

None of this is really top-of-the-line - it's middle to cheap, but more than sufficient to support my personal coding and development projects.

### The New Guy - the Laptop

For folks who do lots of FRC software mentoring, turns out the vast majority of my coding occurs on the road. For this reason, I recently splurged on getting a good machine that would take all the software-writing punishment I could throw at it. My choice? The [Huawei MateBook X Pro](https://consumer.huawei.com/us/tablets/matebook-x-pro/). 

![matebook](https://gloimg.gbtcdn.com/soa/gb/pdm-product-pic/Electronic/2018/07/09/goods_img_big-v1/20180709131041_59936.jpg)

*source: gearbest.com*

That's right - I got the Chinese hardware. But I have to say, it's super awesome. Sleek and light, phenomenal battery life, a brilliant and giant display (my key criteria), and a pretty good keyboard and trackpad make for an excellent coding machine on the road. 

The device sports a plethora of USB-C connectors. I usually carry dongle adapters to get me to VGA and HDMI, as well as extra USB and Ethernet ports (all very important for robot usage). 

To address the elephant at the time of this post - _Yes, Huawei devices are considered a security risk in the US_. Most of the concern has been targeted at their servers and networking hardware, as it relates to the 5G expansion of wireless telecom carriers. Their consumer hardware is under target too. It was a risk I took when purchasing. I'm hoping the situation gets cleared up soon, but also keeping my finger on the pulse of the conversation, and actively monitoring network traffic. If something starts "phoning home", I will probably re-evaluate what sort of network permissions this device will get.

No major changes to the OS or hardware since I've gotten it. I've got exactly what they say they sell on their website.

### The Old Standby - the Server

At my home, I run one additional machine that acts as a server. I run a Dell PowerEdge R200 in my basement.

 * 2.33GHz Xenon CPU
 * 4GB RAM
 * 128 GB SSD

![the server](\assets\server.png)

 It's really not much - the thing is 10 years old. I got it for a _steep_ discount on eBay - just had to provide my own hard drive. 

 I run [ArchLinux](https://www.archlinux.org/), one of the most trimmed down operating systems with the [Linux Kernel](https://www.linux.com/what-is-linux/) you can get. It's a "no batteries included" approach to design - which means you get lots of configurability as a user. This server is the platform for a large number of continuous-running applications I keep at my house.

### Network Storage

For saving files and doing server backup, I run a 2-TB [Buffalo Network Attached Storage](https://www.buffalotech.com/products/category/network-attached-storage) device, with two hot-swapable drives in a RAID configuration allowing for full redundancy. It's primarily to supplement the other devices on the network - I'll get into that later.

### Other Home Networking Equipment

Along with the server, my small rack downstairs consists of two ethernet switches (one providing Power Over Ethernet, one not), an old Netgear combination Router & Wifi access point, and our modem. We're lucky and have fiber internet service - I'm currently on a 300MBps plan that makes for a _blazing_ fast experience.

When I moved into the house, one of my first projects was to install [Cat6 ethernet wiring](https://www.monoprice.com/product?p_id=8103) throughout the house. I added 7 new ports on two floors of the house, and ran all the wiring back down to the server & ethernet switches. This allows our media station (Roku & smart DVD Player) the desktop, and a few wired security cameras to connect to wired internet, even though they're all in different rooms than the rest of the equipment. It also means the noisy server lives downstairs behind closed doors.

![Network Equip](/assets/networkEquipment.png)

In a super simplified (to the point of inaccurate) diagram, here's how it all is hooked together:

![Home Network Diagram](/assets/simplifiedNetwork.png)

## Key Software

This hardware would be nothing without the software that sits on top of it to be useful. I'll give a quick survey of the pieces of software that get used on a daily basis in my household.

### On the Desktop & Laptop

I have a strong preference for free software because I like to spend my money on other things, like food. Sometimes you have to pay for good stuff. However, we are lucky that in today's world, the majority of the tools needed for day-to-day software development can be acquired free of cost!

#### Development Environment

[Visual Studio Code](https://code.visualstudio.com/) is my preferred code editor. The ability to support so many languages so flexibly, along with tons of built-in tools. 

I'm also a huge fan of dark mode, and I really like the built-in color theme. Call me shallow, but if you have to stare at code all day long, might as well do it in a way that looks ascetically pleasing to you!

![VSCodeSample](/assets/vsCodeSample.png)

[Git](https://git-scm.com/) is a daily part of my development experience. Ever since I learned how to use it in college and on my first job, it's become an indispensible tool for keeping track of how I change my software over time, organizing my development process, and creating backups of projects. Though I often manipulate my repos via the command line, I still really like having a nice visualization of my version tree. [Git Extensions](https://gitextensions.github.io/) is my current choice for doing this, but there's lots of great alternatives.

![GitExtensionsSample](/assets/gitExtensionsSample.png)

When connecting to the server, I generally use [SSH](https://en.wikipedia.org/wiki/Secure_Shell) to get access to a command line on the other machine. [Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/) is my tool of choice to get this done on Windows, though the one built into Git's command prompt works just fine too.

Connecting between the Windows machines usually involves Window's built-in Remote Desktop application.

For working with C code, I tend to prefer the [msys/minGW](http://www.mingw.org/wiki/MSYS) to get the parts of the GNU/Linux environment on my Windows machines required to build and link C code to an executable. [Cygwin](https://www.cygwin.com/) is another super common option.

[Python](https://www.python.org/) is my go-to language for most projects - it's got easy & c-like syntax, cross-platform abilities, and batteries-included philosophy makes it a good choice for creating highly functional prototypes and super-flexible applications. For pure speed or robustness other options may be better, but Python is still my daily-driver for a language to implement my ideas in.

#### General Engineering Tools

Of recent, [Discord](https://discordapp.com/) has become the defacto tool for maintaining communication in our FRC team, amongst friends, and even family. 

For CAD, I tend to like [LibreCAD](https://librecad.org/) in the 2D drawings, and use [Autodesk Inventor](https://www.autodesk.com/products/inventor/overview) for 3D work. Both have many alternatives, these are simply the ones that I learned first, so I'm still the most efficient with them. I don't have to do this super often, so I tend to stick with what I know, rather than invest in a new tool.

For electronics work, I have a few tools of choice. For doing research on the functionality of circuits and simulating their behavior, I use a program called [LTspice](https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html). It's a bit obtuse to get used to, I learned it in college. It helps when designing analog circuitry and validating functionality prior to building a real circuit.

When designing an actual circuit that I'll build, I switch over to a different tool. [KiCad](http://www.kicad-pcb.org/) has been my choice of recent, though [Autodesk Eagle](https://www.autodesk.com/products/eagle/free-download) was my choice in college. Both give a vast library of components that you first assemble into a nice circuit schematic, then lay out physically on a [printed circuit board (PCB)](https://en.wikipedia.org/wiki/Printed_circuit_board). In addition to printing the schematic, you can export various files from the PCB design side that manufacturers can use to create a custom board for you. This will likely be the subject of a future blog post.

#### Documentation

For documenting my work, I tend toward two tools. 

For simple technical documentation, I really _really_ like [Markdown](https://en.wikipedia.org/wiki/Markdown). That's what this website is (mostly) written in! My liking is primarily because it's super simple to write - basically just editing a text file. The rendering into nicely-formatted viewing is done by some other tool. To me, this is awesome because even if the visualization tool goes extinct, the base content is still super accessible and readable (unlike Microsoft Word or the like). Github and its clones support it natively, so `.md` files you produce display very nicely via their web interface (which is how most 3rd party folks will first see your projects). The feature set provided is, for me, "just-right" - simple formatting of code, images, headings, lists. All without the overhead of pure HTML/CSS/Javascript to accomplish the same thing. Of course, if doing a website from the ground up, you'll want to be more familiar with those. However, for something like this blog, Markdown is an awesome choice for entering the information with enough complexity to fully describe your ideas, without unneeded overhead.

For more formal documentation (think, scientific papers or resumes), [LaTeX](https://www.latex-project.org/) is by far king, and I also love it. It produces [beautifully formatted documents](https://github.com/RobotCasserole1736/CasseroleLib/blob/master/doc/current_limiting.pdf) with top-of-the-line scientific equation editing. It also does great resumes - I recently moved mine over using the [ModernCV](https://ctan.org/pkg/moderncv?lang=en) templates! It's a bit obtuse to learn at first, but the end results are well worth it!

![LatexResume](/assets/latexResume.png)

*Looks even better unredacted!*


### On the Server

The Gerth Household Server (affectionately nicknamed "Geezer" for its age) runs a number of applications which improve out lives on daily basis. I got into having a household server after my college laptop's screen died, leaving it only useful by SSH or Remote Desktop access. I was bored one weekend, got Arch Linux up and running, and it kinda just snowballed from there. A few years back I finally decided running my laptop to death wasn't a great idea, and swapped for the PowerEdge server hardware.

[HomeAssistant](https://www.home-assistant.io/) is our home automation hub. It was one of the first things I attempted to get running on the server, and has been serving use well ever since! We've got a number of wifi-controlled light switches and outlets, smart speakers, [some homebrew devices](https://github.com/gerth2/smarthome-devices), and of course many networked devices. HomeAssistant has a ton of built-in functionality - you just have to configure it that "yes, these things are in my home" and it will automatically do some really slick integration, providing a super useful user interface for controlling the devices. Additionally, I can write automation scripts to allow the smart speakers to trigger action on light switches and whatnot. Highly recommended!

![Home Assistant Sample](/assets/hassSample.png)


[Github](https://github.com/) is my go-to service for hosting repos online, and making them publicly available. However, there are a handful of projects I really _don't_ want to make it outside my home network. Some of them concern the internal configuration of my network, others contain personal info (like my tax returns or resumes). To still be able to have totally-private, not-at-all-in-the-outside-world git projects backed up on a separate device from my PC or laptop, the server also runs an instance of [Gitea](https://gitea.io/en-us/), a simple Github-lookalike that I host myself. I'll also back up critical projects (like this blog!) just in case Github disappears off the face of the earth - my data won't disappear with it. Though I will have to find another host.

For home media, we use [Plex](https://www.plex.tv/) to stream media files from our NAS to various viewing screens throughout the house. Both TV's have some smarts built into them to where they can stream from the server.

Both Gitea and Plex are backed up against the Network Attached Storage device, which is nice, since the big files don't take up space on the server's internal hard drives.

For monitoring the server status, aside from just remoting in via SSH and running `top`, I recently installed [NETDATA](https://www.netdata.cloud/) to provide a slick web-based view of how the server is running at the moment. It's made basic checkups much quicker!

![netdata sample](/assets/netdataSample.png)

All of the applications are contained behind our router's firewall - no one should be able to access them externally. While on the go, my wife and I use [openVPN](https://openvpn.net/) on our phones and laptops to connect back to the home network. The server runs the server-side implementation of openVPN.

The concept of this [Virtual Private Network](https://en.wikipedia.org/wiki/Virtual_private_network) is simply putting your data in a "tunnel" - one end on the device your using, the other end inside our home network. This not only makes sure we have access to our home network applications, but also that we can protect our data from potentially untrusted wifi networks (Sorry random coffee shop XYZ, your baristas make great coffee, but probably don't spend a ton of time analyzing the security of their local branch's networking equipment). By encrypting our data with our own trusted devices and security keys, we can up our safety factor online quite a bit.

The server also happens to be hooked up to an amplifier that powers some weatherproof speakers we have outside. The server runs both a [Pianobar](https://github.com/PromyLOPh/pianobar) instance controlled within HomeAssistant, as well as a [Scream](https://github.com/duncanthrax/scream) server. Using these, we can play and stream audio to our outdoor speakers from quite a few different devices.

## Conclusion

Ok, this is enough of a technical flex for now. I'm not necessarily recommending that anyone use these tools, or endorsing them in any particular way, other than to say that they work well for my family's current purposes. If you're in need of similar solutions, try out the tools and let me know what you think! I'm by no means an expert in any of them, but would be happy to give more feedback if needed.

Happy coding!

[^1]: Though, not as many as my friend whose insurance company wanted to classify him as a small business due to his sheer quantity of high-powered hardware.