# Dedicated PowerShell profile for Codex in the CtrlPlus repository.
# Keep startup fast, output plain, and subprocess behavior predictable.

$ProgressPreference = "SilentlyContinue"
$ErrorView = "ConciseView"
$env:POWERSHELL_TELEMETRY_OPTOUT = "1"

try {
    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
    [Console]::InputEncoding = $utf8NoBom
    [Console]::OutputEncoding = $utf8NoBom
    $OutputEncoding = $utf8NoBom
} catch {
    # Some hosts do not allow direct console encoding changes.
}

if ($Host.Name -eq "ConsoleHost") {
    try {
        # Plain text is easier for Codex to parse than ANSI-heavy output.
        $PSStyle.OutputRendering = "PlainText"
    } catch {
        # Ignore hosts that do not expose PSStyle.
    }
}

function Set-CodexEnvDefault {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [string]$Value
    )

    $currentValue = [Environment]::GetEnvironmentVariable($Name, "Process")
    if ([string]::IsNullOrWhiteSpace($currentValue)) {
        [Environment]::SetEnvironmentVariable($Name, $Value, "Process")
    }
}

# General non-interactive defaults for agent-driven commands.
Set-CodexEnvDefault -Name "CI" -Value "1"
Set-CodexEnvDefault -Name "DOTNET_CLI_TELEMETRY_OPTOUT" -Value "1"

# Git and GitHub CLI: avoid pagers and hanging prompts.
Set-CodexEnvDefault -Name "GIT_PAGER" -Value "cat"
Set-CodexEnvDefault -Name "GIT_TERMINAL_PROMPT" -Value "0"
Set-CodexEnvDefault -Name "GH_PAGER" -Value "cat"
Set-CodexEnvDefault -Name "GH_NO_UPDATE_NOTIFIER" -Value "1"

# Node and package-manager defaults: less noise, fewer prompts.
Set-CodexEnvDefault -Name "COREPACK_ENABLE_DOWNLOAD_PROMPT" -Value "0"
Set-CodexEnvDefault -Name "NPM_CONFIG_AUDIT" -Value "false"
Set-CodexEnvDefault -Name "NPM_CONFIG_FUND" -Value "false"
Set-CodexEnvDefault -Name "NPM_CONFIG_PROGRESS" -Value "false"
Set-CodexEnvDefault -Name "NPM_CONFIG_UPDATE_NOTIFIER" -Value "false"
Set-CodexEnvDefault -Name "NEXT_TELEMETRY_DISABLED" -Value "1"
Set-CodexEnvDefault -Name "PRISMA_HIDE_UPDATE_MESSAGE" -Value "1"

# Python defaults: UTF-8 output and quieter package installs.
Set-CodexEnvDefault -Name "PYTHONUTF8" -Value "1"
Set-CodexEnvDefault -Name "PYTHONUNBUFFERED" -Value "1"
Set-CodexEnvDefault -Name "PIP_DISABLE_PIP_VERSION_CHECK" -Value "1"
Set-CodexEnvDefault -Name "PIP_PROGRESS_BAR" -Value "off"
Set-CodexEnvDefault -Name "POETRY_NO_INTERACTION" -Value "1"
Set-CodexEnvDefault -Name "UV_NO_PROGRESS" -Value "1"

# This repo uses browsers, Prisma, and frequent frontend work. Keep command
# output compact without changing behavior.
Set-CodexEnvDefault -Name "BROWSERSLIST_IGNORE_OLD_DATA" -Value "1"

# Keep the prompt minimal in Codex-driven shells.
function prompt {
    "PS> "
}
