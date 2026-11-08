import { createLiturgyService } from '../server/liturgyService.js';
import { liturgyDate } from '../server/scrapeCNBB.js';
const date = process.argv[2] || liturgyDate();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T12:00:00-03:00`))) throw new Error('Use YYYY-MM-DD.');
try {
  const get = createLiturgyService(undefined, undefined, () => new Date(`${date}T12:00:00-03:00`));
  const data = await get();
  console.log(JSON.stringify({ date: data.date, title: data.title, source: data.source, verifiedWithCNBB: data.verifiedWithCNBB,
    readings: data.readings.map(({ reference, kind, mode, source, text }) => ({ reference, kind, mode, source, characters: text.length })) }, null, 2));
} catch (error) { console.error(error.message); process.exitCode = 1; }
