$ErrorActionPreference = "Stop"

function Write-Step($msg) {
    Write-Host ""
    Write-Host "=== $msg ===" -ForegroundColor Cyan
}

function Fail($msg) {
    Write-Host ""
    Write-Host "ERROR: $msg" -ForegroundColor Red
    exit 1
}

# 1) تأكد أننا داخل repo
Write-Step "Checking Git repository"
git rev-parse --is-inside-work-tree | Out-Null
if ($LASTEXITCODE -ne 0) { Fail "This folder is not a Git repository." }

# 2) اعرض حالة الملفات
Write-Step "Git status"
git status --short

# 3) شغّل الفحص الكامل
Write-Step "Running project checks"
npm run check
if ($LASTEXITCODE -ne 0) { Fail "npm run check failed." }

# 4) لو فيه تغييرات، اعمل commit
$changes = git status --porcelain
if ($changes) {
    Write-Step "Committing changes"

    $commitMessage = Read-Host "Enter commit message"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "chore: update website"
    }

    git add .
    if ($LASTEXITCODE -ne 0) { Fail "git add failed." }

    git commit -m $commitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Host "No new commit created. Maybe nothing staged or commit was skipped." -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "No local changes to commit." -ForegroundColor Yellow
}

# 5) ادفع إلى main
Write-Step "Pushing to origin/main"
git push origin main
if ($LASTEXITCODE -ne 0) { Fail "git push failed." }

# 6) نهاية
Write-Host ""
Write-Host "Done: code pushed to origin/main successfully." -ForegroundColor Green
Write-Host "Now wait for the website deployment to finish." -ForegroundColor Green