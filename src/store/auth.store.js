import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      login: (userData, token) => set({ user: userData, accessToken: token, isAuthenticated: true }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'tcsc-auth-storage', // name of the item in storage
    }
  )
);

export default useAuthStore;
