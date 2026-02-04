/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { productService } from '../api/service';
import { notifications } from '@mantine/notifications';

interface BasketStore {
  basketItems: any[]; // Сагсан дахь бараануудын жагсаалт
  basketCount: number;
  loading: boolean;
  fetchBasket: () => Promise<void>;
  addToBasket: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, qty: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

export const useBasketStore = create<BasketStore>((set, get) => ({
  basketItems: [],
  basketCount: 0,
  loading: false,

  fetchBasket: async () => {
    // Хэрэв токен байхгүй бол хүсэлт явуулахгүй
    if (!localStorage.getItem('token')) return;
    
    set({ loading: true });
    try {
      const res = await productService.getBasket();
      if (res.success) {
        set({ 
          basketItems: res.body.order_items || [], 
          basketCount: res.body.order_items?.length || 0 
        });
      }
    } catch (error) {
      console.error('Fetch basket error:', error);
    } finally {
      set({ loading: false });
    }
  },

  addToBasket: async (productId: number, quantity: number) => {
    try {
      const res = await productService.addToOrder({ productId, quantity });
      if (res.success) {
        notifications.show({
          title: 'Амжилттай',
          message: 'Сагсанд нэмэгдлээ',
          color: 'green',
        });
        await get().fetchBasket(); // Сагсаа шинэчлэх
      }
    } catch (error: any) {
      notifications.show({
        title: 'Алдаа',
        message: error.response?.data?.error?.message || 'Нэвтрэх шаардлагатай',
        color: 'red',
      });
    }
  },

  updateQuantity: async (productId: number, newQty: number) => {
  if (newQty < 1) return;
  try {
    // Таны хуучин createBasket-тэй ижил POST /order дуудаж байна
    await productService.addToOrder({ productId, quantity: newQty }); 
    // Дараа нь сагсаа дахин татаж төлөвийг шинэчилнэ (runOrder-той ижил)
    get().fetchBasket(); 
  } catch (error) {
    console.error(error);
  }
},

  removeItem: async (itemId: number) => {
    try {
      await productService.removeFromBasket(itemId);
      await get().fetchBasket();
      notifications.show({
        message: 'Сагснаас хасагдлаа',
        color: 'gray',
      });
    } catch (error) {
      console.error('Remove item error:', error);
    }
  }
}));