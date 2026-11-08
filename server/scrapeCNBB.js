import axios from 'axios';
import * as cheerio from 'cheerio';

export const CNBB_URL = 'https://www.cnbb.org.br/liturgia-diaria/';
export const liturgyDate = (date = new Date()) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(date);

// Only accept a date supplied by the source, never assign today's date to unknown content.
export function parseLiturgy(html, expectedDate = liturgyDate()) {
  const $ = cheerio.load(html);
  const candidates = ['article', '.entry-content', '.content', 'main'];
  const area = candidates.map(selector => $(selector).first()).find(element => element.length);
  if (!area) throw new Error('Conteúdo da liturgia não encontrado.');
  area.find('script, style, nav, footer').remove();
  const content = area.html() || '';
  const text = cheerio.load(content.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(?:p|div|h[1-6]|li)>/gi, '\n')).text();
  const [year, month, day] = expectedDate.split('-');
  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const datePattern = new RegExp(`(?:${year}-${month}-${day}|0?${Number(day)}[/.]0?${Number(month)}[/.]${year}|0?${Number(day)}\\s+de\\s+${months[Number(month)-1]}\\s+de\\s+${year})`, 'i');
  if (!datePattern.test(text)) throw new Error('Não foi possível confirmar a data da liturgia na fonte.');
  const sections = {};
  let current;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\s+/g, ' ').trim();
    if (!line) continue;
    const heading = line.match(/^(primeira leitura|1[ªa] leitura|segunda leitura|2[ªa] leitura|salmo(?: responsorial)?(?=\s*(?:[:(–—-]|\d|$))|evangelho|reflexão|homilia|oração dos fiéis|orações do dia)(?:\s|[:(–—-]|$)/i);
    if (heading) {
      const label = heading[1].toLowerCase();
      current = /^(primeira|1)/.test(label) ? 'reading1' : /^(segunda|2)/.test(label) ? 'reading2' : label.startsWith('salmo') ? 'psalm' : label === 'evangelho' ? 'gospel' : undefined;
      if (current && sections[current]) throw new Error('Mais de uma liturgia encontrada; seleção ambígua.');
      if (current) sections[current] = [];
    }
    if (current) sections[current].push(line);
  }
  const result = Object.fromEntries(Object.entries(sections).map(([key, lines]) => [key, lines.join('\n\n')]));
  if (!result.reading1 || result.reading1.length < 80 || !result.gospel || result.gospel.length < 80) throw new Error('Leituras incompletas na fonte.');
  return { date: expectedDate, title: area.find('h1').first().text().trim() || 'Liturgia Diária', ...result,
    source: 'CNBB', url: CNBB_URL, fetchedAt: new Date().toISOString() };
}
export async function scrapeCNBBLiturgy() {
  const response = await axios.get(CNBB_URL, { timeout: 10000, maxContentLength: 2_000_000 });
  return parseLiturgy(response.data);
}
export function createLiturgyCache(fetcher = scrapeCNBBLiturgy, clock = () => new Date()) {
  let cached;
  let pending;
  return async ({ refresh = false } = {}) => {
    const today = liturgyDate(clock());
    if (!refresh && cached?.date === today) return cached;
    if (pending) return pending;
    pending = Promise.resolve().then(fetcher).then(data => {
      if (data.date !== today) throw new Error('Data da liturgia inválida.');
      cached = data;
      return data;
    }).finally(() => { pending = undefined; });
    return pending;
  };
}
export const getCachedOrFreshLiturgy = createLiturgyCache();
