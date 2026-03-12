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

# Keep Clerk env names synchronized for runtime SDKs and MCP server auth.
if (-not $env:CLERK_SECRET_KEY -and $env:AUTH_CLERK_SECRET_KEY) {
  [Environment]::SetEnvironmentVariable("CLERK_SECRET_KEY", $env:AUTH_CLERK_SECRET_KEY, "Process")
}
if (-not $env:AUTH_CLERK_SECRET_KEY -and $env:CLERK_SECRET_KEY) {
  [Environment]::SetEnvironmentVariable("AUTH_CLERK_SECRET_KEY", $env:CLERK_SECRET_KEY, "Process")
}

$localBin = Join-Path $repoRoot "node_modules\.bin"
if (Test-Path $localBin -and -not ($env:PATH -split ';' | Where-Object { $_ -eq $localBin })) {
  $env:PATH = "$localBin;$env:PATH"
}
