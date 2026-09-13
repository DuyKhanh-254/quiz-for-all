Add-Type -AssemblyName System.Drawing

function Crop-Image($srcPath, $dstPath, $x, $y, $w, $h) {
    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    Write-Host "Source image size: $($srcImg.Width) x $($srcImg.Height)"
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

$p34 = "$raw\page-34.jpg"

# Page 34: Part 2 Scene
Crop-Image $p34 "$out\test10-part2-scene.jpg" 246 354 845 842
