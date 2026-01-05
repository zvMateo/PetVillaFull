import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  PawPrint,
  Star,
  MapPin,
  Clock,
  Heart,
  Users,
  FileText,
} from "lucide-react";

// Base Empty State Component
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = "",
  size = "md",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline";
  };
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-20",
  };

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  return (
    <div
      className={cn(
        "pet-empty-state text-center",
        sizeClasses[size],
        className
      )}
    >
      <div
        className={cn(
          "pet-empty-state-icon mx-auto mb-4 text-pet-neutral-400",
          iconSizes[size]
        )}
      >
        {icon}
      </div>

      <h3
        className={cn(
          "pet-empty-state-title",
          size === "sm" && "text-lg",
          size === "md" && "text-xl",
          size === "lg" && "text-2xl",
          size === "xl" && "text-3xl"
        )}
      >
        {title}
      </h3>

      <p className="pet-empty-state-description max-w-md mx-auto">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          <Button
            onClick={action.onClick}
            variant={
              action.variant === "secondary"
                ? "secondary"
                : action.variant === "outline"
                ? "outline"
                : "default"
            }
            className="pet-button-primary"
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

// Specific Empty States

// No Results Empty State
export const NoResultsEmpty = ({
  query,
  onClear,
  className = "",
}: {
  query: string;
  onClear: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Search className="w-full h-full" />}
      title="No se encontraron resultados"
      description={`No hay resultados para "${query}". Intenta con otros términos de búsqueda.`}
      action={{
        label: "Limpiar búsqueda",
        onClick: onClear,
        variant: "outline",
      }}
      className={className}
    />
  );
};

// No Appointments Empty State
export const NoAppointmentsEmpty = ({
  onBookAppointment,
  className = "",
}: {
  onBookAppointment: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Calendar className="w-full h-full" />}
      title="No tienes citas agendadas"
      description="Agenda tu primera cita veterinaria y mantén a tu mascota saludable y feliz."
      action={{
        label: "Agendar cita",
        onClick: onBookAppointment,
      }}
      className={className}
    />
  );
};

// No Pets Empty State
export const NoPetsEmpty = ({
  onAddPet,
  className = "",
}: {
  onAddPet: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<PawPrint className="w-full h-full" />}
      title="No has registrado mascotas"
      description="Registra a tus mascotas para poder agendar citas y recibir atención veterinaria personalizada."
      action={{
        label: "Registrar mascota",
        onClick: onAddPet,
      }}
      className={className}
    />
  );
};

// No Reviews Empty State
export const NoReviewsEmpty = ({
  onLeaveReview,
  className = "",
}: {
  onLeaveReview: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Star className="w-full h-full" />}
      title="No hay reseñas aún"
      description="Sé el primero en compartir tu experiencia y ayudar a otros dueños de mascotas."
      action={{
        label: "Dejar reseña",
        onClick: onLeaveReview,
      }}
      className={className}
    />
  );
};

// No Clinics Empty State
export const NoClinicsEmpty = ({
  onSearchAgain,
  className = "",
}: {
  onSearchAgain: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<MapPin className="w-full h-full" />}
      title="No hay clínicas en esta zona"
      description="Intenta ampliar tu búsqueda o busca en otra ubicación para encontrar clínicas veterinarias cercanas."
      action={{
        label: "Buscar en otra zona",
        onClick: onSearchAgain,
      }}
      className={className}
    />
  );
};

// No Freelancers Empty State
export const NoFreelancersEmpty = ({
  onSearchAgain,
  className = "",
}: {
  onSearchAgain: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Users className="w-full h-full" />}
      title="No hay veterinarios independientes"
      description="No encontramos veterinarios independientes en esta área. Intenta buscar clínicas veterinarias."
      action={{
        label: "Buscar clínicas",
        onClick: onSearchAgain,
      }}
      className={className}
    />
  );
};

// No Favorites Empty State
export const NoFavoritesEmpty = ({
  onExplore,
  className = "",
}: {
  onExplore: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Heart className="w-full h-full" />}
      title="No tienes favoritos"
      description="Guarda tus veterinarios y clínicas favoritas para acceder rápidamente a ellos."
      action={{
        label: "Explorar veterinarios",
        onClick: onExplore,
      }}
      className={className}
    />
  );
};

// No Notifications Empty State
export const NoNotificationsEmpty = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Clock className="w-full h-full" />}
      title="No hay notificaciones"
      description="Te notificaremos sobre tus citas próximas y actualizaciones importantes."
      size="sm"
      className={className}
    />
  );
};

// No History Empty State
export const NoHistoryEmpty = ({ className = "" }: { className?: string }) => {
  return (
    <EmptyState
      icon={<FileText className="w-full h-full" />}
      title="No hay historial"
      description="Tu historial de citas y actividades aparecerá aquí."
      size="sm"
      className={className}
    />
  );
};

// No Points Empty State
export const NoPointsEmpty = ({
  onEarnPoints,
  className = "",
}: {
  onEarnPoints: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Star className="w-full h-full" />}
      title="No tienes puntos acumulados"
      description="Completa citas para ganar puntos y canjearlos por descuentos y beneficios."
      action={{
        label: "Agendar cita",
        onClick: onEarnPoints,
      }}
      className={className}
    />
  );
};

// Network Error Empty State
export const NetworkErrorEmpty = ({
  onRetry,
  className = "",
}: {
  onRetry: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Search className="w-full h-full" />}
      title="Error de conexión"
      description="No pudimos cargar la información. Revisa tu conexión a internet e intenta nuevamente."
      action={{
        label: "Reintentar",
        onClick: onRetry,
        variant: "outline",
      }}
      className={className}
    />
  );
};

// Server Error Empty State
export const ServerErrorEmpty = ({
  onRetry,
  className = "",
}: {
  onRetry: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Clock className="w-full h-full" />}
      title="Error del servidor"
      description="Estamos experimentando problemas técnicos. Por favor, intenta nuevamente en unos minutos."
      action={{
        label: "Reintentar",
        onClick: onRetry,
        variant: "outline",
      }}
      className={className}
    />
  );
};

// Not Found Empty State
export const NotFoundEmpty = ({
  onGoHome,
  className = "",
}: {
  onGoHome: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Search className="w-full h-full" />}
      title="Página no encontrada"
      description="La página que buscas no existe o ha sido movida."
      action={{
        label: "Ir al inicio",
        onClick: onGoHome,
        variant: "outline",
      }}
      size="lg"
      className={className}
    />
  );
};

// Unauthorized Empty State
export const UnauthorizedEmpty = ({
  onLogin,
  className = "",
}: {
  onLogin: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Users className="w-full h-full" />}
      title="Acceso denegado"
      description="Necesitas iniciar sesión para acceder a esta página."
      action={{
        label: "Iniciar sesión",
        onClick: onLogin,
      }}
      size="lg"
      className={className}
    />
  );
};

// Maintenance Empty State
export const MaintenanceEmpty = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<Clock className="w-full h-full" />}
      title="Sitio en mantenimiento"
      description="Estamos mejorando la plataforma para darte un mejor servicio. Vuelve pronto."
      size="lg"
      className={className}
    />
  );
};

// Mobile App Prompts
export const MobileAppPrompt = ({
  onDownload,
  className = "",
}: {
  onDownload: () => void;
  className?: string;
}) => {
  return (
    <EmptyState
      icon={<PawPrint className="w-full h-full" />}
      title="Descarga la app móvil"
      description="Lleva PetVilla contigo y gestiona las citas de tus mascotas desde cualquier lugar."
      action={{
        label: "Descargar app",
        onClick: onDownload,
      }}
      size="sm"
      className={className}
    />
  );
};
