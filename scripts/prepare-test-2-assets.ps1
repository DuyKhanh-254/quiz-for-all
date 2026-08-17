Add-Type -AssemblyName System.Drawing

$sourceRoot = Join-Path $PSScriptRoot "..\test-2\source-pages\full"
$outputRoot = Join-Path $PSScriptRoot "..\content\test-2-assets"
New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null

function Export-Crop {
  param(
    [string]$Source,
    [string]$Destination,
    [int]$X,
    [int]$Y,
    [int]$Width,
    [int]$Height
  )

  $image = [System.Drawing.Image]::FromFile($Source)
  try {
    $rectangle = New-Object System.Drawing.Rectangle($X, $Y, $Width, $Height)
    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($image, (New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)), $rectangle, [System.Drawing.GraphicsUnit]::Pixel)
      } finally {
        $graphics.Dispose()
      }
      $bitmap.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    } finally {
      $bitmap.Dispose()
    }
  } finally {
    $image.Dispose()
  }
}

$page8 = Join-Path $sourceRoot "8.jpg"
$page9 = Join-Path $sourceRoot "9.jpg"
$page10 = Join-Path $sourceRoot "10.jpg"
$page14 = Join-Path $sourceRoot "14.jpg"
$page15 = Join-Path $sourceRoot "15.jpg"

Export-Crop $page8 (Join-Path $outputRoot "listening-part3-q1.jpg") 194 785 932 315
Export-Crop $page8 (Join-Path $outputRoot "listening-part3-q2.jpg") 194 1270 932 315
Export-Crop $page9 (Join-Path $outputRoot "listening-part3-q3.jpg") 128 110 934 315
Export-Crop $page9 (Join-Path $outputRoot "listening-part3-q4.jpg") 128 600 934 315
Export-Crop $page9 (Join-Path $outputRoot "listening-part3-q5.jpg") 128 1093 934 310

Export-Crop $page10 (Join-Path $outputRoot "listening-part4-scene.jpg") 100 240 1070 1450

Export-Crop $page14 (Join-Path $outputRoot "reading-part3-q1.jpg") 205 585 930 230
Export-Crop $page14 (Join-Path $outputRoot "reading-part3-q2.jpg") 205 810 930 225
Export-Crop $page14 (Join-Path $outputRoot "reading-part3-q3.jpg") 205 1025 930 245
Export-Crop $page14 (Join-Path $outputRoot "reading-part3-q4.jpg") 205 1255 930 225
Export-Crop $page14 (Join-Path $outputRoot "reading-part3-q5.jpg") 205 1470 930 235

Export-Crop $page15 (Join-Path $outputRoot "reading-part4-donkey.jpg") 105 245 1080 1430

Write-Output "Prepared Test 2 source image crops in $outputRoot"
