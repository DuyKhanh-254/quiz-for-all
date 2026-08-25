New-Item -ItemType Directory -Force -Path "d:\WEB_QUIZ\content\test-4-assets\audio"
$imgBase = "https://online.flipbuilder.com/sdtta/jlmw/files/mobile/"
$pages = 6..11
foreach ($p in $pages) {
    $url = "$imgBase$p.jpg"
    $dest = "d:\WEB_QUIZ\content\test-4-assets\page-$p.jpg"
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        Write-Host "Downloaded page $p"
    } catch {
        Write-Host "Failed page $p"
    }
}
$audioBase = "https://online.flipbuilder.com/sdtta/jlmw/files/pageConfig/"
$audios = @(
    @("02 Track 2_2.mp3", "test4-lis-part2.mp3"),
    @("03 Track 3_2.mp3", "test4-lis-part3.mp3"),
    @("04 Track 4_2.mp3", "test4-lis-part4.mp3")
)
foreach ($pair in $audios) {
    $src = [uri]::EscapeDataString($pair[0])
    $dst = $pair[1]
    $url = "$audioBase$src"
    $dest = "d:\WEB_QUIZ\content\test-4-assets\audio\$dst"
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        Write-Host "Downloaded audio $dst"
    } catch {
        Write-Host "Failed audio $dst"
    }
}
