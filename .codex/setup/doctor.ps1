param(
  [switch]$Json
)

$ErrorActionPreference = "Stop"

function Test-Cli {
  param([string]$Name, [string]$VersionArgs = "--version")

  $command = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $command) {
    return [pscustomobject]@{ name = $Name; installed = $false; details = "missing" }
  }

  $version = try {
    & $Name $VersionArgs 2>$null | Select-Object -First 1
  } catch {
    "installed"
  }

  return [pscustomobject]@{ name = $Name; installed = $true; details = "$version".Trim() }
}

function Test-EnvVar {
  param([string]$Name)

  [pscustomobject]@{
    name = $Name
    configured = [bool](Test-Path "env:$Name")
  }
}

function Import-EnvFile {
  param([string]$Path)

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

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Import-EnvFile -Path (Join-Path $repoRoot ".env.local")
Import-EnvFile -Path (Join-Path $repoRoot ".env")
$gitStatus = & git -C $repoRoot status --short --branch 2>$null
$gitExitCode = $LASTEXITCODE
$ghAuth = (& cmd /c "gh auth status 2>&1 || exit /b 0" | Out-String).Trim()
$vercelAuth = (& cmd /c "vercel whoami 2>&1 || exit /b 0" | Out-String).Trim()

$report = [ordered]@{
  repo = [ordered]@{
    path = "$repoRoot"
    git = if ($gitExitCode -eq 0) { $gitStatus } else { "git unavailable" }
  }
  cli = @(
    Test-Cli -Name "node"
    Test-Cli -Name "pnpm"
    Test-Cli -Name "gh"
    Test-Cli -Name "vercel"
    Test-Cli -Name "code"
  )
  env = @(
    Test-EnvVar -Name "GITHUB_TOKEN"
    Test-EnvVar -Name "VERCEL_TOKEN"
    Test-EnvVar -Name "OPENAI_API_KEY"
    Test-EnvVar -Name "NEON_API_KEY"
    Test-EnvVar -Name "AUTH_CLERK_SECRET_KEY"
    Test-EnvVar -Name "CONTEXT7_API_KEY"
    Test-EnvVar -Name "NOTION_TOKEN"
  )
  auth = [ordered]@{
    github = "$ghAuth"
    vercel = "$vercelAuth"
  }
}

if ($Json) {
  $report | ConvertTo-Json -Depth 6
  exit 0
}

Write-Host "Repo: $($report.repo.path)"
Write-Host ""
Write-Host "CLI"
$report.cli | ForEach-Object {
  Write-Host ("- {0}: {1}" -f $_.name, $_.details)
}

Write-Host ""
Write-Host "Environment"
$report.env | ForEach-Object {
  $state = if ($_.configured) { "set" } else { "missing" }
  Write-Host ("- {0}: {1}" -f $_.name, $state)
}

Write-Host ""
Write-Host "GitHub Auth"
Write-Host $report.auth.github
Write-Host ""
Write-Host "Vercel Auth"
Write-Host $report.auth.vercel
