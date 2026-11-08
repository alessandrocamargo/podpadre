import type { LiturgyData } from '../types/Liturgy';

const CACHE_KEY = 'liturgy_cache_v2';
const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
export const getLiturgyDate = (date = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

const isLiturgy = (value: unknown): value is LiturgyData => {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  return data.date === getLiturgyDate() &&
    ['title', 'reading1', 'gospel', 'source', 'url', 'fetchedAt'].every(key => typeof data[key] === 'string' && (data[key] as string).trim().length > 0) &&
    (data.reading1 as string).length >= 80 && (data.gospel as string).length >= 80 &&
    (data.reading2 === undefined || typeof data.reading2 === 'string') &&
    (data.psalm === undefined || typeof data.psalm === 'string');
};

export const clearLiturgyCache = (): void => {
  try { localStorage.removeItem(CACHE_KEY); } catch { /* Storage is optional. */ }
};

async function loadLiturgy(refresh = false): Promise<LiturgyData> {
  if (!refresh) {
    try {
      const cached: unknown = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (isLiturgy(cached)) return cached;
    } catch { clearLiturgyCache(); }
  }
  const response = await fetch(`${API_BASE}/liturgia${refresh ? '?refresh=1' : ''}`, {
    signal: AbortSignal.timeout(15000), cache: 'no-store',
  });
  if (!response.ok) throw new Error('Liturgia indisponível. Tente novamente em alguns instantes.');
  const payload = await response.json();
  if (payload.success !== true || !isLiturgy(payload.data)) throw new Error('A fonte não forneceu uma liturgia válida para hoje.');
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload.data)); } catch { /* Storage is optional. */ }
  return payload.data;
}
export const getTodayLiturgy = (): Promise<LiturgyData> => loadLiturgy();
export const refreshLiturgy = (): Promise<LiturgyData> => { clearLiturgyCache(); return loadLiturgy(true); };
