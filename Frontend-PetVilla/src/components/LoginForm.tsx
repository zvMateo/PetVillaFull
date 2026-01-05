import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import api from "../lib/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Register
        const res = await api.post("/auth/register", {
          email,
          password,
          role: "CONSUMER",
        });
        const { user, access_token, refresh_token } = res.data;
        login(access_token, refresh_token, user);
      } else {
        // Login
        const res = await api.post("/auth/login", { email, password });
        const { access_token, refresh_token } = res.data;
        // Get user info
        const userRes = await api.get("/auth/me");
        const { user } = userRes.data;
        login(access_token, refresh_token, user);
      }
    } catch (error) {
      console.error(error);
      alert("Error en la autenticación");
    }
  };

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>{isRegister ? "Registrarse" : "Iniciar Sesión"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <Button type="submit" className="w-full">
            {isRegister ? "Registrarse" : "Iniciar Sesión"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
