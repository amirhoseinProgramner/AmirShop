import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام محصول ضروری است"],
      trim: true,
      maxlength: [100, "نام محصول نمی‌تواند بیشتر از 100 کاراکتر باشد"],
    },
    description: {
      type: String,
      required: [true, "توضیحات محصول ضروری است"],
      maxlength: [1000, "توضیحات نمی‌تواند بیشتر از 1000 کاراکتر باشد"],
    },
    price: {
      type: Number,
      required: [true, "قیمت محصول ضروری است"],
      min: [0, "قیمت نمی‌تواند منفی باشد"],
    },
    originalPrice: {
      type: Number,
      min: [0, "قیمت اصلی نمی‌تواند منفی باشد"],
    },
    category: {
      type: String,
      required: [true, "دسته‌بندی محصول ضروری است"],
      enum: {
        values: ["protein", "creatine", "bcaa", "vitamin", "equipment"],
        message: "دسته‌بندی معتبر نیست",
      },
    },
    brand: {
      type: String,
      required: [true, "برند محصول ضروری است"],
      trim: true,
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
    },
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, "تعداد موجودی ضروری است"],
      min: [0, "موجودی نمی‌تواند منفی باشد"],
      default: 0,
    },
    features: [
      {
        type: String,
      },
    ],
    specifications: {
      weight: String,
      flavor: String,
      servings: Number,
      proteinPerServing: String,
      calories: Number,
    },
    rating: {
      type: Number,
      min: [1, "امتیاز نمی‌تواند کمتر از 1 باشد"],
      max: [5, "امتیاز نمی‌تواند بیشتر از 5 باشد"],
      default: 4.5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    hasDiscount: {
      type: Boolean,
      default: false,
    },
    discountPercent: {
      type: Number,
      min: [0, "درصد تخفیف نمی‌تواند منفی باشد"],
      max: [100, "درصد تخفیف نمی‌تواند بیشتر از 100 باشد"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
productSchema.index({ name: "text", description: "text", brand: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

export default mongoose.model("Product", productSchema);
