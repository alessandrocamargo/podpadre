import { getCachedDailyLiturgy } from './liturgyService.js';

function sendJson(req, res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(req.method === 'HEAD' ? undefined : JSON.stringify(body));
}
function allowRead(req, res) {
  if (req.method === 'GET' || req.method === 'HEAD') return true;
  res.setHeader('Allow', 'GET, HEAD');
  sendJson(req, res, 405, { success: false, error: 'Método não permitido' });
  return false;
}
export function createLiturgyHandler(getLiturgy = getCachedDailyLiturgy, logger = console) {
  return async function liturgyHandler(req, res) {
    if (!allowRead(req, res)) return;
    try {
      const refresh = new URL(req.url, 'http://localhost').searchParams.get('refresh') === '1';
      const data = await getLiturgy({ refresh });
      sendJson(req, res, 200, { success: true, data });
    } catch (error) {
      logger.error('Erro ao consultar liturgia:', error.message);
      res.setHeader('Retry-After', '60');
      sendJson(req, res, 503, { success: false, error: 'Erro ao buscar liturgia' });
    }
  };
}
export function healthHandler(req, res) {
  if (!allowRead(req, res)) return;
  sendJson(req, res, 200, { status: 'ok', timestamp: new Date().toISOString() });
}
