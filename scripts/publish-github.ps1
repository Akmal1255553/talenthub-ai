# Publish TalentHub AI to a new GitHub repository.
# Prerequisites: GitHub CLI installed and authenticated (gh auth login)

$ErrorActionPreference = "Stop"
$RepoName = "talenthub-ai"

Set-Location (Split-Path $PSScriptRoot -Parent)

& "C:\Program Files\GitHub CLI\gh.exe" auth status | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Run first: gh auth login" -ForegroundColor Yellow
  exit 1
}

& "C:\Program Files\GitHub CLI\gh.exe" repo create $RepoName `
  --public `
  --source=. `
  --remote=origin `
  --push `
  --description "AI-powered job platform (hh.ru style) with resume builder, subscriptions, and hiring tools"

Write-Host "Done. Repository:" -ForegroundColor Green
& "C:\Program Files\GitHub CLI\gh.exe" repo view --web
