import express from "express";
import Product from "../models/Product.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 12,
      inStock,
    } = req.query;

    // Build filter object
    let filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = new RegExp(brand, "i");
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت محصولات",
    });
  }
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
router.get("/category/:category", optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find({
      category,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments({ category, isActive: true });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت محصولات",
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "محصول یافت نشد",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "محصول یافت نشد",
      });
    }
    res.status(500).json({
      success: false,
      message: "خطا در دریافت محصول",
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured/new
// @access  Public
router.get("/featured/new", optionalAuth, async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      isNew: true,
    })
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت محصولات ویژه",
    });
  }
});

// @desc    Get discounted products
// @route   GET /api/products/featured/discounted
// @access  Public
router.get("/featured/discounted", optionalAuth, async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      hasDiscount: true,
      discountPercent: { $gt: 0 },
    })
      .sort({ discountPercent: -1 })
      .limit(8);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get discounted products error:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت محصولات تخفیف‌دار",
    });
  }
});

export default router;
