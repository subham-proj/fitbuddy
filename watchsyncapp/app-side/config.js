/**
 * Fallback phone-side configuration.
 *
 * In production, DO NOT put real secrets here — enter the backend URL and API
 * key in the Zepp app's settings screen (see setting/index.js). app-side reads
 * those first and only falls back to these defaults when settings are empty
 * (useful for the simulator).
 *
 * API_BASE must be HTTPS — the Zepp companion `fetch` rejects plain HTTP.
 * API_KEY must match WATCH_KEY in server/.env.
 */
export const API_BASE = ''
export const SYNC_PATH = '/api/watch/sync'
export const API_KEY = ''
