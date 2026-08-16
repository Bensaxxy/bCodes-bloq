const errorMiddleware = (err, req, res, next) => {
  console.error("Global Error:", err);

  // -----------------------------------------
  // Mongoose Validation Error
  // -----------------------------------------
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // -----------------------------------------
  // Invalid MongoDB ObjectId
  // -----------------------------------------
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path || "ID"}`,
    });
  }

  // -----------------------------------------
  // Duplicate MongoDB field
  // -----------------------------------------
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];

    return res.status(400).json({
      success: false,
      message: field ? `${field} already exists` : "Duplicate value",
    });
  }

  // -----------------------------------------
  // JWT errors
  // -----------------------------------------
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Authentication token has expired",
    });
  }

  // -----------------------------------------
  // Default server error
  // -----------------------------------------
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

export default errorMiddleware;
