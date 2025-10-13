const API_URL = "http://localhost:5000/api";

class AmirShopAPI {
  // گرفتن همه محصولات
  // گرفتن محصول بر اساس ID
  async getProduct(id) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);

      if (!response.ok) {
        throw new Error(`خطای HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("خطا در دریافت محصول:", error);

      // داده نمونه برای مواقع قطعی
      return this.getSampleProduct(id);
    }
  }

  // داده نمونه برای محصول
  getSampleProduct(id) {
    const sampleProducts = {
      1: {
        _id: "1",
        name: "پروتئین وی ایزوله 2 کیلویی",
        description:
          "پروتئین با کیفیت عالی برای ورزشکاران حرفه‌ای، حاوی 24 گرم پروتئین خالص در هر سروینگ",
        price: 2300000,
        originalPrice: 2600000,
        category: "protein",
        brand: "Optimum Nutrition",
        image:
          "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
        stock: 50,
        rating: 4.8,
        numReviews: 124,
        isActive: true,
        isNew: true,
        hasDiscount: true,
        discountPercent: 12,
        specifications: {
          weight: "2 کیلوگرم",
          flavor: "شکلاتی",
          servings: 66,
          proteinPerServing: "24g",
          calories: 120,
          carbs: "3g",
          fat: "1g",
          sugar: "1g",
        },
      },
      2: {
        _id: "2",
        name: "کراتین مونوهیدرات 500 گرم",
        description: "کراتین خالص برای افزایش قدرت و حجم عضلات",
        price: 800000,
        category: "creatine",
        brand: "MyProtein",
        image:
          "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
        stock: 30,
        rating: 4.6,
        numReviews: 89,
        isActive: true,
        isNew: false,
        hasDiscount: false,
        discountPercent: 0,
        specifications: {
          weight: "500 گرم",
          flavor: "بدون طعم",
          servings: 100,
          proteinPerServing: "0g",
          calories: 0,
          carbs: "0g",
          fat: "0g",
          sugar: "0g",
        },
      },
      3: {
        _id: "3",
        name: "BCAA 2000 400 گرم",
        description: "آمینواسیدهای شاخه‌دار برای ریکاوری سریع",
        price: 1200000,
        originalPrice: 1400000,
        category: "bcaa",
        brand: "Dymatize",
        image:
          "https://images.unsplash.com/photo-1594736797933-d0c1382d7c2e?w=300&h=300&fit=crop",
        stock: 25,
        rating: 4.5,
        numReviews: 67,
        isActive: true,
        isNew: true,
        hasDiscount: true,
        discountPercent: 14,
        specifications: {
          weight: "400 گرم",
          flavor: "هندوانه",
          servings: 80,
          proteinPerServing: "0g",
          calories: 5,
          carbs: "1g",
          fat: "0g",
          sugar: "0g",
        },
      },
    };

    return sampleProducts[id] || sampleProducts["1"];
  }

  // ثبت‌نام کاربر
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("خطا در ثبت‌نام:", error);
      return { success: false, message: "خطا در ارتباط با سرور" };
    }
  }

  // ورود کاربر
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("خطا در ورود:", error);
      return { success: false, message: "خطا در ارتباط با سرور" };
    }
  }

  // ایجاد سفارش
  async createOrder(orderData) {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("خطا در ایجاد سفارش:", error);
      return { success: false, message: "خطا در ارتباط با سرور" };
    }
  }
}

// ایجاد نمونه سراسری
const api = new AmirShopAPI();
