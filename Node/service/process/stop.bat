
@ echo off

set app=%1

if "%1" == "" (
    set /p app="Ӧ�ô���:"
)

rem echo ����APP:%app%

pm2 stop apps/%app%/%app%.js

pause