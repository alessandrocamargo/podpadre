# 🙏 PodPadre - Portal de Liturgia e Curiosidades

## 📋 Descrição

PodPadre é um portal web desenvolvido em React que apresenta:
- **Liturgia Diária**: Busca automática da liturgia do site da CNBB
- **Curiosidades**: Fatos interessantes sobre religião
- **História**: Informações históricas relevantes
- **Sobre**: Informações sobre o projeto

## 🚀 Como Iniciar

### Quick Start (Recomendado)

#### Windows:
```bash
start.bat
```

#### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

### Manual:

**Terminal 1 - Servidor de Liturgia:**
```bash
npm run server
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

Ou ambos simultaneamente:
```bash
npm run dev:all
```

## 🌐 Como Acessar

- **Aplicação React**: http://localhost:5173
- **API de Liturgia**: http://localhost:3001/api/liturgia
- **Health Check**: http://localhost:3001/api/health

## 🤖 Robô de Scraping da Liturgia

O sistema automaticamente:
1. ✅ Acessa o site da CNBB todos os dias
2. ✅ Extrai a liturgia diária
3. ✅ Armazena em cache (atualiza 1x por dia)
4. ✅ Fornece via API REST
5. ✅ Exibe no site automaticamente

### Detalhes do Servidor

**Arquivo**: `server/server.js`
- **Porta**: 3001
- **Endpoint**: GET `/api/liturgia`
- **Response**: JSON com liturgia do dia
- **Cache**: Inteligente (1 por dia)
- **Fallback**: Retorna dados padrão se falhar

### Scraper da CNBB

**Arquivo**: `server/scrapeCNBB.js`
- **URL**: https://www.cnbb.org.br/liturgia-diaria/
- **Parser**: Cheerio (HTML/DOM parsing)
- **Extração**: Primeira Leitura, Segunda Leitura, Evangelho
- **Timeout**: 10 segundos
- **User-Agent**: Configurado para evitar bloqueios

## 📁 Estrutura do Projeto

```
podpadre/
├── src/
│   ├── pages/
│   │   ├── Home.tsx                 # Página inicial
│   │   ├── Curiosidades.tsx         # Curiosidades
│   │   ├── Historia.tsx             # História
│   │   ├── Sobre.tsx                # Sobre
│   │   ├── LiturgiaDiaria.tsx       # Seção de liturgia
│   │   └── CuriosityDetail.tsx      # Detalhe de curiosidade
│   ├── components/
│   │   ├── Header.tsx               # Menu de navegação
│   │   ├── Footer.tsx               # Rodapé
│   │   └── CuriosityCard.tsx        # Card de curiosidade
│   ├── services/
│   │   └── liturgyService.ts        # Serviço de liturgia (fetch)
│   ├── styles/
│   │   ├── custom-bootstrap.css     # Estilos gerais
│   │   └── liturgia.css             # Estilos da liturgia
│   ├── data/
│   ├── types/
│   └── App.tsx                       # Componente raiz
├── server/
│   ├── server.js                     # Servidor Express
│   ├── scrapeCNBB.js                 # Scraper da CNBB
│   └── README.md                     # Docs do servidor
├── public/
│   └── PodPadre_logo.svg            # Logo do projeto
├── package.json                      # Dependências
├── tsconfig.json                     # Config TypeScript
├── vite.config.ts                    # Config Vite
├── start.bat                         # Script Windows
├── start.sh                          # Script Linux/Mac
└── README.md                         # Este arquivo
```

## 📦 Dependências Principais

### Frontend
- `react`: UI library
- `react-bootstrap`: Componentes Bootstrap
- `react-router-dom`: Roteamento

### Backend (Scraping)
- `express`: Framework web
- `cheerio`: DOM parsing
- `axios`: HTTP client
- `cors`: CORS middleware

### DevDependencies
- `vite`: Build tool
- `typescript`: Type safety
- `concurrently`: Rodar múltiplos processos

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia apenas o Vite
npm run server       # Inicia apenas o servidor
npm run dev:all      # Inicia Vite + Servidor simultaneamente
npm run build        # Build para produção
npm run lint         # Lint do código
npm run preview      # Preview do build
```

## 🌍 Páginas Disponíveis

### Home (`/`)
- Carrousel de imagens
- Resumo do projeto
- Links para outras seções

### Liturgia Diária (`/liturgia`)
- Exibe liturgia do dia da CNBB
- Primeira leitura
- Segunda leitura
- Evangelho
- Atualização automática diária

### Curiosidades (`/curiosidades`)
- Lista de curiosidades religiosas
- Cards interativos
- Links para detalhes

### Detalhes da Curiosidade (`/curiosidade/:id`)
- Informações completas
- Fonte da informação
- Links relacionados

### História (`/historia`)
- Informações históricas
- Timeline
- Fatos relevantes

### Sobre (`/sobre`)
- Sobre o projeto
- Equipe
- Contato

## 🛠️ Desenvolvimento

### Adicionar Nova Página
1. Criar arquivo em `src/pages/NovaPage.tsx`
2. Importar em `src/App.tsx`
3. Adicionar rota em `<Routes>`
4. Adicionar link em `src/components/Header.tsx`

### Modificar Estilos
- Estilos gerais: `src/styles/custom-bootstrap.css`
- Estilos específicos: `src/styles/[feature].css`

### Adicionar Dados de Liturgia
O serviço automaticamente busca de: `src/services/liturgyService.ts`

## 📡 API do Servidor

### GET `/api/liturgia`

**Request:**
```bash
curl http://localhost:3001/api/liturgia
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "date": "segunda-feira, 12 de agosto de 2026",
    "title": "Liturgia Diária",
    "reading1": "...",
    "reading2": "...",
    "gospel": "...",
    "source": "CNBB - Conferência Nacional dos Bispos do Brasil",
    "url": "https://www.cnbb.org.br/liturgia-diaria/",
    "fetchedAt": "2026-08-12T10:30:00.000Z"
  }
}
```

## 🚨 Troubleshooting

### Porta 3001 já em uso
```bash
PORT=3002 npm run server
```

### Servidor não conecta à CNBB
- Verificar conexão de internet
- Verificar se o site da CNBB está online
- Verificar firewall

### React não consegue conectar ao servidor
- Verificar se servidor está rodando: `http://localhost:3001/api/health`
- Verificar CORS: deve retornar success se OK

### Página mostra "Liturgia não disponível"
- Servidor pode não estar rodando
- Verificar console do navegador (F12)
- Rodar `npm run dev:all` para iniciar ambos

## 📝 Build e Deploy

### Build para Produção
```bash
npm run build
```

Isso cria a pasta `dist/` com arquivos otimizados.

### Rodar Servidor em Produção
```bash
PORT=3001 npm run server
```

### Configurar Reverse Proxy (Nginx)
```nginx
upstream api {
    server localhost:3001;
}

server {
    listen 80;
    server_name seu-dominio.com;

    location /api/ {
        proxy_pass http://api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /caminho/para/dist;
        try_files $uri /index.html;
    }
}
```

## 📞 Suporte

Para relatórios de bugs ou sugestões, abra uma issue no repositório.

## 📄 Licença

Este projeto é fornecido como está. Sinta-se livre para usar e modificar conforme necessário.

---

**Desenvolvido com ❤️ para a comunidade católica**

*Última atualização: Agosto de 2026*
