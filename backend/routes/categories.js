import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      displayOrder: 1,
      name: 1,
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت دسته‌بندی‌ها",
    });
  }
});

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی یافت نشد",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت دسته‌بندی",
    });
  }
});

export default router;
