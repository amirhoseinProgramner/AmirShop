import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام کاربر ضروری است"],
      trim: true,
      maxlength: [50, "نام نمی‌تواند بیشتر از 50 کاراکتر باشد"],
    },
    email: {
      type: String,
      required: [true, "ایمیل ضروری است"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "لطفا یک ایمیل معتبر وارد کنید",
      ],
    },
    password: {
      type: String,
      required: [true, "رمز عبور ضروری است"],
      minlength: [6, "رمز عبور باید حداقل 6 کاراکتر باشد"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    addresses: [
      {
        title: { type: String, default: "آدرس منزل" },
        address: { type: String, required: true },
        city: { type: String, default: "تهران" },
        postalCode: { type: String },
        isDefault: { type: Boolean, default: false },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
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

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export default mongoose.model("User", userSchema);
