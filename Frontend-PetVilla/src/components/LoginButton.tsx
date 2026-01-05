import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";

export const LoginButton = () => {
  const { login, isLoading } = useAuth();

  return (
    <Button onClick={() => login()} disabled={isLoading}>
      Iniciar Sesión
    </Button>
  );
};
