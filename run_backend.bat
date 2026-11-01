@echo off
title ResearchGap AI - FastAPI Backend
echo Starting ResearchGap AI FastAPI Backend on http://127.0.0.1:8000 ...
cd /d "%~dp0\backend"
$env:HTTP_PROXY = "http://username:password@proxyserver:port"
$env:HTTPS_PROXY = "http://username:password@proxyserver:port"
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
