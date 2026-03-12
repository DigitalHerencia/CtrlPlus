$repoRoot = "D:\CtrlPlus"

function Set-EnvFileValue {
  param(
    [string]$Path
  )

  if (-not (Test-Path $Path)) {
    return
  }

  Get-Content $Path | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -match '^\s*$') {
      return
    }

    $parts = $_ -split '=', 2
    if ($parts.Length -ne 2) {
      return
    }

    $name = $parts[0].Trim()
    $value = $parts[1].Trim().Trim('"')

    if ($name) {
      [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
  }
}

Set-Location $repoRoot
Set-EnvFileValue -Path (Join-Path $repoRoot ".env.local")
Set-EnvFileValue -Path (Join-Path $repoRoot ".env")

$localBin = Join-Path $repoRoot "node_modules\.bin"
if (Test-Path $localBin -and -not ($env:PATH -split ';' | Where-Object { $_ -eq $localBin })) {
  $env:PATH = "$localBin;$env:PATH"
}
