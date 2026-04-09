const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Vérifier si l'ID MongoDB est valide
const validateMongoId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "ID invalide",
    });
  }

  next();
};

// Vérifier s'il y a des erreurs de validation et les envoyer
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Erreurs de validation",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  next();
};

// Validation pour l'inscription
const validateRegister = [
  body("firstName").trim().notEmpty().withMessage("Le prénom est requis"),
  body("lastName").trim().notEmpty().withMessage("Le nom est requis"),
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("role")
    .optional()
    .isIn(["admin", "manager", "user"])
    .withMessage("Rôle invalide"),
];

// Validation pour la connexion
const validateLogin = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Le mot de passe est requis"),
];

// Validation pour les catégories
const validateCategory = [
  body("name").trim().notEmpty().withMessage("Le nom est requis"),
  body("description").optional().trim(),
];

// Validation pour les produits
const validateProduct = [
  body("name").trim().notEmpty().withMessage("Le nom est requis"),
  body("description").optional().trim(),
  body("sku").trim().notEmpty().withMessage("Le SKU est requis"),
  body("category").notEmpty().withMessage("La catégorie est requise"),
  body("price").isFloat({ min: 0 }).withMessage("Le prix doit être positif"),
  body("stock").optional().isInt({ min: 0 }),
];

// Validation pour les mouvements de stock
const validateStockMovement = [
  body("product").notEmpty().withMessage("Le produit est requis"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("La quantité doit être au moins 1"),
  body("reason")
    .optional()
    .isIn(["purchase", "sale", "return", "adjustment", "damage", "other"]),
  body("details").optional().trim(),
  body("reference").optional().trim(),
];

// Validation pour la mise à jour d'utilisateur
const validateUserUpdate = [
  body("firstName").optional().trim(),
  body("lastName").optional().trim(),
  body("email").optional().isEmail().withMessage("Email invalide"),
  body("role").optional().isIn(["admin", "manager", "user"]),
];

module.exports = {
  handleValidationErrors,
  validateMongoId,
  validateRegister,
  validateLogin,
  validateCategory,
  validateProduct,
  validateStockMovement,
  validateUserUpdate,
};
