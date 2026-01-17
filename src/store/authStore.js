import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth Store - Manages authentication state
 * Uses Zustand with persistence to localStorage
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Onboarding progress
      onboardingStep: 0, // 0: not started, 1: basic info, 2: photo, 3: location, 4: complete

      // Auth actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setLoading: (isLoading) => set({ isLoading }),

      setOnboardingStep: (step) => set({ onboardingStep: step }),

      // Update user profile during onboarding
      updateProfile: (data) => set((state) => ({
        user: { ...state.user, ...data }
      })),

      // Login with provider (Apple, Google, Phone)
      login: async (provider, credentials) => {
        set({ isLoading: true });
        try {
          // This will be replaced with actual API call
          const { authService } = await import('../services/authService');
          const result = await authService.login(provider, credentials);

          if (result.success) {
            set({
              user: result.user,
              isAuthenticated: true,
              onboardingStep: result.user.onboardingComplete ? 4 : 0
            });
          }
          return result;
        } finally {
          set({ isLoading: false });
        }
      },

      // Verify OTP
      verifyOTP: async (phone, otp) => {
        set({ isLoading: true });
        try {
          const { authService } = await import('../services/authService');
          const result = await authService.verifyOTP(phone, otp);

          if (result.success) {
            set({
              user: result.user,
              isAuthenticated: true,
              onboardingStep: result.user.onboardingComplete ? 4 : 0
            });
          }
          return result;
        } finally {
          set({ isLoading: false });
        }
      },

      // Send OTP to phone
      sendOTP: async (phone) => {
        set({ isLoading: true });
        try {
          const { authService } = await import('../services/authService');
          return await authService.sendOTP(phone);
        } finally {
          set({ isLoading: false });
        }
      },

      // Complete profile setup
      completeProfile: async (profileData) => {
        set({ isLoading: true });
        try {
          const { authService } = await import('../services/authService');
          const result = await authService.updateProfile(get().user?.id, profileData);

          if (result.success) {
            set((state) => ({
              user: { ...state.user, ...profileData, onboardingComplete: true },
              onboardingStep: 4
            }));
          }
          return result;
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          onboardingStep: 0
        });
      },

      // Reset store (for testing)
      reset: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          onboardingStep: 0
        });
      }
    }),
    {
      name: 'hactually-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        onboardingStep: state.onboardingStep
      }),
    }
  )
);
