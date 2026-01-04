import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      
      setAccessToken: (token) => set({ accessToken: token }),
      
      login: (userData, token) => set({ 
        user: userData, 
        accessToken: token, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false 
      }),
      
      // New function to update user data
      updateUser: (apiResponse) => set((state) => {
        if (!state.user) return state;
        
        // Transform API response to match your user object structure
        const updatedUser = {
          ...state.user,
          email: apiResponse.email,
          fullName: apiResponse.full_name, // Note: API uses snake_case
          id: apiResponse.id,
          // Preserve existing role if not in API response
          role: state.user.role || 'customer'
        };
        
        return {
          user: updatedUser,
          isAuthenticated: true,
          accessToken: state.accessToken
        };
      })
    }),
    {
      name: 'tcsc-auth-storage',
    }
  )
);

export default useAuthStore;