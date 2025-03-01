# PowerShell script to create a simple icon.png file
# This script uses System.Drawing to create a 32x32 pixel PNG icon

Add-Type -AssemblyName System.Drawing

# Create a 32x32 bitmap
$bitmap = New-Object System.Drawing.Bitmap 32, 32

# Create a graphics object to draw on the bitmap
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Fill the background with a dark color
$graphics.Clear([System.Drawing.Color]::FromArgb(34, 34, 34))

# Create a brush for drawing
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 204, 0))

# Draw a simple "M" letter (for Map)
$font = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Bold)
$graphics.DrawString("M", $font, $brush, 2, 0)

# Dispose of the graphics object
$graphics.Dispose()

# Save the bitmap as a PNG file
$bitmap.Save("$PSScriptRoot\src\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Dispose of the bitmap
$bitmap.Dispose()

Write-Host "Icon created successfully at $PSScriptRoot\src\icon.png" 