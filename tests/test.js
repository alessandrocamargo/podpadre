import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLiturgy, createLiturgyCache, liturgyDate } from '../server/scrapeCNBB.js';
const date = '2026-11-07';
const reading = 'Uma leitura completa para verificar que nenhum conteúdo será cortado. '.repeat(20);
const html = `<main><p>07/11/2026</p><h2>Primeira Leitura</h2><p>${reading}</p><h2>Salmo Responsorial</h2><p>Salmo de teste</p><h2>Evangelho</h2><p>${reading}</p><h2>Reflexão</h2><p>Não pertence ao evangelho.</p></main>`;
test('extrai leituras completas, salmo e não inclui reflexão', () => {
  const data = parseLiturgy(html, date);
  assert.ok(data.reading1.length > 500);
  assert.ok(data.gospel.length > 500);
  assert.ok(!data.gospel.includes('Não pertence'));
  assert.match(data.psalm, /Salmo de teste/);
  assert.equal(data.reading2, undefined);
});
test('rejeita data incorreta, ausente e leituras incompletas', () => {
  assert.throws(() => parseLiturgy(html, '2026-11-08'));
  assert.throws(() => parseLiturgy(html.replace('07/11/2026', ''), date));
  assert.throws(() => parseLiturgy('<article>07/11/2026<h2>Evangelho</h2>texto curto</article>', date));
});
test('usa calendário de São Paulo na virada UTC', () => {
  assert.equal(liturgyDate(new Date('2026-11-08T01:00:00Z')), date);
});
test('cache reaproveita sucesso, permite atualização e muda de dia', async () => {
  let calls = 0;
  let now = new Date('2026-11-07T12:00:00Z');
  const get = createLiturgyCache(async () => ({ date: liturgyDate(now), version: ++calls }), () => now);
  assert.equal((await get()).version, 1);
  assert.equal((await get()).version, 1);
  assert.equal((await get({ refresh: true })).version, 2);
  now = new Date('2026-11-08T12:00:00Z');
  assert.equal((await get()).version, 3);
});
test('falha não é armazenada e consultas simultâneas compartilham a busca', async () => {
  let calls = 0;
  const get = createLiturgyCache(async () => {
    if (++calls === 1) throw new Error('offline');
    return { date };
  }, () => new Date('2026-11-07T12:00:00Z'));
  await assert.rejects(get());
  const results = await Promise.all([get(), get()]);
  assert.equal(calls, 2);
  assert.deepEqual(results, [{ date }, { date }]);
});

// Exercise the actual browser service without a running API or browser.
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
test('serviço do navegador recupera cache inválido, ignora falhas e força atualização', async () => {
  const originalFetch = globalThis.fetch;
  const originalStorage = globalThis.localStorage;
  const storage = new Map([['liturgy_cache_v3', '{invalid']]);
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };
  const source = (await readFile(new URL('../src/services/liturgyService.ts', import.meta.url), 'utf8')).replace('import.meta.env.VITE_API_URL', 'undefined');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  const service = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
  const requests = [];
  const data = { date: service.getLiturgyDate(), title: 'Liturgia', reading1: reading, gospel: reading, source: 'CNBB', url: 'https://www.cnbb.org.br/liturgia-diaria/', fetchedAt: new Date().toISOString(),
    verifiedWithCNBB: false, bible: { name: 'Teste', url: 'https://example.com', notice: 'Teste' },
    readings: [{ id: 'reading1-0', kind: 'reading1', label: 'Primeira Leitura', title: '', reference: 'Fl 4,10-19', text: reading, source: 'Teste', sourceUrl: 'https://example.com', mode: 'bible' }] };
  try {
    globalThis.fetch = async url => { requests.push(url); return { ok: false }; };
    await assert.rejects(service.getTodayLiturgy());
    assert.equal(storage.has('liturgy_cache_v3'), false);
    globalThis.fetch = async url => { requests.push(url); return { ok: true, json: async () => ({ success: true, data }) }; };
    assert.deepEqual(await service.getTodayLiturgy(), data);
    await service.getTodayLiturgy();
    assert.equal(requests.length, 2);
    await service.refreshLiturgy();
    assert.equal(requests.at(-1), '/api/liturgia?refresh=1');
    globalThis.localStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } };
    assert.deepEqual(await service.getTodayLiturgy(), data);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalStorage;
  }
});

import { parseReference, extractPassage, createBibleClient, UnsupportedReference } from '../server/bibleService.js';
import { normalizeReferences, getDailyReferences } from '../server/liturgyReferences.js';
import { createLiturgyService } from '../server/liturgyService.js';
const referencePayload = {
  data: '07/11/2026', liturgia: 'Sábado', leituras: {
    primeiraLeitura: [{ referencia: 'Fl 4,10-19', titulo: 'Filipenses', texto: reading }],
    salmo: [{ referencia: 'Sl 111(112)', refrao: 'Refrão de teste', texto: reading }],
    segundaLeitura: [], evangelho: [{ referencia: 'Lc 16,9-15', texto: reading }], extras: [],
  },
};
const chapterPayload = { translation: { id: 'por_bsl' }, book: { id: 'PHP' }, chapter: { number: 4, content:
  Array.from({ length: 19 }, (_, index) => ({ type: 'verse', number: index + 1, content: ['Texto ', { text: `do versículo ${index + 1}` }, { noteId: 1 }] })) } };
test('resolve referências com intervalos e saltos sem acrescentar versículos', () => {
  assert.deepEqual(parseReference('Fl 4, 10–12.15'), { book: 'PHP', chapter: 4, verses: [10,11,12,15] });
  assert.equal(parseReference('1 Cor 13,1-3').book, '1CO');
  assert.equal(parseReference('Sb 3,1-9').book, 'WIS');
  assert.equal(parseReference('Jó 1,1').book, 'JOB');
  const text = extractPassage(chapterPayload, parseReference('Fl 4,10-12.15'));
  assert.match(text, /12 Texto do versículo 12/);
  assert.ok(!text.includes('versículo 13'));
  assert.ok(!text.includes('noteId'));
});
test('recortes parciais, salmos, capítulos cruzados e alternativas exigem texto litúrgico', () => {
  for (const ref of ['Lc 16,9a-15', 'Sl 111(112)', 'Gn 1,1-2,2', 'Jo 3,16 ou Jo 4,1', 'Fl 4,19-10', 'Fl 4,0', 'Fl 4,10.10']) {
    assert.throws(() => parseReference(ref), UnsupportedReference);
  }
});
test('recusa texto de outro livro, tradução ou com versículos ausentes', () => {
  assert.throws(() => extractPassage(chapterPayload, parseReference('Fl 4,19-20')));
  assert.throws(() => extractPassage(chapterPayload, parseReference('Lc 4,10')));
  assert.throws(() => extractPassage({ ...chapterPayload, translation: { id: 'other' } }, parseReference('Fl 4,10')));
});
test('cache bíblico compartilha o capítulo entre referências e recupera falhas', async () => {
  let calls = 0;
  const fetch = createBibleClient(async () => {
    if (++calls === 1) throw new Error('offline');
    return { data: chapterPayload };
  });
  await assert.rejects(fetch('Fl 4,10'));
  await Promise.all([fetch('Fl 4,10-12'), fetch('Fl 4,15')]);
  assert.equal(calls, 2);
});
test('normalização valida data e mantém alternativas e leituras adicionais', () => {
  assert.throws(() => normalizeReferences(referencePayload, '2026-11-08'));
  const payload = structuredClone(referencePayload);
  payload.leituras.evangelho.push({ referencia: 'Lc 16,9-13', texto: reading });
  payload.leituras.extras.push({ tipo: 'Terceira Leitura', referencia: 'Ex 14,15-20', texto: reading }, { titulo: 'Exsultet', texto: reading });
  const result = normalizeReferences(payload, date);
  assert.equal(result.verifiedWithCNBB, false);
  assert.equal(result.readings.filter(item => item.kind === 'gospel').length, 2);
  assert.equal(result.readings.filter(item => item.kind === 'extra').length, 1);
  assert.equal(new Set(result.readings.map(item => item.id)).size, result.readings.length);
});
test('fonte alternativa é identificada quando a CNBB não fornece referências', async () => {
  const urls = [];
  const result = await getDailyReferences(date, async url => {
    urls.push(url);
    return { data: url.includes('cnbb.org.br') ? '<html>Visualizador externo</html>' : referencePayload };
  });
  assert.equal(urls.length, 2);
  assert.match(urls[1], /dia=07&mes=11&ano=2026/);
  assert.equal(result.verifiedWithCNBB, false);
  assert.match(result.source, /Dancrf/);
});
test('integra referências e Bíblia, preserva salmo e informa a origem de cada texto', async () => {
  const requested = [];
  const get = createLiturgyService(async () => normalizeReferences(referencePayload, date), async ref => {
    requested.push(ref);
    return { text: reading, mode: 'bible', source: 'Bíblia de teste', sourceUrl: 'https://example.com' };
  }, () => new Date('2026-11-07T12:00:00Z'));
  const result = await get();
  assert.deepEqual(requested, ['Fl 4,10-19', 'Lc 16,9-15']);
  assert.equal(result.readings.find(item => item.kind === 'psalm').mode, 'liturgy');
  assert.equal(result.readings.find(item => item.kind === 'gospel').mode, 'bible');
  assert.equal(result.readings[0].liturgicalText, undefined);
  assert.equal(result.verifiedWithCNBB, false);
});
test('API bíblica indisponível preserva texto válido; sem texto não inventa leituras', async () => {
  const refs = normalizeReferences(referencePayload, date);
  const get = createLiturgyService(async () => refs, async () => { throw new Error('offline'); }, () => new Date('2026-11-07T12:00:00Z'));
  assert.ok((await get()).readings.every(item => item.mode === 'liturgy'));
  refs.readings[0].liturgicalText = '';
  await assert.rejects(get());
});

import http from 'node:http';
import { createLiturgyHandler } from '../server/httpHandlers.js';
import deployedHealth from '../api/health.js';
import deployedLiturgy from '../api/liturgia.js';
async function serveHandler(t, handler) {
  const server = http.createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())));
  return `http://127.0.0.1:${server.address().port}`;
}
test('função da Vercel exporta handler e health responde JSON por HTTP', async t => {
  assert.equal(typeof deployedLiturgy, 'function');
  const url = await serveHandler(t, deployedHealth);
  const response = await fetch(`${url}/api/health`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.equal((await response.json()).status, 'ok');
});
test('handler HTTP compartilha contrato da liturgia e encaminha refresh', async t => {
  const calls = [];
  const data = { date, title: 'Liturgia de teste' };
  const url = await serveHandler(t, createLiturgyHandler(async options => { calls.push(options); return data; }));
  const normal = await fetch(`${url}/api/liturgia`);
  assert.equal(normal.status, 200);
  assert.equal(normal.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await normal.json(), { success: true, data });
  await fetch(`${url}/api/liturgia?refresh=1`);
  assert.deepEqual(calls, [{ refresh: false }, { refresh: true }]);
  const head = await fetch(`${url}/api/liturgia`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  const post = await fetch(`${url}/api/liturgia`, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
});
test('falha upstream retorna JSON 503 sem expor detalhes internos', async t => {
  const url = await serveHandler(t, createLiturgyHandler(async () => { throw new Error('detalhe interno'); }, { error() {} }));
  const response = await fetch(`${url}/api/liturgia`);
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('retry-after'), '60');
  assert.deepEqual(await response.json(), { success: false, error: 'Erro ao buscar liturgia' });
});
test('fallback da Vercel atende rotas React e preserva caminhos da API', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const fallback = config.rewrites.find(rule => rule.destination === '/index.html');
  const pattern = new RegExp(`^${fallback.source}$`);
  for (const path of ['/liturgia', '/historia', '/sobre', '/curiosidades', '/curiosidade/1']) assert.ok(pattern.test(path));
  for (const path of ['/api', '/api/liturgia', '/api/health', '/api/unknown']) assert.ok(!pattern.test(path));
});
