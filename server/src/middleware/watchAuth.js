import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

/**
 * Guards the watch sync endpoint. The phone-side service sends the shared
 * secret as `x-api-key`; it must match WATCH_KEY from the environment.
 */
export function requireWatchKey(req, _res, next) {
  if (!env.watchKey) {
    return next(new HttpError(500, 'WATCH_KEY is not configured on the server'));
  }
  if (req.headers['x-api-key'] !== env.watchKey) {
    return next(new HttpError(401, 'Invalid or missing API key'));
  }
  next();
}
