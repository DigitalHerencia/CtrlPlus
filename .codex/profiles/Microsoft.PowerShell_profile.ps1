# Dedicated PowerShell profile for Codex in the CtrlPlus repository.
# Keep startup fast, output plain, and subprocess behavior predictable.

$ProgressPreference = "SilentlyContinue"
$ErrorView = "ConciseView"
$env:POWERSHELL_TELEMETRY_OPTOUT = "1"

try {
    $utf8 = [System.Text.UTF8Encoding]::new($false)
    [Console]::InputEncoding = $utf8
    [Console]::OutputEncoding = $utf8
    $OutputEncoding = $utf8
} catch {
    # Some hosts do not allow direct console encoding changes.
}

if ($Host.Name -eq "ConsoleHost") {
    try {
        $PSStyle.OutputRendering = "PlainText"
    } catch {
        # Ignore hosts that do not expose PSStyle.
    }
}

function Set-CodexEnvDefault {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Value
    )

    $currentValue = [Environment]::GetEnvironmentVariable($Name, "Process")
    if ([string]::IsNullOrWhiteSpace($currentValue)) {
        [Environment]::SetEnvironmentVariable($Name, $Value, "Process")
    }
}

function Copy-CodexEnvAlias {
    param(
        [Parameter(Mandatory = $true)][string]$Target,
        [Parameter(Mandatory = $true)][string[]]$Sources
    )

    if (-not [string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($Target, "Process"))) {
        return
    }

    foreach ($source in $Sources) {
        $value = [Environment]::GetEnvironmentVariable($source, "Process")
        if (-not [string]::IsNullOrWhiteSpace($value)) {
            [Environment]::SetEnvironmentVariable($Target, $value, "Process")
            return
        }
    }
}

function Import-CodexDotEnvFile {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }

    foreach ($line in Get-Content -LiteralPath $Path) {
        if ([string]::IsNullOrWhiteSpace($line)) {
            continue
        }

        $trimmedLine = $line.Trim()
        if ($trimmedLine.StartsWith("#")) {
            continue
        }

        if ($trimmedLine -notmatch "^(?:export\s+)?(?<key>[A-Za-z_][A-Za-z0-9_]*)=(?<value>.*)$") {
            continue
        }

        $key = $matches["key"]
        $value = $matches["value"]

        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        Set-CodexEnvDefault -Name $key -Value $value
    }
}

# Load repo-local environment variables into the session so shell commands and
# MCP auth can reuse the same keys as the app. Load .env.local first so its
# values win over .env without overwriting environment variables that were
# already provided by the parent process.
Import-CodexDotEnvFile -Path "D:\CtrlPlus\.env.local"
Import-CodexDotEnvFile -Path "D:\CtrlPlus\.env"

# Compatibility aliases for MCP/auth tools that look for different env names.
Copy-CodexEnvAlias -Target "AUTH_CLERK_SECRET_KEY" -Sources @("CLERK_SECRET_KEY")
Copy-CodexEnvAlias -Target "STRIPE_API_KEY" -Sources @(
    "ctrl_plus_STRIPE_MCP_KEY",
    "CTRL_PLUS_STRIPE_MCP_KEY",
    "STRIPE_SECRET_KEY",
    "ctrl_plus_STRIPE_SECRET_KEY"
)

$codexDefaults = @{
    CI                           = "1"
    DOTNET_CLI_TELEMETRY_OPTOUT  = "1"
    PAGER                        = "cat"
    GIT_PAGER                    = "cat"
    GIT_TERMINAL_PROMPT          = "0"
    GH_PAGER                     = "cat"
    GH_NO_UPDATE_NOTIFIER        = "1"
    COREPACK_ENABLE_DOWNLOAD_PROMPT = "0"
    NPM_CONFIG_AUDIT             = "false"
    NPM_CONFIG_COLOR             = "false"
    NPM_CONFIG_FUND              = "false"
    NPM_CONFIG_PROGRESS          = "false"
    NPM_CONFIG_UPDATE_NOTIFIER   = "false"
    NEXT_TELEMETRY_DISABLED      = "1"
    PRISMA_HIDE_UPDATE_MESSAGE   = "1"
    PYTHONUTF8                   = "1"
    PYTHONUNBUFFERED             = "1"
    PIP_DISABLE_PIP_VERSION_CHECK = "1"
    PIP_PROGRESS_BAR             = "off"
    POETRY_NO_INTERACTION        = "1"
    UV_NO_PROGRESS               = "1"
    BROWSERSLIST_IGNORE_OLD_DATA = "1"
    NO_COLOR                     = "1"
    FORCE_COLOR                  = "0"
}

foreach ($entry in $codexDefaults.GetEnumerator()) {
    Set-CodexEnvDefault -Name $entry.Key -Value $entry.Value
}

function prompt { "PS> " }
