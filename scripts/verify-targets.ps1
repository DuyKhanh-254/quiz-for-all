Add-Type -AssemblyName System.Drawing

$src = "d:\WEB_QUIZ\content\test-8-assets\images\test8-part1-scene.jpg"
$dst = "d:\WEB_QUIZ\content\test-8-assets\images\test8-preview-targets.jpg"

$bmp = [System.Drawing.Bitmap]::FromFile($src)
$g = [System.Drawing.Graphics]::FromImage($bmp)

$targets = @(
    @{ name = "Anna"; x = 0.340; y = 0.355; color = [System.Drawing.Color]::Lime },
    @{ name = "Mother"; x = 0.185; y = 0.310; color = [System.Drawing.Color]::Gray },
    @{ name = "Mark"; x = 0.655; y = 0.400; color = [System.Drawing.Color]::Blue },
    @{ name = "Jill"; x = 0.790; y = 0.460; color = [System.Drawing.Color]::Purple },
    @{ name = "Sue"; x = 0.415; y = 0.620; color = [System.Drawing.Color]::Red },
    @{ name = "Hugo"; x = 0.175; y = 0.770; color = [System.Drawing.Color]::Cyan },
    @{ name = "Ben"; x = 0.700; y = 0.790; color = [System.Drawing.Color]::Orange }
)

$font = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)

foreach ($t in $targets) {
    $px = [int]($t.x * $bmp.Width)
    $py = [int]($t.y * $bmp.Height)
    $brush = New-Object System.Drawing.SolidBrush($t.color)
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 4)
    
    # Draw circle
    $g.FillEllipse($brush, $px - 18, $py - 18, 36, 36)
    $g.DrawEllipse($pen, $px - 18, $py - 18, 36, 36)
    
    # Draw text label with shadow
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $g.DrawString($t.name, $font, $shadowBrush, $px + 22, $py - 10)
    $g.DrawString($t.name, $font, $textBrush, $px + 20, $py - 11)
    
    $brush.Dispose()
    $pen.Dispose()
    $shadowBrush.Dispose()
    $textBrush.Dispose()
}

$bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$font.Dispose()
$bmp.Dispose()

Write-Host "Updated target verification image: $dst"
