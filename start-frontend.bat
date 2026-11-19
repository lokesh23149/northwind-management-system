@echo off
echo Starting Northwind Management System Frontend (React + Vite)...
cd frontend

if not exist node_modules (
    echo [INFO] First time setup: Installing npm packages...
    call npm install
)

echo Starting Vite development server...
call npm run dev
pause
