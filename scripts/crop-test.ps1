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

# Crop test Q1 from page-36.jpg
Crop-Image "d:\WEB_QUIZ\content\test-3-assets\page-36.jpg" "d:\WEB_QUIZ\content\test-3-assets\test3-part3-q1.jpg" 230 760 950 310
# Crop test Q2 from page-36.jpg
Crop-Image "d:\WEB_QUIZ\content\test-3-assets\page-36.jpg" "d:\WEB_QUIZ\content\test-3-assets\test3-part3-q2.jpg" 230 1250 950 310

# Crop test Q3 from page-37.jpg
Crop-Image "d:\WEB_QUIZ\content\test-3-assets\page-37.jpg" "d:\WEB_QUIZ\content\test-3-assets\test3-part3-q3.jpg" 120 110 950 310
# Crop test Q4 from page-37.jpg
Crop-Image "d:\WEB_QUIZ\content\test-3-assets\page-37.jpg" "d:\WEB_QUIZ\content\test-3-assets\test3-part3-q4.jpg" 120 600 950 310
# Crop test Q5 from page-37.jpg
Crop-Image "d:\WEB_QUIZ\content\test-3-assets\page-37.jpg" "d:\WEB_QUIZ\content\test-3-assets\test3-part3-q5.jpg" 120 1090 950 310
