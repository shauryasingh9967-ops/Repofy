export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose duplicate-key error (e.g. unique repo/file name, unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ success: false, message: `That ${field} is already in use` });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ success: false, message });
  }

  // Malformed ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid identifier supplied" });
  }

  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
