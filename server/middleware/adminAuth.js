import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    // userAuth should run before adminAuth
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please login.",
      });
    }

    // Get the authenticated user's role
    const user = await userModel
      .findById(req.userId)
      .select("role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check admin permission
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // User is authenticated and is an admin
    next();
  } catch (error) {
    console.error("Admin auth error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while checking admin authorization.",
    });
  }
};

export default adminAuth;