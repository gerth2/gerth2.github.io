:: Requires minGW, and NASM (https://www.nasm.us/), both on the system path

:: Call the assembler (NASM) to convert our code into 1's and 0's that can go on an x86 processor
:: Will create a new file with extension .obj with the results of that operation
nasm -felf -g sample_1.asm

:: Link our code with windows specific runtime libraries to allow it to execute in a Windows environment
:: Produce a .exe file with our code inside of it, so Windows knows how to load our code into RAM and run it.
gcc sample_1.o -o sample_1.exe

:: Run our program in a debugger (gdb), which will allow us to see the results of our program
:: Use the commands in debugger_commands.txt to automate the steps required to getting to see our results
gdb sample_1.exe -x debugger_commands.txt

:: Keep the console open so we can see the results
pause