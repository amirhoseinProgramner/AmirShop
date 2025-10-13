import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام دسته‌بندی ضروری است"],
      unique: true,
      trim: true,
      maxlength: [50, "نام دسته‌بندی نمی‌تواند بیشتر از 50 کاراکتر باشد"],
    },
    slug: {
      type: String,
      required: [true, "اسلاگ ضروری است"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [200, "توضیحات نمی‌تواند بیشتر از 200 کاراکتر باشد"],
    },
    image: {
      type: String,
      default: "",
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-increment product count
categorySchema.methods.incrementProductCount = function () {
  this.productCount += 1;
  return this.save();
};

categorySchema.methods.decrementProductCount = function () {
  this.productCount = Math.max(0, this.productCount - 1);
  return this.save();
};

export default mongoose.model("Category", categorySchema);
