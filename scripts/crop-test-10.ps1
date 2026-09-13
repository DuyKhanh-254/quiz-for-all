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

$raw = "d:\WEB_QUIZ\content\test-10-assets\raw"
$out = "d:\WEB_QUIZ\content\test-10-assets\images\listening"
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out -Force }

$p22 = "$raw\page-22.jpg"
$p23 = "$raw\page-23.jpg"

# Page 22 (Q1 & Q2)
# Q1: Where is May's tablet?
Crop-Image $p22 "$out\q1-a.jpg" 208 803 279 278
Crop-Image $p22 "$out\q1-b.jpg" 503 803 279 278
Crop-Image $p22 "$out\q1-c.jpg" 798 803 279 278

# Q2: Which sport is Bill playing?
Crop-Image $p22 "$out\q2-a.jpg" 208 1246 279 277
Crop-Image $p22 "$out\q2-b.jpg" 503 1246 279 277
Crop-Image $p22 "$out\q2-c.jpg" 798 1246 279 277

# Page 23 (Q3, Q4, Q5)
# Q3: What food does Pat want for dinner?
Crop-Image $p23 "$out\q3-a.jpg" 202 203 277 275
Crop-Image $p23 "$out\q3-b.jpg" 495 203 277 275
Crop-Image $p23 "$out\q3-c.jpg" 788 203 277 275

# Q4: What is in the picture in the boy's book?
Crop-Image $p23 "$out\q4-a.jpg" 202 642 277 276
Crop-Image $p23 "$out\q4-b.jpg" 495 642 277 276
Crop-Image $p23 "$out\q4-c.jpg" 788 642 277 276

# Q5: Where is Dan now?
Crop-Image $p23 "$out\q5-a.jpg" 202 1082 277 277
Crop-Image $p23 "$out\q5-b.jpg" 495 1082 277 277
Crop-Image $p23 "$out\q5-c.jpg" 788 1082 277 277
