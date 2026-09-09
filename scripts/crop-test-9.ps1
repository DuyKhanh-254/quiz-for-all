Add-Type -AssemblyName System.Drawing

function Crop-Image($srcPath, $dstPath, $x, $y, $w, $h) {
    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $srcRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $dstRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $g.DrawImage($srcImg, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    # Save with high quality jpeg
    $dstDir = [System.IO.Path]::GetDirectoryName($dstPath)
    if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force }

    $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()
    $srcImg.Dispose()
    Write-Host "Saved $dstPath ($w x $h)"
}

$raw = "d:\WEB_QUIZ\content\test-9-assets\raw"
$out = "d:\WEB_QUIZ\content\test-9-assets\images"
$lis = "$out\listening"

# 1. Part 1: Robot Scene
Crop-Image "$raw\page-6.jpg" "$out\test9-part1-scene.jpg" 212 365 864 860

# 2. Part 2 (Part 3 in book): Option images
# Q1: Dad
Crop-Image "$raw\page-8.jpg" "$lis\q1-a.jpg" 210 805 280 280
Crop-Image "$raw\page-8.jpg" "$lis\q1-b.jpg" 502 805 280 280
Crop-Image "$raw\page-8.jpg" "$lis\q1-c.jpg" 796 805 280 280

# Q2: Anna's sister
Crop-Image "$raw\page-8.jpg" "$lis\q2-a.jpg" 210 1245 280 280
Crop-Image "$raw\page-8.jpg" "$lis\q2-b.jpg" 502 1245 280 280
Crop-Image "$raw\page-8.jpg" "$lis\q2-c.jpg" 796 1245 280 280

# Q3: Sam's school bag
Crop-Image "$raw\page-9.jpg" "$lis\q3-a.jpg" 192 205 282 280
Crop-Image "$raw\page-9.jpg" "$lis\q3-b.jpg" 488 205 282 280
Crop-Image "$raw\page-9.jpg" "$lis\q3-c.jpg" 784 205 282 280

# Q4: Grandpa's glasses
Crop-Image "$raw\page-9.jpg" "$lis\q4-a.jpg" 192 650 282 280
Crop-Image "$raw\page-9.jpg" "$lis\q4-b.jpg" 488 650 282 280
Crop-Image "$raw\page-9.jpg" "$lis\q4-c.jpg" 784 650 282 280

# Q5: May drawing
Crop-Image "$raw\page-9.jpg" "$lis\q5-a.jpg" 192 1090 282 280
Crop-Image "$raw\page-9.jpg" "$lis\q5-b.jpg" 488 1090 282 280
Crop-Image "$raw\page-9.jpg" "$lis\q5-c.jpg" 784 1090 282 280

# 3. Part 3: Kitchen Scene
Crop-Image "$raw\page-10.jpg" "$out\test9-part3-scene.jpg" 120 325 1022 1245

Write-Host "All Test 9 images cropped successfully!"
