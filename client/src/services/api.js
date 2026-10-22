/**
 * Thin fetch wrapper for the backend API.
 *
 * Requests go to `/api/*`, which Vite proxies to the Express server in dev
 * (see vite.config.js) and which should be served behind the same origin in
 * production.
 */
const BASE_URL = '/api';

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // 204 No Content — nothing to parse.
  if (res.status === 204) return null;

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message = payload?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return payload;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};
