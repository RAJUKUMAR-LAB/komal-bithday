@echo off
title Komal's Birthday Surprise Web Server
color 0D
echo =================================================================
echo         KOMAL'S 23rd BIRTHDAY SURPRISE WEB EXPERIENCE
echo            Starting Pure Offline Range Web Server...
echo =================================================================
echo.
cd /d "%~dp0"
echo Serving on http://localhost:8088/index.html
start http://localhost:8088/index.html
python range_server.py 8088 "%~dp0"
pause
