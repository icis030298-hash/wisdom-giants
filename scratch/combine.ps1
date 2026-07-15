$p1 = Get-Content scratch/part1.json -Encoding UTF8 -Raw
$p2 = Get-Content scratch/part2.json -Encoding UTF8 -Raw
$p3 = Get-Content scratch/part3.json -Encoding UTF8 -Raw
$p4 = Get-Content scratch/part4.json -Encoding UTF8 -Raw
$p5 = Get-Content scratch/part5.json -Encoding UTF8 -Raw

$all = $p1 + "," + $p2 + "," + $p3 + "," + $p4 + "," + $p5 + "`r`n}"
Set-Content scratch/uk_batch_6_out.json -Value $all -Encoding UTF8
