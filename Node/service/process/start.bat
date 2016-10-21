
@ echo off

set app=%1

if "%1" == "" (
    set /p app="应用代码:"
)

rem echo 启动APP:%app%

pm2 start apps/%app%/%app%.js

pause