// داده‌های مقالات
const articlesData = [
  {
    id: 1,
    title: "راهنمای جامع تغذیه ورزشی برای عضله‌سازی",
    excerpt:
      "در این مقاله به بررسی کامل اصول تغذیه ورزشی، زمان‌بندی مصرف مواد غذایی و بهترین منابع پروتئینی برای عضله‌سازی می‌پردازیم.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    category: "nutrition",
    readTime: "۸ دقیقه",
    date: "۱۴۰۲/۱۰/۱۵",
    views: "۱٫۲K",
  },
  {
    id: 2,
    title: "برنامه تمرینی کامل برای حجم‌گیری",
    excerpt:
      "یک برنامه تمرینی ۴ روزه حرفه‌ای برای افزایش حجم عضلات همراه با توضیحات کامل تکنیک‌های اجرا و نکات مهم.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop",
    category: "workout",
    readTime: "۱۲ دقیقه",
    date: "۱۴۰۲/۱۰/۱۲",
    views: "۲٫۵K",
  },
  {
    id: 3,
    title: "مکمل‌های ضروری برای بدنسازان",
    excerpt:
      "آشنایی با مهمترین مکمل‌های ورزشی، نحوه مصرف، دوز مناسب و بهترین زمان مصرف برای رسیدن به حداکثر نتیجه.",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=400&h=250&fit=crop",
    category: "supplements",
    readTime: "۱۰ دقیقه",
    date: "۱۴۰۲/۱۰/۱۰",
    views: "۳٫۱K",
  },
  {
    id: 4,
    title: "تاثیر خواب بر رشد عضلات",
    excerpt:
      "بررسی علمی رابطه بین کیفیت خواب، ترشح هورمون‌ها و تاثیر مستقیم آن بر ریکاوری و رشد عضلات.",
    image:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop",
    category: "health",
    readTime: "۶ دقیقه",
    date: "۱۴۰۲/۱۰/۰۸",
    views: "۱٫۸K",
  },
  {
    id: 5,
    title: "رژیم کات برای کاهش چربی بدن",
    excerpt:
      "برنامه غذایی دقیق و اصولی برای کاهش چربی بدن بدون از دست دادن حجم عضلانی به همراه نکات طلایی.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop",
    category: "nutrition",
    readTime: "۹ دقیقه",
    date: "۱۴۰۲/۱۰/۰۵",
    views: "۲٫۲K",
  },
  {
    id: 6,
    title: "تمرینات کاردیو برای چربی‌سوزی",
    excerpt:
      "بهترین انواع تمرینات کاردیو، مدت زمان مناسب و شدت مطلوب برای حداکثر چربی‌سوزی و حفظ عضلات.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=250&fit=crop",
    category: "workout",
    readTime: "۷ دقیقه",
    date: "۱۴۰۲/۱۰/۰۳",
    views: "۱٫۹K",
  },
];

// تابع برای نمایش مقالات
function displayArticles(articles) {
  const articlesGrid = document.getElementById("articlesGrid");
  articlesGrid.innerHTML = "";

  articles.forEach((article) => {
    const articleCard = `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300" data-category="${
              article.category
            }">
                <a href="article-${articles / article01.html}.html">
                    <img 
                        src="${article.image}" 
                        alt="${article.title}"
                        class="w-full h-48 object-cover"
                    />
                </a>
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-medium px-2 py-1 rounded-full bg-primary bg-opacity-10 text-primary">
                            ${getCategoryName(article.category)}
                        </span>
                        <span class="text-xs text-gray-500">${
                          article.readTime
                        }</span>
                    </div>
                    <a href="article-${article.id}.html">
                        <h3 class="font-bold text-lg mb-3 hover:text-primary transition-colors">${
                          article.title
                        }</h3>
                    </a>
                    <p class="text-gray-600 text-sm mb-4 leading-relaxed">${
                      article.excerpt
                    }</p>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>${article.date}</span>
                        <div class="flex items-center space-x-1 space-x-reverse">
                            <i data-feather="eye" class="w-4 h-4"></i>
                            <span>${article.views}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    articlesGrid.innerHTML += articleCard;
  });

  feather.replace();
}

// تابع برای گرفتن نام فارسی دسته‌بندی
function getCategoryName(category) {
  const categories = {
    nutrition: "تغذیه ورزشی",
    workout: "تمرینات",
    supplements: "مکمل‌ها",
    health: "سلامت",
  };
  return categories[category] || category;
}

// فیلتر کردن مقالات
function filterArticles(category) {
  if (category === "all") {
    displayArticles(articlesData);
  } else {
    const filteredArticles = articlesData.filter(
      (article) => article.category === category
    );
    displayArticles(filteredArticles);
  }
}

// فعال کردن دکمه فیلتر
function setActiveFilter(activeBtn) {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active", "bg-primary", "text-white");
    btn.classList.add("bg-white", "border");
  });

  activeBtn.classList.add("active", "bg-primary", "text-white");
  activeBtn.classList.remove("bg-white", "border");
}

// جستجوی مقالات
function searchArticles(query) {
  const filteredArticles = articlesData.filter(
    (article) =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(query.toLowerCase())
  );
  displayArticles(filteredArticles);
}

// رویدادهای صفحه
document.addEventListener("DOMContentLoaded", function () {
  // نمایش اولیه مقالات
  displayArticles(articlesData);

  // فیلتر دسته‌بندی
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      setActiveFilter(this);
      filterArticles(category);
    });
  });

  // جستجو
  document
    .getElementById("searchInput")
    .addEventListener("input", function (e) {
      searchArticles(e.target.value);
    });

  // فیلتر از سایدبار
  document.querySelectorAll(".category-filter").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const category = this.getAttribute("data-category");
      const correspondingBtn = document.querySelector(
        `.filter-btn[data-category="${category}"]`
      );
      if (correspondingBtn) {
        setActiveFilter(correspondingBtn);
        filterArticles(category);
      }
    });
  });
});
