; ----------------------------------------------------------------------------
; sample.asm
; ----------------------------------------------------------------------------

    global  _main

; ----------------------------------------------------------------------------
; Code Starts Here

section .text

_main:
    mov EAX, 0x25  ; Init some values for comparison
    mov EBX, 0x8F   

    cmp EAX, EBX   ; Perform the comparison operation of EAX against EBX
    jg  _a_big     ; if EAX was greater, go to section _a_big
    je  _same      ; Otherwise, if equal, go to section _same
    jmp _b_big     ; Otherwise, EBX must have been bigger. 

_a_big:
    mov ECX, 0x0A  ; since A was greater, put "A" into ECX
    jmp _done

_b_big:
    mov ECX, 0x0B  ; since B was greater, put "B" into ECX
    jmp _done

_same:
    mov ECX, 0xAB  ; since they were equal, put "AB" into ECX
    jmp _done

_done:
    ; We are done executing - return control to the operating system
    retn 
