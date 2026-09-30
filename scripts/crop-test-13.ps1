Add-Type -AssemblyName System.Drawing

function Crop-Image($srcPath, $dstPath, $x, $y, $w, $h) {
    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $srcRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $dstRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $g.DrawImage($srcImg, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()
    $srcImg.Dispose()
    Write-Host "Saved $dstPath ($w x $h)"
}

function Find-Box($path) {
    $bmp = New-Object System.Drawing.Bitmap($path)
    Write-Host "Analyzing $path ($($bmp.Width)x$($bmp.Height))"
    
    # Sample along diagonal or vertical lines to locate box
    # Find Y top: black line around x=600, y between 400 and 600
    $topY = 0
    for ($y = 400; $y -lt 600; $y++) {
        $c = $bmp.GetPixel(600, $y)
        if ($c.R -lt 60 -and $c.G -lt 60 -and $c.B -lt 60) {
            $topY = $y
            break
        }
    }
    
    # Find Y bottom: black line around x=600, y between 900 and 1600
    $botY = 0
    for ($y = 1500; $y -gt 900; $y--) {
        $c = $bmp.GetPixel(600, $y)
        if ($c.R -lt 60 -and $c.G -lt 60 -and $c.B -lt 60) {
            $botY = $y
            break
        }
    }
    
    # Find X left: black line around y=1000, x between 50 and 200
    $leftX = 0
    for ($x = 50; $x -lt 200; $x++) {
        $c = $bmp.GetPixel($x, 1000)
        if ($c.R -lt 60 -and $c.G -lt 60 -and $c.B -lt 60) {
            $leftX = $x
            break
        }
    }
    
    # Find X right: black line around y=1000, x between 1100 and 1350
    $rightX = 0
    for ($x = 1350; $x -gt 1100; $x--) {
        $c = $bmp.GetPixel($x, 1000)
        if ($c.R -lt 60 -and $c.G -lt 60 -and $c.B -lt 60) {
            $rightX = $x
            break
        }
    }
    
    $bmp.Dispose()
    Write-Host "Detected: Left=$leftX, Top=$topY, Right=$rightX, Bottom=$botY, Width=$($rightX - $leftX), Height=$($botY - $topY)"
    return @{ Left = $leftX; Top = $topY; Right = $rightX; Bottom = $botY; Width = ($rightX - $leftX); Height = ($botY - $topY) }
}

$p35 = Find-Box "D:\WEB_QUIZ\content\test-13-assets\raw\page-35.jpg"
$p36 = Find-Box "D:\WEB_QUIZ\content\test-13-assets\raw\page-36.jpg"

Crop-Image "D:\WEB_QUIZ\content\test-13-assets\raw\page-35.jpg" "D:\WEB_QUIZ\content\test-13-assets\images\test13-bedroom-scene.jpg" $p35.Left $p35.Top $p35.Width $p35.Height
Crop-Image "D:\WEB_QUIZ\content\test-13-assets\raw\page-36.jpg" "D:\WEB_QUIZ\content\test-13-assets\images\test13-park-scene.jpg" $p36.Left $p36.Top $p36.Width $p36.Height
