# Uninstall Windows Management Framework
wmic product where "name like 'Windows Management Framework%'" call uninstall /nointeractive

# Remove PowerShell directories
rd /s /q "C:\Program Files\PowerShell"
rd /s /q "C:\Program Files (x86)\PowerShell"
rd /s /q "C:\Windows\System32\WindowsPowerShell"
rd /s /q "%USERPROFILE%\Documents\WindowsPowerShell"
rd /s /q "%USERPROFILE%\OneDrive\Documents\WindowsPowerShell"

# Clean registry
reg delete "HKLM\SOFTWARE\Microsoft\PowerShell" /f
reg delete "HKLM\SOFTWARE\Microsoft\PowerShell\3" /f
reg delete "HKLM\SOFTWARE\Microsoft\PowerShell\1" /f
reg delete "HKLM\SOFTWARE\Microsoft\PowerShell\1\PowerShellEngine" /f
reg delete "HKLM\SOFTWARE\Microsoft\PowerShell\3\PowerShellEngine" /f
reg delete "HKCU\Software\Microsoft\PowerShell" /f