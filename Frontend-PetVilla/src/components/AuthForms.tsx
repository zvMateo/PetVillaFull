import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useAuthStore } from "../stores/authStore";
import { authAPI, profilesAPI } from "../lib/api";
import { toast } from "sonner";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  PawPrint,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  Star,
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Ingresá un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresá un correo electrónico válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["CONSUMER", "VET_INDIVIDUAL"]),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "Debés aceptar los términos y condiciones",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export const AuthForms = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "CONSUMER" | "VET_INDIVIDUAL"
  >("CONSUMER");
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "CONSUMER",
      agreeToTerms: false,
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Step 1: Login to get tokens
      const response = await authAPI.login(data.email, data.password);
      const { access_token, refresh_token } = response.data;

      // Step 2: Set tokens first so subsequent requests are authenticated
      useAuthStore.getState().setTokens(access_token, refresh_token);

      // Step 3: Fetch user data from /auth/me
      const userResponse = await authAPI.me();
      // Backend returns { user: { id, email, role, profile, pets, freelancerProfile } }
      const { user } = userResponse.data;

      // Step 4: Complete login with user data
      login(access_token, refresh_token, user);
      toast.success("¡Bienvenido de nuevo!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Correo o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Step 1: Register user (only email, password, role)
      const registerData = {
        email: data.email,
        password: data.password,
        role: selectedRole,
      };
      const registerResponse = await authAPI.register(registerData);
      const { user, access_token, refresh_token } = registerResponse.data;

      // Step 2: Parse name from fullName
      const nameParts = data.fullName.trim().split(" ");
      const firstName = nameParts[0];
      // If no lastName provided, use firstName as lastName to satisfy backend requirement
      const lastName = nameParts.slice(1).join(" ") || firstName;

      // Set tokens first so the profile request is authenticated
      login(access_token, refresh_token, user);

      // Step 3: Create profile with userId, firstName, lastName
      try {
        await profilesAPI.createWithUserId({
          userId: user.id,
          firstName,
          lastName,
        });
        // Update local user state with profile
        const updatedUser = {
          ...user,
          profile: { id: user.id, firstName, lastName },
        };
        login(access_token, refresh_token, updatedUser);
      } catch (profileError) {
        console.warn("Profile creation skipped:", profileError);
        // Profile creation is optional, don't block registration
      }

      toast.success("¡Cuenta creada exitosamente!");
      navigate("/");
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Error al crear la cuenta. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image & Testimonial */}
      <div className="hidden lg:flex lg:w-1/2 bg-pet-secondary relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=1200&fit=crop"
            alt="Veterinarian"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-t from-pet-secondary via-pet-secondary/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end p-12">
          <div className="mb-8">
            <div className="w-12 h-12 bg-pet-primary rounded-xl flex items-center justify-center mb-6">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Conectá con los mejores veterinarios cerca tuyo.
            </h2>
            <p className="text-lg text-white/80">
              Sumate a la comunidad más grande de dueños de mascotas y
              profesionales veterinarios. Sacá turnos, consultá y compartí tu
              experiencia.
            </p>
          </div>

          {/* Social Proof */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
            </div>
            <p className="text-white/90 text-sm">
              +10.000 Dueños de Mascotas confían en nosotros
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 lg:p-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pet-primary rounded-lg flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PetVilla</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className={`text-sm font-medium ${
                isLoginPage
                  ? "text-pet-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className={`text-sm font-medium ${
                !isLoginPage
                  ? "text-pet-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Registrarse
            </Link>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-8">
          <div className="w-full max-w-md">
            {isLoginPage ? (
              /* Login Form */
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Hola de nuevo!
                </h1>
                <p className="text-gray-600 mb-8">
                  Iniciá sesión en tu cuenta de PetVilla.
                </p>

                <form
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-5"
                >
                  <div>
                    <Label htmlFor="email" className="text-gray-700">
                      Correo Electrónico
                    </Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        className="pl-10 h-12 rounded-lg border-gray-200"
                        {...loginForm.register("email")}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-700">
                      Contraseña
                    </Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingresá tu contraseña"
                        className="pl-10 pr-10 h-12 rounded-lg border-gray-200"
                        {...loginForm.register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox id="remember" />
                      <span className="text-sm text-gray-600">Recordarme</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-pet-primary hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-pet-primary hover:bg-pet-primary-dark text-white font-medium rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>

                {/* <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        O CONTINUAR CON
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button variant="outline" className="h-12 rounded-lg">
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5 mr-2"
                      />
                      Google
                    </Button>
                    <Button variant="outline" className="h-12 rounded-lg">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                        />
                      </svg>
                      Apple
                    </Button>
                  </div>
                </div> */}

                <p className="text-center text-sm text-gray-600 mt-8">
                  ¿No tenés una cuenta?{" "}
                  <Link
                    to="/register"
                    className="text-pet-primary font-medium hover:underline"
                  >
                    Registrate
                  </Link>
                </p>
              </div>
            ) : (
              /* Register Form */
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Creá tu cuenta
                </h1>
                <p className="text-gray-600 mb-8">
                  Empezá tu camino con PetVilla hoy.
                </p>

                {/* Role Selector */}
                <div className="mb-6">
                  <Label className="text-gray-700 mb-3 block">SOY...</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole("CONSUMER");
                        registerForm.setValue("role", "CONSUMER");
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        selectedRole === "CONSUMER"
                          ? "border-pet-primary bg-pet-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedRole === "CONSUMER"
                            ? "bg-pet-primary/10 text-pet-primary"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900">
                        Dueño de Mascota
                      </span>
                      {selectedRole === "CONSUMER" && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-pet-primary rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole("VET_INDIVIDUAL");
                        registerForm.setValue("role", "VET_INDIVIDUAL");
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        selectedRole === "VET_INDIVIDUAL"
                          ? "border-pet-primary bg-pet-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedRole === "VET_INDIVIDUAL"
                            ? "bg-pet-primary/10 text-pet-primary"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900">
                        Veterinario
                      </span>
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={registerForm.handleSubmit(handleRegister)}
                  className="space-y-5"
                >
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700">
                      Nombre Completo
                    </Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="ej. Juan Pérez"
                        className="pl-10 h-12 rounded-lg border-gray-200"
                        {...registerForm.register("fullName")}
                      />
                    </div>
                    {registerForm.formState.errors.fullName && (
                      <p className="text-sm text-red-500 mt-1">
                        {registerForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="reg-email" className="text-gray-700">
                      Correo Electrónico
                    </Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        className="pl-10 h-12 rounded-lg border-gray-200"
                        {...registerForm.register("email")}
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="reg-password" className="text-gray-700">
                      Contraseña
                    </Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Creá una contraseña"
                        className="pl-10 pr-10 h-12 rounded-lg border-gray-200"
                        {...registerForm.register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Debe tener al menos 8 caracteres
                    </p>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      className="mt-0.5"
                      onCheckedChange={(checked) =>
                        registerForm.setValue(
                          "agreeToTerms",
                          checked as boolean
                        )
                      }
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      Acepto los{" "}
                      <Link
                        to="/terms"
                        className="text-pet-primary hover:underline"
                      >
                        Términos de Servicio
                      </Link>{" "}
                      y la{" "}
                      <Link
                        to="/privacy"
                        className="text-pet-primary hover:underline"
                      >
                        Política de Privacidad
                      </Link>
                      .
                    </label>
                  </div>
                  {registerForm.formState.errors.agreeToTerms && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.agreeToTerms.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-pet-primary hover:bg-pet-primary-dark text-white font-medium rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </form>

                {/* <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        O CONTINUAR CON
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button variant="outline" className="h-12 rounded-lg">
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5 mr-2"
                      />
                      Google
                    </Button>
                    <Button variant="outline" className="h-12 rounded-lg">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                        />
                      </svg>
                      Apple
                    </Button>
                  </div>
                </div> */}

                <p className="text-center text-sm text-gray-600 mt-8">
                  ¿Ya tenés una cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-pet-primary font-medium hover:underline"
                  >
                    Iniciá Sesión
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
