@echo off
REM Script para iniciar o servidor e o Vite em desenvolvimento (Windows)

echo.
echo  ========================================
echo  PodPadre - Liturgia Diaria
echo  ========================================
echo.
echo  Iniciando servidor de scraping da CNBB...
echo.

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
)

echo.
echo  Iniciando:
echo   - Servidor de Liturgia (porta 3001)
echo   - Vite Dev Server (porta 5173)
echo.
echo  Acesse: http://localhost:5173
echo.
echo  Pressione Ctrl+C para parar
echo.

call npm run dev:all
pause
