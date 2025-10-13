import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// داده‌های نمونه
const sampleProducts = [
  {
    _id: "1",
    name: "پروتئین وی ایزوله 2 کیلویی",
    description:
      "پروتئین با کیفیت عالی برای ورزشکاران حرفه‌ای، حاوی 24 گرم پروتئین خالص در هر سروینگ",
    price: 2300000,
    originalPrice: 2600000,
    category: "protein",
    brand: "Optimum Nutrition",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
    stock: 50,
    rating: 4.8,
    numReviews: 124,
    isActive: true,
    isNew: true,
    hasDiscount: true,
    discountPercent: 12,
  },
  {
    _id: "2",
    name: "کراتین مونوهیدرات 500 گرم",
    description: "کراتین خالص برای افزایش قدرت و حجم عضلات",
    price: 800000,
    category: "creatine",
    brand: "MyProtein",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
    stock: 30,
    rating: 4.6,
    numReviews: 89,
    isActive: true,
    isNew: false,
    hasDiscount: false,
    discountPercent: 0,
  },
  {
    _id: "3",
    name: "BCAA 2000 400 گرم",
    description: "آمینواسیدهای شاخه‌دار برای ریکاوری سریع",
    price: 1200000,
    originalPrice: 1400000,
    category: "bcaa",
    brand: "Dymatize",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
    stock: 25,
    rating: 4.5,
    numReviews: 67,
    isActive: true,
    isNew: true,
    hasDiscount: true,
    discountPercent: 14,
  },
];

const sampleCategories = [
  { _id: "1", name: "پروتئین", slug: "protein", productCount: 15 },
  { _id: "2", name: "کراتین", slug: "creatine", productCount: 8 },
  { _id: "3", name: "BCAA", slug: "bcaa", productCount: 12 },
  { _id: "4", name: "ویتامین", slug: "vitamin", productCount: 18 },
  { _id: "5", name: "تجهیزات", slug: "equipment", productCount: 30 },
];

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "🏋️‍♂️ AmirShop Backend API",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      categories: "/api/categories",
      auth: "/api/auth",
    },
  });
});

// Products API
app.get("/api/products", (req, res) => {
  try {
    const { category, search } = req.query;

    let products = sampleProducts;

    // فیلتر بر اساس دسته‌بندی
    if (category) {
      products = products.filter((product) => product.category === category);
    }

    // جستجو
    if (search) {
      const searchTerm = search.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm)
      );
    }

    res.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطا در دریافت محصولات",
    });
  }
});

app.get("/api/products/category/:category", (req, res) => {
  try {
    const { category } = req.params;
    const products = sampleProducts.filter(
      (product) => product.category === category
    );

    res.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطا در دریافت محصولات",
    });
  }
});

app.get("/api/products/:id", (req, res) => {
  try {
    const product = sampleProducts.find((p) => p._id === req.params.id);

    if (!product) {
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
    res.status(500).json({
      success: false,
      message: "خطا در دریافت محصول",
    });
  }
});

// Categories API
app.get("/api/categories", (req, res) => {
  try {
    res.json({
      success: true,
      data: sampleCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطا در دریافت دسته‌بندی‌ها",
    });
  }
});

// Auth API (ساده)
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, password } = req.body;

    // شبیه‌سازی ثبت‌نام
    res.json({
      success: true,
      message: "ثبت‌نام با موفقیت انجام شد",
      data: {
        _id: "user123",
        name,
        email,
        token: "sample_jwt_token_123",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطا در ثبت‌نام",
    });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;

    // شبیه‌سازی ورود
    res.json({
      success: true,
      message: "ورود موفقیت‌آمیز",
      data: {
        _id: "user123",
        name: "کاربر نمونه",
        email,
        token: "sample_jwt_token_123",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطا در ورود",
    });
  }
});

// Orders API (ساده)
app.post("/api/orders", (req, res) => {
  try {
    const { items, totalPrice, shippingAddress } = req.body;

    // شبیه‌سازی ثبت سفارش
    res.json({
      success: true,
      message: "سفارش با موفقیت ثبت شد",
      data: {
        orderNumber: `ORD-${Date.now()}`,
        items,
        totalPrice,
        status: "pending",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطا در ثبت سفارش",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🎉 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`📚 Docs: http://localhost:${PORT}`);
});
