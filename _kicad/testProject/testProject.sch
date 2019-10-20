EESchema Schematic File Version 4
LIBS:testProject-cache
EELAYER 29 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L 74xx:74HC86 U1
U 1 1 5D1C42B6
P 4150 1950
F 0 "U1" H 4150 2275 50  0001 C CNN
F 1 "74HC86" H 4150 2184 50  0001 C CNN
F 2 "" H 4150 1950 50  0001 C CNN
F 3 "http://www.ti.com/lit/gpn/sn74HC86" H 4150 1950 50  0001 C CNN
	1    4150 1950
	1    0    0    -1  
$EndComp
$Comp
L 74xx:74HC86 U?
U 2 1 5D1C554B
P 4150 2500
F 0 "U?" H 4150 2825 50  0001 C CNN
F 1 "74HC86" H 4150 2734 50  0001 C CNN
F 2 "" H 4150 2500 50  0001 C CNN
F 3 "http://www.ti.com/lit/gpn/sn74HC86" H 4150 2500 50  0001 C CNN
	2    4150 2500
	1    0    0    -1  
$EndComp
$Comp
L 74xx:74HC86 U?
U 3 1 5D1C7905
P 4150 3050
F 0 "U?" H 4150 3375 50  0001 C CNN
F 1 "74HC86" H 4150 3284 50  0001 C CNN
F 2 "" H 4150 3050 50  0001 C CNN
F 3 "http://www.ti.com/lit/gpn/sn74HC86" H 4150 3050 50  0001 C CNN
	3    4150 3050
	1    0    0    -1  
$EndComp
$Comp
L 74xx:74HC86 U?
U 4 1 5D1C93EF
P 4150 3550
F 0 "U?" H 4150 3875 50  0001 C CNN
F 1 "74HC86" H 4150 3784 50  0001 C CNN
F 2 "" H 4150 3550 50  0001 C CNN
F 3 "http://www.ti.com/lit/gpn/sn74HC86" H 4150 3550 50  0001 C CNN
	4    4150 3550
	1    0    0    -1  
$EndComp
$Comp
L 74xGxx:74AHC1G04 U?
U 1 1 5D1CA2DC
P 5000 1950
F 0 "U?" H 4975 2217 50  0001 C CNN
F 1 "74AHC1G04" H 4975 2126 50  0001 C CNN
F 2 "" H 5000 1950 50  0001 C CNN
F 3 "http://www.ti.com/lit/sg/scyt129e/scyt129e.pdf" H 5000 1950 50  0001 C CNN
	1    5000 1950
	1    0    0    -1  
$EndComp
$Comp
L 74xGxx:74AHC1G04 U?
U 1 1 5D1CAF5E
P 5000 2500
F 0 "U?" H 4975 2767 50  0001 C CNN
F 1 "74AHC1G04" H 4975 2676 50  0001 C CNN
F 2 "" H 5000 2500 50  0001 C CNN
F 3 "http://www.ti.com/lit/sg/scyt129e/scyt129e.pdf" H 5000 2500 50  0001 C CNN
	1    5000 2500
	1    0    0    -1  
$EndComp
$Comp
L 74xGxx:74AHC1G04 U?
U 1 1 5D1CB62A
P 5000 3050
F 0 "U?" H 4975 3317 50  0001 C CNN
F 1 "74AHC1G04" H 4975 3226 50  0001 C CNN
F 2 "" H 5000 3050 50  0001 C CNN
F 3 "http://www.ti.com/lit/sg/scyt129e/scyt129e.pdf" H 5000 3050 50  0001 C CNN
	1    5000 3050
	1    0    0    -1  
$EndComp
$Comp
L 74xGxx:74AHC1G04 U?
U 1 1 5D1CBD1F
P 5000 3550
F 0 "U?" H 4975 3817 50  0001 C CNN
F 1 "74AHC1G04" H 4975 3726 50  0001 C CNN
F 2 "" H 5000 3550 50  0001 C CNN
F 3 "http://www.ti.com/lit/sg/scyt129e/scyt129e.pdf" H 5000 3550 50  0001 C CNN
	1    5000 3550
	1    0    0    -1  
$EndComp
Wire Wire Line
	4450 2500 4700 2500
Wire Wire Line
	4450 3050 4700 3050
Wire Wire Line
	5250 1950 5600 1950
Wire Wire Line
	5600 1950 5600 2550
Wire Wire Line
	5600 2550 5950 2550
Wire Wire Line
	5600 3550 5600 2850
Wire Wire Line
	5600 2850 5950 2850
Wire Wire Line
	5250 2500 5450 2500
Wire Wire Line
	5450 2500 5450 2650
Wire Wire Line
	5450 2650 5950 2650
Wire Wire Line
	5250 3050 5450 3050
Wire Wire Line
	5450 3050 5450 2750
Wire Wire Line
	5450 2750 5950 2750
Text GLabel 6750 2700 2    50   Input ~ 0
Alarm
Wire Wire Line
	6550 2700 6750 2700
Text GLabel 3500 1850 0    50   Input ~ 0
A_0
Text GLabel 3500 2050 0    50   Input ~ 0
B_0
Wire Wire Line
	3500 1850 3850 1850
Wire Wire Line
	3500 2050 3850 2050
Text GLabel 3500 2400 0    50   Input ~ 0
A_1
Text GLabel 3500 2600 0    50   Input ~ 0
B_1
Wire Wire Line
	3500 2400 3850 2400
Wire Wire Line
	3500 2600 3850 2600
Text GLabel 3500 2950 0    50   Input ~ 0
A_2
Text GLabel 3500 3150 0    50   Input ~ 0
B_2
Wire Wire Line
	3500 2950 3850 2950
Wire Wire Line
	3500 3150 3850 3150
Text GLabel 3500 3450 0    50   Input ~ 0
A_3
Text GLabel 3500 3650 0    50   Input ~ 0
B_3
Wire Wire Line
	3500 3450 3850 3450
Wire Wire Line
	3500 3650 3850 3650
Wire Wire Line
	4450 1950 4700 1950
Wire Wire Line
	5250 3550 5600 3550
Wire Wire Line
	4700 3550 4450 3550
$Comp
L 74xx:74LS21 U?
U 1 1 5D1F16BA
P 6250 2700
F 0 "U?" H 6250 3075 50  0001 C CNN
F 1 "74LS21" H 6250 2984 50  0001 C CNN
F 2 "" H 6250 2700 50  0001 C CNN
F 3 "http://www.ti.com/lit/gpn/sn74LS21" H 6250 2700 50  0001 C CNN
	1    6250 2700
	1    0    0    -1  
$EndComp
$Comp
L 74xGxx:74AUC2G79 U?
U 1 1 5D1F7C18
P 4600 5050
F 0 "U?" H 4600 5367 50  0001 C CNN
F 1 "74AUC2G79" H 4600 5276 50  0001 C CNN
F 2 "" H 4600 5050 50  0001 C CNN
F 3 "http://www.ti.com/lit/sg/scyt129e/scyt129e.pdf" H 4600 5050 50  0001 C CNN
	1    4600 5050
	1    0    0    -1  
$EndComp
$Comp
L 74xGxx:74AUC2G79 U?
U 2 1 5D1F90F4
P 4600 5600
F 0 "U?" H 4600 5917 50  0001 C CNN
F 1 "74AUC2G79" H 4600 5826 50  0001 C CNN
F 2 "" H 4600 5600 50  0001 C CNN
F 3 "http://www.ti.com/lit/sg/scyt129e/scyt129e.pdf" H 4600 5600 50  0001 C CNN
	2    4600 5600
	1    0    0    -1  
$EndComp
$Comp
L 74xGxx:74AUC2G79 U?
U 1 1 5D1FA02D
P 4600 6150
F 0 "U?" H 4600 6467 50  0001 C CNN
F 1 "74AUC2G79" H 4600 6376 50  0001 C CNN
F 2 "" H 4600 6150 50  0001 C CNN
F 3 "http://www.ti.com/lit/sg/scyt129e/scyt129e.pdf" H 4600 6150 50  0001 C CNN
	1    4600 6150
	1    0    0    -1  
$EndComp
$Comp
L 74xGxx:74AUC2G79 U?
U 2 1 5D1FA890
P 4600 6700
F 0 "U?" H 4600 7017 50  0001 C CNN
F 1 "74AUC2G79" H 4600 6926 50  0001 C CNN
F 2 "" H 4600 6700 50  0001 C CNN
F 3 "http://www.ti.com/lit/sg/scyt129e/scyt129e.pdf" H 4600 6700 50  0001 C CNN
	2    4600 6700
	1    0    0    -1  
$EndComp
Text GLabel 3850 4950 0    50   Input ~ 0
IN_0
Text GLabel 5350 4950 2    50   Input ~ 0
OUT_0
Wire Wire Line
	3850 4950 4350 4950
Wire Wire Line
	4850 4950 5350 4950
Text GLabel 3850 5500 0    50   Input ~ 0
IN_1
Wire Wire Line
	3850 5500 4350 5500
Text GLabel 3850 6050 0    50   Input ~ 0
IN_2
Wire Wire Line
	3850 6050 4350 6050
Text GLabel 3850 6600 0    50   Input ~ 0
IN_3
Wire Wire Line
	3850 6600 4350 6600
Text GLabel 5350 5500 2    50   Input ~ 0
OUT_1
Wire Wire Line
	4850 5500 5350 5500
Text GLabel 5350 6050 2    50   Input ~ 0
OUT_2
Wire Wire Line
	4850 6050 5350 6050
Text GLabel 5350 6600 2    50   Input ~ 0
OUT_3
Wire Wire Line
	4850 6600 5350 6600
Text GLabel 3850 6800 0    50   Input ~ 0
CLK
Wire Wire Line
	3850 6800 4250 6800
Wire Wire Line
	4250 6250 4350 6250
Wire Wire Line
	4250 6250 4250 6800
Connection ~ 4250 6800
Wire Wire Line
	4250 6800 4350 6800
Wire Wire Line
	4350 5700 4250 5700
Wire Wire Line
	4250 5700 4250 6250
Connection ~ 4250 6250
Wire Wire Line
	4350 5150 4250 5150
Wire Wire Line
	4250 5150 4250 5700
Connection ~ 4250 5700
$Comp
L 74xx:74LS83 U?
U 1 1 5D212947
P 9000 2850
F 0 "U?" H 9000 3831 50  0000 C CNN
F 1 "74LS83" H 9000 3740 50  0000 C CNN
F 2 "" H 9000 2850 50  0001 C CNN
F 3 "http://www.ti.com/lit/gpn/sn74LS83" H 9000 2850 50  0001 C CNN
	1    9000 2850
	1    0    0    -1  
$EndComp
$EndSCHEMATC
