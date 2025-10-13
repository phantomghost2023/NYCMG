@echo off
title Waiting for Installation

echo Waiting for dependency installation to complete...
echo This may take several minutes depending on your internet connection.
echo.

timeout /t 30 /nobreak >nul

echo.
echo Checking installation status...
node check_installation.js

echo.
echo If the installation is still in progress, please run this script again.
pause