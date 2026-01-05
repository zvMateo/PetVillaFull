import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Calendar,
  Star,
  Clock,
  MapPin,
  MessageCircle,
  Settings,
  DollarSign,
  TrendingUp,
  Plus,
  ChevronRight,
  Bell,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  Navigation,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profilesAPI, appointmentsAPI } from "../../lib/api";
import { useAuthStore } from "../../stores/authStore";
import { Header } from "../../components/Header";
import { formatCurrency, formatDate, formatTime } from "../../lib/format";

interface Appointment {
  id: string;
  dateTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  pet?: {
    name: string;
    species: string;
  };
  consumer?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  service?: {
    title: string;
    priceFrom: number;
  };
}

interface FreelancerProfile {
  id: string;
  bio?: string;
  licenseNumber?: string;
  specialties: string[];
  serviceRadiusKm: number;
  services?: {
    id: string;
    title: string;
    priceFrom: number;
    isActive: boolean;
  }[];
}

const FreelancerDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "overview" | "appointments" | "services" | "messages"
  >("overview");

  // Get freelancer profile from user (comes from /auth/me)
  const freelancerProfileFromUser = user?.freelancerProfile;

  // Fetch freelancer services
  const { data: services } = useQuery({
    queryKey: ["my-freelancer-services", freelancerProfileFromUser?.id],
    queryFn: async () => {
      if (!freelancerProfileFromUser?.id) return [];
      const response = await profilesAPI.getMe();
      return response.data?.services || [];
    },
    enabled: !!freelancerProfileFromUser?.id,
  });

  // Fetch appointments (as provider)
  const { data: appointments = [] } = useQuery({
    queryKey: ["my-provider-appointments"],
    queryFn: async () => {
      // This would need a provider-specific endpoint
      const response = await appointmentsAPI.getAll();
      return (response.data || []) as Appointment[];
    },
  });

  // Mock data for demo
  const mockProfile: FreelancerProfile = {
    id: "1",
    bio: "Veterinario con más de 10 años de experiencia especializado en medicina felina y canina.",
    licenseNumber: "MN-12345",
    specialties: ["Medicina Felina", "Dermatología", "Medicina Preventiva"],
    serviceRadiusKm: 15,
    services: [
      {
        id: "1",
        title: "Consulta a Domicilio",
        priceFrom: 18000,
        isActive: true,
      },
      { id: "2", title: "Vacunación", priceFrom: 12000, isActive: true },
      {
        id: "3",
        title: "Control Dermatológico",
        priceFrom: 22000,
        isActive: true,
      },
      { id: "4", title: "Desparasitación", priceFrom: 8000, isActive: false },
    ],
  };

  const mockAppointments: Appointment[] = [
    {
      id: "1",
      dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      status: "CONFIRMED",
      pet: { name: "Luna", species: "DOG" },
      consumer: {
        firstName: "María",
        lastName: "López",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
      },
      service: { title: "Consulta a Domicilio", priceFrom: 18000 },
    },
    {
      id: "2",
      dateTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      status: "PENDING",
      pet: { name: "Max", species: "CAT" },
      consumer: { firstName: "Juan", lastName: "García" },
      service: { title: "Vacunación", priceFrom: 12000 },
    },
    {
      id: "3",
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: "CONFIRMED",
      pet: { name: "Rocky", species: "DOG" },
      consumer: { firstName: "Ana", lastName: "Martínez" },
      service: { title: "Control Dermatológico", priceFrom: 22000 },
    },
  ];

  // Use freelancer profile from user, fallback to mock
  const displayProfile: FreelancerProfile = freelancerProfileFromUser
    ? {
        ...freelancerProfileFromUser,
        specialties: freelancerProfileFromUser.specialties || [],
        services: services || mockProfile.services,
      }
    : mockProfile;
  const displayAppointments =
    appointments.length > 0 ? appointments : mockAppointments;

  const pendingAppointments = displayAppointments.filter(
    (a) => a.status === "PENDING"
  );
  const confirmedAppointments = displayAppointments.filter(
    (a) => a.status === "CONFIRMED"
  );
  const todaysAppointments = displayAppointments.filter((a) => {
    const today = new Date();
    const appointmentDate = new Date(a.dateTime);
    return appointmentDate.toDateString() === today.toDateString();
  });

  // Stats
  const stats = {
    monthlyEarnings: 245000,
    totalAppointments: 48,
    rating: 4.8,
    profileViews: 156,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r min-h-[calc(100vh-64px)] p-4">
          {/* Profile Summary */}
          <div className="flex items-center gap-3 p-3 mb-6">
            <Avatar className="w-12 h-12 border-2 border-pet-primary">
              <AvatarImage src={user?.profile?.avatarUrl} />
              <AvatarFallback className="bg-pet-primary/10 text-pet-primary">
                {user?.profile?.firstName?.[0]}
                {user?.profile?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900">
                Dr. {user?.profile?.firstName}
              </div>
              <div className="text-xs text-pet-primary font-medium">
                VETERINARIO
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            <SidebarButton
              icon={<TrendingUp className="w-5 h-5" />}
              label="Panel General"
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <SidebarButton
              icon={<Calendar className="w-5 h-5" />}
              label="Mis Turnos"
              active={activeTab === "appointments"}
              onClick={() => setActiveTab("appointments")}
              badge={pendingAppointments.length || undefined}
            />
            <SidebarButton
              icon={<Briefcase className="w-5 h-5" />}
              label="Mis Servicios"
              active={activeTab === "services"}
              onClick={() => setActiveTab("services")}
            />
            <SidebarButton
              icon={<MessageCircle className="w-5 h-5" />}
              label="Mensajes"
              active={activeTab === "messages"}
              onClick={() => setActiveTab("messages")}
              badge={3}
            />
          </nav>

          {/* Bottom Actions */}
          <div className="pt-4 border-t space-y-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
            >
              <Settings className="w-5 h-5" />
              Configuración
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ¡Buen día, Dr. {user?.profile?.firstName}!
                </h1>
                <p className="text-gray-600">
                  Tenés {todaysAppointments.length} turnos para hoy
                </p>
              </div>
              <Button className="bg-pet-primary hover:bg-green-600 text-white">
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
              </Button>
            </div>

            {activeTab === "overview" && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard
                    icon={<DollarSign className="w-6 h-6 text-green-600" />}
                    label="Ganancias del Mes"
                    value={formatCurrency(stats.monthlyEarnings)}
                    trend="+12%"
                    trendUp
                  />
                  <StatCard
                    icon={<Calendar className="w-6 h-6 text-blue-600" />}
                    label="Turnos Este Mes"
                    value={stats.totalAppointments.toString()}
                    trend="+8"
                    trendUp
                  />
                  <StatCard
                    icon={<Star className="w-6 h-6 text-yellow-500" />}
                    label="Calificación"
                    value={stats.rating.toString()}
                    subtext="⭐ 32 reseñas"
                  />
                  <StatCard
                    icon={<Eye className="w-6 h-6 text-purple-600" />}
                    label="Vistas del Perfil"
                    value={stats.profileViews.toString()}
                    trend="+23%"
                    trendUp
                  />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left Column - Appointments */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Pending Approvals */}
                    {pendingAppointments.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <h2 className="font-semibold text-yellow-800">
                            Turnos Pendientes de Confirmación
                          </h2>
                        </div>
                        <div className="space-y-3">
                          {pendingAppointments.map((apt) => (
                            <PendingAppointmentCard
                              key={apt.id}
                              appointment={apt}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Today's Schedule */}
                    <div className="bg-white rounded-2xl border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Turnos de Hoy
                        </h2>
                        <Link
                          to="/appointments"
                          className="text-pet-primary text-sm font-medium hover:underline"
                        >
                          Ver Todos
                        </Link>
                      </div>
                      {confirmedAppointments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No tenés turnos confirmados para hoy</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {confirmedAppointments.slice(0, 3).map((apt) => (
                            <AppointmentRow key={apt.id} appointment={apt} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Profile Completeness */}
                    <div className="bg-white rounded-2xl border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                          Tu Perfil
                        </h3>
                        <Link to="/profile">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        </Link>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Matrícula</span>
                          <span className="font-medium">
                            {displayProfile.licenseNumber}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Radio de Cobertura
                          </span>
                          <span className="font-medium flex items-center gap-1">
                            <Navigation className="w-4 h-4 text-pet-primary" />
                            {displayProfile.serviceRadiusKm} km
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {displayProfile.specialties.map((s, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Acciones Rápidas
                      </h3>
                      <div className="space-y-2">
                        <QuickActionButton
                          icon={<Plus className="w-5 h-5" />}
                          label="Agregar Servicio"
                          onClick={() => setActiveTab("services")}
                        />
                        <QuickActionButton
                          icon={<Clock className="w-5 h-5" />}
                          label="Gestionar Horarios"
                          onClick={() => {}}
                        />
                        <QuickActionButton
                          icon={<MapPin className="w-5 h-5" />}
                          label="Actualizar Zona"
                          onClick={() => {}}
                        />
                      </div>
                    </div>

                    {/* Messages Preview */}
                    <div className="bg-white rounded-2xl border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                          Mensajes
                        </h3>
                        <Badge className="bg-red-100 text-red-700">
                          3 nuevos
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <MessagePreview
                          name="María López"
                          message="Hola, quería consultar sobre..."
                          time="hace 5 min"
                          avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop"
                        />
                        <MessagePreview
                          name="Juan García"
                          message="Gracias por la atención de ayer"
                          time="hace 1 hora"
                        />
                      </div>
                      <button
                        onClick={() => setActiveTab("messages")}
                        className="w-full mt-4 text-pet-primary text-sm font-medium hover:underline"
                      >
                        Ver todos los mensajes
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "services" && (
              <div className="bg-white rounded-2xl border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Mis Servicios
                  </h2>
                  <Button className="bg-pet-primary hover:bg-green-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Servicio
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {displayProfile.services?.map((service) => (
                    <div
                      key={service.id}
                      className={`border rounded-xl p-4 ${
                        service.isActive
                          ? "border-gray-200"
                          : "border-dashed border-gray-300 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {service.title}
                        </h3>
                        <Badge
                          className={
                            service.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }
                        >
                          {service.isActive ? "Activo" : "Pausado"}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-4">
                        {formatCurrency(service.priceFrom)}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={
                            service.isActive
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        >
                          {service.isActive ? "Pausar" : "Activar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "appointments" && (
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Todos los Turnos
                </h2>
                <div className="space-y-3">
                  {displayAppointments.map((apt) => (
                    <AppointmentRow
                      key={apt.id}
                      appointment={apt}
                      showActions
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Mensajes
                </h2>
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">
                    Sistema de mensajes
                  </p>
                  <p>
                    Próximamente podrás comunicarte con tus pacientes desde aquí
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-components

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: number;
}

const SidebarButton = ({
  icon,
  label,
  active,
  onClick,
  badge,
}: SidebarButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg font-medium transition-colors ${
      active
        ? "bg-pet-primary text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <span className="flex items-center gap-3">
      {icon}
      {label}
    </span>
    {badge && (
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          active ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
        }`}
      >
        {badge}
      </span>
    )}
  </button>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  subtext?: string;
}

const StatCard = ({
  icon,
  label,
  value,
  trend,
  trendUp,
  subtext,
}: StatCardProps) => (
  <div className="bg-white rounded-2xl border p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {trend && (
        <span
          className={`text-sm font-medium ${
            trendUp ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend}
        </span>
      )}
      {subtext && <span className="text-sm text-gray-500">{subtext}</span>}
    </div>
  </div>
);

interface AppointmentRowProps {
  appointment: Appointment;
  showActions?: boolean;
}

const AppointmentRow = ({ appointment, showActions }: AppointmentRowProps) => {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    CANCELLED: "bg-gray-100 text-gray-500",
  };

  const statusLabels = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
      <Avatar className="w-10 h-10">
        <AvatarImage src={appointment.consumer?.avatarUrl} />
        <AvatarFallback className="bg-pet-primary/10 text-pet-primary">
          {appointment.consumer?.firstName?.[0]}
          {appointment.consumer?.lastName?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {appointment.consumer?.firstName} {appointment.consumer?.lastName}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">{appointment.pet?.name}</span>
        </div>
        <div className="text-sm text-gray-500">
          {appointment.service?.title} • {formatTime(appointment.dateTime)}
        </div>
      </div>
      <Badge className={statusColors[appointment.status]}>
        {statusLabels[appointment.status]}
      </Badge>
      {showActions && appointment.status === "CONFIRMED" && (
        <Button size="sm" variant="outline">
          <CheckCircle className="w-4 h-4 mr-1" />
          Completar
        </Button>
      )}
    </div>
  );
};

interface PendingAppointmentCardProps {
  appointment: Appointment;
}

const PendingAppointmentCard = ({
  appointment,
}: PendingAppointmentCardProps) => (
  <div className="bg-white rounded-xl p-4 flex items-center gap-4">
    <Avatar className="w-10 h-10">
      <AvatarImage src={appointment.consumer?.avatarUrl} />
      <AvatarFallback>{appointment.consumer?.firstName?.[0]}</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="font-medium text-gray-900">
        {appointment.consumer?.firstName} {appointment.consumer?.lastName}
      </div>
      <div className="text-sm text-gray-600">
        {appointment.service?.title} • {formatDate(appointment.dateTime)}{" "}
        {formatTime(appointment.dateTime)}
      </div>
    </div>
    <div className="flex gap-2">
      <Button
        size="sm"
        className="bg-pet-primary hover:bg-green-600 text-white"
      >
        <CheckCircle className="w-4 h-4 mr-1" />
        Confirmar
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-red-600 border-red-200 hover:bg-red-50"
      >
        <XCircle className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const QuickActionButton = ({
  icon,
  label,
  onClick,
}: QuickActionButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
  >
    <span className="flex items-center gap-3">
      {icon}
      <span className="font-medium">{label}</span>
    </span>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </button>
);

interface MessagePreviewProps {
  name: string;
  message: string;
  time: string;
  avatar?: string;
}

const MessagePreview = ({
  name,
  message,
  time,
  avatar,
}: MessagePreviewProps) => (
  <div className="flex items-center gap-3">
    <Avatar className="w-10 h-10">
      <AvatarImage src={avatar} />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900">{name}</span>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-600 truncate">{message}</p>
    </div>
  </div>
);

export default FreelancerDashboard;
