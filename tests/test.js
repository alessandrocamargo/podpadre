#!/usr/bin/env node

/**
 * Script de Testes Automáticos para PodPadre
 * Valida se tudo está configurado corretamente
 */

import http from "http";
import { spawn } from "child_process";

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${COLORS.green}✅ ${msg}${COLORS.reset}`),
  error: (msg) => console.log(`${COLORS.red}❌ ${msg}${COLORS.reset}`),
  info: (msg) => console.log(`${COLORS.cyan}ℹ️  ${msg}${COLORS.reset}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠️  ${msg}${COLORS.reset}`),
  header: (msg) => console.log(`\n${COLORS.blue}═══ ${msg} ═══${COLORS.reset}\n`),
};

// Testar conexão a um servidor
const testConnection = (port, endpoint = "/") => {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}${endpoint}`, (res) => {
      resolve(res.statusCode === 200);
      res.on("data", () => {}); // Consumir dados
    });

    req.on("error", () => resolve(false));
    req.setTimeout(5000, () => req.abort());
  });
};

// Testar API de Liturgia
const testLiturgyAPI = () => {
  return new Promise((resolve) => {
    const req = http.get("http://localhost:3001/api/liturgia", (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json.success && json.data);
        } catch {
          resolve(false);
        }
      });
    });

    req.on("error", () => resolve(false));
    req.setTimeout(5000, () => req.abort());
  });
};

// Testar Health Check
const testHealthCheck = () => {
  return new Promise((resolve) => {
    const req = http.get("http://localhost:3001/api/health", (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json.status === "ok");
        } catch {
          resolve(false);
        }
      });
    });

    req.on("error", () => resolve(false));
    req.setTimeout(5000, () => req.abort());
  });
};

// Main
const main = async () => {
  console.clear();
  console.log(`
╔═══════════════════════════════════════════════════════╗
║     🙏 TESTES DO PODPADRE - SISTEMA DE LITURGIA      ║
╚═══════════════════════════════════════════════════════╝
  `);

  let testsPassed = 0;
  let testsFailed = 0;

  // Teste 1: Verificar Servidor Node.js
  log.header("Teste 1: Verificar Servidor Node.js (porta 3001)");
  const serverRunning = await testConnection(3001, "/api/health");
  if (serverRunning) {
    log.success("Servidor Node.js está rodando");
    testsPassed++;
  } else {
    log.error(
      "Servidor Node.js NÃO está rodando na porta 3001"
    );
    log.info("Execute: npm run server");
    testsFailed++;
  }

  // Teste 2: Verificar Vite Dev Server
  log.header("Teste 2: Verificar React/Vite (porta 5173)");
  const vitesRunning = await testConnection(5173, "/");
  if (vitesRunning) {
    log.success("Vite dev server está rodando");
    testsPassed++;
  } else {
    log.warn("Vite dev server NÃO está rodando na porta 5173");
    log.info("Execute em outro terminal: npm run dev");
    testsFailed++;
  }

  // Teste 3: Verificar Health Check da API
  log.header("Teste 3: Verificar Health Check da API");
  const healthOk = await testHealthCheck();
  if (healthOk) {
    log.success("API Health Check respondendo corretamente");
    testsPassed++;
  } else {
    log.error("API Health Check falhou");
    testsFailed++;
  }

  // Teste 4: Verificar Scraping da Liturgia
  log.header("Teste 4: Verificar Scraping da Liturgia CNBB");
  const liturgyData = await testLiturgyAPI();
  if (liturgyData) {
    log.success("Scraping da CNBB funcionando");
    log.info(`  📖 Data: ${liturgyData.date}`);
    log.info(`  📚 Título: ${liturgyData.title}`);
    log.info(
      `  📑 Leitura 1: ${liturgyData.reading1?.substring(0, 50)}...`
    );
    testsPassed++;
  } else {
    log.error("Scraping da CNBB falhou");
    log.warn("  Possíveis razões:");
    log.warn("  - Servidor não está rodando");
    log.warn("  - Sem conexão de internet");
    log.warn("  - Site da CNBB indisponível");
    testsFailed++;
  }

  // Resumo
  log.header("📊 RESUMO DOS TESTES");
  console.log(`
✅ Testes aprovados: ${COLORS.green}${testsPassed}${COLORS.reset}
❌ Testes falhados:  ${COLORS.red}${testsFailed}${COLORS.reset}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);

  if (testsFailed === 0) {
    log.success("TODOS OS TESTES PASSARAM! ✨");
    console.log(`
🌐 Acesse o aplicativo em:
   http://localhost:5173

📡 API disponível em:
   http://localhost:3001/api/liturgia
    `);
    process.exit(0);
  } else {
    log.error(`${testsFailed} teste(s) falharam`);
    console.log(`
💡 Dicas:
   1. Execute: npm run dev:all
   2. Aguarde ~30 segundos
   3. Execute novamente: node tests/test.js
    `);
    process.exit(1);
  }
};

main().catch(console.error);
