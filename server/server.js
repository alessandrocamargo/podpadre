// Servidor Express para fornecer a liturgia diária via API
import express from "express";
import cors from "cors";
import { getCachedDailyLiturgy } from "./liturgyService.js";
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
app.get("/api/liturgia", async (req, res) => {
  try {
    console.log("📖 Buscando liturgia...");
    const liturgy = await getCachedDailyLiturgy({ refresh: req.query.refresh === "1" });
    console.log("✅ Liturgia obtida com sucesso");
    res.json({
      success: true,
      data: liturgy,
    });
  } catch (error) {
    console.error("❌ Erro na rota /api/liturgia:", error);
    res.status(503).json({
      success: false,
      error: "Erro ao buscar liturgia",
    });
  }
});

// Rota para obter dados de exemplo
app.get("/api/exemplo", (req, res) => {
  res.json({
    success: true,
    demo: true,
    data: exampleLiturgyData,
  });
});

// Rota de health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🙏 Servidor de Liturgia rodando em http://localhost:${PORT}`);
  console.log(`📖 API disponível em http://localhost:${PORT}/api/liturgia`);
});
