# Download the official PowerShellGet installer
$url = "https://go.microsoft.com/fwlink/?LinkID=623631"
$installerPath = "$env:TEMP\PowerShellGet.msi"
Write-Host "Downloading PowerShellGet installer..."
Invoke-WebRequest -Uri $url -OutFile $installerPath

# Install PowerShellGet
Write-Host "Installing PowerShellGet..."
Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /qn" -Wait

# Clean up
Remove-Item -Path $installerPath -Force

Write-Host "PowerShellGet installation complete. Please restart PowerShell as Administrator."
