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
      isDiscountMember: false,

      setAddress : (address) => set({ address }),
      setNav : (nav) => set({ nav }),
      setIsDiscountMember : (isDiscountMember) => set({ isDiscountMember }),
    }),
    {
      name: 'tcsc-profile-storage', // localStorage key
    }
  )
);