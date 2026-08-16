import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please login.",
      });
    }

    const tokenDecoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (
      typeof tokenDecoded === "string" ||
      !tokenDecoded.id
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    // Store authenticated user ID on the request
    req.userId = tokenDecoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default userAuth;