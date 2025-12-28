// store/profileStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useProfileStore = create(
  persist(
    (set) => ({
      nav: "Home",
      setNav : (nav) => set({ nav }),
    }),
    {
      name: 'tcsc-profile-storage', // localStorage key
    }
  )
);