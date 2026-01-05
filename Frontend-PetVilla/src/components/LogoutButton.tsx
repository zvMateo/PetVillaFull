import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";

export const LogoutButton = () => {
  const { logout, isLoading } = useAuth();

  return (
    <Button onClick={() => logout()} disabled={isLoading}>
      Cerrar Sesión
    </Button>
  );
};
