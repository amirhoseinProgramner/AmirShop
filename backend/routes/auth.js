import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "amirshop_secret", {
    expiresIn: "30d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("نام کاربر ضروری است"),
    body("email").isEmail().withMessage("ایمیل معتبر وارد کنید"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("رمز عبور باید حداقل 6 کاراکتر باشد"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "داده‌های ورودی معتبر نیستند",
          errors: errors.array(),
        });
      }

      const { name, email, password, phone } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: "کاربری با این ایمیل وجود دارد",
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        phone,
      });

      if (user) {
        res.status(201).json({
          success: true,
          message: "ثبت‌نام با موفقیت انجام شد",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id),
          },
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        message: "خطا در ثبت‌نام",
      });
    }
  }
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("ایمیل معتبر وارد کنید"),
    body("password").notEmpty().withMessage("رمز عبور ضروری است"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "داده‌های ورودی معتبر نیستند",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Check for user
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "ایمیل یا رمز عبور اشتباه است",
        });
      }

      // Check password
      const isPasswordCorrect = await user.correctPassword(
        password,
        user.password
      );
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "ایمیل یا رمز عبور اشتباه است",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "حساب کاربری غیرفعال است",
        });
      }

      res.json({
        success: true,
        message: "ورود موفقیت‌آمیز",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id),
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "خطا در ورود",
      });
    }
  }
);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت اطلاعات کاربر",
    });
  }
});

export default router;
