# 🎙️ PodPadre

**PodPadre** é um portal elegante e acolhedor que reúne curiosidades sobre o **Catolicismo Apostólico Romano**.  
Desenvolvido com React, TypeScript e Bootstrap, o site oferece uma experiência suave em tons pastéis e dourados — ideal para quem deseja mergulhar na riqueza da fé católica.

---

## ✨ Funcionalidades

- 📜 Listagem de curiosidades católicas com resumo e data.
- 🔍 Página de detalhes com conteúdo completo.
- 🧭 Navegação SPA (Single Page Application) com React Router.
- 🎨 Design responsivo e personalizado em tons pastéis e dourado.
- 🖼️ Logo própria (SVG ou PNG).
- 📱 Layout adaptável (mobile-first).
- 🦶 Footer fixo ao final da página.

---

## 🛠️ Tecnologias

| Tecnologia          | Uso                        |
|---------------------|----------------------------|
| React 19           | Biblioteca UI              |
| TypeScript          | Tipagem estática           |
| Vite                | Build tool e dev server    |
| React Router v7     | Roteamento                 |
| Bootstrap 5         | Sistema de grid e componentes base |
| React-Bootstrap     | Integração Bootstrap com React |
| CSS Modules (opcional) | Estilização adicional   |

---

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js (20.19+ ou 22.12+, incluindo versões posteriores compatíveis)
- npm (v8 ou superior)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/alessandrocamargo/podpadre.git
cd podpadre

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev:all

```


## Liturgia diária: referências e texto bíblico

O Express monta a liturgia em duas etapas: consulta as referências do dia e resolve as passagens em uma API bíblica. A data é calculada em `America/Sao_Paulo`.

1. `server/liturgyReferences.js` tenta ler referências identificadas e datadas na página pública da CNBB. O visualizador atual carrega conteúdo externo, e sua API separada respondeu 403 no teste de integração; não há tentativa de contornar essa restrição.
2. Sem referências verificáveis na página pública, consulta a [API Liturgia Diária v2](https://github.com/Dancrf/liturgia-diaria/blob/master/docs/v2/README.md), com dia, mês e ano explícitos. A data da resposta precisa coincidir. A interface identifica a fonte alternativa e informa que não houve confirmação automática na CNBB.
3. `server/bibleService.js` consulta capítulos da [Free Use Bible API](https://bible.helloao.org/docs/pt/guide/getting-started.html), tradução `por_bsl` (Bíblia Portuguesa Mundial), e seleciona apenas os versículos da referência. Esta versão inclui os livros deuterocanônicos; é uma tradução em revisão, declarada em domínio público pelo provedor, e **não é a tradução oficial do lecionário da CNBB**. A interface mostra esse aviso e os créditos.
4. Intervalos e listas de versículos do mesmo capítulo são suportados. Salmos responsoriais, partes de versículos (`a`, `b` etc.), referências entre capítulos, alternativas dentro de uma referência e livros com diferenças conhecidas de numeração preservam o texto da fonte litúrgica. Nunca são aproximados para um capítulo inteiro ou versículos completos. Falhas da API bíblica também preservam o texto litúrgico, se disponível; sem texto válido a API responde 503.

Alternativas de leitura e leituras bíblicas adicionais são preservadas como itens separados. O modelo `readings` informa referência, texto, refrão, fonte e modo (`bible` ou `liturgy`) por item. Os campos anteriores (`reading1`, `psalm`, `reading2`, `gospel`) continuam disponíveis para a prévia da Home.

O cache da liturgia dura o dia, na memória do servidor e no navegador; o botão Atualizar ignora ambos. Capítulos bíblicos são compartilhados entre consultas em um cache de até 100 entradas; falhas são removidas para permitir novas tentativas. Não há chave de API no frontend.

### Verificar

```sh
npm test
npm run lint
npm run build
# Integração real: requer acesso à internet e depende das fontes externas
node scripts/check-liturgy.mjs
# Ou uma data específica
node scripts/check-liturgy.mjs 2026-11-07
```

Os testes locais usam respostas controladas e verificam datas, intervalos, conteúdo incompleto, alternativas, origem dos textos e recuperação de falhas. O script de integração imprime referências e metadados, sem armazenar a Bíblia no repositório.

### Publicação

O frontend usa `/api` por padrão; o Vite encaminha esse caminho ao Express na porta 3001 durante o desenvolvimento. Em produção, configure o encaminhamento de `/api` para o backend ou defina `VITE_API_URL` antes do build. A hospedagem precisa permitir requisições HTTPS de saída para CNBB, API Liturgia Diária e Free Use Bible API. O backend deve ser executado além do site estático. Consulte `.env.example`.


### Publicar na Vercel

O arquivo `vercel.json` configura o build do Vite e encaminha as rotas do React para `index.html`, inclusive quando abertas diretamente ou recarregadas. Os caminhos `/api` ficam fora desse fallback.

Os arquivos `api/liturgia.js` e `api/health.js` publicam funções Node.js na própria Vercel, usando os mesmos handlers do servidor local. Não é necessário executar `npm run server` em outra hospedagem para esse deploy. A função de liturgia possui duração máxima configurada em 60 segundos; o cache de memória é por instância, podendo ser reconstruído em novas execuções.

Nas configurações do projeto Vercel:

- **Root Directory:** a pasta que contém `package.json`, `vercel.json`, `api` e `src` (neste workspace, `podpadre`).
- **Framework:** Vite.
- **Build Command:** `npm run build`.
- **Output Directory:** `dist`.
- **Node.js:** uma versão suportada pelo Vite, como 22.12+ ou 24.
- **VITE_API_URL:** deixe sem definir ou use `/api`; não use `localhost` em produção.

Após enviar os arquivos ao GitHub, aguarde o novo deploy. Confira `/api/health` (JSON com `status: ok`), `/api/liturgia` (JSON com as leituras) e `/liturgia` aberta diretamente. As funções precisam continuar recebendo respostas válidas das fontes externas; erros retornam JSON 503, nunca o HTML do frontend.
