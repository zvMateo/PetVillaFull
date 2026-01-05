import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Calendar,
  PawPrint,
  Star,
  Users,
  Settings,
  Heart,
  TrendingUp,
  Activity,
  MapPin,
  Clock,
  FileText,
  Award,
  Building,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  roles?: string[];
  description?: string;
}

const RoleBasedNavigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (!isAuthenticated || !user) return null;

  const getNavigationItems = (): NavigationItem[] => {
    const commonItems: NavigationItem[] = [
      {
        label: "Inicio",
        href: "/",
        icon: <Home className="w-5 h-5" />,
        description: "Panel principal",
      },
      {
        label: "Perfil",
        href: "/profile",
        icon: <User className="w-5 h-5" />,
        description: "Mi perfil",
      },
    ];

    const consumerItems: NavigationItem[] = [
      ...commonItems,
      {
        label: "Buscar Veterinarios",
        href: "/clinics",
        icon: <MapPin className="w-5 h-5" />,
        description: "Encuentra clínicas cerca",
      },
      {
        label: "Veterinarios Independientes",
        href: "/freelancers",
        icon: <Users className="w-5 h-5" />,
        description: "Profesionales a domicilio",
      },
      {
        label: "Mis Citas",
        href: "/appointments",
        icon: <Calendar className="w-5 h-5" />,
        description: "Gestiona tus citas",
      },
      {
        label: "Mis Mascotas",
        href: "/pets",
        icon: <PawPrint className="w-5 h-5" />,
        description: "Registra y gestiona mascotas",
      },
      {
        label: "Favoritos",
        href: "/favorites",
        icon: <Heart className="w-5 h-5" />,
        description: "Veterinarios guardados",
      },
      {
        label: "Mis Puntos",
        href: "/points",
        icon: <Award className="w-5 h-5" />,
        badge: "Nuevo",
        description: "Canjea beneficios",
      },
    ];

    const vetIndividualItems: NavigationItem[] = [
      ...commonItems,
      {
        label: "Mis Citas",
        href: "/appointments",
        icon: <Calendar className="w-5 h-5" />,
        description: "Gestiona tus citas",
      },
      {
        label: "Mi Perfil Profesional",
        href: "/vet-profile",
        icon: <User className="w-5 h-5" />,
        description: "Configura tu perfil",
      },
      {
        label: "Disponibilidad",
        href: "/availability",
        icon: <Clock className="w-5 h-5" />,
        description: "Gestiona tu horario",
      },
      {
        label: "Mis Servicios",
        href: "/services",
        icon: <FileText className="w-5 h-5" />,
        description: "Ofrece servicios",
      },
      {
        label: "Reseñas",
        href: "/reviews",
        icon: <Star className="w-5 h-5" />,
        badge: "5",
        description: "Opiniones de clientes",
      },
      {
        label: "Estadísticas",
        href: "/analytics",
        icon: <TrendingUp className="w-5 h-5" />,
        description: "Métricas de rendimiento",
      },
    ];

    const clinicAdminItems: NavigationItem[] = [
      ...commonItems,
      {
        label: "Panel de Clínica",
        href: "/clinic-dashboard",
        icon: <Building className="w-5 h-5" />,
        description: "Gestión general",
      },
      {
        label: "Empleados",
        href: "/employees",
        icon: <Users className="w-5 h-5" />,
        badge: "3",
        description: "Gestiona tu equipo",
      },
      {
        label: "Citas",
        href: "/appointments",
        icon: <Calendar className="w-5 h-5" />,
        description: "Todas las citas",
      },
      {
        label: "Servicios",
        href: "/services",
        icon: <FileText className="w-5 h-5" />,
        description: "Catálogo de servicios",
      },
      {
        label: "Disponibilidad",
        href: "/availability",
        icon: <Clock className="w-5 h-5" />,
        description: "Horarios de atención",
      },
      {
        label: "Reportes",
        href: "/reports",
        icon: <Activity className="w-5 h-5" />,
        description: "Informes y análisis",
      },
      {
        label: "Configuración",
        href: "/settings",
        icon: <Settings className="w-5 h-5" />,
        description: "Configuración de clínica",
      },
    ];

    const clinicEmpItems: NavigationItem[] = [
      ...commonItems,
      {
        label: "Mis Citas",
        href: "/appointments",
        icon: <Calendar className="w-5 h-5" />,
        description: "Mis asignaciones",
      },
      {
        label: "Horarios",
        href: "/schedule",
        icon: <Clock className="w-5 h-5" />,
        description: "Mi disponibilidad",
      },
      {
        label: "Perfil",
        href: "/profile",
        icon: <User className="w-5 h-5" />,
        description: "Mi información",
      },
    ];

    switch (user.role) {
      case "CONSUMER":
        return consumerItems;
      case "VET_INDIVIDUAL":
        return vetIndividualItems;
      case "CLINIC_ADMIN":
        return clinicAdminItems;
      case "CLINIC_EMP":
        return clinicEmpItems;
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleTheme = () => {
    switch (user.role) {
      case "CONSUMER":
        return "pet-consumer-theme";
      case "VET_INDIVIDUAL":
        return "pet-vet-theme";
      case "CLINIC_ADMIN":
      case "CLINIC_EMP":
        return "pet-clinic-theme";
      default:
        return "";
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case "CONSUMER":
        return "Dueño de Mascota";
      case "VET_INDIVIDUAL":
        return "Veterinario";
      case "CLINIC_ADMIN":
        return "Administrador";
      case "CLINIC_EMP":
        return "Empleado";
      default:
        return "Usuario";
    }
  };

  const NavigationLink = ({ item }: { item: NavigationItem }) => {
    const isActive = location.pathname === item.href;

    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
          isActive
            ? "bg-pet-primary text-white shadow-md"
            : "text-pet-neutral-700 hover:bg-pet-neutral-100 hover:text-pet-primary"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <span
          className={cn(
            "transition-transform duration-200",
            !isActive && "group-hover:scale-110"
          )}
        >
          {item.icon}
        </span>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <Badge
                variant={isActive ? "secondary" : "default"}
                className={cn(
                  "text-xs",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-pet-primary text-white"
                )}
              >
                {item.badge}
              </Badge>
            )}
          </div>

          {item.description && (
            <p
              className={cn(
                "text-xs mt-1",
                isActive ? "text-white/80" : "text-pet-neutral-500"
              )}
            >
              {item.description}
            </p>
          )}
        </div>

        {/* Active indicator */}
        {isActive && (
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        )}
      </Link>
    );
  };

  return (
    <div className={cn("min-h-screen bg-pet-neutral-50", getRoleTheme())}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-80 lg:overflow-y-auto lg:bg-white lg:border-r lg:border-pet-neutral-200">
        <div className="flex h-full flex-col">
          {/* Logo and Brand */}
          <div className="flex h-16 items-center gap-3 px-6 border-b border-pet-neutral-200">
            <div className="w-10 h-10 bg-pet-primary rounded-lg flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-pet-neutral-900">
                PetVilla
              </h1>
              <p className="text-xs text-pet-neutral-500">{getRoleLabel()}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-pet-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pet-primary to-pet-primary-dark rounded-full flex items-center justify-center text-white font-bold">
                {user.profile?.firstName?.[0]}
                {user.profile?.lastName?.[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-pet-neutral-900">
                  {user.profile?.firstName} {user.profile?.lastName}
                </p>
                <p className="text-sm text-pet-neutral-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavigationLink key={item.href} item={item} />
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-pet-neutral-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-pet-neutral-700 hover:text-pet-error hover:bg-pet-error/10"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white border-b border-pet-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pet-primary rounded-lg flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-pet-neutral-900">
                PetVilla
              </h1>
              <p className="text-xs text-pet-neutral-500">{getRoleLabel()}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
              <div className="flex h-full flex-col">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-pet-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pet-primary rounded-lg flex items-center justify-center">
                      <PawPrint className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-pet-neutral-900">
                      PetVilla
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Mobile User Info */}
                <div className="p-4 border-b border-pet-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pet-primary to-pet-primary-dark rounded-full flex items-center justify-center text-white font-bold">
                      {user.profile?.firstName?.[0]}
                      {user.profile?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-pet-neutral-900">
                        {user.profile?.firstName} {user.profile?.lastName}
                      </p>
                      <p className="text-sm text-pet-neutral-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {navigationItems.map((item) => (
                    <NavigationLink key={item.href} item={item} />
                  ))}
                </nav>

                {/* Mobile Logout */}
                <div className="p-4 border-t border-pet-neutral-200">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-pet-neutral-700 hover:text-pet-error hover:bg-pet-error/10"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleBasedNavigation;
