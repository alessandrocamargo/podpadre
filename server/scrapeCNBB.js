// Função para fazer scraping da liturgia do site da CNBB
import axios from "axios";
import * as cheerio from "cheerio";
import { exampleLiturgyData } from "./exampleData.js";

const CNBB_URL = "https://www.cnbb.org.br/liturgia-diaria/";

export const scrapeCNBBLiturgy = async () => {
  try {
    console.log("🌐 Iniciando scraping da CNBB...");
    console.log(`📡 Acessando: ${CNBB_URL}`);
    
    // Buscar a página da CNBB
    const response = await axios.get(CNBB_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    console.log("✅ Página carregada com sucesso");
    console.log(`📄 Status: ${response.status}`);
    
    const html = response.data;
    const $ = cheerio.load(html);

    // Extrair o conteúdo da liturgia
    // A CNBB usa diferentes seletores, vou tentar vários
    let title = "";
    let reading1 = "";
    let reading2 = "";
    let gospel = "";
    let reflection = "";

    // Tentar diferentes seletores possíveis
    title =
      $("h1").first().text().trim() ||
      $(".page-title").text().trim() ||
      $(".entry-title").text().trim() ||
      "Liturgia Diária";

    // Procurar pelas leituras no conteúdo principal
    const contentArea = $("article").first() || $(".content").first();

    // Extrair texto do artigo
    const content = contentArea.html() || "";

    // Procurar por padrões específicos
    const lines = content.split(/<br\s*\/?>/gi);

    for (let i = 0; i < lines.length; i++) {
      const line = cheerio.load(lines[i]).text().trim();

      if (line.includes("Primeira") || line.includes("primeira")) {
        reading1 =
          lines
            .slice(i, i + 10)
            .map((l) => cheerio.load(l).text().trim())
            .join(" ")
            .substring(0, 500) || "Primeira leitura não disponível";
      }

      if (line.includes("Segunda") || line.includes("segunda")) {
        reading2 =
          lines
            .slice(i, i + 10)
            .map((l) => cheerio.load(l).text().trim())
            .join(" ")
            .substring(0, 500) || "Segunda leitura não disponível";
      }

      if (
        line.includes("Evangelho") ||
        line.includes("evangelho") ||
        line.includes("Mc ") ||
        line.includes("Mt ") ||
        line.includes("Lc ") ||
        line.includes("Jo ")
      ) {
        gospel =
          lines
            .slice(i, i + 10)
            .map((l) => cheerio.load(l).text().trim())
            .join(" ")
            .substring(0, 500) || "Evangelho não disponível";
      }
    }

    // Se não encontrou nada, extrair todo o texto
    if (!reading1 && !reading2 && !gospel) {
      console.log("⚠️  Nenhuma leitura encontrada. Usando dados de exemplo.");
      return exampleLiturgyData;
    }

    const today = new Date();
    const dateStr = today.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    console.log("✅ Scraping concluído com sucesso!");
    
    return {
      date: dateStr,
      title: title || "Liturgia do Dia",
      reading1: reading1 || "Primeira leitura não disponível",
      reading2: reading2 || "Segunda leitura não disponível",
      gospel: gospel || "Evangelho não disponível",
      source: "CNBB - Conferência Nacional dos Bispos do Brasil",
      url: CNBB_URL,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Erro ao fazer scraping da CNBB:", error.message);
    console.log("📚 Usando dados de exemplo como fallback...");

    // Retornar dados de exemplo em caso de erro
    return exampleLiturgyData;
  }
};

// Função para fazer cache dos dados
const CACHE_FILE = "liturgy-cache.json";
let cachedData = null;
let cacheDate = null;

export const getCachedOrFreshLiturgy = async () => {
  const today = new Date().toDateString();

  // Se já buscamos hoje, retornar do cache
  if (cacheDate === today && cachedData) {
    console.log("💾 Retornando liturgia do cache");
    return cachedData;
  }

  // Caso contrário, buscar novo
  console.log("🔄 Buscando liturgia fresca da CNBB");
  cachedData = await scrapeCNBBLiturgy();
  cacheDate = today;

  return cachedData;
};
