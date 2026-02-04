/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { Product } from "../types";

const API = axios.create({
  baseURL: "https://buuz-api.itwork.mn/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Хэрэв токен хүчингүй болсон бол автоматаар гаргах interceptor (нэмэлт)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  },
);

export const productService = {
  getAll: async (params: string = "") => {
    const response = await API.get<{
      success: boolean;
      body: { items: Product[] };
    }>(`/product/${params}`);
    return response.data;
  },

  // Сагсны мэдээлэл авах
  getBasket: async () => {
    const res = await API.get("/order/basket");
    return res.data;
  },

  // Сагсанд бараа нэмэх (Order үүсгэх)
  addToOrder: async (data: { productId: number; quantity: number }) => {
    const res = await API.post("/order", data);
    return res.data;
  },

  // Сагсан дахь барааны тоог өөрчлөх (Update item quantity)
  // Таны API-аас хамаарч PATCH эсвэл POST байж болно. Захиалга шинэчлэхэд ашиглана.
  updateBasketItem: async (orderItemId: number, quantity: number) => {
    const res = await API.post("/order/item", { orderItemId, quantity });
    return res.data;
  },

  // Сагснаас бараа устгах
  removeFromBasket: async (orderItemId: number) => {
    const res = await API.delete(`/order/${orderItemId}`);
    return res.data;
  },
  changeOrderStatus: async (orderId: number, status: string) => {
    const res = await API.put("/order/change-status", { orderId, status });
    return res.data;
  },

  // Захиалгыг эцэслэн баталгаажуулах
  checkout: async (data: { address: string; phone: string; note?: string }) => {
    const res = await API.post("/order/checkout", data);
    return res.data;
  },
};

export const authService = {
  signIn: async (data: any) => {
    const response = await API.post("/client/signin", data);
    return response.data;
  },
  signUp: async (data: any) => {
    const response = await API.post("/client/signup", data);
    return response.data;
  },
};

export const userService = {
  // Хэрэглэгчийн мэдээлэл авах
  getMe: async () => {
    const res = await API.get("/client/info");
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await API.put('/client/forgot-password', { email });
    return res.data;
  },
  updateProfile: async (data: {
    name: string;
    phone: string;
    location: string;
  }) => {
    const res = await API.put("/client", data);
    return res.data;
  },
  changePassword: async (password: string) => {
    const res = await API.put("/client/change-password", { password });
    return res.data;
  },

  // Захиалгын түүх авах (Төлөвөөр шүүх)
  // Жишээ нь: status = 'pending' | 'processing' | 'completed' | 'done'
  getOrders: async (status: string) => {
    const res = await API.post("/order/status", { status });
    return res.data;
  },
};
