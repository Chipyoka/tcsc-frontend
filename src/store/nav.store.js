// store/navStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useNavStore = create(
  persist(
    (set) => ({
      productCategory: 'all',
      selectedProductId: null,
      setProductCategory: (cat) => set({ productCategory: cat }),
      setProductId: (id) => set({ selectedProductId: id }),
    }),
    {
      name: 'nav-storage', // localStorage key
    }
  )
);