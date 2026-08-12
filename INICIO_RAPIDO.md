# 🚀 INÍCIO RÁPIDO - 3 PASSOS

## Passo 1️⃣ - Instalar Dependências (Se for a primeira vez)

Abra o terminal/PowerShell na pasta do projeto e execute:

```bash
npm install
```

Aguarde até aparecer: `added X packages`

---

## Passo 2️⃣ - INICIAR TUDO

### Opção A - Um clique (Windows):
Clique duplo em: **`start.bat`**

### Opção B - Pelo terminal:
```bash
npm run dev:all
```

**Aguarde aparecer:**
```
🙏 Servidor de Liturgia rodando em http://localhost:3001
  VITE v8.0.16  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

---

## Passo 3️⃣ - TESTAR

### No seu navegador, abra:
```
http://localhost:5173
```

**Você deve ver:**
- ✅ Logo e menu no topo
- ✅ Conteúdo carregando
- ✅ Menu com: Início, Liturgia, Curiosidades, História, Sobre

### Testar a Seção Liturgia:
1. Clique em **Liturgia** no menu
2. Deve aparecer:
   - Data do dia
   - Primeira leitura
   - Segunda leitura  
   - Evangelho
3. Clique em **Atualizar** para testar scraping

### Rodar Testes Automáticos:
Enquanto tudo está rodando, em outro terminal:

**Windows:**
```bash
Clique duplo em: test.bat
```

**Terminal:**
```bash
npm test
```

**Você deve ver:**
```
✅ Servidor Node.js está rodando
✅ Vite dev server está rodando
✅ API Health Check respondendo corretamente
✅ Scraping da CNBB funcionando
```

---

## 📊 CHECKLIST DE VALIDAÇÃO

Marque ao testar:

- [ ] Aplicação abriu em http://localhost:5173
- [ ] Home carrega sem erros
- [ ] Menu está visível
- [ ] Clique em **Liturgia** carrega dados
- [ ] Mostra data, leituras e evangelho
- [ ] **Atualizar** funciona
- [ ] Clique em **Curiosidades** mostra cards
- [ ] Clique em um card abre detalhes
- [ ] Responsividade funciona (Redimensione a janela)
- [ ] Sem erros vermelhos no console (F12)
- [ ] Testes automáticos passam

---

## 🛑 PARAR TUDO

Pressione **Ctrl+C** no terminal onde está rodando

---

## ❓ PROBLEMAS COMUNS

| Problema | Solução |
|----------|---------|
| Porta 3001/5173 em uso | `npm run dev:all` mata e reinicia automaticamente |
| Página em branco | Pressione Ctrl+Shift+R para limpar cache |
| "Liturgia não disponível" | Verifique internet e se servidor está OK |
| Erro no console | Veja [GUIA_EXECUCAO.md](GUIA_EXECUCAO.md) |

---

## 🎉 PRONTO!

Seu sistema está funcionando! 🙏

**Próximas páginas para testar:**
- http://localhost:5173/historia
- http://localhost:5173/sobre
- http://localhost:3001/api/liturgia (retorna JSON)

Boa sorte! ✨
