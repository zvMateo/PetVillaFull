import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FreelancerProfile {
  id: string;
  bio?: string;
  licenseNumber?: string;
  specialties: string[];
  serviceRadiusKm: number;
}

export interface User {
  id: string;
  email: string;
  role: "CONSUMER" | "VET_INDIVIDUAL" | "CLINIC_ADMIN" | "CLINIC_EMP";
  profile?: {
    id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
  };
  freelancerProfile?: FreelancerProfile;
  pets?: {
    id: string;
    name: string;
    species: string;
    breed?: string;
    birthDate?: string;
    weight?: number;
    imageUrl?: string;
  }[];
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setTokens: (token: string, refreshToken: string) => void;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setTokens: (token: string, refreshToken: string) => {
        localStorage.setItem("auth-token", token);
        localStorage.setItem("refresh-token", refreshToken);
        set({
          token,
          refreshToken,
          isAuthenticated: true,
        });
      },

      login: (token: string, refreshToken: string, user: User) => {
        localStorage.setItem("auth-token", token);
        localStorage.setItem("refresh-token", refreshToken);
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("refresh-token");
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("auth-token");
};

// Helper function to get refresh token
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh-token");
};

// Helper function to check if user has specific role
export const hasRole = (role: string): boolean => {
  const user = useAuthStore.getState().user;
  return user?.role === role;
};
