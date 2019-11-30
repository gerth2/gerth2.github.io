---
layout: post
title:  "TRTT Behind the Scenes"
date:   2019-11-31 09:30:40 -0500
categories: blog_posts
---

## Introduction

When I started writing this blog, I didn't have much in mind. I was mostly hoping just to put some text available on a website. It kinda snowballed over time - it's still not super complex, but does incorporate a number of different web technologies. For anyone interested in doing something similar, or just curiuos, I figured I'd document what sorts of technologies I'm using currently.

## Jekyll

Jekyll is a static website generator. Website generators, in general, are tools which allow you to enter in a relatively small amount of information (for example, the text of a post) and create nice-looking and well-structured HTML (which your browser can display) in a scripted manner. 

They're one of many software tools that take a form of information that is easy for humans to manipulate, and transform it into something which is easy for machines to work with. 

This lets us have our cake and eat it too - pages are easy to make and change, but still look nice, and minimize the work done by the client computer to display the content

A static website is one which has the content pre-defined, and served the same way to all users. 

A website like Facebook or Twitter is the anti-example to this - depending on who you are (as determined by who is "logged in"), and what friends you have or which handles you subscribe to, the contents returned to your browser when you visit "facebook.com" or "twitter.com" will vary greatly. In order to make this happen, they have to _dynamically_ generate the HTML, Javascript, and CSS files which are sent to each client on connect.

However for most blogs (including this one), there's no mechanism for login, or differentiating users from each other. Each person who visits gets the exact same set of posts. Therefor, there's no need (or reason) for dynamic generation of content. We can pre-generate the exact HTML, Javascript, and CSS you will recieve, and just hand it off to you when you ask for it.

This is a much simpler way of doing things, and is therefor more limiting. I don't really have the ability to change what each user sees. However, based on the whole point of a blog in general, that sort of flexibilty isn't needed. Flexibility usually implies complexity, which implies more work. To keep the whole thing simple, I chose to go with a static website, and keep things simple.

Jekyll was chosen specifically because it integrated well with Github, which was my hosting platform (will explain soon). It turned out this didn't matter too much, but was important at first.

## Github.io - Hosting

Every website, fundamentally, works the same way:

1) A client computer contacts another computer and says "Hey, I want to see XYZ webpage"
2) The server says "Sure, here's the files associated with XYZ"
3) The client computer displays the files.

To do this, it's required that there is some _server_, somewhere, accessable to everyone in the world, which not only stores the files associated with the website, but is configured to properly format and provide responses to clients when requested.

Designing this server is a big key to having a well-working website. It has to be always-on - any time you turn it off, the website "disappears", and is inaccessable to everyone. Additionally, it will have to do work any time someone else in the world asks for the website. This means that the load is fairly unpredictable. Between these two facts, using your desktop or laptop as the server is generally a bad idea. You'll want a dedicated, separate computer that you can leave on all the time, and not care if the CPU load spikes randomly.

However, even if you were to have a separate computer, hosting your own web server is _hard to do right_. For one thing, you have to update your network's firewall to allow external people to send commands into the server. This reduces the security of your network overall, and is a prime target for folks looking to hack into your network. Without careful security measures, you risk exposing every device on your network to the prying eyes of malicious hackers. These points of entry may be in your router and your network configuration, or in the server itself - old, buggy software on the server is a great way hackers can exploit their way into your personal files, take control of your website, and generally wreak havoc.

Furthermore, most consumer Internet Service Provider's don't allow you to host a website from your connection - you usually need a business (or otherwise special) agreement to have them allow incoming HTTP connections to your network.

For all these reasons, when hosting a website, it's often easier to let someone else do it for you.

Enter [github.io](https://github.io). This is Github's free service for hosting static websites. It's pretty simple - create a special repo to house your website. Push the content to the website, with a special file named "index.html" as the "top-level" file which is served whenever someone visits your website.

It's an awesome system actually - the only real skill the developer needs is git. As long as you can push your files with git, you can allow github to serve them as a website to anyone in the world who wants to visit the website.

Given that the hosting was free, it seemed like an easy choice.

## Google Domains - the web address

Even once a website is available on some server on the internet, visitors still need an easy way to find the server amongst the _many many_ servers online. 

Each server online does get assigned an IP address. TALK MORE ABOUT IP ADDRESSES. However, remembering these number combinations is unintuitive, and hard for humans.

This is where the ["Domain Name Service" (or DNS) servers](LINK TO DNS HERE) come into play. 

DNS servers are a handful of servers that know about other servers. They maintain a mapping of convinent english names (like "google.com") to actual IP addresses. They do fancy things, handing off requests to each other, until the lookup of website name to IP address has been completed.

The servers are distributed, and live at fixed and well-known IP addresses. Most ISP's have their own. Google does too (8.8.8.8 and 8.8.4.4), and 1.1.1.1 is another up-and-coming one.

As an aside: an easy way to check "Am I connected to the internet" is to ping a known DNS server. If the IP address 8.8.8.8 responds to pings, you know your network allows for connection to the broader internet.

By default, Github provides a URL for free for your website, but its name is not configurable: mine would be "gerth2.github.io" - which, though nice, is not informative about the content of the site.

In order to allow for the name of the website to show up as the URL, I pay $12 per year to Google Domains. I used their service to _purchase_ and _maintain ownership of_ the domain name "trickingrockstothink.com". In return for my payment, they keep their DNS servers configured such that anyone who types "trickingrockstothink.com" into their browser URL window will get redirected to the IP addresses associated with Github's web host servers, and specifically my website.

## Markdown 

As stated previously, the point of using Jekyll as a website generator (rather than manually writing HTML) is to allow me to enter the information (ie, the text you're reading right now) in the most rapid way, and letting a script do all the "HTML Decoration" around it in a algorithmic way.

Jekyll takes a few input formats, but [Markdown](LINK HERE) is the most common. Markdown is one of many, loosely-defined "markup" languages. A markup language is not really a programming language, but rather a set of special character sequences to indicate a desired formatting. For example, if I want _italics in some text_, I have to wrap the text in underscores, `_like this_`. Jekyll's markdown interpreter knows to place the text inside the `_ _`'s inside of HTML and CSS blocks which cause the text to go slanty. Similar character sequences are recognized for footnotes, bold text, section headers, and [many other things](Link to cheatsheet).

Again, there's no concrete reason I _couldn't_ just write the HTML. But, it's a lot more keystrokes to get the exact same output.

Additionally, I like the fact that markdown source files are really easy to read as a human. Even if Jekyll and markdown disappear off the face of the planet tomorrow, it would be pretty trivial to move them to some alternate markup format. HTML in theory could be the same, but it isn't nearly as straightforward.

## Add-ons

Obviously, Markdown doesn't allow for _unlimited_ configuration of how your text looks, and that's on purpose. It sacrifices flexibiltiy to make the _most common_ operations _really really easy_. However, as we'll show, there's still plenty of oppurtunity to extend its functionaly as needed.

### Chart Plotting

Certain concepts are much better explained with a 2-D graph, rather than words.

### Math Formulas

Why Latex is awesome

Why Mathjax is awesome

## Development Flow

How blog posts are created and "tested"

### Drafts & Local Server

What the batch files are for. What jekyll supports

### Deployment Script

How we deploy to github on separate branches

### Miscellaneous Development Techniques

placekitten.com

## Conclusion

Yay website awesome