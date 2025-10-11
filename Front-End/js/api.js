// آدرس سرور بک‌اند
const PB_URL = "http://127.0.0.1:8090/api";

// کلاس مدیریت API
class AmirShopAPI {
  // گرفتن همه محصولات
  async getProducts() {
    try {
      const response = await fetch(`${PB_URL}/collections/products/records`);
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("خطا در دریافت محصولات:", error);
      // اگر خطا داد، از داده نمونه استفاده کن
      return this.getSampleProducts();
    }
  }

  // گرفتن محصول بر اساس دسته‌بندی
  async getProductsByCategory(category) {
    try {
      const response = await fetch(
        `${PB_URL}/collections/products/records?filter=(category='${category}')`
      );
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("خطا در دریافت محصولات:", error);
      return [];
    }
  }

  // ثبت‌نام کاربر
  async register(userData) {
    try {
      const response = await fetch(`${PB_URL}/collections/users/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error("خطا در ثبت‌نام:", error);
      return { error: true };
    }
  }

  // ورود کاربر
  async login(email, password) {
    try {
      const response = await fetch(
        `${PB_URL}/collections/users/auth-with-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identity: email,
            password: password,
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("خطا در ورود:", error);
      return { error: true };
    }
  }

  // ایجاد سفارش
  async createOrder(orderData) {
    try {
      const response = await fetch(`${PB_URL}/collections/orders/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      return await response.json();
    } catch (error) {
      console.error("خطا در ایجاد سفارش:", error);
      return { error: true };
    }
  }

  // داده نمونه برای مواقع خطا
  getSampleProducts() {
    return [
      {
        id: "1",
        name: "پروتئین وی ایزوله 2 کیلویی",
        price: 2300000,
        category: "protein",
        brand: "Optimum Nutrition",
        image:
          "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
        stock: 50,
        description: "پروتئین با کیفیت عالی برای ورزشکاران حرفه‌ای",
      },
      {
        id: "2",
        name: "کراتین مونوهیدرات 500 گرم",
        price: 800000,
        category: "creatine",
        brand: "MyProtein",
        image:
          "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
        stock: 30,
        description: "کراتین خالص برای افزایش قدرت",
      },
    ];
  }
}

// ایجاد نمونه全局
const api = new AmirShopAPI();
