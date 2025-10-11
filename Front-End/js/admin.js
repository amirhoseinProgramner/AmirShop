// admin.js - سیستم کامل مدیریت محصولات با آپلود عکس
class ImageUploader {
  constructor() {
    this.uploadedImages =
      JSON.parse(localStorage.getItem("uploaded-images")) || [];
    this.MIN_FILE_SIZE = 5 * 1024 * 1024; // 5MB حداقل
    this.MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB حداکثر
  }

  // آپلود عکس
  uploadImage(file) {
    return new Promise((resolve, reject) => {
      // بررسی نوع فایل
      if (!file.type.startsWith("image/")) {
        reject("لطفاً فقط فایل عکس انتخاب کنید (JPG, PNG, GIF)");
        return;
      }

      // بررسی حداقل حجم فایل (حداقل 5MB)
      if (file.size < this.MIN_FILE_SIZE) {
        const minSizeMB = this.MIN_FILE_SIZE / (1024 * 1024);
        reject(
          `حجم فایل باید حداقل ${minSizeMB} مگابایت باشد. فایل شما: ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}MB`
        );
        return;
      }

      // بررسی حداکثر حجم فایل (حداکثر 10MB)
      if (file.size > this.MAX_FILE_SIZE) {
        const maxSizeMB = this.MAX_FILE_SIZE / (1024 * 1024);
        reject(
          `حجم فایل نباید بیشتر از ${maxSizeMB} مگابایت باشد. فایل شما: ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}MB`
        );
        return;
      }

      // بررسی ابعاد عکس (حداقل 1000px در یک بعد)
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        if (img.width < 1000 && img.height < 1000) {
          reject("ابعاد عکس باید حداقل 1000x1000 پیکسل باشد");
          return;
        }

        // اگر همه چیز اوکی بود، آپلود کن
        this.processImageUpload(file, resolve, reject);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        this.processImageUpload(file, resolve, reject);
      };

      img.src = objectUrl;
    });
  }

  // پردازش آپلود عکس
  processImageUpload(file, resolve, reject) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageData = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        data: e.target.result,
        uploadedAt: new Date().toISOString(),
        dimensions: `${file.width || "N/A"}x${file.height || "N/A"}`,
      };

      // ذخیره در localStorage
      this.uploadedImages.push(imageData);
      this.saveToStorage();

      resolve(imageData);
    };

    reader.onerror = () => reject("خطا در خواندن فایل");
    reader.readAsDataURL(file);
  }

  // بقیه متدها بدون تغییر...
  saveToStorage() {
    localStorage.setItem(
      "uploaded-images",
      JSON.stringify(this.uploadedImages)
    );
  }

  getImageById(id) {
    return this.uploadedImages.find((img) => img.id === id);
  }

  deleteImage(id) {
    this.uploadedImages = this.uploadedImages.filter((img) => img.id !== id);
    this.saveToStorage();
  }

  // متد جدید برای گرفتن اطلاعات حجم
  getSizeInfo() {
    return {
      min: this.MIN_FILE_SIZE,
      max: this.MAX_FILE_SIZE,
      minMB: this.MIN_FILE_SIZE / (1024 * 1024),
      maxMB: this.MAX_FILE_SIZE / (1024 * 1024),
    };
  }
}

class ProductManager {
  constructor() {
    this.products = this.loadProducts();
    this.currentProduct = null;
    this.imageUploader = new ImageUploader();
    this.initializeEventListeners();
  }

  // مقداردهی اولیه event listeners
  initializeEventListeners() {
    // نمایش اطلاعات حجم در رابط کاربری
    this.displaySizeInfo();
  }

  // نمایش اطلاعات حجم مورد نیاز
  displaySizeInfo() {
    const uploadArea = document.getElementById("uploadArea");
    if (!uploadArea) return;

    const sizeInfo = this.imageUploader.getSizeInfo();
    const sizeText = document.createElement("p");
    sizeText.className = "text-sm text-orange-600 mt-2 font-medium";
    sizeText.innerHTML = `📁 <strong>حداقل حجم: ${sizeInfo.minMB}MB</strong> - حداکثر: ${sizeInfo.maxMB}MB`;

    const existingSizeText = uploadArea.querySelector(".size-info");
    if (existingSizeText) {
      existingSizeText.remove();
    }

    sizeText.classList.add("size-info");
    uploadArea.appendChild(sizeText);
  }

  // مدیریت آپلود عکس (آپدیت شده)
  async handleImageUpload(file) {
    if (!file) return;

    try {
      // نمایش اطلاعات فایل
      this.showFileInfo(file);

      // نمایش progress bar
      this.showUploadProgress(true);

      // آپلود عکس
      const imageData = await this.imageUploader.uploadImage(file);

      // نمایش پیش‌نمایش
      this.showImagePreview(imageData.data, file);

      // پر کردن فیلد آدرس عکس
      document.getElementById("productImage").value = imageData.data;

      // مخفی کردن progress bar
      this.showUploadProgress(false);
    } catch (error) {
      alert("خطا در آپلود عکس: " + error);
      this.showUploadProgress(false);
      this.clearFileInfo();
    }
  }

  // نمایش اطلاعات فایل
  showFileInfo(file) {
    const fileInfo = document.getElementById("fileInfo");
    if (!fileInfo) return;

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const fileType = file.type.split("/")[1]?.toUpperCase() || "ناشناخته";

    fileInfo.innerHTML = `
            <div class="bg-blue-50 p-3 rounded-lg mt-3">
                <div class="flex justify-between items-center text-sm">
                    <span class="font-medium">${file.name}</span>
                    <span class="text-blue-600">${fileSizeMB} MB</span>
                </div>
                <div class="flex justify-between items-center text-xs text-gray-600 mt-1">
                    <span>فرمت: ${fileType}</span>
                    <span class="${
                      file.size >= this.imageUploader.MIN_FILE_SIZE
                        ? "text-green-600"
                        : "text-red-600"
                    }">
                        ${
                          file.size >= this.imageUploader.MIN_FILE_SIZE
                            ? "✅ مناسب"
                            : "❌ حجم کم"
                        }
                    </span>
                </div>
            </div>
        `;
    fileInfo.classList.remove("hidden");
  }

  // پاک کردن اطلاعات فایل
  clearFileInfo() {
    const fileInfo = document.getElementById("fileInfo");
    if (fileInfo) {
      fileInfo.classList.add("hidden");
      fileInfo.innerHTML = "";
    }
  }

  // نمایش پیش‌نمایش عکس (آپدیت شده)
  showImagePreview(imageUrl, file) {
    const preview = document.getElementById("imagePreview");
    const fileSizeMB = file ? (file.size / (1024 * 1024)).toFixed(2) : "0";

    preview.innerHTML = `
            <div class="flex items-center space-x-4 space-x-reverse bg-green-50 p-4 rounded-lg">
                <img src="${imageUrl}" alt="پیش‌نمایش محصول" 
                     class="w-20 h-20 object-cover rounded-lg border">
                <div class="flex-1">
                    <p class="text-sm text-green-600 font-medium">✅ عکس با موفقیت آپلود شد</p>
                    <p class="text-xs text-gray-500 mt-1">
                        حجم: ${fileSizeMB} MB | 
                        در حافظه مرورگر ذخیره شد
                    </p>
                </div>
                <button type="button" onclick="this.parentElement.remove(); 
                        document.getElementById('productImage').value = ''; 
                        document.getElementById('uploadArea').classList.remove('hidden');
                        productManager.clearFileInfo();" 
                        class="text-red-500 hover:text-red-700 text-sm bg-white px-3 py-1 rounded border">
                    حذف
                </button>
            </div>
        `;
  }

  // بقیه متدها بدون تغییر می‌مونن...
  // [کدهای قبلی بدون تغییر]
}

// ایجاد نمونه از ProductManager
const productManager = new ProductManager();

// فعال کردن Drag & Drop (آپدیت شده)
function initializeDragDrop() {
  const uploadArea = document.getElementById("uploadArea");

  if (!uploadArea) return;

  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("border-blue-500", "bg-blue-50");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("border-blue-500", "bg-blue-50");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("border-blue-500", "bg-blue-50");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      productManager.handleImageUpload(files[0]);
    }
  });
}
function debugImageUpload() {
  console.log("=== دیباگ سیستم آپلود عکس ===");
  console.log("1. المنت uploadArea:", document.getElementById("uploadArea"));
  console.log("2. المنت imageUpload:", document.getElementById("imageUpload"));
  console.log("3. المنت fileInfo:", document.getElementById("fileInfo"));
  console.log(
    "4. المنت imagePreview:",
    document.getElementById("imagePreview")
  );
  console.log("5. productManager:", productManager);
  console.log("==============================");
}

// تابع global برای آپلود
function handleImageUpload(file) {
  productManager.handleImageUpload(file);
}

// مدیریت ارسال فرم
document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.getElementById("productForm");
  if (productForm) {
    productForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = productManager.getFormData();
      const productId = document.getElementById("productId").value;

      // اعتبارسنجی
      if (
        !formData.name ||
        !formData.price ||
        !formData.category ||
        !formData.image
      ) {
        alert("لطفاً فیلدهای ضروری را پر کنید");
        return;
      }

      if (productId) {
        // ویرایش محصول موجود
        productManager.editProduct(parseInt(productId), formData);
        alert("محصول با موفقیت ویرایش شد!");
      } else {
        // افزودن محصول جدید
        productManager.addProduct(formData);
        alert("محصول با موفقیت اضافه شد!");
      }

      productManager.resetForm();
    });
  }

  // نمایش/مخفی کردن فیلد تخفیف
  const hasDiscount = document.getElementById("hasDiscount");
  if (hasDiscount) {
    hasDiscount.addEventListener("change", function () {
      const discountField = document.getElementById("discountField");
      if (discountField) {
        discountField.classList.toggle("hidden", !this.checked);
      }
    });
  }

  // بارگذاری اولیه محصولات
  productManager.renderProducts();
  initializeDragDrop();

  // مقداردهی اولیه Feather Icons اگر وجود دارد
  if (typeof feather !== "undefined") {
    feather.replace();
  }
});

// تابع برای نمایش تعداد محصولات
function updateProductCount() {
  const countElement = document.querySelector(".product-count");
  if (countElement) {
    countElement.textContent = productManager.products.length;
  }
}

// صادر کردن برای استفاده در فایل‌های دیگر
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ProductManager, ImageUploader };
}
