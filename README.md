# PodPadre

Portal de liturgia e curiosidades católicas em React 19, TypeScript, React Router 7 e Express 5.

## Executar

Requer Node.js 20.19+ ou 22.12+ (incluindo versões posteriores compatíveis) e npm.

```sh
npm ci
npm run dev:all
```

Frontend: http://localhost:5173. API: http://localhost:3001/api/liturgia.
O Vite encaminha `/api` para o Express em desenvolvimento.

## Configuração e publicação

Consulte `.env.example`. O frontend usa `/api` por padrão. Para uma API em outro domínio, configure `VITE_API_URL` antes de compilar (inclua `/api`). Variáveis `VITE_` são públicas: nunca inclua segredos.
O backend lê `PORT` e `CORS_ORIGIN` do ambiente do processo; configure-os na hospedagem. Arquivos `.env` do Vite não configuram o Express automaticamente.

```sh
npm run build
npm run server
```

Publique `dist` em hospedagem estática com fallback das rotas para `index.html` e encaminhe `/api` para o Express, ou configure uma API separada. Use HTTPS em ambos. `npm run preview` apenas permite inspecionar o build local; não substitui a hospedagem de produção.

## Liturgia

A consulta à CNBB aceita somente conteúdo com data confirmada para o calendário de `America/Sao_Paulo`, primeira leitura e evangelho. O parser depende da estrutura da fonte; páginas dinâmicas ou mudanças de marcação podem causar indisponibilidade. Nesses casos a API responde 503 e a interface permite tentar novamente, sem apresentar exemplos como leituras reais. A tela também oferece o visualizador oficial das Edições CNBB, incorporado pela própria página da CNBB, e um link para abri-lo em outra aba.

O cache diário fica na memória do servidor e no navegador. Falhas não são armazenadas. O botão Atualizar ignora ambos os caches. `/api/exemplo` é exclusivamente uma demonstração, com `demo: true` e sem data litúrgica validada. `/api/health` verifica que o processo responde, não a disponibilidade da CNBB.

## Verificações

```sh
npm test
npm run lint
npm run build
```

Os testes são locais e determinísticos: verificam extração, recusa de datas inválidas, conteúdo completo, cache, concorrência e falhas. Não comprovam a disponibilidade da fonte ao vivo.

## Conteúdo

As igrejas e curiosidades são conteúdo editorial estático. Confirme endereços e referências antes de publicar. As consultas do mapa usam Campo Limpo Paulista; não representam um cadastro diocesano oficial. Fontes bibliográficas devem receber referências específicas verificadas durante a revisão editorial.
