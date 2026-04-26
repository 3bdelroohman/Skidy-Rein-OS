$paths = @(
  ".\\skidy-rein-os-schedule-typesafe-build-fix",
  ".\\skidy-rein-os-schedule-typesafe-build-fix.zip",
  ".\\skidy-rein-os-schedule-full-restore-fix.zip",
  ".\\skidy-rein-os-leads-complete-fix.zip",
  ".\\skidy-rein-os-schedule-runtime-fix.zip",
  ".\\skidy-rein-os-root-bundle-fix.zip",
  ".\\skidy-rein-os-consolidated-fix-and-handoff.zip",
  ".\\skidy-rein-os-teachers-service-hotfix.zip"
)
foreach ($p in $paths) {
  if (Test-Path $p) {
    Remove-Item $p -Recurse -Force
  }
}
Write-Host "artifact cleanup complete"

