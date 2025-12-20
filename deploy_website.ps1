
# Script to deploy Tawbah Website to GitHub
# Run this script using PowerShell

Write-Host "Starting deployment process..." -ForegroundColor Cyan

# Navigate to the parent directory (Project Root: d:/Programs/Tawbah)
Set-Location ".."

# 1. Initialize Git if not already present
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..."
    git init
} else {
    Write-Host "Git repository already initialized."
}

# 2. Add Remote Origin
# Note: This might fail if origin already exists, so we silence the error
try {
    git remote add origin https://github.com/saeedali33/Tawbah.git
    Write-Host "Remote 'origin' added."
} catch {
    Write-Host "Remote 'origin' might already exist."
}

# 3. Add Website Folder
Write-Host "Adding website files..."
git add wepsit/

# 4. Commit
Write-Host "Committing changes..."
git commit -m "Add promotional website (wepsit)"

# 5. Push
Write-Host "Pushing to GitHub (main)..."
Write-Host "If this asks for a password, please enter your GitHub PAT or credentials." -ForegroundColor Yellow
git branch -M main
git push -u origin main

Write-Host "Done! Check your repository at https://github.com/saeedali33/Tawbah" -ForegroundColor Green
Read-Host -Prompt "Press Enter to exit"
