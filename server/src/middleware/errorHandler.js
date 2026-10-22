import { isProduction } from '../config/env.js';

/**
 * 404 handler — reached when no route matched the request.
 */
export function notFound(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist.`,
  });
}

/**
 * Centralized error handler. Any `next(err)` or thrown error in an async
 * handler (wrapped with `asyncHandler`) lands here.
 */
// eslint-disable-next-line no-unused-vars -- `next` required for Express to treat this as an error handler
export function errorHandler(err, req, res, next) {
  let status = err.statusCode || err.status || 500;
  let message = err.message || 'Something went wrong.';

  // Map common Mongoose errors to meaningful client-facing responses.
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  } else if (err.code === 11000) {
    status = 409;
    message = `Duplicate value for: ${Object.keys(err.keyValue).join(', ')}`;
  }

  res.status(status).json({
    error: err.name || 'InternalServerError',
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
