Add-Type -AssemblyName System.Drawing

function Find-Borders($srcPath, $minW, $minH, $maxW, $maxH) {
    $bmp = New-Object System.Drawing.Bitmap($srcPath)
    Write-Host "Scanning $srcPath ($($bmp.Width) x $($bmp.Height))..."

    # Let's sample horizontal and vertical dark lines
    # A box border has black pixels (R,G,B all < 60)
    for ($y = 100; $y -lt $bmp.Height - 100; $y += 5) {
        for ($x = 100; $x -lt $bmp.Width - 100; $x += 5) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.R -lt 50 -and $c.G -lt 50 -and $c.B -lt 50) {
                # Check if it's a top-left corner of a box
                # Check horizontal span to the right
                $w = 0
                for ($tx = $x; $tx -lt [Math]::Min($bmp.Width - 10, $x + $maxW + 20); $tx++) {
                    $tc = $bmp.GetPixel($tx, $y)
                    if ($tc.R -lt 70 -and $tc.G -lt 70 -and $tc.B -lt 70) {
                        $w++
                    } else {
                        break
                    }
                }
                # Check vertical span downwards
                $h = 0
                for ($ty = $y; $ty -lt [Math]::Min($bmp.Height - 10, $y + $maxH + 20); $ty++) {
                    $tc = $bmp.GetPixel($x, $ty)
                    if ($tc.R -lt 70 -and $tc.G -lt 70 -and $tc.B -lt 70) {
                        $h++
                    } else {
                        break
                    }
                }

                if ($w -ge $minW -and $h -ge $minH) {
                    # Verify opposite corners
                    $rx = $x + $w - 1
                    $by = $y + $h - 1
                    Write-Host "Candidate at ($x, $y) span w=$w, h=$h"
                }
            }
        }
    }
    $bmp.Dispose()
}

Find-Borders "d:\WEB_QUIZ\content\test-7-assets\raw\page-34.jpg" 300 300 1000 1000
