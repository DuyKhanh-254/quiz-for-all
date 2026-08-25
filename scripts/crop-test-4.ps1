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

$base = "d:\WEB_QUIZ\content\test-4-assets"
$page8 = "$base\page-8.jpg"
$page9 = "$base\page-9.jpg"

# Page 8: Q1 (Anna)
Crop-Image $page8 "$base\q1-a.jpg" 263 775 260 260
Crop-Image $page8 "$base\q1-b.jpg" 540 775 260 260
Crop-Image $page8 "$base\q1-c.jpg" 817 775 260 260

# Page 8: Q2 (Bill's dad)
Crop-Image $page8 "$base\q2-a.jpg" 263 1195 260 260
Crop-Image $page8 "$base\q2-b.jpg" 540 1195 260 260
Crop-Image $page8 "$base\q2-c.jpg" 817 1195 260 260

# Page 9: Q3 (Sam)
Crop-Image $page9 "$base\q3-a.jpg" 235 220 258 258
Crop-Image $page9 "$base\q3-b.jpg" 508 220 258 258
Crop-Image $page9 "$base\q3-c.jpg" 780 220 258 258

# Page 9: Q4 (Jill's bedroom)
Crop-Image $page9 "$base\q4-a.jpg" 235 630 258 258
Crop-Image $page9 "$base\q4-b.jpg" 508 630 258 258
Crop-Image $page9 "$base\q4-c.jpg" 780 630 258 258

# Page 9: Q5 (Nick's brother)
Crop-Image $page9 "$base\q5-a.jpg" 238 1040 258 258
Crop-Image $page9 "$base\q5-b.jpg" 510 1040 258 258
Crop-Image $page9 "$base\q5-c.jpg" 782 1040 258 258
