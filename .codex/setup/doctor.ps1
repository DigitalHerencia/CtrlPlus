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

function Promote-UserEnvVarToProcess {
  param([string]$Name)

  if (Test-Path "env:$Name") {
    return
  }

  $userValue = [Environment]::GetEnvironmentVariable($Name, "User")
  if ($userValue) {
    [Environment]::SetEnvironmentVariable($Name, $userValue, "Process")
  }
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
git config --global --add safe.directory "$repoRoot" 2>$null | Out-Null
Import-EnvFile -Path (Join-Path $repoRoot ".env.local")
Import-EnvFile -Path (Join-Path $repoRoot ".env")

@(
  "GITHUB_TOKEN",
  "VERCEL_TOKEN",
  "OPENAI_API_KEY",
  "NEON_API_KEY",
  "CLERK_SECRET_KEY",
  "AUTH_CLERK_SECRET_KEY",
  "CONTEXT7_API_KEY",
  "NOTION_TOKEN",
  "BLOB_READ_WRITE_TOKEN",
  "HUGGINGFACE_API_TOKEN"
) | ForEach-Object { Promote-UserEnvVarToProcess -Name $_ }

if (-not $env:CLERK_SECRET_KEY -and $env:AUTH_CLERK_SECRET_KEY) {
  [Environment]::SetEnvironmentVariable("CLERK_SECRET_KEY", $env:AUTH_CLERK_SECRET_KEY, "Process")
}
if (-not $env:AUTH_CLERK_SECRET_KEY -and $env:CLERK_SECRET_KEY) {
  [Environment]::SetEnvironmentVariable("AUTH_CLERK_SECRET_KEY", $env:CLERK_SECRET_KEY, "Process")
}

$gitStatus = & git -C $repoRoot status --short --branch 2>$null
$gitExitCode = $LASTEXITCODE
$ghAuth = (& cmd /c "gh auth status 2>&1 || exit /b 0" | Out-String).Trim()
$vercelAuth = (& cmd /c "vercel whoami 2>&1 || exit /b 0" | Out-String).Trim()
$ghAuthenticated = $ghAuth -notmatch "not logged into any GitHub hosts"
$vercelAuthenticated = $vercelAuth -notmatch "No existing credentials found"

$skillRoots = @(
  "C:\Users\scree\.codex\skills",
  "C:\Users\scree\.agents\skills"
)

$skills = $skillRoots | ForEach-Object {
  if (Test-Path $_) {
    [pscustomobject]@{
      path = $_
      exists = $true
      count = (Get-ChildItem $_ -Directory | Measure-Object).Count
    }
  } else {
    [pscustomobject]@{
      path = $_
      exists = $false
      count = 0
    }
  }
}

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
    Test-EnvVar -Name "CLERK_SECRET_KEY"
    Test-EnvVar -Name "AUTH_CLERK_SECRET_KEY"
    Test-EnvVar -Name "CONTEXT7_API_KEY"
    Test-EnvVar -Name "NOTION_TOKEN"
    Test-EnvVar -Name "BLOB_READ_WRITE_TOKEN"
    Test-EnvVar -Name "HUGGINGFACE_API_TOKEN"
  )
  mcp = @(
    [pscustomobject]@{
      server = "github"
      ready = $ghAuthenticated -or (Test-Path "env:GITHUB_TOKEN")
    }
    [pscustomobject]@{
      server = "vercel"
      ready = $vercelAuthenticated -or (Test-Path "env:VERCEL_TOKEN")
    }
    [pscustomobject]@{
      server = "neon"
      ready = (Test-Path "env:NEON_API_KEY")
    }
    [pscustomobject]@{
      server = "clerk"
      ready = (Test-Path "env:CLERK_SECRET_KEY") -or (Test-Path "env:AUTH_CLERK_SECRET_KEY")
    }
    [pscustomobject]@{
      server = "context7"
      ready = (Test-Path "env:CONTEXT7_API_KEY")
    }
    [pscustomobject]@{
      server = "notion"
      ready = (Test-Path "env:NOTION_TOKEN")
    }
    [pscustomobject]@{
      server = "openaiDeveloperDocs"
      ready = $true
    }
  )
  skills = $skills
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
Write-Host "MCP Readiness"
$report.mcp | ForEach-Object {
  $state = if ($_.ready) { "ready" } else { "missing auth/config" }
  Write-Host ("- {0}: {1}" -f $_.server, $state)
}

Write-Host ""
Write-Host "Skills"
$report.skills | ForEach-Object {
  if ($_.exists) {
    Write-Host ("- {0}: {1} skills" -f $_.path, $_.count)
  } else {
    Write-Host ("- {0}: missing" -f $_.path)
  }
}

Write-Host ""
Write-Host "GitHub Auth"
Write-Host $report.auth.github
Write-Host ""
Write-Host "Vercel Auth"
Write-Host $report.auth.vercel
