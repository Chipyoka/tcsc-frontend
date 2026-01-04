// store/profileStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useProfileStore = create(
  persist(
    (set) => ({
      address: {
        loading: true,
        status: "not found",
        data: null,
      },
      nav: "Home",
      setAddress : (address) => set({ address }),
      setNav : (nav) => set({ nav }),
    }),
    {
      name: 'tcsc-profile-storage', // localStorage key
    }
  )
);