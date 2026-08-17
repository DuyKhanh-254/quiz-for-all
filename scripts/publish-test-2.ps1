$runtimeEnv = Join-Path $PSScriptRoot "..\.env.test2.local"
$defaultEnv = Join-Path $PSScriptRoot "..\.env.local"
$envFile = if (Test-Path $runtimeEnv) { $runtimeEnv } else { $defaultEnv }
if (-not (Test-Path $envFile)) { throw "No local environment file was found." }

Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$') {
    $name = $Matches[1]
    $value = $Matches[2].Trim().Trim('"').Trim("'")
    Set-Item -Path "Env:$name" -Value $value
  }
}

node (Join-Path $PSScriptRoot "upload-test-2-media.mjs")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node (Join-Path $PSScriptRoot "import-quiz.mjs") test-2
exit $LASTEXITCODE
