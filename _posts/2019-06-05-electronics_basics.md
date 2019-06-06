---
layout: post
title:  "Introduction to Electronics"
date:   2019-06-05 9:30:00 -0500
categories: electricity
---

*“Invention is the most important product of man's creative brain. The ultimate purpose is the complete mastery of mind over the material world, the harnessing of human nature to human needs.” ― Nikola Tesla*

Computers and robots are both electronic devices, so it is worthwhile to start with some basic background on this force of nature we are using to do computation, movement, and other forms of useful work.

## What is Electricity

*Electric Charge* is a physical property of some matter, just like mass, or magnetism. Within an atom, the protons will have a positive charge, and electrons will have a negative charge. Electric charges interact with each other, and will exert mechanical forces on each other, which can cause motion. Just like in many things, opposites attract - negative charges tend to move toward positive charges, and vice versa. 

In robotics, *electricity* usually refers to the flow of charge from one point to another. If you have a big clump of positive charge (like a bunch of protons) fixed at a certain location, and release a small negative charge nearby (like an electron), that small mobile negative charge will move toward the bigger clump. We say that the positive charges create an *electric field* which causes forces on other charged particles in the area.

## Measurements of Electricity

There are two primary quantities to measure in the phenomenon described above. 

### Voltage

When you have an excess of charge in one place, we say it creates an electric field that can act on other charged particles. The strength of this field, and how much it acts on a given charge, is called the *Voltage*. Voltage is measured in units of *Volts* ($$V$$), and is usually also denoted in equations as $$V$$. It is always measured as the difference between two points (or one point referenced against another). A small bit of positive charge will want to move away from the point with a higher voltage toward that with a lower voltage.

### Current

*Current* is a measurement of a certain amount of charge flowing past a given point. The SI unit for measuring this is the *Ampere* or more commonly just the *Amp* ($$A$$). In equations, you'll see it denoted as $$I$$, because of the French. It is equal to $$6.25 * 10^{18}$$ electrons flowing past a point at any given time.

Back when electrical properties were first being described, it actually wasn't known yet that electrons are almost always the mobile charge, so at the time positive current was defined to refer to positive charges. Only after further study was done that it was discovered the convention was technically wrong - when you talk about positive current flow in a certain direction, the electrons actually flow the opposite direction. The good news is you can usually happily ignore this fact until you get to semiconductor physics - most of the rest of electrical engineering can be blissfully unaware of the difference between "conventional current" and "electron current".

### Resistance, Conductors, and Insulators

When our little electron friends are exposed to an electric field, they will experience a force, and want to start to move. And move indeed they will! However, one has to consider what material they are moving through. In general, real materials will present some barriers to the movement of charged particles. This resistance usually comes in the form of atoms of the material "grabbing" onto the mobile charges - exerting additional forces beyond what the electric field exerts.

Metallic materials like copper present a tiny bit of opposition to the movement, but really not much at all. Electrons which can freely move though a "sea" of atoms are common, so it's easy to get a current flowing.

Plastic and rubber, in contrast, are made up of large, strong molecules of many tightly bound atoms. It's hard to get any loose electrons to be available to move. So even if you place a large voltage across them, you're not liable to see much current.

The measurement of how much current flows through a material for every unit of voltage applied is called the *Resistance*. It's measured in units of *Ohms* ($$\Omega$$), and usually denoted in equations as $$R$$. 

*Ohm's Law* defines this relationship as:

$$ V = I R $$

In general, materials with high resistances are called "Insulators", and materials with low resistance are called "Conductors". This is why wire is effective for usage as a conduit through which to route current - the metal core provides a highway for charge to move through, carefully isolated from the outside world by a flexible, rubber insulator. This keeps the current flowing where you want it (motors & the like), and away from where you don't (the frame, your fingers, etc.).

## Semiconductors

Of particular interest to computer engineers is a very particular class of materials called *Semiconductors* These materials have the ability to change between conductor and insulator depending on how voltages are applied to them. 

### Physical Construction

Semiconductors are primarily made of specially processed silicon, formed into a very regular lattice-like structure on the atomic level, then carefully "doped" with impurities that introduce mobile charged particles. These can be actual electrons, or a void where an electron could fit in (called a "hole"), which is effectively a positive charge carrier. 

Remember that a conductor has free particles to carry charge, while insulators do not. Undoped silicon is effectively an insulator, because all electrons are tightly bound into the lattice. Doped silicon does have extra electrons (or holes) which can move around, as they are not tightly bound to the lattice, and are therefor effectively conductors.

Layers of differently-doped material are fused in specific physical configurations to construct useful devices.

When a doped region with extra electrons is fused to a doped region with holes, some electrons naturally migrate into the holes near the junction. This forms what is called the "depletion layer" near the junction. This depletion layer is effectively an insulator, since there are no free electrons to carry current through the region.


### Electrical Properties

Applying a voltage across this depletion region will exert an extra force on the electrons. Depending on the direction of the voltage, you may end up with more electrons  hopping into holes (expanding the depletion region), or knocking electrons out of holes (shrinking the depletion region). As the voltage gets big enough to drive the depletion region to near zero size, the resistance of the material goes down, and it transforms into a conductor overall.

![depletion layer and diode](/assets/diode.png)

This is the useful property of semiconductors - by applying a voltage to one part, the material property can be converted between insulator and conductor.

### Transistor as a Switch

It is commonly said that computers store information using 1's and 0's. These "bits" of information are represented inside the circuitry of the processor as high and low voltages. To store, combine, and manipulate the information, it is necessary to have circutry which can manipulate the high and low voltages dynamically.

Transistors contain 3 or more regions of semiconductor material. The simplest type have what is referred to as a Base, Collector, and Emitter region. 

![bjt diagram](/assets/bjt.png)

Usually the line diagram with the "arrow pointing in" is used to represent the transistor in schematics.

By injecting a voltage (and tiny current) at the base, the motion of electrons causes an avalanche effect if the collector & emitter have a voltage across them. The tiny input force causes a much larger output force, though it saturates at a certain point. This association allows one electrical signal to impact the flow of another signal, much as a human turning a light switch on and off impacts the flow of electricity to a lamp.

![bjt as switch](/assets/bjt_as_switch.png)

This switching action of the transistor is the basis upon which information can be manipulated. By carefully combining transistors, along with small numbers of other components, basic "logic gates" can be built up. These rudamentory gates have one or more inputs, and a single output, and computer boolean operations like AND, OR, and NOT with electronics.

The exact construction of logic gates from transistors is beyond the scope of this blog because, indeed, learning about how it *actually* works requires a much deeper dive into the various types of transistors available. In my opinion, this is a topic better suited for folks interested in designing processor circuitry, rather than writing software. For the curious, [HyperPhysics](http://hyperphysics.phy-astr.gsu.edu/hbase/Electronic/trangate.html) has some examples of how gates can be constructed from the BJT transistors we have explained already.

Therefor, we make the following two abstractions:

1. *A transistor is a device which controls the flow of electricity*
2. *Transistors can be combined to build logic gates, which implement basic logic functions*

Just remember these two, and you'll be fine going forward!

