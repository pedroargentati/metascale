@echo off

set here=%cd%
set container_name=local-dev-connect-1
set string_a_procurar=Finished starting connectors and tasks

echo Procurando a string "%string_a_procurar%" no log do container %container_name%.

:loop
  docker logs %container_name% | findstr /I /C:"%string_a_procurar%" > nul

  if %errorlevel% equ 0 (
    echo A string "%string_a_procurar%" foi encontrada no log do container %container_name%.

    call setup-connector.bat

    goto fim
  ) else (
    echo A string "%string_a_procurar%" nao foi encontrada no log do container %container_name%.
    set errorlevel=
  )

  timeout /t 5 >nul
goto loop
:fim
echo Loop encerrado.

