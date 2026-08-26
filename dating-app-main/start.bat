@echo off
title EchoZshsamber 一键启动 (React + Next.js)
cd /d "%~dp0"

rem ---- 1. 清理残留 node 进程，避免端口占用 ----
taskkill /f /im node.exe >nul 2>nul

rem ---- 2. 清空编译缓存，确保每次打开都是最新页面 ----
if exist ".next" rmdir /s /q ".next"

rem ---- 3. 优先使用项目内置 Node.js（免安装版）----
if exist "nodejs\node.exe" set "PATH=%~dp0nodejs;%PATH%"

echo ============================================
echo   EchoZshsamber 一键启动
echo   React + Next.js 全栈应用
echo ============================================
echo.

rem ---- 检查 Node.js ----
where node >nul 2>nul
if errorlevel 1 (
    echo [错误] 未检测到 Node.js！
    echo.
    echo 请确认 nodejs 文件夹存在，或安装 Node.js 后重试。
    echo.
    pause
    exit /b 1
)

for /f "delims=" %%v in ('node --version') do set NODE_VER=%%v
echo [OK] 已检测到 Node.js：%NODE_VER%
echo.

rem ---- 首次运行自动安装依赖 ----
if not exist "node_modules\next" (
    echo [*] 正在安装依赖，请耐心等待...
    echo.
    call npm install --no-audit --no-fund
    if errorlevel 1 (
        echo.
        echo [错误] 依赖安装失败，请检查网络后重新运行本脚本。
        pause
        exit /b 1
    )
    echo.
    echo [OK] 依赖安装完成！
    echo.
)

rem ---- 启动开发服务器，8秒后自动打开浏览器 ----
start "" /b cmd /c "timeout /t 8 /nobreak >nul & start http://localhost:3000"
echo [*] 首次启动需要编译，请耐心等待页面加载...
echo     若浏览器未自动打开，请手动访问：http://localhost:3000
echo     提示：如果页面还是旧样式，请按 Ctrl+F5 强制刷新。
echo.
echo     关闭本窗口即可停止服务器。
echo.
call npm run dev

pause