; ----------------------------------------------------------------------------
; sample.asm
; ----------------------------------------------------------------------------

    global  _main

; ----------------------------------------------------------------------------
; Code Starts Here

section .text

_main:
    mov EAX, 0b10101100110000111010110011000011   ; Init our inputs  
    mov EBX, 0b00001111000011110000111100001111   ; Use random-ish 32-bit values

    mov ECX, EAX          ; Copy first operand into the output location
    and ECX, EBX          ; Perform bitwise AND on the two values
    mov [andResult], ECX  ; Store into the global variable for later inspection

    mov ECX, EAX          ; Copy first operand into the output location
    or ECX, EBX           ; Perform bitwise OR on the two values
    mov [orResult], ECX   ; Store into the global variable for later inspection

    mov ECX, EAX          ; Copy first operand into the output location
    not ECX               ; Perform bitwise NOT on the first value
    mov [notResult], ECX  ; Store into the global variable for later inspection

    mov ECX, EAX          ; Copy first operand into the output location
    xor ECX, EBX          ; Perform bitwise NOT on the two values
    mov [xorResult], ECX  ; Store into the global variable for later inspection

    ; We are done executing - return control to the operating system
    retn 

; ----------------------------------------------------------------------------
; Global Variables

section .data
    andResult      DD 0x0
    orResult       DD 0x0
    notResult      DD 0x0
    xorResult      DD 0x0

