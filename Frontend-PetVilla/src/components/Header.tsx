import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuthStore } from "../stores/authStore";
import { Menu, X, Bell, PawPrint } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  // Authenticated Header (VetConnect Dashboard Style)
  if (isAuthenticated) {
    return (
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pet-primary rounded-lg flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PetVilla</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "text-pet-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/appointments"
                className={`text-sm font-medium transition-colors ${
                  isActive("/appointments")
                    ? "text-pet-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mis Turnos
              </Link>
              <Link
                to="/clinics"
                className={`text-sm font-medium transition-colors ${
                  isActive("/clinics")
                    ? "text-pet-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Buscar Veterinaria
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pet-error rounded-full"></span>
              </button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 focus:outline-none">
                    <Avatar className="w-9 h-9 border-2 border-pet-primary/20">
                      <AvatarImage src={user?.profile?.avatarUrl} />
                      <AvatarFallback className="bg-pet-primary/10 text-pet-primary font-medium">
                        {user?.profile?.firstName?.[0]}
                        {user?.profile?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium text-gray-900">
                      {user?.profile?.firstName} {user?.profile?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/pets")}>
                    Mis Mascotas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/appointments")}>
                    Mis Turnos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4 space-y-3 animate-in slide-in-from-top-2">
              <Link
                to="/"
                className="block py-2 text-gray-600 hover:text-pet-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/appointments"
                className="block py-2 text-gray-600 hover:text-pet-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Mis Turnos
              </Link>
              <Link
                to="/clinics"
                className="block py-2 text-gray-600 hover:text-pet-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Buscar Veterinaria
              </Link>
              <Link
                to="/pets"
                className="block py-2 text-gray-600 hover:text-pet-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Mis Mascotas
              </Link>
              <Link
                to="/profile"
                className="block py-2 text-gray-600 hover:text-pet-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Mi Perfil
              </Link>
              <hr className="my-3" />
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-red-600 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>
    );
  }

  // Public Header (VetConnect Landing Style)
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pet-primary rounded-lg flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PetVilla</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/clinics"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Características
            </Link>
            <Link
              to="/freelancers"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Para Veterinarios
            </Link>
            <Link
              to="/clinics"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Para Dueños
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button
              asChild
              className="bg-pet-primary hover:bg-pet-primary-dark text-white font-medium px-5 rounded-full"
            >
              <Link to="/register">Registrarse</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-3 animate-in slide-in-from-top-2">
            <Link
              to="/clinics"
              className="block py-2 text-gray-600 hover:text-pet-primary font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Características
            </Link>
            <Link
              to="/freelancers"
              className="block py-2 text-gray-600 hover:text-pet-primary font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Para Veterinarios
            </Link>
            <Link
              to="/clinics"
              className="block py-2 text-gray-600 hover:text-pet-primary font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Para Dueños
            </Link>
            <hr className="my-3" />
            <Link
              to="/login"
              className="block py-2 text-gray-600 hover:text-pet-primary font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="block w-full text-center py-3 bg-pet-primary text-white rounded-full font-medium hover:bg-pet-primary-dark transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
