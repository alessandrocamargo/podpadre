// Serviço para buscar liturgia diária de uma API pública

interface LiturgyData {
  date: string;
  title: string;
  reading1?: string;
  reading2?: string;
  gospel?: string;
  liturgicalDay?: string;
}

const CACHE_KEY = "liturgy_cache";
const CACHE_EXPIRY_KEY = "liturgy_cache_expiry";

// Função para obter a data no formato YYYY-MM-DD
const getFormattedDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Verifica se o cache é do dia atual
const isCacheValid = (): boolean => {
  const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
  if (!expiry) return false;

  const cachedDate = expiry;
  const today = getFormattedDate();
  return cachedDate === today;
};

// Obtém liturgia do cache
const getCachedLiturgy = (): LiturgyData | null => {
  if (!isCacheValid()) return null;
  const cached = localStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
};

// Salva liturgia no cache
const cacheLiturgy = (data: LiturgyData): void => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(CACHE_EXPIRY_KEY, getFormattedDate());
};

// Busca dados da API local de scraping da CNBB
const fetchFromLiturgyApi = async (): Promise<LiturgyData> => {
  try {
    console.log("🔄 Tentando buscar liturgia de http://localhost:3001/api/liturgia");
    // Tentar buscar do servidor local
    const response = await fetch("http://localhost:3001/api/liturgia");

    console.log("📊 Status da resposta:", response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Dados recebidos da API:", data);
      
      const apiData = data.data || data;
      const result = {
        date: apiData.date || getFormattedDate(),
        title: apiData.title || "Liturgia do Dia",
        reading1: apiData.reading1 || "",
        reading2: apiData.reading2 || "",
        gospel: apiData.gospel || "",
        liturgicalDay: apiData.date || "",
      };
      
      console.log("✨ Dados formatados para exibição:", result);
      return result;
    }

    console.error("❌ API respondeu com erro:", response.status);
    // Se a API local falhar, retornar dados padrão
    return getDefaultLiturgy();
  } catch (error) {
    console.error("❌ Erro ao buscar liturgia da API local:", error);
    console.error("ℹ️  Verifique se o servidor está rodando em http://localhost:3001");
    // Se o servidor não estiver rodando, retornar dados padrão
    return getDefaultLiturgy();
  }
};

// Retorna dados padrão quando a API não está disponível
const getDefaultLiturgy = (): LiturgyData => {
  const today = new Date();
  const dayName = today.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    date: getFormattedDate(today),
    title: `Liturgia de ${dayName}`,
    reading1:
      "A liturgia diária carregará automaticamente quando houver conexão com a API.",
    reading2: "",
    gospel: "Leitura do Evangelho do dia",
    liturgicalDay: dayName,
  };
};

// Função principal para obter a liturgia do dia
export const getTodayLiturgy = async (): Promise<LiturgyData> => {
  // Verificar se há cache válido
  const cached = getCachedLiturgy();
  if (cached) {
    return cached;
  }

  // Se não houver cache, buscar da API
  const liturgy = await fetchFromLiturgyApi();
  cacheLiturgy(liturgy);
  return liturgy;
};

// Função para limpar o cache (útil para testes)
export const clearLiturgyCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_EXPIRY_KEY);
};

// Função para forçar atualização (ignora cache)
export const refreshLiturgy = async (): Promise<LiturgyData> => {
  clearLiturgyCache();
  return getTodayLiturgy();
};
