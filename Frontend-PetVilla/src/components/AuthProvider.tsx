import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import api from "../lib/api";
import { Loader2 } from "lucide-react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { login, isAuthenticated, setLoading } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("auth-token");
      const storedRefreshToken = localStorage.getItem("refresh-token");

      if (storedToken && storedRefreshToken && !isAuthenticated) {
        setLoading(true);
        try {
          // Validate token by fetching user data
          const res = await api.get("/auth/me");
          const { user } = res.data;
          login(storedToken, storedRefreshToken, user);
        } catch {
          // Token invalid, clear storage
          localStorage.removeItem("auth-token");
          localStorage.removeItem("refresh-token");
        } finally {
          setLoading(false);
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [login, isAuthenticated, setLoading]);

  // Show loading screen while checking authentication
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-pet-primary" />
          <p className="text-gray-500 text-sm">Cargando PetVilla...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
