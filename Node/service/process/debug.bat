
@ echo off

set app=%1

if "%1" == "" (
    set /p app="Ӧ�ô���:"
)

rem �´������� node-inspector
start cmd /k node-inspector

rem ִ��debug
node --debug ../app.js