import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "لطفاً وارد حساب کاربری خود شوید",
      });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "amirshop_secret"
      );
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "کاربر یافت نشد",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "توکن معتبر نیست",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطای سرور",
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "دسترسی غیر مجاز. نیاز به سطح دسترسی ادمین دارید",
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "amirshop_secret"
        );
        req.user = await User.findById(decoded.id).select("-password");
      } catch (error) {
        // If token is invalid, continue without user
        req.user = null;
      }
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export { protect, admin, optionalAuth };
