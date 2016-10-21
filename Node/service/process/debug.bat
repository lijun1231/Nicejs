
@ echo off

set app=%1

if "%1" == "" (
    set /p app="应用代码:"
)

rem 新窗口启动 node-inspector
start cmd /k node-inspector

rem 执行debug
node --debug ../app.js