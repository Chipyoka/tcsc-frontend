// store/navStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useNavStore = create(
  persist(
    (set) => ({
      productCategory: 'all',
      setProductCategory: (cat) => set({ productCategory: cat }),
    }),
    {
      name: 'nav-storage', // localStorage key
      partialize: (state) => ({ productCategory: state.productCategory }), // only store productCategory
    }
  )
);