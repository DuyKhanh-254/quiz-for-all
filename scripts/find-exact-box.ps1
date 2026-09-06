Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap("d:\WEB_QUIZ\content\test-3-assets\page-33.jpg")

# Find top Y (where density jumps above 800)
$topY = 0
for ($y = 300; $y -lt 400; $y++) {
    $count = 0
    for ($x = 100; $x -lt $bmp.Width - 100; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 230 -or $c.G -lt 230 -or $c.B -lt 230) { $count++ }
    }
    if ($count -gt 800) { $topY = $y; break }
}

# Find bottom Y
$bottomY = 0
for ($y = 1600; $y -gt 1500; $y--) {
    $count = 0
    for ($x = 100; $x -lt $bmp.Width - 100; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 230 -or $c.G -lt 230 -or $c.B -lt 230) { $count++ }
    }
    if ($count -gt 800) { $bottomY = $y; break }
}

# Find left X and right X across mid Y (e.g. y=800)
$leftX = 0
for ($x = 50; $x -lt 300; $x++) {
    $c = $bmp.GetPixel($x, 800)
    if ($c.R -lt 200 -or $c.G -lt 200 -or $c.B -lt 200) { $leftX = $x; break }
}

$rightX = 0
for ($x = $bmp.Width - 50; $x -gt $bmp.Width - 300; $x--) {
    $c = $bmp.GetPixel($x, 800)
    if ($c.R -lt 200 -or $c.G -lt 200 -or $c.B -lt 200) { $rightX = $x; break }
}

Write-Host "Box coordinates: Left=$leftX, Top=$topY, Right=$rightX, Bottom=$bottomY, Width=$($rightX - $leftX), Height=$($bottomY - $topY)"

$bmp.Dispose()
