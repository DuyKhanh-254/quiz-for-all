Add-Type -AssemblyName System.Drawing

function Crop-Image($srcPath, $dstPath, $x, $y, $w, $h) {
    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $srcRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $dstRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $g.DrawImage($srcImg, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $dstDir = [System.IO.Path]::GetDirectoryName($dstPath)
    if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force }

    $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()
    $srcImg.Dispose()
    Write-Host "Saved $dstPath ($w x $h)"
}

$raw = "d:\WEB_QUIZ\content\test-11-assets\raw"
$out = "d:\WEB_QUIZ\content\test-11-assets\images"

# Crop main classroom scene from page 34
Crop-Image "$raw\page-34.jpg" "$out\test11-scene.jpg" 198 351 864 810

Write-Host "Test 11 images cropped successfully!"
