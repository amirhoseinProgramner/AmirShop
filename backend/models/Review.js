import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "امتیاز ضروری است"],
      min: [1, "امتیاز نمی‌تواند کمتر از 1 باشد"],
      max: [5, "امتیاز نمی‌تواند بیشتر از 5 باشد"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "عنوان نمی‌تواند بیشتر از 100 کاراکتر باشد"],
    },
    comment: {
      type: String,
      required: [true, "نظر ضروری است"],
      maxlength: [1000, "نظر نمی‌تواند بیشتر از 1000 کاراکتر باشد"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product rating when review is saved
reviewSchema.post("save", async function () {
  await this.updateProductRating();
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.updateProductRating();
  }
});

reviewSchema.methods.updateProductRating = async function () {
  const Review = mongoose.model("Review");

  const stats = await Review.aggregate([
    {
      $match: { product: this.product, isActive: true },
    },
    {
      $group: {
        _id: "$product",
        numReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    const Product = mongoose.model("Product");
    await Product.findByIdAndUpdate(this.product, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews,
    });
  }
};

export default mongoose.model("Review", reviewSchema);
