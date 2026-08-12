#!/bin/bash
# Script para iniciar o servidor e o Vite em desenvolvimento

echo "🙏 Iniciando PodPadre com Servidor de Liturgia..."
echo ""

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo ""
echo "🚀 Iniciando:"
echo "   - Servidor de Liturgia (porta 3001)"
echo "   - Vite Dev Server (porta 5173)"
echo ""
echo "Acesse: http://localhost:5173"
echo ""

npm run dev:all
