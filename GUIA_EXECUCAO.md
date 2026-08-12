# 🚀 Guia Completo: Como Rodar e Testar o PodPadre

## 📋 Pré-requisitos

Verifique se você tem instalado:
- **Node.js** (v18+): https://nodejs.org
- **npm** (geralmente vem com Node.js)

Para verificar:
```bash
node --version
npm --version
```

---

## ✅ Opção 1: INICIAR TUDO COM UM CLIQUE (Recomendado)

### Windows:
1. Abra o explorador de arquivos
2. Navegue até a pasta do projeto
3. **Clique duplo em `start.bat`**
4. Uma janela do terminal abrirá
5. Acesse: http://localhost:5173

### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

---

## ✅ Opção 2: INICIAR PELO TERMINAL

### Abrir 1 Terminal (Mais Simples - Ambos Simultaneamente):

**Windows (PowerShell/CMD):**
```bash
cd "c:\Users\profe\OneDrive\Área de Trabalho\podepadre\podpadre"
npm run dev:all
```

**Linux/Mac:**
```bash
cd ~/seu/caminho/podpadre
npm run dev:all
```

Isso inicia:
- ✅ Servidor Node.js na porta 3001
- ✅ React Vite na porta 5173

---

## ✅ Opção 3: INICIAR SEPARADAMENTE (2 Terminais)

### Terminal 1 - Servidor (Scraping CNBB):
```bash
npm run server
```

Saída esperada:
```
🙏 Servidor de Liturgia rodando em http://localhost:3001
📖 API disponível em http://localhost:3001/api/liturgia
```

### Terminal 2 - React:
```bash
npm run dev
```

Saída esperada:
```
  VITE v8.0.16  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🌐 ACESSAR A APLICAÇÃO

Após iniciar, abra seu navegador em:

### Principais URLs:

| Página | URL |
|--------|-----|
| **Home** | http://localhost:5173 |
| **Liturgia Diária** | http://localhost:5173/liturgia |
| **Curiosidades** | http://localhost:5173/curiosidades |
| **História** | http://localhost:5173/historia |
| **Sobre** | http://localhost:5173/sobre |
| **API de Liturgia** | http://localhost:3001/api/liturgia |
| **Health Check** | http://localhost:3001/api/health |

---

## 🧪 TESTES E VERIFICAÇÕES

### 1️⃣ Verificar se o Servidor está Rodando:

```bash
curl http://localhost:3001/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-08-12T10:30:00.000Z"
}
```

### 2️⃣ Buscar Liturgia da CNBB:

```bash
curl http://localhost:3001/api/liturgia
```

**Resposta esperada:**
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

### 3️⃣ Testar no Navegador:

1. Abra: http://localhost:5173
2. **Home**: Deve mostrar carousel e resumo
3. Clique em **Liturgia** no menu
   - Deve carregar dados da CNBB
   - Mostrar data do dia
   - Primeira leitura, segunda leitura, evangelho
4. Clique em **Curiosidades**
   - Deve mostrar cards com informações
5. Clique em outras seções para navegar

### 4️⃣ Abrir Console do Navegador:

Pressione **F12** no navegador e vá para a aba **Console**:
- Não deve haver erros em vermelho
- Pode haver avisos em amarelo (normal)
- Deve aparecer conexão com a API

### 5️⃣ Testar Responsividade:

No navegador, pressione **F12** e:
1. Clique no ícone de dispositivo (móvel)
2. Altere entre:
   - iPhone SE
   - iPad
   - Desktop
3. O layout deve se adaptar

---

## 🛠️ COMANDOS DISPONÍVEIS

```bash
# Iniciar servidor de scraping
npm run server

# Iniciar Vite (apenas frontend)
npm run dev

# Iniciar ambos simultaneamente
npm run dev:all

# Build para produção
npm run build

# Visualizar build (produção)
npm run preview

# Lint do código
npm run lint
```

---

## 🐛 TROUBLESHOOTING

### ❌ Erro: "Cannot find module 'cheerio'"

**Solução:**
```bash
npm install
```

### ❌ Erro: "EADDRINUSE: address already in use :::3001"

A porta 3001 está em uso. **Solução:**

**Windows:**
```bash
netstat -ano | findstr :3001
taskkill /PID [PID_DO_PROCESSO] /F
```

**Linux/Mac:**
```bash
lsof -i :3001
kill -9 [PID]
```

Ou simplesmente mudar a porta:
```bash
PORT=3002 npm run server
```

### ❌ Erro: "Vite dev server already listening on port 5173"

Mesma solução acima, mas para a porta 5173.

### ❌ Página branca ou "Não consegue conectar"

1. Verifique se ambos os serviços estão rodando:
   - Servidor: http://localhost:3001/api/health
   - React: http://localhost:5173

2. Se um falhar, pare (Ctrl+C) e reinicie:
   ```bash
   npm run dev:all
   ```

### ❌ Liturgia mostra "não disponível"

1. Verifique se o servidor está rodando
2. Teste a API: http://localhost:3001/api/liturgia
3. Verifique conexão com internet
4. Verifique se o site da CNBB está online

### ❌ Erro ao fazer build

```bash
npm run build
```

Se falhar:
```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

---

## 📊 CHECKLIST DE TESTES

Após iniciar, verifique:

- [ ] Servidor rodando (porta 3001)
- [ ] React rodando (porta 5173)
- [ ] Página Home carrega
- [ ] Menu de navegação funciona
- [ ] Seção Liturgia carrega dados
- [ ] Botão "Atualizar" na Liturgia funciona
- [ ] Clique em Curiosidades mostra dados
- [ ] Clique em Curiosidade abre detalhe
- [ ] Responsividade funciona (F12 > Mobile)
- [ ] Console do navegador sem erros
- [ ] API retorna dados corretos

---

## 📱 TESTAR EM DISPOSITIVOS MÓVEIS

### Na mesma rede (WiFi):

1. No terminal, veja o IP da sua máquina:
   ```bash
   ipconfig        # Windows
   ifconfig        # Linux/Mac
   ```

2. Procure por algo como: `192.168.x.x`

3. No seu telefone, acesse:
   ```
   http://192.168.x.x:5173
   ```

---

## 🔄 WORKFLOW DE DESENVOLVIMENTO

### Fazer Alterações:

1. Edite o arquivo (ex: `src/pages/Home.tsx`)
2. Salve (Ctrl+S)
3. O navegador **auto-atualiza** (Hot Reload)
4. Veja as mudanças em tempo real

### Adicionar Dependência:

```bash
npm install [nome-pacote]
```

### Criar Nova Página:

1. Criar: `src/pages/NovaPagina.tsx`
2. Importar em `src/App.tsx`
3. Adicionar rota
4. Adicionar link no menu

---

## 📊 MONITORAR PERFORMANCE

### Vite Dev Server:

No console do terminal, você verá:
- Tempo de transformação de módulos
- Avisos e erros

### React DevTools:

Instale a extensão no navegador para inspecionar componentes

### Network (F12 > Network):

Veja requisições HTTP:
- Requisições para API
- Tempo de carregamento
- Tamanho dos arquivos

---

## 🚀 BUILD E PRODUÇÃO

### Criar Build:

```bash
npm run build
```

Isso gera pasta `dist/` com arquivos otimizados.

### Testar Build:

```bash
npm run preview
```

Acesse: http://localhost:4173

### Deploy:

O conteúdo de `dist/` pode ser deployado em qualquer servidor.

---

## 💡 DICAS PRÁTICAS

1. **Mantenha o terminal aberto** - Mostra erros em tempo real
2. **F12 sempre aberto** - Console mostra problemas importantes
3. **Ctrl+Shift+R** - Limpa cache e recarrega página
4. **Ctrl+C no terminal** - Para os serviços (faça antes de sair)
5. **npm run dev:all** - Forma mais simples e recomendada

---

## ❓ PERGUNTAS COMUNS

### P: Posso fechar o terminal?
**R:** Não. Enquanto fechado, aplicação para de funcionar. Se quiser rodar em background, use screen ou tmux (Linux).

### P: Quanto tempo leva para iniciar?
**R:** ~30 segundos para ambos os serviços estarem prontos.

### P: Posso editar arquivo enquanto roda?
**R:** Sim! Salve o arquivo e o navegador atualiza automaticamente.

### P: Preciso rodar o servidor sempre?
**R:** Sim, para buscar dados da CNBB. Sem ele, mostra dados padrão.

### P: Posso fazer deploy sem o servidor?
**R:** Sim, mas a liturgia não será atualizada. Você precisaria hospedar o servidor separadamente.

---

## 📞 RESUMO RÁPIDO

```bash
# Tudo que você precisa fazer é:
npm run dev:all

# Abrir no navegador:
http://localhost:5173

# Pronto!
```

---

**Qualquer dúvida, consulte os arquivos:**
- `README_SISTEMA.md` - Documentação completa
- `server/README.md` - Detalhes do servidor

Boa sorte! 🙏
