param(
  [switch]$SkipExtensions
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$codeUserDir = Join-Path $env:APPDATA "Code\User"
$workspaceSettings = Join-Path $repoRoot ".vscode\settings.json"
$workspaceExtensions = Join-Path $repoRoot ".vscode\extensions.json"
$globalSettingsTemplate = Join-Path $PSScriptRoot "vscode-global-settings.jsonc"
$mcpTemplate = Join-Path $PSScriptRoot "mcp.json"

git config --global --add safe.directory "$repoRoot" | Out-Null

if (-not (Test-Path $codeUserDir)) {
  New-Item -ItemType Directory -Force -Path $codeUserDir | Out-Null
}

Copy-Item $globalSettingsTemplate (Join-Path $codeUserDir "settings.json") -Force
Copy-Item $mcpTemplate (Join-Path $codeUserDir "mcp.json") -Force

if (-not $SkipExtensions) {
  $extensions = @(
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright",
    "tamasfe.even-better-toml",
    "editorconfig.editorconfig",
    "github.vscode-github-actions",
    "github.vscode-pull-request-github",
    "vitest.explorer",
    "usernamehw.errorlens"
  )

  foreach ($extension in $extensions) {
    code --install-extension $extension --force | Out-Null
  }
}

Write-Host "Applied VS Code settings from $globalSettingsTemplate"
Write-Host "Applied MCP config from $mcpTemplate"
Write-Host "Workspace settings file: $workspaceSettings"
Write-Host "Workspace extensions file: $workspaceExtensions"
Write-Host ""
Write-Host "Run '.codex/setup/doctor.ps1' next to verify auth and env state."
