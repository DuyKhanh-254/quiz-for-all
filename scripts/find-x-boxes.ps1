Add-Type -AssemblyName System.Drawing

function Find-X-Boxes($pagePath, $name, $y1, $y2) {
    $bmp = New-Object System.Drawing.Bitmap($pagePath)
    Write-Host "=== $name for Y=[$y1..$y2] ==="
    
    $colNonWhite = New-Object int[] $bmp.Width
    for ($y = $y1; $y -le $y2; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
                $colNonWhite[$x]++
            }
        }
    }
    
    $threshold = ($y2 - $y1) * 0.2
    $inBlock = $false
    $startX = 0
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        if ($colNonWhite[$x] -gt $threshold -and -not $inBlock) {
            $inBlock = $true
            $startX = $x
        } elseif ($colNonWhite[$x] -le $threshold -and $inBlock) {
            $inBlock = $false
            Write-Host "  Box X: $startX to $x (width = $($x - $startX))"
        }
    }
    if ($inBlock) {
        Write-Host "  Box X: $startX to $($bmp.Width - 1)"
    }
    $bmp.Dispose()
}

Find-X-Boxes "d:\WEB_QUIZ\content\test-7-assets\raw\page-34.jpg" "Page 34 Scene" 354 1196
Find-X-Boxes "d:\WEB_QUIZ\content\test-7-assets\raw\page-36.jpg" "Page 36 Q1" 786 1057
Find-X-Boxes "d:\WEB_QUIZ\content\test-7-assets\raw\page-36.jpg" "Page 36 Q2" 1203 1479
Find-X-Boxes "d:\WEB_QUIZ\content\test-7-assets\raw\page-37.jpg" "Page 37 Q3" 225 489
Find-X-Boxes "d:\WEB_QUIZ\content\test-7-assets\raw\page-37.jpg" "Page 37 Q4" 638 902
Find-X-Boxes "d:\WEB_QUIZ\content\test-7-assets\raw\page-37.jpg" "Page 37 Q5" 1052 1317
