const User = require("../models/User");

// recupe tous les user actif | GET /api/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// recupe user par id | GET /api/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// update user | PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, role } = req.body;

    // anti auto promotion (seul admin peut modifier le role)
    if (role && req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "vous ne pouvez pas modifier votre role",
      });
    }

    const updateData = {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: email || undefined,
      role: role || undefined,
      updatedAt: Date.now(),
    };

    //delete champ undefined (pour eviter de reset les champ pas modifier)
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "modification reussi",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// desactive user (soft delete) | DELETE /api/users/:id
exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "le compte du user est desactiver",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
