const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Vérifier si l'utilisateur est authentifié avec un token JWT
const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token requis",
      });
    }

    // verif et decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    req.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalide",
    });
  }
};

module.exports = { authMiddleware };
