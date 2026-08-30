Add-Type -AssemblyName System.Drawing

function Crop-Rect($srcPath, $dstPath, $x, $y, $w, $h) {
  $src = [System.Drawing.Image]::FromFile($srcPath)
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $srcRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
  $dstRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
  $g.DrawImage($src, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $g.Dispose()
  $bmp.Dispose()
  $src.Dispose()
  Write-Host "Saved $dstPath"
}

# Page 22
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\22.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q1b-a.jpg" 248 815 272 265
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\22.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q1b-b.jpg" 528 815 272 265
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\22.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q1b-c.jpg" 808 815 272 265

Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\22.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q2b-a.jpg" 248 1228 272 265
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\22.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q2b-b.jpg" 528 1228 272 265
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\22.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q2b-c.jpg" 808 1228 272 265

# Page 23
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\23.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q3b-a.jpg" 230 238 270 262
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\23.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q3b-b.jpg" 510 238 270 262
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\23.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q3b-c.jpg" 790 238 270 262

Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\23.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q4b-a.jpg" 230 647 270 263
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\23.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q4b-b.jpg" 510 647 270 263
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\23.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q4b-c.jpg" 790 647 270 263

Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\23.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q5b-a.jpg" 230 1055 270 263
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\23.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q5b-b.jpg" 510 1055 270 263
Crop-Rect "d:\WEB_QUIZ\content\test-6-assets\pages\23.jpg" "d:\WEB_QUIZ\content\test-6-assets\images\q5b-c.jpg" 790 1055 270 263
