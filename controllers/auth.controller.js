const jwt = require("jsonwebtoken");
const User = require("../models/User");

// genere token (prend id user et key JWT (duree = 7j))
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

//enregistre new user | POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "email deja utilise",
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "user",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "enregistrement reussi",
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

//connexion user |  POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email et/ou mdp manquant",
      });
    }

    //recherche user
    const user = await User.findOne({ email }).select("+password"); //inclure le mdp
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "email et/ou mdp incorrect",
      });
    }

    //verif mdp
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "email et/ou mdp incorrect",
      });
    }

    //verif compte user actif
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "compte supprimer => contacter le support",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "connection reussi",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// verif token et recupe info user  | GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
