@echo off
call npm-install.bat
call npm-build.bat
call docker-build-img.bat