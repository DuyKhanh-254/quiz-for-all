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

$raw = "d:\WEB_QUIZ\content\test-7-assets\raw"
$out = "d:\WEB_QUIZ\content\test-7-assets\images"
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out -Force }

$p34 = "$raw\page-34.jpg"
$p36 = "$raw\page-36.jpg"
$p37 = "$raw\page-37.jpg"

# Page 34: Part 2 Scene
Crop-Image $p34 "$out\part-2-scene.jpg" 246 354 845 842

# Page 36: Q1 (Tom's dinner)
Crop-Image $p36 "$out\q1-a.jpg" 256 786 273 271
Crop-Image $p36 "$out\q1-b.jpg" 537 786 273 271
Crop-Image $p36 "$out\q1-c.jpg" 816 786 273 271

# Page 36: Q2 (Anna)
Crop-Image $p36 "$out\q2-a.jpg" 256 1203 273 276
Crop-Image $p36 "$out\q2-b.jpg" 537 1203 273 276
Crop-Image $p36 "$out\q2-c.jpg" 816 1203 273 276

# Page 37: Q3 (May's mouse)
Crop-Image $p37 "$out\q3-a.jpg" 229 225 265 264
Crop-Image $p37 "$out\q3-b.jpg" 505 225 265 264
Crop-Image $p37 "$out\q3-c.jpg" 781 225 265 264

# Page 37: Q4 (Ben's sport)
Crop-Image $p37 "$out\q4-a.jpg" 229 638 265 264
Crop-Image $p37 "$out\q4-b.jpg" 505 638 265 264
Crop-Image $p37 "$out\q4-c.jpg" 781 638 265 264

# Page 37: Q5 (Alex)
Crop-Image $p37 "$out\q5-a.jpg" 230 1052 265 265
Crop-Image $p37 "$out\q5-b.jpg" 506 1052 265 265
Crop-Image $p37 "$out\q5-c.jpg" 782 1052 265 265
