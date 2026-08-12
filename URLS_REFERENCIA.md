# 🔗 REFERÊNCIA RÁPIDA DE URLs

## 🌐 Aplicação Web

| Página | URL |
|--------|-----|
| **Home (Inicial)** | http://localhost:5173 |
| **Liturgia Diária** | http://localhost:5173/liturgia |
| **Curiosidades** | http://localhost:5173/curiosidades |
| **Detalhes Curiosidade** | http://localhost:5173/curiosidade/1 |
| **História** | http://localhost:5173/historia |
| **Sobre** | http://localhost:5173/sobre |

## 📡 API Backend

| Endpoint | URL | Método | Descrição |
|----------|-----|--------|-----------|
| **Health Check** | http://localhost:3001/api/health | GET | Status do servidor |
| **Liturgia do Dia** | http://localhost:3001/api/liturgia | GET | Dados completos da liturgia |

## 🧪 Ferramentas de Teste

| Ferramenta | Comando |
|-----------|---------|
| **Testes Automáticos** | `npm test` ou `test.bat` |
| **Console do Navegador** | F12 (Developer Tools) |
| **Modo Responsivo** | F12 → Clique no ícone de device |
| **Network Tab** | F12 → Network (ver requisições) |

## 📝 Exemplos de Requisições

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Buscar Liturgia
```bash
curl http://localhost:3001/api/liturgia
```

### Com jq (JSON pretty print)
```bash
curl http://localhost:3001/api/liturgia | jq
```

## ⚙️ Portas em Uso

| Serviço | Porta |
|---------|-------|
| **React Vite** | 5173 |
| **Node.js API** | 3001 |

## 📚 Arquivos de Documentação

| Arquivo | Conteúdo |
|---------|----------|
| **INICIO_RAPIDO.md** | Guia de 3 passos (você está aqui) |
| **GUIA_EXECUCAO.md** | Guia completo e detalhado |
| **README_SISTEMA.md** | Documentação técnica completa |
| **server/README.md** | Detalhes do servidor Node.js |

## 🎯 Fluxo Típico de Uso

```
1. Abrir terminal
   ↓
2. npm run dev:all
   ↓
3. Aguardar "ready"
   ↓
4. Abrir http://localhost:5173
   ↓
5. Navegar e testar
   ↓
6. F12 para debug se necessário
   ↓
7. Ctrl+C para parar
```

## 🔍 Debug / Troubleshooting

### Ver logs do servidor:
Terminal onde rodou `npm run server` mostra os logs

### Ver logs do React:
Terminal onde rodou `npm run dev` mostra erros do build

### Ver logs do navegador:
F12 → Console → Todos os erros JavaScript aparecem lá

### Ver requisições HTTP:
F12 → Network → Todas as requisições para API

---

## 💡 DICA FINAL

Marque esta página como favorito para referência rápida! 📌

**Qualquer dúvida, consulte:**
- `GUIA_EXECUCAO.md` para detalhes
- Console (F12) para erros
- Terminal para logs do servidor
