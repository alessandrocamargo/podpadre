# 📖 Servidor de Scraping da Liturgia CNBB

Este servidor faz scraping automático da liturgia diária do site da CNBB (Conferência Nacional dos Bispos do Brasil) e fornece os dados via API REST.

## 🚀 Como Usar

### Opção 1: Rodar Servidor e Vite Simultaneamente
```bash
npm run dev:all
```

Isso iniciará:
- **Servidor Node.js** na porta 3001 (API de liturgia)
- **Vite dev server** na porta 5173 (React app)

### Opção 2: Rodar Apenas o Servidor
```bash
npm run server
```

### Opção 3: Rodar Apenas o Vite (sem servidor)
```bash
npm run dev
```

## 📡 Endpoints da API

### GET `/api/liturgia`
Retorna a liturgia do dia da CNBB em formato JSON.

**Exemplo de Response:**
```json
{
  "success": true,
  "data": {
    "date": "segunda-feira, 12 de agosto de 2026",
    "title": "Liturgia Diária",
    "reading1": "Primeira leitura...",
    "reading2": "Segunda leitura...",
    "gospel": "Evangelho...",
    "source": "CNBB - Conferência Nacional dos Bispos do Brasil",
    "url": "https://www.cnbb.org.br/liturgia-diaria/",
    "fetchedAt": "2026-08-12T10:30:00.000Z"
  }
}
```

### GET `/api/health`
Health check da API.

**Exemplo de Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-08-12T10:30:00.000Z"
}
```

## ⚙️ Funcionamento

1. **Scraping Automático**: O servidor faz scraping do site da CNBB
2. **Cache Inteligente**: Os dados são cacheados e atualizados uma vez por dia
3. **CORS Habilitado**: A API pode ser consumida pelo frontend React
4. **Fallback Seguro**: Se o scraping falhar, retorna mensagem amigável

## 📦 Dependências

- **express**: Framework web Node.js
- **cheerio**: Parsing de HTML/XML
- **axios**: Cliente HTTP
- **cors**: Middleware para CORS

## 🔧 Variáveis de Ambiente

```bash
PORT=3001  # Porta do servidor (padrão: 3001)
```

## 📝 Observações

- O servidor faz scraping apenas uma vez por dia (cache inteligente)
- Se o servidor não estiver rodando, o frontend mostra dados padrão
- O User-Agent é necessário para evitar bloqueios do servidor da CNBB
- Timeout de 10 segundos para requisições

## 🚨 Troubleshooting

### Erro: "Cannot find module 'cheerio'"
```bash
npm install cheerio express cors
```

### Erro: "EADDRINUSE: address already in use :::3001"
A porta 3001 já está em uso. Altere:
```bash
PORT=3002 npm run server
```

### Página mostra "Liturgia não disponível"
1. Verifique se o servidor está rodando: `http://localhost:3001/api/health`
2. Verifique a conexão com o site da CNBB
3. Verifique o console do navegador para erros

## 📚 Arquivo de Configuração

O serviço de liturgia está em: `src/services/liturgyService.ts`

Para mudar a URL do servidor, edite:
```typescript
const response = await fetch("http://localhost:3001/api/liturgia");
```

---

**Desenvolvido com ❤️ para PodPadre**
