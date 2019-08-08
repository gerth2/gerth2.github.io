; ----------------------------------------------------------------------------
; sample_1.asm
; ----------------------------------------------------------------------------

    global  _main

; ----------------------------------------------------------------------------
; Code Starts Here

section .text

_main:
    mov EAX, [myVariable]            ; Move the value at myVariable into EAX 
                                     ; EAX now contains 42
    mov EBX, 1234                    ; Move the constant value 1234 into EBX
                                     ; EBX now contains 1234
    mov EDX, EAX                     ; Load EDX with the present value of EAX
                                     ; EDX is now also 42
    mov dword [myOtherVariable], 25  ; Load the constant value 25 into 
                                     ;   all 32 of the bits of myOtherVariable
                                     ; The memory allocated at label 
                                     ;   "myOtherVariable" now has value 25
    mov ECX, [myOtherVariable]       ; Load ECX with the value from memory 
                                     ;   labeled "myOtherVariable"
                                     ; ECX is now also 25

    ; We are done executing - return control to the operating system
    retn 

; ----------------------------------------------------------------------------
; Global Variables

section .data
    myVariable      DD 42
    myOtherVariable DD 0xBEEFBEEF
    myBeefVariable  DD 0x0BADBEEF
