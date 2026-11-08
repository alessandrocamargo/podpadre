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
  const storage = new Map([['liturgy_cache_v2', '{invalid']]);
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };
  const source = (await readFile(new URL('../src/services/liturgyService.ts', import.meta.url), 'utf8')).replace('import.meta.env.VITE_API_URL', 'undefined');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  const service = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
  const requests = [];
  const data = { date: service.getLiturgyDate(), title: 'Liturgia', reading1: reading, gospel: reading, source: 'CNBB', url: 'https://www.cnbb.org.br/liturgia-diaria/', fetchedAt: new Date().toISOString() };
  try {
    globalThis.fetch = async url => { requests.push(url); return { ok: false }; };
    await assert.rejects(service.getTodayLiturgy());
    assert.equal(storage.has('liturgy_cache_v2'), false);
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
