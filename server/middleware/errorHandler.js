/**
 * Global error handler. Must be registered last. Never leak stack or internal errors to client.
 */
export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Something went wrong. Please try again.";
  if (status >= 500) {
    console.error("Server error:", err.message);
    if (process.env.NODE_ENV !== "production") {
      console.error(err.stack);
    }
  }
  res.status(status).json({
    error: status >= 500 ? "An unexpected error occurred. Please try again." : message,
  });
}
