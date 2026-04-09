// Gérer les erreurs globales

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Erreur interne";

  // err mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Erreur de validation",
      errors: errors,
    });
  }

  // Erreur de clé unique (email déjà existant, etc)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} existe déjà`,
    });
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token invalide",
    });
  }

  // Erreur générique
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = { globalErrorHandler };
