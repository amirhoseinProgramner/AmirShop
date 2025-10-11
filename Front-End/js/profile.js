// مدیریت پروفایل کاربر
class UserProfile {
  constructor() {
    this.userData = {
      firstName: "امیرحسین",
      lastName: "برنامه‌نویس",
      email: "amir@example.com",
      phone: "۰۹۱۲۳۴۵۶۷۸۹",
      joinDate: "۲۰ دی ۱۴۰۲",
      addresses: [
        {
          id: 1,
          title: "آدرس منزل",
          address: "تهران، منطقه ۵، خیابان آزادی، کوچه ۱۲، پلاک ۲۵، واحد ۳",
          postalCode: "۱۲۳۴۵۶۷۸۹۰",
          isDefault: true,
        },
      ],
    };
  }

  // به‌روزرسانی اطلاعات کاربر
  updateProfile(data) {
    this.userData = { ...this.userData, ...data };
    this.saveToLocalStorage();
    this.updateUI();
  }

  // ذخیره در localStorage
  saveToLocalStorage() {
    localStorage.setItem(
      "amirshop_user_profile",
      JSON.stringify(this.userData)
    );
  }

  // بارگذاری از localStorage
  loadFromLocalStorage() {
    const saved = localStorage.getItem("amirshop_user_profile");
    if (saved) {
      this.userData = JSON.parse(saved);
    }
    this.updateUI();
  }

  // به‌روزرسانی UI
  updateUI() {
    // به‌روزرسانی اطلاعات نمایشی
    document.querySelectorAll('[data-user-field="firstName"]').forEach((el) => {
      el.textContent = this.userData.firstName;
    });

    document.querySelectorAll('[data-user-field="lastName"]').forEach((el) => {
      el.textContent = this.userData.lastName;
    });

    document.querySelectorAll('[data-user-field="email"]').forEach((el) => {
      el.textContent = this.userData.email;
    });

    document.querySelectorAll('[data-user-field="phone"]').forEach((el) => {
      el.textContent = this.userData.phone;
    });
  }
}

// نمونه از کلاس پروفایل
const userProfile = new UserProfile();

// مدیریت فرم ویرایش پروفایل
function setupProfileForm() {
  const editBtn = document.querySelector("[data-edit-profile]");
  if (editBtn) {
    editBtn.addEventListener("click", showEditProfileModal);
  }
}

// نمایش modal ویرایش پروفایل
function showEditProfileModal() {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
  modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold">ویرایش اطلاعات شخصی</h3>
                <button class="text-gray-400 hover:text-gray-600 close-modal">
                    <i data-feather="x" class="w-6 h-6"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="profileEditForm" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="profile-label">نام</label>
                            <input type="text" name="firstName" value="${userProfile.userData.firstName}" class="profile-input" required>
                        </div>
                        <div>
                            <label class="profile-label">نام خانوادگی</label>
                            <input type="text" name="lastName" value="${userProfile.userData.lastName}" class="profile-input" required>
                        </div>
                    </div>
                    <div>
                        <label class="profile-label">ایمیل</label>
                        <input type="email" name="email" value="${userProfile.userData.email}" class="profile-input" required>
                    </div>
                    <div>
                        <label class="profile-label">شماره موبایل</label>
                        <input type="tel" name="phone" value="${userProfile.userData.phone}" class="profile-input" required>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="submit" class="profile-btn-primary flex-1">ذخیره تغییرات</button>
                        <button type="button" class="profile-btn-secondary close-modal">انصراف</button>
                    </div>
                </form>
            </div>
        </div>
    `;

  document.body.appendChild(modal);
  feather.replace();

  // مدیریت فرم
  const form = modal.querySelector("#profileEditForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    userProfile.updateProfile(data);
    modal.remove();
  });

  // بستن modal
  modal.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.remove();
    });
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
  userProfile.loadFromLocalStorage();
  setupProfileForm();

  // مدیریت منوی فعال
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".profile-nav-link").forEach((link) => {
    link.classList.remove("active");
    if (
      link.getAttribute("href") === currentPage ||
      (currentPage === "" && link.getAttribute("href") === "index.html")
    ) {
      link.classList.add("active");
    }
  });
});
