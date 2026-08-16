import userModel from "../models/userModel.js";

// ------------------------------------
// GET ALL USERS
// ------------------------------------
export const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Prevent invalid values
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const skip = (safePage - 1) * safeLimit;

    const users = await userModel
      .find({ role: "user" })
      .select(
        "-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit);

    const totalUsers = await userModel.countDocuments();

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: safePage,
        totalPages: Math.ceil(totalUsers / safeLimit),
        totalUsers,
        limit: safeLimit,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// ------------------------------------
// GET SINGLE USER
// ------------------------------------
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel
      .findById(id)
      .select(
        "-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt",
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// ------------------------------------
// UPDATE USER
// ------------------------------------
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.userId;

    const { name, email, role, isAccountVerified } = req.body;

    // Prevent admin from modifying their own role
    if (
      id.toString() === adminId.toString() &&
      role !== undefined &&
      role !== "admin"
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your own admin privileges",
      });
    }

    // Validate role
    if (
      role !== undefined &&
      !["user", "admin"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be user or admin",
      });
    }

    // Check if user exists
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check email uniqueness
    if (email && email !== user.email) {
      const existingUser = await userModel.findOne({
        email,
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    // Update allowed fields
    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      user.email = email;
    }

    if (role !== undefined) {
      user.role = role;
    }

    if (isAccountVerified !== undefined) {
      user.isAccountVerified = isAccountVerified;
    }

    await user.save();

    const updatedUser = await userModel
      .findById(user._id)
      .select(
        "-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt",
      );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// ------------------------------------
// DELETE USER
// ------------------------------------
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.userId;

    // Prevent admin from deleting themselves
    if (id.toString() === adminId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};