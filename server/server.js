// Servidor Express para fornecer a liturgia diária via API
import express from "express";
import cors from "cors";
import { createLiturgyHandler, healthHandler } from "./httpHandlers.js";
import { exampleLiturgyData } from "./exampleData.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Rota raiz (diagnostico)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Servidor de Liturgia está rodando",
    endpoints: {
      health: "/api/health",
      liturgia: "/api/liturgia",
      exemplo: "/api/exemplo",
    },
  });
});

// Rota para obter a liturgia do dia
app.get("/api/liturgia", createLiturgyHandler());

// Rota para obter dados de exemplo
app.get("/api/exemplo", (req, res) => {
  res.json({
    success: true,
    demo: true,
    data: exampleLiturgyData,
  });
});

// Rota de health check
app.get("/api/health", healthHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🙏 Servidor de Liturgia rodando em http://localhost:${PORT}`);
  console.log(`📖 API disponível em http://localhost:${PORT}/api/liturgia`);
});
