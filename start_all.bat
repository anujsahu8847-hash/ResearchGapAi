@echo off
title ResearchGap AI - System Launcher
echo ========================================================
echo   Launching ResearchGap AI (Backend + Frontend)
echo ========================================================
start "ResearchGap AI - FastAPI Backend" cmd /c "cd /d %~dp0\backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 2 >nul
start "ResearchGap AI - React Frontend" cmd /c "cd /d %~dp0\frontend && npm run dev"
echo Backend running at:  http://127.0.0.1:8000
echo Frontend running at: http://localhost:3000
echo Swagger Docs at:     http://127.0.0.1:8000/docs
pause
