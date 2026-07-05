/**
 * Global Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
  console.error('[Error Middleware] Catastrophic request error:', err);

  const status = err.status || 500;
  const message = err.message || 'An internal server error occurred';

  res.status(status).json({
    error: err.name || 'ServerError',
    message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
