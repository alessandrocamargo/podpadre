import axios from 'axios';
import { CNBB_URL, liturgyDate, parseLiturgy } from './scrapeCNBB.js';

export const REFERENCE_API = 'https://liturgia.up.railway.app/v2/';
const GROUPS = [
  ['primeiraLeitura', 'reading1', 'Primeira Leitura'],
  ['salmo', 'psalm', 'Salmo Responsorial'],
  ['segundaLeitura', 'reading2', 'Segunda Leitura'],
  ['extras', 'extra', 'Leitura adicional'],
  ['evangelho', 'gospel', 'Evangelho'],
];
export function normalizeReferences(payload, expectedDate) {
  const [year, month, day] = expectedDate.split('-');
  if (payload?.data !== `${day}/${month}/${year}` || typeof payload.liturgia !== 'string' || !payload.leituras) throw new Error('Data ou estrutura da liturgia inválida.');
  const readings = [];
  for (const [field, kind, label] of GROUPS) {
    const entries = payload.leituras[field];
    if (!Array.isArray(entries)) throw new Error(`Grupo ${field} inválido.`);
    for (const [index, entry] of entries.entries()) {
      if (kind === 'extra' && !entry.referencia) continue; // Exsultet and other non-biblical prayers.
      if (typeof entry.referencia !== 'string' || !entry.referencia.trim()) throw new Error('Referência bíblica ausente.');
      readings.push({ id: `${kind}-${index}`, kind, label: entry.tipo || label, reference: entry.referencia.trim(),
        title: typeof entry.titulo === 'string' ? entry.titulo : '',
        liturgicalText: typeof entry.texto === 'string' ? entry.texto.trim() : '',
        refrain: typeof entry.refrao === 'string' ? entry.refrao : undefined });
    }
  }
  for (const required of ['reading1', 'psalm', 'gospel']) {
    if (!readings.some(item => item.kind === required)) throw new Error(`Liturgia sem ${required}.`);
  }
  return { date: expectedDate, title: payload.liturgia, readings,
    source: 'API Liturgia Diária (Dancrf)', url: 'https://github.com/Dancrf/liturgia-diaria',
    verifiedWithCNBB: false,
    notice: 'Referências fornecidas pela API Liturgia Diária; não foi possível confirmá-las automaticamente na CNBB.' };
}
export function referencesFromCNBB(html, date) {
  const parsed = parseLiturgy(html, date);
  const readings = [];
  for (const [kind, label] of [['reading1','Primeira Leitura'], ['psalm','Salmo Responsorial'], ['reading2','Segunda Leitura'], ['gospel','Evangelho']]) {
    if (!parsed[kind]) continue;
    const reference = parsed[kind].split('\n')[0].match(/([1-3]?\s*[A-Za-zÀ-ÿ]+\s+\d+(?:\(\d+\))?(?:,\s*[\d.a-d–—, -]+)?)/)?.[1]?.trim();
    if (!reference) throw new Error('CNBB sem referência bíblica reconhecível.');
    readings.push({ id: `${kind}-0`, kind, label, reference, title: '', liturgicalText: parsed[kind] });
  }
  if (!readings.some(item => item.kind === 'psalm')) throw new Error('CNBB sem salmo validado.');
  return { date, title: parsed.title, readings, source: 'CNBB', url: CNBB_URL, verifiedWithCNBB: true };
}
export async function getDailyReferences(date = liturgyDate(), get = url => axios.get(url, { timeout: 4000, maxContentLength: 2_000_000 })) {
  // Read only the public CNBB page. The separate viewer API denies direct access (403).
  try { return referencesFromCNBB((await get(CNBB_URL)).data, date); }
  catch {
    const [year, month, day] = date.split('-');
    const url = `${REFERENCE_API}?dia=${day}&mes=${month}&ano=${year}`;
    return normalizeReferences((await get(url)).data, date);
  }
}
