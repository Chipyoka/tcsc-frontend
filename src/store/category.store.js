import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Category store
export const useCategoryStore = create(
  persist(
    (set) => ({
      categories: [], // the nested nav tree
      loading: false,
      setCategories: (links) => set({ categories: links }),
      setLoading: (status) => set({ loading: status }),
    }),
    {
      name: 'tcsc-category-links-storage', // localStorage key
      getStorage: () => localStorage,
      partialize: (state) => ({ categories: state.categories }), // persist only the tree
    }
  )
);
