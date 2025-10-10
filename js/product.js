// دریافت ID محصول از URL
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get("id")) || 1;
}

// پیدا کردن محصول بر اساس ID (فعلاً تستی)
function findProductById(id) {
  // در آینده می‌تونی از دیتابیس یا فایل JSON بخونی
  return {
    id: id,
    name: `پروتئین وی ایزوله ${id} کیلویی`,
    price: "۲,۳۰۰,۰۰۰",
    originalPrice: "۲,۶۰۰,۰۰۰",
    category: "پروتئین",
    rating: "4.8",
    reviews: "124",
    description: `این محصول با کیفیت عالی و قیمت مناسب برای ورزشکاران حرفه‌ای طراحی شده است. 
                   حاوی ۲۴ گرم پروتئین خالص در هر سروینگ و عاری از لاکتوز و گلوتن می‌باشد.`,
    image: "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=600",
  };
}

// آپدیت صفحه با اطلاعات محصول
function updateProductPage() {
  const productId = getProductIdFromURL();
  const product = findProductById(productId);

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent =
    product.price + " تومان";
  document.getElementById("productOriginalPrice").textContent =
    product.originalPrice + " تومان";
  document.getElementById("productCategory").textContent = product.category;
  document.getElementById("productRating").textContent = product.rating;
  document.getElementById("productReviews").textContent = product.reviews;
  document.getElementById("productDescription").textContent =
    product.description;
  document.getElementById("productImage").src = product.image;

  document.title = product.name + " - AmirShop";
}

document.addEventListener("DOMContentLoaded", function () {
  updateProductPage();
  feather.replace();
});
