// داده‌های محصولات (100 محصول کامل)
const productsData = Array.from({ length: 100 }, (_, index) => {
  const categories = ["protein", "creatine", "bcaa", "vitamin", "equipment"];
  const brands = [
    "Optimum Nutrition",
    "MyProtein",
    "Dymatize",
    "MuscleTech",
    "BSN",
    "GNC",
    "ProForm",
    "Universal",
  ];
  const flavors = ["شکلاتی", "وانیلی", "توت فرنگی", "شکلاتی-بادام", "کافه"];
  const sizes = ["500 گرم", "1 کیلو", "2 کیلو", "5 کیلو"];

  const category = categories[index % categories.length];
  const brand = brands[index % brands.length];
  const flavor = flavors[index % flavors.length];
  const size = sizes[index % sizes.length];

  // قیمت‌های مختلف بر اساس دسته‌بندی
  const basePrices = {
    protein: [1800000, 2300000, 2800000, 3200000],
    creatine: [600000, 800000, 1200000, 1500000],
    bcaa: [900000, 1200000, 1600000, 2000000],
    vitamin: [150000, 300000, 500000, 750000],
    equipment: [800000, 1500000, 2500000, 4000000],
  };

  const prices = basePrices[category];
  const price = prices[index % prices.length];
  const hasDiscount = index % 3 === 0;
  const originalPrice = hasDiscount ? Math.floor(price * 1.2) : null;
  const discountPercent = hasDiscount
    ? Math.floor((1 - price / originalPrice) * 100)
    : 0;

  return {
    id: index + 1,
    name: `${getCategoryName(category)} ${brand} ${size}`,
    description: `این محصول با کیفیت عالی از برند ${brand} مناسب برای ورزشکاران حرفه‌ای و مبتدی می‌باشد. حاوی بهترین مواد اولیه و عاری از هرگونه مواد مضر.`,
    price: formatPrice(price),
    originalPrice: originalPrice ? formatPrice(originalPrice) : "",
    discountPercent: discountPercent,
    image: getProductImage(category),
    category: category,
    brand: brand,
    flavor: flavor,
    size: size,
    rating: (4 + Math.random() * 1).toFixed(1),
    reviews: Math.floor(Math.random() * 200) + 50,
    isNew: index < 15,
    hasDiscount: hasDiscount,
    inStock: index % 20 !== 0, // 5 محصول موجود نیستند
    features: [
      "کیفیت عالی",
      "ضمانت اصل بودن",
      "ارسال سریع",
      "پشتیبانی 24 ساعته",
    ],
    usage: `مقدار مصرف: 1 پیمانه (30 گرم) در 300 میلی‌لیتر آب یا شیر حل شده و بعد از تمرین مصرف شود.`,
    specifications: {
      weight: size,
      flavor: flavor,
      servings: Math.floor(Math.random() * 50) + 20,
      proteinPerServing: category === "protein" ? "24g" : "0g",
      calories: Math.floor(Math.random() * 200) + 100,
    },
  };
});

// توابع کمکی
function getCategoryName(category) {
  const names = {
    protein: "پروتئین",
    creatine: "کراتین",
    bcaa: "BCAA",
    vitamin: "ویتامین",
    equipment: "تجهیزات",
  };
  return names[category] || category;
}

function formatPrice(price) {
  return price.toLocaleString("fa-IR");
}

function getProductImage(category) {
  const images = {
    protein:
      "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
    creatine:
      "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
    bcaa: "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
    vitamin:
      "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
    equipment:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
  };
  return images[category];
}

// تنظیمات صفحه‌بندی
const productsPerPage = 20;
let currentPage = 1;
const totalPages = Math.ceil(productsData.length / productsPerPage);
let currentFilter = "all";

// تابع برای نمایش محصولات
function displayProducts(page = 1) {
  const productsGrid = document.getElementById("productsGrid");
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  // فیلتر کردن محصولات اگر لازم باشد
  let productsToShow = productsData;
  if (currentFilter !== "all") {
    productsToShow = productsData.filter(
      (product) => product.category === currentFilter
    );
  }

  const paginatedProducts = productsToShow.slice(startIndex, endIndex);

  productsGrid.innerHTML = "";

  paginatedProducts.forEach((product) => {
    const productCard = `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1" data-category="${
              product.category
            }">
                <div class="relative">
                    <a href="product-single.html?id=${product.id}">
                        <img 
                            src="${product.image}" 
                            alt="${product.name}"
                            class="w-full h-48 object-cover"
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
                      !product.inStock
                        ? '<span class="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold">ناموجود</span>'
                        : ""
                    }
                    
                    <button class="absolute bottom-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors favorite-btn" data-product-id="${
                      product.id
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
                              product.reviews
                            })</span>
                        </div>
                    </div>
                    <a href="product-single.html?id=${product.id}">
                        <h3 class="font-medium text-sm mb-2 hover:text-primary cursor-pointer line-clamp-2">${
                          product.name
                        }</h3>
                    </a>
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center space-x-2 space-x-reverse">
                            <span class="font-bold text-lg text-primary">${
                              product.price
                            } تومان</span>
                            ${
                              product.originalPrice
                                ? `<span class="text-sm text-gray-400 line-through">${product.originalPrice}</span>`
                                : ""
                            }
                        </div>
                        <button class="bg-primary text-white rounded-lg px-3 py-2 hover:bg-primary-dark transition-colors text-sm add-to-cart-btn ${
                          !product.inStock
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }" 
                                data-product-id="${product.id}"
                                ${!product.inStock ? "disabled" : ""}>
                            <i data-feather="shopping-cart" class="w-4 h-4 inline ml-1"></i>
                            ${product.inStock ? "خرید" : "ناموجود"}
                        </button>
                    </div>
                </div>
            </div>
        `;
    productsGrid.innerHTML += productCard;
  });

  // آپدیت اطلاعات صفحه
  const totalFilteredProducts =
    currentFilter === "all"
      ? productsData.length
      : productsData.filter((p) => p.category === currentFilter).length;
  document.getElementById("startItem").textContent = startIndex + 1;
  document.getElementById("endItem").textContent = Math.min(
    endIndex,
    totalFilteredProducts
  );
  document.getElementById("totalItems").textContent = totalFilteredProducts;

  feather.replace();
  attachProductEvents();
}

// تابع برای ایجاد صفحه‌بندی
function createPagination() {
  const pagination = document.getElementById("pagination");
  const totalFilteredProducts =
    currentFilter === "all"
      ? productsData.length
      : productsData.filter((p) => p.category === currentFilter).length;
  const totalFilteredPages = Math.ceil(totalFilteredProducts / productsPerPage);

  pagination.innerHTML = "";

  // دکمه قبلی
  if (currentPage > 1) {
    pagination.innerHTML += `
            <button onclick="changePage(${
              currentPage - 1
            })" class="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors hover:bg-gray-50">
                <i data-feather="chevron-right" class="w-4 h-4"></i>
            </button>
        `;
  }

  // صفحات
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalFilteredPages, currentPage + 2);

  // صفحه اول اگر لازم باشد
  if (startPage > 1) {
    pagination.innerHTML += `
            <button onclick="changePage(1)" class="w-10 h-10 border border-gray-300 rounded-lg hover:border-primary transition-colors hover:bg-gray-50">1</button>
            ${
              startPage > 2
                ? '<span class="px-2 flex items-center">...</span>'
                : ""
            }
        `;
  }

  // صفحات میانی
  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      pagination.innerHTML += `
                <button class="w-10 h-10 bg-primary text-white rounded-lg font-bold">${i}</button>
            `;
    } else {
      pagination.innerHTML += `
                <button onclick="changePage(${i})" class="w-10 h-10 border border-gray-300 rounded-lg hover:border-primary transition-colors hover:bg-gray-50">${i}</button>
            `;
    }
  }

  // صفحه آخر اگر لازم باشد
  if (endPage < totalFilteredPages) {
    pagination.innerHTML += `
            ${
              endPage < totalFilteredPages - 1
                ? '<span class="px-2 flex items-center">...</span>'
                : ""
            }
            <button onclick="changePage(${totalFilteredPages})" class="w-10 h-10 border border-gray-300 rounded-lg hover:border-primary transition-colors hover:bg-gray-50">${totalFilteredPages}</button>
        `;
  }

  // دکمه بعدی
  if (currentPage < totalFilteredPages) {
    pagination.innerHTML += `
            <button onclick="changePage(${
              currentPage + 1
            })" class="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors hover:bg-gray-50">
                <i data-feather="chevron-left" class="w-4 h-4"></i>
            </button>
        `;
  }

  feather.replace();
}

// تابع تغییر صفحه
function changePage(page) {
  currentPage = page;
  displayProducts(currentPage);
  createPagination();

  // اسکرول به بالای صفحه
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// فیلتر کردن محصولات
function filterProducts(category) {
  currentFilter = category;
  currentPage = 1; // بازگشت به صفحه اول هنگام فیلتر

  // آپدیت دکمه‌های فیلتر فعال
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    if (btn.getAttribute("data-category") === category) {
      btn.classList.add("active", "bg-primary", "text-white");
      btn.classList.remove("bg-white", "border", "text-gray-700");
    } else {
      btn.classList.remove("active", "bg-primary", "text-white");
      btn.classList.add("bg-white", "border", "text-gray-700");
    }
  });

  displayProducts(currentPage);
  createPagination();
}

// مرتب‌سازی محصولات
function sortProducts(sortBy) {
  let sortedProducts = [...productsData];

  switch (sortBy) {
    case "price-low":
      sortedProducts.sort(
        (a, b) =>
          parseFloat(a.price.replace(/,/g, "")) -
          parseFloat(b.price.replace(/,/g, ""))
      );
      break;
    case "price-high":
      sortedProducts.sort(
        (a, b) =>
          parseFloat(b.price.replace(/,/g, "")) -
          parseFloat(a.price.replace(/,/g, ""))
      );
      break;
    case "rating":
      sortedProducts.sort(
        (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
      );
      break;
    case "newest":
      sortedProducts.reverse(); // معکوس کردن آرایه برای نمایش جدیدترین اول
      break;
    default:
      // پیش‌فرض: پربازدیدترین (همان ترتیب اولیه)
      break;
  }

  // آپدیت productsData با ترتیب جدید
  productsData.length = 0;
  productsData.push(...sortedProducts);

  displayProducts(currentPage);
}

// مدیریت سبد خرید و علاقه‌مندی‌ها
function attachProductEvents() {
  // دکمه افزودن به سبد خرید
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
      addToCart(productId);
    });
  });

  // دکمه علاقه‌مندی
  document.querySelectorAll(".favorite-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
      toggleFavorite(productId, this);
    });
  });
}

function addToCart(productId) {
  const product = productsData.find((p) => p.id == productId);
  if (product && product.inStock) {
    // نمایش پیام موفقیت
    showToast(`"${product.name}" به سبد خرید اضافه شد`, "success");

    // اینجا می‌تونی به localStorage یا API اضافه کنی
    console.log("افزودن به سبد خرید:", product);
  } else {
    showToast("این محصول در حال حاضر موجود نیست", "error");
  }
}

function toggleFavorite(productId, button) {
  const product = productsData.find((p) => p.id == productId);
  const icon = button.querySelector("i");

  if (icon.getAttribute("data-feather") === "heart") {
    icon.setAttribute("data-feather", "heart");
    icon.classList.add("text-red-500", "fill-current");
    showToast(`"${product.name}" به علاقه‌مندی‌ها اضافه شد`, "success");
  } else {
    icon.setAttribute("data-feather", "heart");
    icon.classList.remove("text-red-500", "fill-current");
    showToast(`"${product.name}" از علاقه‌مندی‌ها حذف شد`, "info");
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

// جستجوی محصولات
function searchProducts(query) {
  const filteredProducts = productsData.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
  );

  // نمایش نتایج جستجو
  const productsGrid = document.getElementById("productsGrid");
  productsGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i data-feather="search" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-xl font-bold text-gray-600">محصولی یافت نشد</h3>
                <p class="text-gray-500 mt-2">لطفاً عبارت جستجوی خود را تغییر دهید</p>
            </div>
        `;
  } else {
    filteredProducts.forEach((product) => {
      const productCard = `
                <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                    <div class="relative">
                        <a href="product-single.html?id=${product.id}">
                            <img src="${product.image}" alt="${
        product.name
      }" class="w-full h-48 object-cover">
                        </a>
                        ${
                          product.isNew
                            ? '<span class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">جدید</span>'
                            : ""
                        }
                        ${
                          product.hasDiscount
                            ? `<span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">${product.discountPercent}%</span>`
                            : ""
                        }
                    </div>
                    <div class="p-4">
                        <h3 class="font-medium text-sm mb-2">${
                          product.name
                        }</h3>
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-lg text-primary">${
                              product.price
                            } تومان</span>
                            <button class="bg-primary text-white rounded-lg px-3 py-2 hover:bg-primary-dark transition-colors text-sm">
                                <i data-feather="shopping-cart" class="w-4 h-4 inline ml-1"></i>
                                خرید
                            </button>
                        </div>
                    </div>
                </div>
            `;
      productsGrid.innerHTML += productCard;
    });
  }

  feather.replace();
}

// رویدادهای صفحه
document.addEventListener("DOMContentLoaded", function () {
  // نمایش اولیه محصولات
  displayProducts(currentPage);
  createPagination();

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

  // مرتب‌سازی
  document.querySelector("select").addEventListener("change", function (e) {
    const sortBy = this.value;
    sortProducts(sortBy);
  });

  // جستجو
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "جستجوی محصولات...";
  searchInput.className =
    "border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary";

  searchInput.addEventListener("input", function (e) {
    if (e.target.value.length >= 2) {
      searchProducts(e.target.value);
    } else if (e.target.value.length === 0) {
      displayProducts(currentPage);
      createPagination();
    }
  });

  // اضافه کردن جستجو به toolbar اگر وجود دارد
  const toolbar = document.querySelector(".flex.items-center.space-x-2");
  if (toolbar) {
    toolbar.appendChild(searchInput);
  }

  // فیلتر قیمت
  document.querySelectorAll('input[name="price"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      // اینجا می‌تونی فیلتر قیمت رو پیاده‌سازی کنی
      console.log("فیلتر قیمت:", this.id);
    });
  });
});

// توابعی که در صفحه product-single.html استفاده می‌شوند
function getProductById(id) {
  return productsData.find((product) => product.id === id) || productsData[0];
}

function getRelatedProducts(category, currentProductId, limit = 4) {
  return productsData
    .filter(
      (product) =>
        product.category === category && product.id !== currentProductId
    )
    .slice(0, limit);
}
