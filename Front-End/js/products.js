// داده‌های محصولات
let productsData = [];
let currentPage = 1;
const productsPerPage = 20;
let currentFilter = "all";

// تابع بارگذاری محصولات از بک‌اند
async function loadProductsFromBackend() {
  try {
    console.log("📡 در حال دریافت محصولات از بک‌اند...");
    productsData = await api.getProducts();
    console.log("✅ محصولات دریافت شد:", productsData.length, "محصول");
    return productsData;
  } catch (error) {
    console.error("❌ خطا در بارگذاری محصولات:", error);
    // اگر خطا داد، صفحه رو رفرش کن
    setTimeout(() => {
      loadProductsFromBackend();
    }, 3000);
    return [];
  }
}

// تابع برای نمایش محصولات
function displayProducts(productsToShow = productsData) {
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid) {
    console.error("❌ المنت productsGrid پیدا نشد!");
    return;
  }

  // نمایش loading
  if (productsToShow.length === 0) {
    productsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p class="text-gray-600">در حال دریافت محصولات...</p>
            </div>
        `;
    return;
  }

  productsGrid.innerHTML = "";

  productsToShow.forEach((product) => {
    const productCard = `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1" data-category="${
              product.category
            }">
                <div class="relative">
                    <a href="product-single.html?id=${product._id}">
                        <img 
                            src="${product.image}" 
                            alt="${product.name}"
                            class="w-full h-48 object-cover"
                            onerror="this.src='https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop'"
                        />
                    </a>
                    ${
                      product.isNew
                        ? '<span class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">جدید</span>'
                        : ""
                    }
                    ${
                      product.hasDiscount
                        ? `<span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">${product.discountPercent}%</span>`
                        : ""
                    }
                    ${
                      product.stock === 0
                        ? '<span class="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold">ناموجود</span>'
                        : ""
                    }
                    
                    <button class="absolute bottom-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors favorite-btn" data-product-id="${
                      product._id
                    }">
                        <i data-feather="heart" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="p-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-gray-500">${
                          product.brand
                        }</span>
                        <div class="flex items-center space-x-1 space-x-reverse">
                            <i data-feather="star" class="w-3 h-3 text-yellow-400 fill-current"></i>
                            <span class="text-xs text-gray-600">${
                              product.rating
                            }</span>
                            <span class="text-xs text-gray-400">(${
                              product.numReviews
                            })</span>
                        </div>
                    </div>
                    <a href="product-single.html?id=${product._id}">
                        <h3 class="font-medium text-sm mb-2 hover:text-primary cursor-pointer line-clamp-2">${
                          product.name
                        }</h3>
                    </a>
                    <p class="text-gray-600 text-xs mb-3 line-clamp-2">${
                      product.description
                    }</p>
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center space-x-2 space-x-reverse">
                            <span class="font-bold text-lg text-primary">${
                              typeof product.price === "number"
                                ? product.price.toLocaleString("fa-IR")
                                : product.price
                            } تومان</span>
                            ${
                              product.originalPrice
                                ? `<span class="text-sm text-gray-400 line-through">${
                                    typeof product.originalPrice === "number"
                                      ? product.originalPrice.toLocaleString(
                                          "fa-IR"
                                        )
                                      : product.originalPrice
                                  }</span>`
                                : ""
                            }
                        </div>
                        <button class="bg-primary text-white rounded-lg px-3 py-2 hover:bg-primary-dark transition-colors text-sm add-to-cart-btn ${
                          product.stock === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }" 
                                data-product-id="${product._id}"
                                ${product.stock === 0 ? "disabled" : ""}>
                            <i data-feather="shopping-cart" class="w-4 h-4 inline ml-1"></i>
                            ${product.stock === 0 ? "ناموجود" : "خرید"}
                        </button>
                    </div>
                </div>
            </div>
        `;
    productsGrid.innerHTML += productCard;
  });

  // آپدیت آیکون‌ها
  feather.replace();
}

// تابع برای ایجاد صفحه‌بندی
function createPagination() {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  const totalPages = Math.ceil(productsData.length / productsPerPage);

  pagination.innerHTML = "";

  // دکمه قبلی
  if (currentPage > 1) {
    pagination.innerHTML += `
            <button onclick="changePage(${
              currentPage - 1
            })" class="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                <i data-feather="chevron-right" class="w-4 h-4"></i>
            </button>
        `;
  }

  // صفحات
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      pagination.innerHTML += `
                <button class="w-10 h-10 bg-primary text-white rounded-lg">${i}</button>
            `;
    } else {
      pagination.innerHTML += `
                <button onclick="changePage(${i})" class="w-10 h-10 border border-gray-300 rounded-lg hover:border-primary transition-colors">${i}</button>
            `;
    }
  }

  // دکمه بعدی
  if (currentPage < totalPages) {
    pagination.innerHTML += `
            <button onclick="changePage(${
              currentPage + 1
            })" class="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                <i data-feather="chevron-left" class="w-4 h-4"></i>
            </button>
        `;
  }

  feather.replace();
}

// تابع تغییر صفحه
function changePage(page) {
  currentPage = page;
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToShow = productsData.slice(startIndex, endIndex);

  displayProducts(productsToShow);
  createPagination();

  // اسکرول به بالا
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// فیلتر کردن محصولات
function filterProducts(category) {
  currentFilter = category;
  currentPage = 1;

  let filteredProducts = productsData;

  if (category !== "all") {
    filteredProducts = productsData.filter(
      (product) => product.category === category
    );
  }

  // آپدیت دکمه‌های فیلتر
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    if (btn.getAttribute("data-category") === category) {
      btn.classList.add("active", "bg-primary", "text-white");
      btn.classList.remove("bg-white", "border", "text-gray-700");
    } else {
      btn.classList.remove("active", "bg-primary", "text-white");
      btn.classList.add("bg-white", "border", "text-gray-700");
    }
  });

  displayProducts(filteredProducts);
  createPagination();
}

// مدیریت رویدادها
function setupEventListeners() {
  // فیلتر دسته‌بندی
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      filterProducts(category);
    });
  });

  // فیلتر از سایدبار
  document.querySelectorAll(".category-filter").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const category = this.getAttribute("data-category");
      filterProducts(category);
    });
  });

  // افزودن به سبد خرید
  document.addEventListener("click", function (e) {
    if (e.target.closest(".add-to-cart-btn")) {
      const button = e.target.closest(".add-to-cart-btn");
      const productId = button.getAttribute("data-product-id");
      addToCart(productId);
    }
  });

  // علاقه‌مندی‌ها
  document.addEventListener("click", function (e) {
    if (e.target.closest(".favorite-btn")) {
      const button = e.target.closest(".favorite-btn");
      const productId = button.getAttribute("data-product-id");
      toggleFavorite(productId, button);
    }
  });
}

// افزودن به سبد خرید
function addToCart(productId) {
  const product = productsData.find((p) => p._id === productId);
  if (product) {
    // نمایش پیام موفقیت
    showToast(`"${product.name}" به سبد خرید اضافه شد`, "success");

    // اینجا می‌تونی به localStorage اضافه کنی
    console.log("افزودن به سبد خرید:", product);
  }
}

// مدیریت علاقه‌مندی‌ها
function toggleFavorite(productId, button) {
  const product = productsData.find((p) => p._id === productId);
  const icon = button.querySelector("i");

  if (icon.classList.contains("text-red-500")) {
    icon.classList.remove("text-red-500", "fill-current");
    showToast(`"${product.name}" از علاقه‌مندی‌ها حذف شد`, "info");
  } else {
    icon.classList.add("text-red-500", "fill-current");
    showToast(`"${product.name}" به علاقه‌مندی‌ها اضافه شد`, "success");
  }

  feather.replace();
}

// نمایش نوتیفیکیشن
function showToast(message, type = "info") {
  // ایجاد یک toast ساده
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500"
  }`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // حذف اتوماتیک بعد از 3 ثانیه
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// رویداد اصلی وقتی صفحه لود شد
document.addEventListener("DOMContentLoaded", async function () {
  console.log("🏋️‍♂️ شروع بارگذاری AmirShop...");

  // بارگذاری محصولات از بک‌اند
  await loadProductsFromBackend();

  // نمایش محصولات
  displayProducts();
  createPagination();

  // تنظیم رویدادها
  setupEventListeners();

  console.log("✅ AmirShop آماده است!");
});
