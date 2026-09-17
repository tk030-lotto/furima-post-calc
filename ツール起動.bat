@echo off
chcp 932 > nul
title FurimaPostCalc 起動ランチャー

echo ========================================================
echo   FurimaPostCalc（送料・梱包サイズ判定ツール）
echo   ブラウザでツールを起動しています...
echo ========================================================
echo.

cd /d "%~dp0"
start "" "index.html"

exit
