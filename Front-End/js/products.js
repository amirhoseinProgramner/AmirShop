// Front-End/js/products.js
document.addEventListener("DOMContentLoaded", function () {
  // داده‌های نمونه برای تست
  const sampleProducts = [
    {
      id: 1,
      name: "پروتئین وی ایزوله 2 کیلویی",
      price: "۲,۳۰۰,۰۰۰",
      originalPrice: "۲,۶۰۰,۰۰۰",
      image:
        "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=400&h=400&fit=crop",
      category: "protein",
      rating: 4.8,
      reviews: 124,
      discount: 12,
    },
    {
      id: 2,
      name: "کراتین مونوهیدرات 500 گرم",
      price: "۸۰۰,۰۰۰",
      originalPrice: "۹۵۰,۰۰۰",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      category: "creatine",
      rating: 4.6,
      reviews: 89,
      discount: 16,
    },
    {
      id: 3,
      name: "BCAA 400 گرم",
      price: "۶۵۰,۰۰۰",
      originalPrice: "۷۸۰,۰۰۰",
      image:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
      category: "bcaa",
      rating: 4.5,
      reviews: 67,
      discount: 17,
    },
    {
      id: 4,
      name: "ویتامین D3 1000 IU",
      price: "۱۸۰,۰۰۰",
      originalPrice: "۲۲۰,۰۰۰",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
      category: "vitamin",
      rating: 4.7,
      reviews: 156,
      discount: 18,
    },
  ];

  // نمایش محصولات
  displayProducts(sampleProducts);
  setupEventListeners();
});

function displayProducts(products) {
  const productsGrid = document.getElementById("productsGrid");

  if (!productsGrid) {
    console.error('Element with id "productsGrid" not found');
    return;
  }

  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);
  });

  // آپدیت اطلاعات صفحه
  updatePageInfo(products.length);
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow";
  card.innerHTML = `
        <a href="product-single.html?id=${product.id}">
            <div class="relative">
                <img 
                    src="${product.image}" 
                    alt="${product.name}"
                    class="w-full h-48 object-cover"
                >
                ${
                  product.discount
                    ? `
                    <span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                        ${product.discount}% تخفیف
                    </span>
                `
                    : ""
                }
            </div>
            <div class="p-4">
                <h3 class="font-bold text-gray-800 mb-2 hover:text-primary transition-colors">
                    ${product.name}
                </h3>
                <div class="flex items-center space-x-2 space-x-reverse mb-3">
                    <div class="flex items-center space-x-1 space-x-reverse">
                        <i data-feather="star" class="w-4 h-4 text-yellow-400 fill-current"></i>
                        <span class="text-sm font-medium">${
                          product.rating
                        }</span>
                    </div>
                    <span class="text-gray-400 text-sm">(${
                      product.reviews
                    } نظر)</span>
                </div>
                <div class="flex items-center space-x-2 space-x-reverse">
                    <span class="text-lg font-bold text-primary">${
                      product.price
                    } تومان</span>
                    ${
                      product.originalPrice
                        ? `
                        <span class="text-sm text-gray-400 line-through">${product.originalPrice} تومان</span>
                    `
                        : ""
                    }
                </div>
                <button class="w-full mt-3 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                    افزودن به سبد خرید
                </button>
            </div>
        </a>
    `;

  return card;
}

function updatePageInfo(totalProducts) {
  const startItem = document.getElementById("startItem");
  const endItem = document.getElementById("endItem");
  const totalItems = document.getElementById("totalItems");

  if (startItem) startItem.textContent = "1";
  if (endItem) endItem.textContent = totalProducts.toString();
  if (totalItems) totalItems.textContent = totalProducts.toString();
}

function setupEventListeners() {
  // فیلتر دسته‌بندی
  const categoryFilters = document.querySelectorAll(".category-filter");
  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", function (e) {
      e.preventDefault();
      const category = this.getAttribute("data-category");
      // اینجا می‌تونی فیلتر کردن محصولات رو اضافه کنی
      console.log("Filter by category:", category);
    });
  });

  // feather icons
  if (typeof feather !== "undefined") {
    feather.replace();
  }
}
