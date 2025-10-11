// داده‌های نمونه سفارشات
const ordersData = [
  {
    id: "ORD-1402-789456",
    date: "۱۴۰۲/۱۰/۲۰",
    status: "delivered",
    statusText: "تحویل شده",
    total: "۳,۰۰۵,۰۰۰",
    items: [
      {
        name: "پروتئین وی ایزوله 2 کیلویی",
        price: "۲,۳۰۰,۰۰۰",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=80&h=80&fit=crop",
      },
      {
        name: "کراتین مونوهیدرات 500 گرم",
        price: "۸۰۰,۰۰۰",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=80&h=80&fit=crop",
      },
    ],
    shipping: {
      method: "پیک موتوری",
      cost: "۲۵,۰۰۰",
      address: "تهران، منطقه ۵، خیابان آزادی، کوچه ۱۲، پلاک ۲۵",
    },
    tracking: {
      number: "TRK-789456123",
      steps: [
        {
          status: "paid",
          text: "پرداخت شده",
          date: "۱۴۰۲/۱۰/۲۰ - ۱۵:۳۰",
          completed: true,
        },
        {
          status: "processing",
          text: "در حال پردازش",
          date: "۱۴۰۲/۱۰/۲۰ - ۱۶:۴۵",
          completed: true,
        },
        {
          status: "shipped",
          text: "ارسال شده",
          date: "۱۴۰۲/۱۰/۲۱ - ۰۹:۱۵",
          completed: true,
        },
        {
          status: "delivered",
          text: "تحویل شده",
          date: "۱۴۰۲/۱۰/۲۱ - ۱۴:۲۰",
          completed: true,
        },
      ],
    },
  },
  {
    id: "ORD-1402-654321",
    date: "۱۴۰۲/۱۰/۱۸",
    status: "shipped",
    statusText: "ارسال شده",
    total: "۱,۸۵۰,۰۰۰",
    items: [
      {
        name: "BCAA 2000 400 گرم",
        price: "۱,۲۰۰,۰۰۰",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=80&h=80&fit=crop",
      },
      {
        name: "مولتی ویتامین کامل",
        price: "۴۵۰,۰۰۰",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=80&h=80&fit=crop",
      },
    ],
    shipping: {
      method: "پست پیشتاز",
      cost: "۱۵,۰۰۰",
      address: "تهران، منطقه ۵، خیابان آزادی، کوچه ۱۲، پلاک ۲۵",
    },
    tracking: {
      number: "TRK-654987321",
      steps: [
        {
          status: "paid",
          text: "پرداخت شده",
          date: "۱۴۰۲/۱۰/۱۸ - ۱۱:۲۰",
          completed: true,
        },
        {
          status: "processing",
          text: "در حال پردازش",
          date: "۱۴۰۲/۱۰/۱۸ - ۱۳:۴۵",
          completed: true,
        },
        {
          status: "shipped",
          text: "ارسال شده",
          date: "۱۴۰۲/۱۰/۱۹ - ۱۰:۳۰",
          completed: true,
        },
        {
          status: "delivered",
          text: "تحویل شده",
          date: "۱۴۰۲/۱۰/۲۱ - ۱۴:۲۰",
          completed: false,
        },
      ],
    },
  },
  {
    id: "ORD-1402-321987",
    date: "۱۴۰۲/۱۰/۱۵",
    status: "processing",
    statusText: "در حال پردازش",
    total: "۴,۲۰۰,۰۰۰",
    items: [
      {
        name: "پروتئین کازیین 1.8 کیلو",
        price: "۲,۱۰۰,۰۰۰",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=80&h=80&fit=crop",
      },
    ],
    shipping: {
      method: "پیک موتوری",
      cost: "۲۵,۰۰۰",
      address: "تهران، منطقه ۵، خیابان آزادی، کوچه ۱۲، پلاک ۲۵",
    },
    tracking: {
      number: "TRK-321654987",
      steps: [
        {
          status: "paid",
          text: "پرداخت شده",
          date: "۱۴۰۲/۱۰/۱۵ - ۰۹:۱۵",
          completed: true,
        },
        {
          status: "processing",
          text: "در حال پردازش",
          date: "۱۴۰۲/۱۰/۱۵ - ۱۱:۳۰",
          completed: true,
        },
        {
          status: "shipped",
          text: "ارسال شده",
          date: "۱۴۰۲/۱۰/۱۶ - ۰۹:۰۰",
          completed: false,
        },
        { status: "delivered", text: "تحویل شده", date: "", completed: false },
      ],
    },
  },
];

// تابع نمایش سفارشات
function displayOrders(statusFilter = "all") {
  const ordersList = document.getElementById("ordersList");
  const filteredOrders =
    statusFilter === "all"
      ? ordersData
      : ordersData.filter((order) => order.status === statusFilter);

  ordersList.innerHTML = "";

  if (filteredOrders.length === 0) {
    ordersList.innerHTML = `
            <div class="bg-white rounded-lg shadow-sm p-12 text-center">
                <i data-feather="package" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-xl font-bold text-gray-600 mb-2">سفارشی یافت نشد</h3>
                <p class="text-gray-500">هیچ سفارشی با این فیلتر وجود ندارد</p>
            </div>
        `;
    feather.replace();
    return;
  }

  filteredOrders.forEach((order) => {
    const orderCard = createOrderCard(order);
    ordersList.innerHTML += orderCard;
  });

  feather.replace();
  attachOrderEvents();
}

// تابع ایجاد کارت سفارش
function createOrderCard(order) {
  return `
        <div class="order-card fade-in" data-order-id="${order.id}">
            <!-- هدر سفارش -->
            <div class="border-b border-gray-200 p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex items-center space-x-4 space-x-reverse">
                        <div>
                            <p class="font-medium text-gray-500">شماره سفارش</p>
                            <p class="font-bold text-lg">${order.id}</p>
                        </div>
                        <div>
                            <p class="font-medium text-gray-500">تاریخ سفارش</p>
                            <p class="font-medium">${order.date}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4 space-x-reverse">
                        <span class="order-status order-status-${
                          order.status
                        }">${order.statusText}</span>
                        <p class="font-bold text-xl text-primary">${
                          order.total
                        } تومان</p>
                    </div>
                </div>
            </div>

            <!-- محصولات -->
            <div class="p-6 border-b border-gray-200">
                <div class="space-y-4">
                    ${order.items
                      .map(
                        (item) => `
                        <div class="flex items-center space-x-4 space-x-reverse">
                            <img src="${item.image}" alt="${
                          item.name
                        }" class="w-16 h-16 rounded object-cover">
                            <div class="flex-1">
                                <h4 class="font-medium">${item.name}</h4>
                                <p class="text-gray-500 text-sm">${
                                  item.quantity
                                } عدد × ${item.price} تومان</p>
                            </div>
                            <span class="font-medium">${(
                              parseInt(item.price.replace(/,/g, "")) *
                              item.quantity
                            ).toLocaleString("fa-IR")} تومان</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>

            <!-- اطلاعات ارسال -->
            <div class="p-6 border-b border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-medium mb-2">روش ارسال</h4>
                        <p class="text-gray-600">${order.shipping.method} - ${
    order.shipping.cost
  } تومان</p>
                    </div>
                    <div>
                        <h4 class="font-medium mb-2">آدرس ارسال</h4>
                        <p class="text-gray-600">${order.shipping.address}</p>
                    </div>
                </div>
            </div>

            <!-- اقدامات -->
            <div class="p-6">
                <div class="flex flex-col sm:flex-row gap-3 justify-end">
                    <button class="profile-btn-secondary order-detail-btn" data-order-id="${
                      order.id
                    }">
                        <i data-feather="eye" class="w-4 h-4 ml-1"></i>
                        مشاهده جزئیات
                    </button>
                    <button class="profile-btn-secondary">
                        <i data-feather="repeat" class="w-4 h-4 ml-1"></i>
                        سفارش مجدد
                    </button>
                    ${
                      order.status === "delivered"
                        ? `
                        <button class="profile-btn-primary">
                            <i data-feather="star" class="w-4 h-4 ml-1"></i>
                            ثبت نظر
                        </button>
                    `
                        : ""
                    }
                </div>
            </div>
        </div>
    `;
}

// فیلتر کردن سفارشات
function setupOrderFilters() {
  document.querySelectorAll(".order-filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // غیرفعال کردن همه دکمه‌ها
      document.querySelectorAll(".order-filter-btn").forEach((b) => {
        b.classList.remove("active");
      });

      // فعال کردن دکمه جاری
      this.classList.add("active");

      // فیلتر کردن سفارشات
      const status = this.getAttribute("data-status");
      displayOrders(status);
    });
  });
}

// مدیریت رویدادهای سفارش
function attachOrderEvents() {
  document.querySelectorAll(".order-detail-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const orderId = this.getAttribute("data-order-id");
      showOrderDetails(orderId);
    });
  });
}

// نمایش جزئیات سفارش
function showOrderDetails(orderId) {
  const order = ordersData.find((o) => o.id === orderId);
  if (!order) return;

  // ایجاد modal جزئیات سفارش
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
  modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold">جزئیات سفارش ${order.id}</h3>
                <button class="text-gray-400 hover:text-gray-600 close-modal">
                    <i data-feather="x" class="w-6 h-6"></i>
                </button>
            </div>
            <div class="p-6">
                <!-- محتوای modal -->
                <div class="space-y-6">
                    <!-- مراحل پیگیری -->
                    <div>
                        <h4 class="font-bold text-lg mb-4">پیگیری سفارش</h4>
                        <div class="space-y-4">
                            ${order.tracking.steps
                              .map(
                                (step) => `
                                <div class="flex items-center space-x-4 space-x-reverse">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center ${
                                      step.completed
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-400"
                                    }">
                                        <i data-feather="${
                                          step.completed ? "check" : "clock"
                                        }" class="w-4 h-4"></i>
                                    </div>
                                    <div class="flex-1">
                                        <p class="font-medium">${step.text}</p>
                                        ${
                                          step.date
                                            ? `<p class="text-gray-500 text-sm">${step.date}</p>`
                                            : ""
                                        }
                                    </div>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);
  feather.replace();

  // بستن modal
  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.remove();
  });

  // بستن با کلیک خارج
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// مقداردهی اولیه
document.addEventListener("DOMContentLoaded", function () {
  displayOrders();
  setupOrderFilters();
});
