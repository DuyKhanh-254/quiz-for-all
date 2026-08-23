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

$base = "d:\WEB_QUIZ\content\test-3-assets"
$page36 = "$base\page-36.jpg"
$page37 = "$base\page-37.jpg"

# Q1 (Snake, Crocodile, Horse)
Crop-Image $page36 "$base\q1-a.jpg" 230 760 305 310
Crop-Image $page36 "$base\q1-b.jpg" 550 760 305 310
Crop-Image $page36 "$base\q1-c.jpg" 870 760 305 310

# Q2 (Monsters)
Crop-Image $page36 "$base\q2-a.jpg" 230 1250 305 310
Crop-Image $page36 "$base\q2-b.jpg" 550 1250 305 310
Crop-Image $page36 "$base\q2-c.jpg" 870 1250 305 310

# Q3 (Classroom, Gym, School)
Crop-Image $page37 "$base\q3-a.jpg" 120 110 305 310
Crop-Image $page37 "$base\q3-b.jpg" 440 110 305 310
Crop-Image $page37 "$base\q3-c.jpg" 760 110 305 310

# Q4 (Desk, Armchair, Lamp)
Crop-Image $page37 "$base\q4-a.jpg" 120 600 305 310
Crop-Image $page37 "$base\q4-b.jpg" 440 600 305 310
Crop-Image $page37 "$base\q4-c.jpg" 760 600 305 310

# Q5 (Potatoes, Tomatoes, Carrots)
Crop-Image $page37 "$base\q5-a.jpg" 120 1090 305 310
Crop-Image $page37 "$base\q5-b.jpg" 440 1090 305 310
Crop-Image $page37 "$base\q5-c.jpg" 760 1090 305 310
