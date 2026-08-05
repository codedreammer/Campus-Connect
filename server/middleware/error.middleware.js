// Converts unmatched requests into a consistent error that the central handler can format.
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;

  next(error);
};

// Formats all application errors in one predictable API response shape.
export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    ...(isProduction ? {} : { stack: error.stack }),
  });
};
