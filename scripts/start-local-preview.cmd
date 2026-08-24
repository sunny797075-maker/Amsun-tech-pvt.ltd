@echo off
cd /d "%~dp0.."
"%CD%\.tools\node-v24.14.0-win-x64\node.exe" "%CD%\scripts\serve-dist.mjs" > "%CD%\preview-live.log" 2> "%CD%\preview-live.err"
