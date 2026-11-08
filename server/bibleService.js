import axios from 'axios';

export const BIBLE_URL = 'https://bible.helloao.org/api/por_bsl';
export const BIBLE_CREDIT = {
  name: 'Bíblia Portuguesa Mundial',
  url: 'https://ebible.org/Scriptures/details.php?id=porbrbsl',
  notice: 'Tradução bíblica para estudo, em revisão; não é o texto oficial do lecionário da CNBB.',
};
const BOOKS = {
  Gn:'GEN', Ex:'EXO', Lv:'LEV', Nm:'NUM', Dt:'DEU', Js:'JOS', Jz:'JDG', Rt:'RUT',
  '1Sm':'1SA','2Sm':'2SA','1Rs':'1KI','2Rs':'2KI','1Cr':'1CH','2Cr':'2CH', Ed:'EZR', Ne:'NEH',
  Tb:'TOB', Jt:'JDT', Est:'EST', '1Mc':'1MA','2Mc':'2MA', Jó:'JOB', Sl:'PSA', Pr:'PRO', Pv:'PRO',
  Ecl:'ECC', Ct:'SNG', Sb:'WIS', Eclo:'SIR', Is:'ISA', Jr:'JER', Lm:'LAM', Br:'BAR', Ez:'EZK',
  Dn:'DAN', Os:'HOS', Jl:'JOL', Am:'AMO', Ab:'OBA', Jn:'JON', Mq:'MIC', Na:'NAM',
  Hab:'HAB', Hc:'HAB', Sf:'ZEP', Ag:'HAG', Zc:'ZEC', Ml:'MAL', Mt:'MAT', Mc:'MRK', Lc:'LUK', Jo:'JHN',
  At:'ACT', Rm:'ROM', '1Cor':'1CO','2Cor':'2CO', '1Co':'1CO','2Co':'2CO', Gl:'GAL', Ef:'EPH',
  Fl:'PHP', Cl:'COL','1Ts':'1TH','2Ts':'2TH','1Tm':'1TI','2Tm':'2TI', Tt:'TIT', Fm:'PHM',
  Hb:'HEB', Tg:'JAS','1Pd':'1PE','2Pd':'2PE','1Pe':'1PE','2Pe':'2PE','1Jo':'1JN','2Jo':'2JN','3Jo':'3JN', Jd:'JUD', Ap:'REV',
};
export class UnsupportedReference extends Error {}
export function parseReference(reference) {
  if (typeof reference !== 'string' || reference.length > 180) throw new UnsupportedReference('Referência inválida.');
  const normalized = reference.replace(/[–—]/g, '-').replace(/\s+/g, '');
  // Lettered half-verses, alternatives and numbering equivalences need the liturgical source text.
  const match = normalized.match(/^([1-3]?[A-Za-zÀ-ÿ]+)(\d+),(\d+(?:-\d+)?(?:\.\d+(?:-\d+)?)*)$/);
  if (!match || !BOOKS[match[1]]) throw new UnsupportedReference('Referência com recorte ou formato não suportado.');
  const book = BOOKS[match[1]];
  if (['PSA','DAN','EST','JOL','MAL'].includes(book)) throw new UnsupportedReference('Numeração exige correspondência com o lecionário.');
  const chapter = Number(match[2]);
  const verses = [];
  for (const segment of match[3].split('.')) {
    const [start, end = start] = segment.split('-').map(Number);
    if (start < 1 || end < start || end > 176) throw new UnsupportedReference('Intervalo inválido.');
    for (let number = start; number <= end; number++) {
      if (verses.includes(number)) throw new UnsupportedReference('Versículos repetidos.');
      verses.push(number);
    }
  }
  if (chapter < 1 || chapter > 150 || verses.length > 176) throw new UnsupportedReference('Capítulo inválido.');
  return { book, chapter, verses };
}
export function extractPassage(payload, parsed) {
  if (payload?.translation?.id !== 'por_bsl' || payload?.book?.id !== parsed.book || payload?.chapter?.number !== parsed.chapter || !Array.isArray(payload.chapter.content)) throw new Error('Resposta bíblica incompatível.');
  const verses = payload.chapter.content.filter(item => item.type === 'verse');
  return parsed.verses.map(number => {
    const matches = verses.filter(item => item.number === number);
    if (matches.length !== 1 || !Array.isArray(matches[0].content)) throw new Error(`Versículo ${number} ausente ou ambíguo.`);
    const text = matches[0].content.map(part => typeof part === 'string' ? part : typeof part?.text === 'string' ? part.text : '').join(' ').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
    if (!text) throw new Error(`Versículo ${number} vazio.`);
    return `${number} ${text}`;
  }).join('\n\n');
}
export function createBibleClient(get = url => axios.get(url, { timeout: 7000, maxContentLength: 2_000_000 })) {
  const chapters = new Map();
  return async reference => {
    const parsed = parseReference(reference);
    const url = `${BIBLE_URL}/${parsed.book}/${parsed.chapter}.json`;
    if (!chapters.has(url)) {
      // Bound memory; failures are evicted so subsequent requests can recover.
      if (chapters.size >= 100) chapters.delete(chapters.keys().next().value);
      const pending = Promise.resolve().then(() => get(url)).then(response => response.data);
      chapters.set(url, pending);
      pending.catch(() => { if (chapters.get(url) === pending) chapters.delete(url); });
    }
    const payload = await chapters.get(url);
    try { return { text: extractPassage(payload, parsed), source: BIBLE_CREDIT.name, sourceUrl: BIBLE_CREDIT.url, mode: 'bible' }; }
    catch (error) { chapters.delete(url); throw error; }
  };
}
export const getBiblePassage = createBibleClient();
