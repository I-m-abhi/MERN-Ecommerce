// Middleware to handle async errors in Express routes
// This middleware will catch any errors thrown in async route handlers
// and pass them to the next error handling middleware.

// Usage: Wrap your async route handlers with this middleware.
// Example: app.get('/route', handleAsyncError(async (req, res) => { ... }));

export default (myErrorFun) => (req, res, next) => {
  Promise.resolve(myErrorFun(req, res, next)).catch(next);
}