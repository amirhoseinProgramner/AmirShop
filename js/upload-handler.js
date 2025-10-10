// upload-handler.js - مدیریت آپلود عکس
class ImageUploader {
  constructor() {
    this.uploadedImages =
      JSON.parse(localStorage.getItem("uploaded-images")) || [];
  }

  // آپلود عکس
  uploadImage(file) {
    return new Promise((resolve, reject) => {
      // بررسی نوع فایل
      if (!file.type.startsWith("image/")) {
        reject("لطفاً فقط فایل عکس انتخاب کنید");
        return;
      }

      // بررسی حجم فایل (حداکثر 2MB)
      if (file.size > 2 * 1024 * 1024) {
        reject("حجم فایل نباید بیشتر از ۲ مگابایت باشد");
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const imageData = {
          id: Date.now(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result, // داده base64
          uploadedAt: new Date().toISOString(),
        };

        // ذخیره در localStorage
        this.uploadedImages.push(imageData);
        this.saveToStorage();

        resolve(imageData);
      };

      reader.onerror = () => reject("خطا در خواندن فایل");
      reader.readAsDataURL(file);
    });
  }

  // ذخیره در localStorage
  saveToStorage() {
    localStorage.setItem(
      "uploaded-images",
      JSON.stringify(this.uploadedImages)
    );
  }

  // دریافت عکس بر اساس ID
  getImageById(id) {
    return this.uploadedImages.find((img) => img.id === id);
  }

  // حذف عکس
  deleteImage(id) {
    this.uploadedImages = this.uploadedImages.filter((img) => img.id !== id);
    this.saveToStorage();
  }

  // نمایش پیش‌نمایش عکس
  previewImage(input, previewElement) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewElement.innerHTML = `
                <div class="relative">
                    <img src="${e.target.result}" alt="پیش‌نمایش" 
                         class="w-32 h-32 object-cover rounded-lg border">
                    <button type="button" onclick="this.parentElement.remove()" 
                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        ×
                    </button>
                </div>
            `;
    };
    reader.readAsDataURL(file);
  }
}

// ایجاد نمونه از آپلودر
const imageUploader = new ImageUploader();
