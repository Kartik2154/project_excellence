@echo off
REM Change directory to the project root
cd /d %~dp0

REM Start backend in a new window
start "Backend" cmd /k "cd backend && npm start"

REM Start frontend in another new window
start "Frontend" cmd /k "cd frontend && npm run dev"
