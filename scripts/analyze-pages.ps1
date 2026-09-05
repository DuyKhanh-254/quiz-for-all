Add-Type -AssemblyName System.Drawing

function Analyze-Page($pagePath, $name) {
    $bmp = New-Object System.Drawing.Bitmap($pagePath)
    Write-Host "=== $name ($($bmp.Width) x $($bmp.Height)) ==="
    
    # Check vertical projection of non-white pixels
    # and horizontal projection
    # Also find sharp black borders
    
    $rowNonWhite = New-Object int[] $bmp.Height
    $colNonWhite = New-Object int[] $bmp.Width
    
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
                $rowNonWhite[$y]++
                $colNonWhite[$x]++
            }
        }
    }
    
    # Print ranges where non-white > 200
    Write-Host "High density Y ranges:"
    $inBlock = $false
    $startY = 0
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        if ($rowNonWhite[$y] -gt 200 -and -not $inBlock) {
            $inBlock = $true
            $startY = $y
        } elseif ($rowNonWhite[$y] -le 200 -and $inBlock) {
            $inBlock = $false
            Write-Host "  Y: $startY to $y (height = $($y - $startY), max width=$($rowNonWhite[$startY..$y] | Measure-Object -Maximum | Select-Object -ExpandProperty Maximum))"
        }
    }
    if ($inBlock) {
        Write-Host "  Y: $startY to $($bmp.Height - 1)"
    }
    
    $bmp.Dispose()
}

Analyze-Page "d:\WEB_QUIZ\content\test-7-assets\raw\page-34.jpg" "Page 34"
Analyze-Page "d:\WEB_QUIZ\content\test-7-assets\raw\page-36.jpg" "Page 36"
Analyze-Page "d:\WEB_QUIZ\content\test-7-assets\raw\page-37.jpg" "Page 37"
