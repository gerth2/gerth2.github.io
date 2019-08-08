:: Requires minGW, and NASM (https://www.nasm.us/), both on the system path

:: Call the assembler (NASM) to convert our code into 1's and 0's that can go on an x86 processor
:: Will create a new file with extension .obj with the results of that operation
nasm -felf -g hello_world.asm

:: Link our code with windows specific runtime libraries to allow it to execute in a Windows environment
:: Produce a .exe file with our code inside of it, so Windows knows how to load our code into RAM and run it.
gcc hello_world.o -o hello_world_asm.exe

:: Run our program
hello_world_asm.exe

:: Keep the console open so we can see the results
pause