import express from "express";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "لطفاً یک فایل تصویری انتخاب کنید",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "amirshop",
      width: 800,
      height: 600,
      crop: "limit",
    });

    res.json({
      success: true,
      message: "تصویر با موفقیت آپلود شد",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "خطا در آپلود تصویر",
    });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
router.post(
  "/multiple",
  protect,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "لطفاً فایل‌های تصویری انتخاب کنید",
        });
      }

      const uploadResults = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "amirshop",
          width: 800,
          height: 600,
          crop: "limit",
        });

        uploadResults.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      res.json({
        success: true,
        message: "تصاویر با موفقیت آپلود شدند",
        data: uploadResults,
      });
    } catch (error) {
      console.error("Multiple upload error:", error);
      res.status(500).json({
        success: false,
        message: "خطا در آپلود تصاویر",
      });
    }
  }
);

export default router;
