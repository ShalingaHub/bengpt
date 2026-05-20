@echo off
REM Start a local web server for the Ben GPT site using PowerShell.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
