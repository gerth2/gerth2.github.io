; ----------------------------------------------------------------------------
; sample.asm
; ----------------------------------------------------------------------------

    global  _main

; ----------------------------------------------------------------------------
; Code Starts Here

section .text

_main:
    mov EAX, 10   ; Init our inputs with some values
    mov EBX, 15

    mov ECX, EAX  ; Copy first operand into the output location
    add ECX, EBX  ; Add the value in ECX (same as EAX) to EBX, storing back into ECX
                  ; ECX should be 10+15 = 25

    mov EDX, EAX  ; Copy first operand into the output location
    sub EDX, EBX  ; Subtract the value in EDX (same as EAX) from EBX, storing back into EDX
                  ; EDX should be 10-15 = -5


    ; We are done executing - return control to the operating system
    retn 

; ----------------------------------------------------------------------------
; Global Variables

section .data

