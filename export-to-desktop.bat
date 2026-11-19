@echo off
set TARGET=%USERPROFILE%\Desktop\northwind-management-system
echo Copying complete project to Desktop: %TARGET% ...
xcopy /E /I /Y "%~dp0*" "%TARGET%\"
echo Done! You can now open %TARGET% in your IDE or file explorer.
pause
