import { create } from 'zustand';

interface BasketState {
  count: number;
  setCount: (count: number) => void;
}

export const useBasketStore = create<BasketState>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
}));