// --- ۱. مدل داده: داده‌های محصولات (بدون تغییر) ---

let productsData = Array.from({ length: 100 }, (_, index) => {
  // ... [همان کد شما برای ساخت محصولات ۱۰۰ تایی] ...
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
  const rawPrice = prices[index % prices.length];
  const hasDiscount = index % 3 === 0;
  const rawOriginalPrice = hasDiscount ? Math.floor(rawPrice * 1.2) : null;
  const discountPercent = hasDiscount
    ? Math.floor((1 - rawPrice / rawOriginalPrice) * 100)
    : 0;

  // نکته مهم: قیمت اصلی (بدون فرمت) برای مرتب‌سازی نیاز است.
  return {
    id: index + 1,
    name: `${getCategoryName(category)} ${brand} ${size}`,
    description: `این محصول با کیفیت عالی از برند ${brand} مناسب برای ورزشکاران حرفه‌ای و مبتدی می‌باشد. حاوی بهترین مواد اولیه و عاری از هرگونه مواد مضر.`,
    price: formatPrice(rawPrice),
    rawPrice: rawPrice, // نگهداری قیمت خام
    originalPrice: rawOriginalPrice ? formatPrice(rawOriginalPrice) : "",
    rawOriginalPrice: rawOriginalPrice, // نگهداری قیمت خام
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
    inStock: index % 20 !== 0,
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
async function loadProductsFromBackend() {
  try {
    productsData = await api.getProducts();
    console.log("محصولات loaded:", productsData);
  } catch (error) {
    console.error("خطا در بارگذاری محصولات:", error);
    productsData = api.getSampleProducts();
  }
}

// آپدیت تابع displayProducts
function displayProducts(productsToShow = productsData) {
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid) return;

  productsGrid.innerHTML = "";

  productsToShow.forEach((product) => {
    const productCard = `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1" data-category="${
              product.category
            }">
                <div class="relative">
                    <a href="product-single.html?id=${product.id}">
                        <img 
                            src="${
                              product.image ||
                              "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop"
                            }" 
                            alt="${product.name}"
                            class="w-full h-48 object-cover"
                        />
                    </a>
                    ${
                      product.stock < 10
                        ? '<span class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">كمياب</span>'
                        : ""
                    }
                    ${
                      product.stock > 10
                        ? '<span class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">موجود</span>'
                        : ""
                    }
                    
                    <button class="absolute bottom-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors favorite-btn">
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
                            <span class="text-xs text-gray-600">4.8</span>
                        </div>
                    </div>
                    <a href="product-single.html?id=${product.id}">
                        <h3 class="font-medium text-sm mb-2 hover:text-primary cursor-pointer line-clamp-2">${
                          product.name
                        }</h3>
                    </a>
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center space-x-2 space-x-reverse">
                            <span class="font-bold text-lg text-primary">${product.price.toLocaleString(
                              "fa-IR"
                            )} تومان</span>
                        </div>
                        <button class="bg-primary text-white rounded-lg px-3 py-2 hover:bg-primary-dark transition-colors text-sm add-to-cart-btn" data-product-id="${
                          product.id
                        }">
                            <i data-feather="shopping-cart" class="w-4 h-4 inline ml-1"></i>
                            خرید
                        </button>
                    </div>
                </div>
            </div>
        `;
    productsGrid.innerHTML += productCard;
  });

  feather.replace();
}

// آپدیت رویداد DOMContentLoaded
document.addEventListener("DOMContentLoaded", async function () {
  // بارگذاری محصولات از بک‌اند
  await loadProductsFromBackend();

  // نمایش محصولات
  displayProducts();
  createPagination();

  // بقیه کدها...
  setupEventListeners();
});

// --- ۲. توابع کمکی (بدون تغییر) ---

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

// --- ۳. متغیرهای پیکربندی و حالت (State) ---

const productsPerPage = 20;
let currentPage = 1;
let currentFilter = "all"; // فیلتر دسته‌بندی
let currentPriceRange = "all"; // فیلتر قیمت
let currentSort = "per-bazdid"; // مرتب‌سازی (جدید: بر اساس متنی که در HTML هست)

// --- ۴. توابع اصلی منطق (Core Logic) ---

/**
 * محدوده قیمتی را بر اساس ID رادیو باتن برمی‌گرداند.
 * @param {string} id - شناسه رادیو باتن قیمت (مثلاً: price-1)
 * @returns {{min: number, max: number}|null}
 */
function getPriceRange(id) {
  switch (id) {
    case "price-1":
      return { min: 0, max: 500000 };
    case "price-2":
      return { min: 500001, max: 1000000 };
    case "price-3":
      return { min: 1000001, max: Infinity };
    default:
      return null; // all
  }
}

/**
 * فیلتر و مرتب‌سازی محصولات را انجام می‌دهد.
 * این تابع باید منبع داده اصلی (Source of Truth) برای displayProducts باشد.
 */
function getProcessedProducts() {
  let products = [...productsData]; // کپی از آرایه اصلی برای جلوگیری از تغییر آن

  // الف. فیلتر بر اساس دسته‌بندی
  if (currentFilter !== "all") {
    products = products.filter((p) => p.category === currentFilter);
  }

  // ب. فیلتر بر اساس قیمت
  const range = getPriceRange(currentPriceRange);
  if (range) {
    products = products.filter(
      (p) => p.rawPrice >= range.min && p.rawPrice <= range.max
    );
  }

  // ج. مرتب‌سازی
  products.sort((a, b) => {
    switch (currentSort) {
      case "گران‌ترین":
        return b.rawPrice - a.rawPrice;
      case "ارزان‌ترین":
        return a.rawPrice - b.rawPrice;
      case "پرفروش‌ترین":
        return b.reviews - a.reviews; // فرض: reviews بالا = پرفروش
      case "جدیدترین":
        return b.id - a.id; // فرض: id بالاتر = جدیدتر
      case "پربازدیدترین":
      default:
        // پربازدیدترین یا پیش‌فرض: بر اساس بالاترین امتیاز
        return parseFloat(b.rating) - parseFloat(a.rating);
    }
  });

  return products;
}

// تابع برای نمایش محصولات
function displayProducts(page = 1) {
  const productsGrid = document.getElementById("productsGrid");

  // ۱. دریافت محصولات فیلتر و مرتب شده
  const productsToShow = getProcessedProducts();
  const totalFilteredProducts = productsToShow.length;

  // ۲. محاسبه صفحه‌بندی
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = productsToShow.slice(startIndex, endIndex);

  productsGrid.innerHTML = "";

  // ۳. اگر محصولی نبود، پیام نمایش بده
  if (totalFilteredProducts === 0) {
    productsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i data-feather="search" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-xl font-bold text-gray-600">محصولی یافت نشد</h3>
                <p class="text-gray-500 mt-2">لطفاً فیلترها یا عبارت جستجوی خود را تغییر دهید.</p>
            </div>
        `;
  } else {
    // ۴. ساخت کارت‌های محصول
    paginatedProducts.forEach((product) => {
      // ... [کد شما برای ساخت productCard] ...
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
  }

  // ۵. آپدیت اطلاعات صفحه
  document.getElementById("startItem").textContent =
    totalFilteredProducts > 0 ? startIndex + 1 : 0;
  document.getElementById("endItem").textContent = Math.min(
    endIndex,
    totalFilteredProducts
  );
  document.getElementById("totalItems").textContent = totalFilteredProducts;

  feather.replace();
  attachProductEvents();
  createPagination(totalFilteredProducts); // ارسال تعداد محصولات فیلتر شده به تابع صفحه‌بندی
}

// تابع برای ایجاد صفحه‌بندی (اصلاح شده برای پذیرش totalFilteredProducts)
function createPagination(totalFilteredProducts) {
  const pagination = document.getElementById("pagination");
  const totalFilteredPages = Math.ceil(totalFilteredProducts / productsPerPage);

  pagination.innerHTML = "";

  if (totalFilteredPages <= 1) return; // اگر فقط یک صفحه باشد

  // ... [بقیه کد createPagination بدون تغییر] ...

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
  // createPagination() دیگر لازم نیست فراخوانی شود چون در displayProducts صدا زده می‌شود.

  // اسکرول به بالای صفحه
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// فیلتر کردن محصولات (بهبودیافته)
function filterProducts(category) {
  currentFilter = category;
  currentPage = 1; // بازگشت به صفحه اول هنگام فیلتر

  // آپدیت دکمه‌های فیلتر فعال
  document.querySelectorAll(".category-filter").forEach((link) => {
    // تغییرات بصری در HTML را اینجا اعمال می‌کنیم
    if (link.getAttribute("data-category") === category) {
      link.classList.add("font-bold", "text-primary");
    } else {
      link.classList.remove("font-bold", "text-primary");
    }
  });

  displayProducts(currentPage);
  // createPagination(); // در displayProducts صدا زده می‌شود
}

// مرتب‌سازی محصولات (اصلاح‌شده)
function sortProducts(sortBy) {
  currentSort = sortBy; // فقط وضعیت مرتب‌سازی را ذخیره می‌کنیم
  currentPage = 1;
  // آرایه productsData را تغییر نمی‌دهیم، تابع getProcessedProducts آن را مدیریت می‌کند.
  displayProducts(currentPage);
}

// فیلتر قیمت (جدید)
function filterPrice(rangeId) {
  currentPriceRange = rangeId; // ذخیره id رادیو باتن (مثل: price-1, price-all)
  currentPage = 1; // بازگشت به صفحه اول
  displayProducts(currentPage);
}

// مدیریت سبد خرید و علاقه‌مندی‌ها (بدون تغییر)
function attachProductEvents() {
  // ... [کد شما برای attachProductEvents] ...
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
  const isFavorite = icon.classList.contains("fill-current");

  // نکته: برای تغییر آیکون نیاز است که feather.replace() مجدداً فراخوانی شود، که در displayProducts انجام می‌شود.
  // اما برای حالت سریع‌تر، می‌توانیم آیکون را با SVG جایگزین کنیم، یا از تغییر رنگ/پر کردن استفاده کنیم.
  if (!isFavorite) {
    icon.classList.add("text-red-500", "fill-current"); // پر کردن قلب
    showToast(`"${product.name}" به علاقه‌مندی‌ها اضافه شد`, "success");
  } else {
    icon.classList.remove("text-red-500", "fill-current"); // خالی کردن قلب
    showToast(`"${product.name}" از علاقه‌مندی‌ها حذف شد`, "info");
  }

  // به دلیل استفاده از feather.replace() در انتها، این تغییرات بصری به‌خوبی نمایش داده خواهند شد.
  feather.replace();
}

// نمایش نوتیفیکیشن (بدون تغییر)
function showToast(message, type = "info") {
  // ... [کد شما برای showToast] ...
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

// جستجوی محصولات (بدون تغییر) - نکته: اگر جستجو انجام شود، فیلتر و مرتب‌سازی نادیده گرفته می‌شوند
// اگر می‌خواهید جستجو با فیلترها ادغام شود، باید تابع searchProducts را بازنویسی کنید
function searchProducts(query) {
  // ... [کد شما برای searchProducts] ...
  const productsGrid = document.getElementById("productsGrid");
  const filteredProducts = productsData.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
  );

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
    // در حالت جستجو، فقط نتایج را نمایش می‌دهیم، صفحه‌بندی غیرفعال می‌شود
    filteredProducts.forEach((product) => {
      // ... (کارت محصول ساده)
    });
  }

  feather.replace();
}

// --- ۵. رویدادهای صفحه (Event Listeners) ---
document.addEventListener("DOMContentLoaded", function () {
  // ۱. نمایش اولیه محصولات
  displayProducts(currentPage);
  // createPagination() // در displayProducts صدا زده می‌شود

  // ۲. فیلتر دسته‌بندی
  document.querySelectorAll(".category-filter").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const category = this.getAttribute("data-category");
      filterProducts(category);
    });
  });

  // تنظیم اولیه فیلتر "همه محصولات" به عنوان فعال
  document
    .querySelector('.category-filter[data-category="all"]')
    .classList.add("font-bold", "text-primary");

  // ۳. فیلتر قیمت (جدید: اتصال رادیو باتن‌ها به تابع filterPrice)
  document.querySelectorAll('input[name="price"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      filterPrice(this.id);
    });
  });

  // تنظیم اولیه فیلتر "همه قیمت‌ها" به عنوان فعال
  document.getElementById("price-all").checked = true;

  // ۴. مرتب‌سازی
  document.querySelector("select").addEventListener("change", function (e) {
    const sortBy = this.value;
    sortProducts(sortBy);
  });

  // ۵. جستجو (باید المان جستجو در HTML شما تعریف شده باشد)
  const searchInput = document.querySelector(
    'input[placeholder="جستجوی محصولات..."]'
  );
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      // اگر کاربر چیزی تایپ کند، فیلترها و صفحه‌بندی نادیده گرفته می‌شوند
      if (e.target.value.length >= 2) {
        searchProducts(e.target.value);
      } else if (e.target.value.length === 0) {
        // با پاک شدن جستجو، به حالت فیلتر و صفحه‌بندی برمی‌گردیم
        displayProducts(currentPage);
      }
    });
  }

  // ... [بقیه توابع کمکی شما] ...
});

// توابعی که در صفحه product-single.html استفاده می‌شوند (بدون تغییر)
function getProductById(id) {
  return (
    productsData.find((product) => product.id === parseInt(id)) ||
    productsData[0]
  );
}

function getRelatedProducts(category, currentProductId, limit = 4) {
  return productsData
    .filter(
      (product) =>
        product.category === category && product.id !== currentProductId
    )
    .slice(0, limit);
}
