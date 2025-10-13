// مدیریت صفحه محصول تک
class ProductSingle {
  constructor() {
    this.productId = this.getProductIdFromURL();
    this.selectedFlavor = "شکلاتی";
    this.quantity = 1;
    this.currentImageIndex = 0;
  }

  // دریافت ID محصول از URL
  getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id") || "1";
  }

  // بارگذاری اطلاعات محصول
  async loadProduct() {
    console.log("🔍 در حال دریافت محصول با ID:", this.productId);

    try {
      const product = await api.getProduct(this.productId);
      console.log("✅ محصول دریافت شد:", product);

      if (product) {
        this.displayProduct(product);
        this.setupEventListeners();
      } else {
        this.showError("محصول یافت نشد");
      }
    } catch (error) {
      console.error("❌ خطا در دریافت محصول:", error);
      // استفاده از داده نمونه
      const sampleProduct = this.getSampleProduct();
      this.displayProduct(sampleProduct);
      this.setupEventListeners();
    }
  }

  // نمایش اطلاعات محصول
  displayProduct(product) {
    // اطلاعات اصلی
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productDescription").textContent =
      product.description;
    document.getElementById("productBrand").textContent = product.brand;
    document.getElementById("productPrice").textContent = this.formatPrice(
      product.price
    );

    if (product.originalPrice) {
      document.getElementById("productOriginalPrice").textContent =
        this.formatPrice(product.originalPrice);
      document.getElementById("productDiscount").textContent =
        product.discountPercent + "%";
    } else {
      document.getElementById("productOriginalPrice").style.display = "none";
      document.getElementById("productDiscount").style.display = "none";
    }

    document.getElementById("productRating").textContent = product.rating;
    document.getElementById("productReviews").textContent = product.numReviews;

    // دسته‌بندی
    const categoryNames = {
      protein: "پروتئین",
      creatine: "کراتین",
      bcaa: "BCAA",
      vitamin: "ویتامین",
      equipment: "تجهیزات",
    };

    const categoryName = categoryNames[product.category] || product.category;
    document.getElementById("productCategory").textContent = categoryName;
    document.getElementById("productCategoryBadge").textContent = categoryName;

    // موجودی
    if (product.stock === 0) {
      document.getElementById("productStock").textContent = "✗ ناموجود";
      document
        .getElementById("productStock")
        .classList.remove("text-green-600");
      document.getElementById("productStock").classList.add("text-red-600");
    }

    // مشخصات فنی
    if (product.specifications) {
      this.displaySpecifications(product.specifications);
    }

    // بارگذاری نظرات
    this.loadReviews();

    console.log("🎉 محصول نمایش داده شد");
  }

  // نمایش مشخصات فنی
  displaySpecifications(specs) {
    if (specs.weight)
      document.getElementById("specWeight").textContent = specs.weight;
    if (specs.servings)
      document.getElementById("specServings").textContent =
        specs.servings + " سروینگ";
    if (specs.proteinPerServing)
      document.getElementById("specProtein").textContent =
        specs.proteinPerServing;
    if (specs.calories)
      document.getElementById("specCalories").textContent = specs.calories;
  }

  // بارگذاری نظرات
  async loadReviews() {
    // شبیه‌سازی دریافت نظرات
    setTimeout(() => {
      const reviews = [
        {
          id: 1,
          user: "محمد رضایی",
          rating: 5,
          date: "۱۴۰۲/۱۰/۱۵",
          comment:
            "کیفیت عالی داره. واقعاً راضیم از خریدم. بسته‌بندی هم خیلی خوب بود.",
          verified: true,
        },
        {
          id: 2,
          user: "فاطمه محمدی",
          rating: 4,
          date: "۱۴۰۲/۱۰/۱۲",
          comment: "طعم خوبی داره و به راحتی حل میشه. فقط قیمتش کمی بالاست.",
          verified: true,
        },
      ];

      this.displayReviews(reviews);
    }, 1000);
  }

  // نمایش نظرات
  displayReviews(reviews) {
    const reviewsList = document.getElementById("reviewsList");
    if (!reviewsList) return;

    reviewsList.innerHTML = "";

    reviews.forEach((review) => {
      const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

      const reviewElement = `
                <div class="border-b border-gray-200 pb-6">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <h5 class="font-bold">${review.user}</h5>
                            <div class="flex items-center space-x-2 space-x-reverse mt-1">
                                <div class="text-yellow-400">${stars}</div>
                                <span class="text-gray-500 text-sm">${
                                  review.date
                                }</span>
                                ${
                                  review.verified
                                    ? '<span class="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">خریدار verified</span>'
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-700">${review.comment}</p>
                </div>
            `;
      reviewsList.innerHTML += reviewElement;
    });

    feather.replace();
  }

  // تنظیم event listeners
  setupEventListeners() {
    this.setupTabs();
    this.setupFlavorSelection();
    this.setupQuantity();
    this.setupImageGallery();
  }

  // مدیریت تب‌ها
  setupTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");

        // غیرفعال کردن همه تب‌ها
        tabBtns.forEach((b) => {
          b.classList.remove("border-primary", "text-primary");
          b.classList.add("text-gray-500");
        });

        tabContents.forEach((content) => {
          content.classList.remove("active");
        });

        // فعال کردن تب انتخاب شده
        btn.classList.add("border-primary", "text-primary");
        btn.classList.remove("text-gray-500");
        document.getElementById(tabId).classList.add("active");

        feather.replace();
      });
    });
  }

  // مدیریت انتخاب طعم
  setupFlavorSelection() {
    const flavorBtns = document.querySelectorAll(".flavor-btn");

    flavorBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        flavorBtns.forEach((b) => {
          b.classList.remove("flavor-active", "bg-primary", "text-white");
          b.classList.add("border-gray-300", "text-gray-700");
        });

        btn.classList.add("flavor-active", "bg-primary", "text-white");
        btn.classList.remove("border-gray-300", "text-gray-700");

        this.selectedFlavor = btn.getAttribute("data-flavor");
        document.getElementById("specFlavor").textContent = this.selectedFlavor;
      });
    });
  }

  // مدیریت تعداد
  setupQuantity() {
    const quantityEl = document.getElementById("quantity");
    const decreaseBtn = document.getElementById("decreaseQty");
    const increaseBtn = document.getElementById("increaseQty");

    if (!quantityEl || !decreaseBtn || !increaseBtn) return;

    decreaseBtn.addEventListener("click", () => {
      let qty = parseInt(quantityEl.textContent);
      if (qty > 1) {
        quantityEl.textContent = qty - 1;
        this.quantity = qty - 1;
      }
    });

    increaseBtn.addEventListener("click", () => {
      let qty = parseInt(quantityEl.textContent);
      quantityEl.textContent = qty + 1;
      this.quantity = qty + 1;
    });
  }

  // مدیریت گالری تصاویر
  setupImageGallery() {
    const thumbnails = document.querySelectorAll('img[onclick*="changeImage"]');
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        this.changeImage(thumb.src, index);
      });
    });
  }

  // تغییر تصویر اصلی
  changeImage(src, index) {
    document.getElementById("mainImage").src = src;
    this.currentImageIndex = index;

    // آپدیت وضعیت تصاویر کوچک
    document
      .querySelectorAll('img[onclick*="changeImage"]')
      .forEach((thumb, i) => {
        if (i === index) {
          thumb.classList.add("thumb-active", "border-primary");
          thumb.classList.remove("border-transparent");
        } else {
          thumb.classList.remove("thumb-active", "border-primary");
          thumb.classList.add("border-transparent");
        }
      });
  }

  // فرمت قیمت
  formatPrice(price) {
    if (typeof price === "number") {
      return price.toLocaleString("fa-IR") + " تومان";
    }
    return price + " تومان";
  }

  // داده نمونه
  getSampleProduct() {
    return {
      _id: this.productId,
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
      specifications: {
        weight: "2 کیلوگرم",
        flavor: "شکلاتی",
        servings: 66,
        proteinPerServing: "24g",
        calories: 120,
        carbs: "3g",
        fat: "1g",
        sugar: "1g",
      },
    };
  }

  // نمایش خطا
  showError(message) {
    console.error("❌ خطا:", message);
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `
                <div class="max-w-6xl mx-auto text-center py-12">
                    <div class="text-6xl mb-4">❌</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">${message}</h2>
                    <a href="products.html" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark">
                        بازگشت به محصولات
                    </a>
                </div>
            `;
    }
  }
}

// وقتی صفحه لود شد
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 صفحه محصول لود شد");
  const productPage = new ProductSingle();
  productPage.loadProduct();
});
