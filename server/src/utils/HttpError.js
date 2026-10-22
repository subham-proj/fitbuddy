/**
 * Error with an attached HTTP status code. Throw from controllers/services to
 * produce a specific response status via the central error handler.
 *
 *   throw new HttpError(404, 'Workout not found');
 */
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}
