const rateLimit = require("express-rate-limit");

// Limiter le nombre de requêtes par IP
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 100, // 100 requêtes maximum
  message: "Trop de requêtes, réessayez plus tard",
});

module.exports = { rateLimiter };
