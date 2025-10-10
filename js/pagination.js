// js/pagination.js

// تنظیمات Pagination
const PRODUCTS_PER_PAGE = 12; // ۱۲ محصول در هر صفحه
const TOTAL_PRODUCTS = 84; // ۹۶ محصول = ۸ صفحه
let currentPage = 1;

// محصولات نمونه (در حالت واقعی از API میاد)
const sampleProducts = Array.from({ length: TOTAL_PRODUCTS }, (_, i) => ({
  id: i + 1,
  name: `پروتئین وی اپتیموم ناتریشن ${i + 1}`,
  price: (2000000 + i * 100000).toLocaleString(),
  originalPrice: (2500000 + i * 100000).toLocaleString(),
  rating: 4 + (i % 5) * 0.2,
  reviews: 42 + i,
  image: `https://images.unsplash.com/photo-1594736797933-d0ea3ff8db41?w=400&v=${i}`,
  hasDiscount: i % 3 === 0,
  category:
    i % 4 === 0
      ? "گینر"
      : i % 4 === 1
      ? "پروتئین"
      : i % 4 === 2
      ? "پری‌ورکات"
      : "آمینواسید",
}));

// محاسبه تعداد صفحات
function calculateTotalPages() {
  return Math.ceil(TOTAL_PRODUCTS / PRODUCTS_PER_PAGE);
}

// دریافت محصولات صفحه جاری
function getCurrentPageProducts() {
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  return sampleProducts.slice(startIndex, endIndex);
}

// رندر محصولات
function renderProducts() {
  const productsGrid = document.getElementById("productsGrid");
  const products = getCurrentPageProducts();

  productsGrid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card">
            <div class="relative overflow-hidden">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image w-full h-48 object-cover">
                ${
                  product.hasDiscount
                    ? '<span class="product-badge bg-red-500 text-white">تخفیف ۲۰٪</span>'
                    : '<span class="product-badge bg-blue-500 text-white">جدید</span>'
                }
                <span class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ${product.category}
                </span>
            </div>
            <div class="p-4">
                <h3 class="font-bold mb-2 text-sm h-12 overflow-hidden">${
                  product.name
                }</h3>
                <div class="flex items-center mb-3">
                    <div class="text-yellow-400 text-sm">${generateStars(
                      product.rating
                    )}</div>
                    <span class="text-gray-500 text-xs mr-2">(${
                      product.reviews
                    })</span>
                </div>
                <div class="flex justify-between items-center">
                    <div>
                        ${
                          product.hasDiscount
                            ? `<span class="text-gray-500 line-through text-xs">${product.originalPrice} تومان</span>
                             <div class="text-primary font-bold text-sm">${product.price} تومان</div>`
                            : `<div class="text-primary font-bold text-sm">${product.price} تومان</div>`
                        }
                    </div>
                    <button class="btn-add-to-cart" onclick="addToCart(${
                      product.id
                    })">
                        <i data-feather="shopping-cart" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  feather.replace();
}

// تولید ستاره‌های امتیاز
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
  );
}

// رندر Pagination
function renderPagination() {
  const totalPages = calculateTotalPages();
  const pageNumbers = document.getElementById("pageNumbers");
  const currentPageElement = document.getElementById("currentPage");
  const totalPagesElement = document.getElementById("totalPages");
  const showingProducts = document.getElementById("showingProducts");
  const productCount = document.getElementById("productCount");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // آپدیت اطلاعات صفحه
  currentPageElement.textContent = currentPage;
  totalPagesElement.textContent = totalPages;

  const startProduct = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endProduct = Math.min(currentPage * PRODUCTS_PER_PAGE, TOTAL_PRODUCTS);
  showingProducts.textContent = `${startProduct}-${endProduct}`;
  productCount.textContent = `در حال نمایش ${startProduct}-${endProduct} از ${TOTAL_PRODUCTS} محصول`;

  // ساخت لینک‌های صفحات
  let pagesHTML = "";
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // دکمه اول
  if (startPage > 1) {
    pagesHTML += `<button onclick="changePage(1)" class="page-link">1</button>`;
    if (startPage > 2) {
      pagesHTML += `<span class="px-2 text-gray-500">...</span>`;
    }
  }

  // صفحات میانی
  for (let i = startPage; i <= endPage; i++) {
    pagesHTML += `<button onclick="changePage(${i})" 
                              class="page-link ${
                                i === currentPage ? "active" : ""
                              }">${i}</button>`;
  }

  // دکمه آخر
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pagesHTML += `<span class="px-2 text-gray-500">...</span>`;
    }
    pagesHTML += `<button onclick="changePage(${totalPages})" class="page-link">${totalPages}</button>`;
  }

  pageNumbers.innerHTML = pagesHTML;

  // فعال/غیرفعال کردن دکمه‌ها
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  if (currentPage === 1) {
    prevBtn.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    prevBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }

  if (currentPage === totalPages) {
    nextBtn.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    nextBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

// تغییر صفحه
function changePage(page) {
  const totalPages = calculateTotalPages();

  if (page < 1 || page > totalPages) return;

  currentPage = page;
  renderProducts();
  renderPagination();

  // اسکرول به بالا
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// شبیه‌سازی افزودن به سبد خرید
function addToCart(productId) {
  // نمایش پیام موفقیت
  showToast(`محصول ${productId} به سبد خرید اضافه شد`);

  // آپدیت تعداد سبد خرید (اگر فانکشن وجود داره)
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}

// نمایش پیام toast
function showToast(message) {
  // ایجاد المان toast
  const toast = document.createElement("div");
  toast.className =
    "fixed top-4 left-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-0 transition-transform duration-300";
  toast.textContent = message;

  // اضافه کردن به صفحه
  document.body.appendChild(toast);

  // حذف بعد از ۳ ثانیه
  setTimeout(() => {
    toast.style.transform = "translateX(-100%)";
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// فیلتر کردن محصولات (برای آینده)
function filterProducts(category, brand, priceRange) {
  // این تابع رو می‌تونی برای فیلتر کردن واقعی توسعه بدی
  console.log("فیلتر اعمال شد:", { category, brand, priceRange });
  currentPage = 1; // بازگشت به صفحه اول بعد از فیلتر
  renderProducts();
  renderPagination();
}

// مرتب‌سازی محصولات
function sortProducts(sortBy) {
  // منطق مرتب‌سازی رو اینجا پیاده‌سازی کن
  console.log("مرتب‌سازی بر اساس:", sortBy);
  renderProducts();
}

// جستجوی محصولات
function searchProducts(query) {
  // منطق جستجو رو اینجا پیاده‌سازی کن
  console.log("جستجو برای:", query);
  currentPage = 1;
  renderProducts();
  renderPagination();
}

// مقداردهی اولیه
document.addEventListener("DOMContentLoaded", function () {
  // بررسی وجود المنت‌های لازم
  if (document.getElementById("productsGrid")) {
    renderProducts();
    renderPagination();
  }

  // اضافه کردن event listener برای فیلترها
  const filterCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      // اینجا می‌تونی منطق فیلتر کردن رو صدا بزنی
      console.log("فیلتر تغییر کرد:", this.value);
    });
  });

  // event listener برای مرتب‌سازی
  const sortSelect = document.querySelector("select");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      sortProducts(this.value);
    });
  }
});

// توابع کمکی
function formatPrice(price) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function setQueryParam(param, value) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(param, value);
  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}?${urlParams}`
  );
}
