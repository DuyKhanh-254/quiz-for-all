Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap("d:\WEB_QUIZ\content\test-7-assets\raw\page-34.jpg")

# Find bounding box of the large illustration on page 34:
# We know the background outside the box is white (R>240, G>240, B>240)
# Inside the box is colored artwork.
# Let's find the non-white bounding box in range x: [100..1100], y: [250..1300]

$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

for ($y = 300; $y -lt 1300; $y++) {
    for ($x = 100; $x -lt 1100; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Check if pixel is not white/light grey (e.g. R<230 or G<230 or B<230)
        # Also ignore the audio bar or text if any
        if ($c.R -lt 200 -or $c.G -lt 200 -or $c.B -lt 200) {
            # Let's check if it's the black border line
            if ($c.R -lt 100 -and $c.G -lt 100 -and $c.B -lt 100) {
                # Could be border
            }
        }
    }
}

# Let's inspect specific horizontal lines across y=500
Write-Host "Horizontal scan across y=500:"
for ($x = 100; $x -lt 1100; $x += 10) {
    $c = $bmp.GetPixel($x, 500)
    if ($c.R -lt 100 -and $c.G -lt 100 -and $c.B -lt 100) {
        Write-Host "Dark pixel at x=$x (R=$($c.R), G=$($c.G), B=$($c.B))"
    }
}

# Horizontal scan across y=700
Write-Host "Horizontal scan across y=700:"
for ($x = 100; $x -lt 1100; $x += 10) {
    $c = $bmp.GetPixel($x, 700)
    if ($c.R -lt 100 -and $c.G -lt 100 -and $c.B -lt 100) {
        Write-Host "Dark pixel at x=$x (R=$($c.R), G=$($c.G), B=$($c.B))"
    }
}

$bmp.Dispose()
