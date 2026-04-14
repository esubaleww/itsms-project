export const validateNumber = (paramName) => {
  return (req, res, next) => {
    const value = req.params[paramName] || req.body[paramName];

    if (value !== undefined && isNaN(Number(value))) {
      return res.status(400).json({
        success: false,
        message: `${paramName} must be a number`,
        received: value,
      });
    }

    next();
  };
};

export const validateEnum = (field, allowedValues) => {
  return (req, res, next) => {
    const value = req.body[field];

    if (value !== undefined && !allowedValues.includes(value)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${field}. Allowed: ${allowedValues.join(", ")}`,
        received: value,
      });
    }

    next();
  };
};

/**
 * Global error handler for MongoDB errors
 */
export const handleValidationErrors = (err, req, res, next) => {
  // Handle invalid ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({
      success: false,
      message: `Invalid ID: "${err.value}" is not a valid ObjectId`,
    });
  }

  // Handle duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  next(err);
};
