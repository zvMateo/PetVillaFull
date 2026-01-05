import { useAuthStore } from "../stores/authStore";

export const useAuth = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading: false,
    login: () => {}, // Login is handled by LoginForm component
    logout,
  };
};
