import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "هیچ محصولی در سبد خرید وجود ندارد",
      });
    }

    // Check product availability and update stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `محصول ${item.name} یافت نشد`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `موجودی محصول ${item.name} کافی نیست`,
        });
      }

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "سفارش با موفقیت ثبت شد",
      data: createdOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "خطا در ثبت سفارش",
    });
  }
});

// @desc    Get user orders
// @route   GET /api/orders/user/:userId
// @access  Private
router.get("/user/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is accessing their own orders
    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "دسترسی غیر مجاز",
      });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت سفارشات",
    });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "سفارش یافت نشد",
      });
    }

    // Check if user owns the order or is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "دسترسی غیر مجاز",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "سفارش یافت نشد",
      });
    }
    res.status(500).json({
      success: false,
      message: "خطا در دریافت سفارش",
    });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "دسترسی غیر مجاز",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "سفارش یافت نشد",
      });
    }

    order.status = status;

    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: "وضعیت سفارش به روز شد",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "خطا در به روزرسانی وضعیت سفارش",
    });
  }
});

export default router;
