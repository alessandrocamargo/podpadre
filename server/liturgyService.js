import { createLiturgyCache, liturgyDate } from './scrapeCNBB.js';
import { getDailyReferences } from './liturgyReferences.js';
import { BIBLE_CREDIT, getBiblePassage } from './bibleService.js';

export function createLiturgyService(referenceFetcher = getDailyReferences, bibleFetcher = getBiblePassage, clock = () => new Date()) {
  return async () => {
    const date = liturgyDate(clock());
    const references = await referenceFetcher(date);
    if (references.date !== date) throw new Error('Referências de outra data.');
    // Sequential groups of three bound upstream traffic even on days with many alternatives.
    const readings = [];
    for (let offset = 0; offset < references.readings.length; offset += 3) {
      readings.push(...await Promise.all(references.readings.slice(offset, offset + 3).map(async reading => {
        let passage;
        try {
          // Responsorial psalms and partial verses require the exact liturgical selection.
          if (reading.kind === 'psalm') throw new Error('Preservar salmo responsorial.');
          passage = await bibleFetcher(reading.reference);
        } catch {
          if (!reading.liturgicalText?.trim()) throw new Error(`Texto indisponível para ${reading.reference}.`);
          passage = { text: reading.liturgicalText, mode: 'liturgy', source: references.source, sourceUrl: references.url };
        }
        if (!passage.text?.trim()) throw new Error('Texto bíblico vazio.');
        const { liturgicalText: _original, ...metadata } = reading;
        void _original;
        return { ...metadata, ...passage };
      })));
    }
    const legacy = kind => readings.filter(item => item.kind === kind).map(item => `${item.reference}\n\n${item.text}`).join('\n\n');
    return { date, title: references.title, readings, reading1: legacy('reading1'), psalm: legacy('psalm'),
      reading2: legacy('reading2') || undefined, gospel: legacy('gospel'),
      source: references.source, url: references.url, verifiedWithCNBB: references.verifiedWithCNBB,
      notice: references.notice, bible: BIBLE_CREDIT, fetchedAt: clock().toISOString() };
  };
}
export const getCachedDailyLiturgy = createLiturgyCache(createLiturgyService());
