// store/profileStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useProfileStore = create(
  persist(
    (set) => ({
      address: {
        loading: false,
        status: "not found",
        data: null,
      },
      nav: "Home",
      setAddress : (nav) => set({ nav }),
      setNav : (nav) => set({ nav }),
    }),
    {
      name: 'tcsc-profile-storage', // localStorage key
    }
  )
);