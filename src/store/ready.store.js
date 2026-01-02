// store/navStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useReadyStore = create(
  persist(
    (set) => ({
      productsReady: false,
      startaParksReady: false,
      bestSellersReady : false,
      setProductsReady: (s) => set({ productReady: s }),
      setStartaParksReady: (s) => set({ startaParksReady: s }),
      setBestSellersReady: (s) => set({ bestSellersReady: s }),
    }),
    {
      name: 'tcsc-readiness-storage', // localStorage key
    }
  )
);