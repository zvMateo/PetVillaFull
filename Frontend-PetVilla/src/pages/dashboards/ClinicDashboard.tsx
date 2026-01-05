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
  Users,
  TrendingUp,
  Plus,
  Bell,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  Building2,
  UserPlus,
  BarChart3,
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

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
}

interface ClinicProfile {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  is24Hours: boolean;
  imageUrl?: string;
  services?: {
    id: string;
    title: string;
    priceFrom: number;
    isActive: boolean;
  }[];
  members?: TeamMember[];
}

const ClinicDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "overview" | "appointments" | "services" | "team" | "messages"
  >("overview");

  // Fetch clinic profile
  const { data: profile } = useQuery({
    queryKey: ["my-clinic-profile"],
    queryFn: async () => {
      const response = await profilesAPI.getMe();
      return response.data as ClinicProfile;
    },
  });

  // Fetch appointments
  const { data: appointments = [] } = useQuery({
    queryKey: ["clinic-appointments"],
    queryFn: async () => {
      const response = await appointmentsAPI.getAll();
      return (response.data || []) as Appointment[];
    },
  });

  // Mock data for demo
  const mockProfile: ClinicProfile = {
    id: "1",
    name: "Veterinaria Patitas Felices",
    description:
      "Clínica veterinaria con más de 15 años de experiencia brindando atención de calidad.",
    address: "Av. Corrientes 1234, CABA",
    phone: "+54 11 4567-8900",
    email: "contacto@patitasfelices.com",
    website: "www.patitasfelices.com",
    is24Hours: false,
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop",
    services: [
      { id: "1", title: "Consulta General", priceFrom: 15000, isActive: true },
      { id: "2", title: "Vacunación", priceFrom: 12000, isActive: true },
      { id: "3", title: "Cirugía Menor", priceFrom: 45000, isActive: true },
      { id: "4", title: "Peluquería", priceFrom: 8000, isActive: true },
      { id: "5", title: "Radiografía", priceFrom: 25000, isActive: false },
    ],
    members: [
      {
        id: "1",
        firstName: "Carlos",
        lastName: "Martínez",
        role: "Veterinario Principal",
        avatarUrl:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
      },
      {
        id: "2",
        firstName: "María",
        lastName: "González",
        role: "Veterinaria",
        avatarUrl:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
      },
      {
        id: "3",
        firstName: "Juan",
        lastName: "López",
        role: "Peluquero Canino",
      },
    ],
  };

  const mockAppointments: Appointment[] = [
    {
      id: "1",
      dateTime: "2024-12-30T13:00:00Z",
      status: "CONFIRMED",
      pet: { name: "Luna", species: "DOG" },
      consumer: {
        firstName: "Ana",
        lastName: "Rodríguez",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
      },
      service: { title: "Consulta General", priceFrom: 15000 },
    },
    {
      id: "2",
      dateTime: "2024-12-30T15:00:00Z",
      status: "PENDING",
      pet: { name: "Max", species: "CAT" },
      consumer: { firstName: "Pedro", lastName: "Sánchez" },
      service: { title: "Vacunación", priceFrom: 12000 },
    },
    {
      id: "3",
      dateTime: "2024-12-30T17:00:00Z",
      status: "CONFIRMED",
      pet: { name: "Rocky", species: "DOG" },
      consumer: { firstName: "Laura", lastName: "Fernández" },
      service: { title: "Peluquería", priceFrom: 8000 },
    },
    {
      id: "4",
      dateTime: "2024-12-31T10:00:00Z",
      status: "PENDING",
      pet: { name: "Milo", species: "DOG" },
      consumer: { firstName: "Diego", lastName: "Torres" },
      service: { title: "Cirugía Menor", priceFrom: 45000 },
    },
  ];

  const displayProfile = profile || mockProfile;
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
    monthlyEarnings: 890000,
    totalAppointments: 156,
    rating: 4.9,
    newClients: 28,
  };

  const isAdmin = user?.role === "CLINIC_ADMIN";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r min-h-[calc(100vh-64px)] p-4">
          {/* Clinic Info */}
          <div className="flex items-center gap-3 p-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-pet-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-pet-primary" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 truncate max-w-[150px]">
                {displayProfile.name}
              </div>
              <div className="text-xs text-pet-primary font-medium">
                {isAdmin ? "ADMINISTRADOR" : "EMPLEADO"}
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
              label="Turnos"
              active={activeTab === "appointments"}
              onClick={() => setActiveTab("appointments")}
              badge={pendingAppointments.length || undefined}
            />
            <SidebarButton
              icon={<Briefcase className="w-5 h-5" />}
              label="Servicios"
              active={activeTab === "services"}
              onClick={() => setActiveTab("services")}
            />
            {isAdmin && (
              <SidebarButton
                icon={<Users className="w-5 h-5" />}
                label="Equipo"
                active={activeTab === "team"}
                onClick={() => setActiveTab("team")}
              />
            )}
            <SidebarButton
              icon={<MessageCircle className="w-5 h-5" />}
              label="Mensajes"
              active={activeTab === "messages"}
              onClick={() => setActiveTab("messages")}
              badge={5}
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
                  {displayProfile.name} 🏥
                </h1>
                <p className="text-gray-600">
                  {todaysAppointments.length} turnos programados para hoy
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Reportes
                </Button>
                <Button className="bg-pet-primary hover:bg-green-600 text-white">
                  <Bell className="w-4 h-4 mr-2" />
                  Notificaciones
                </Button>
              </div>
            </div>

            {activeTab === "overview" && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard
                    icon={<DollarSign className="w-6 h-6 text-green-600" />}
                    label="Ingresos del Mes"
                    value={formatCurrency(stats.monthlyEarnings)}
                    trend="+18%"
                    trendUp
                  />
                  <StatCard
                    icon={<Calendar className="w-6 h-6 text-blue-600" />}
                    label="Turnos Este Mes"
                    value={stats.totalAppointments.toString()}
                    trend="+24"
                    trendUp
                  />
                  <StatCard
                    icon={<Star className="w-6 h-6 text-yellow-500" />}
                    label="Calificación"
                    value={stats.rating.toString()}
                    subtext="⭐ 89 reseñas"
                  />
                  <StatCard
                    icon={<UserPlus className="w-6 h-6 text-purple-600" />}
                    label="Clientes Nuevos"
                    value={stats.newClients.toString()}
                    trend="+15%"
                    trendUp
                  />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Pending Approvals */}
                    {pendingAppointments.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <h2 className="font-semibold text-yellow-800">
                            {pendingAppointments.length} Turno
                            {pendingAppointments.length > 1 ? "s" : ""}{" "}
                            Pendiente{pendingAppointments.length > 1 ? "s" : ""}{" "}
                            de Confirmación
                          </h2>
                        </div>
                        <div className="space-y-3">
                          {pendingAppointments.slice(0, 3).map((apt) => (
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
                          Agenda del Día
                        </h2>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-1" />
                          Ver Calendario
                        </Button>
                      </div>
                      {confirmedAppointments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No hay turnos confirmados para hoy</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {confirmedAppointments.slice(0, 5).map((apt) => (
                            <AppointmentRow key={apt.id} appointment={apt} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Clinic Profile Card */}
                    <div className="bg-white rounded-2xl border overflow-hidden">
                      <div className="h-24 bg-linear-to-r from-pet-primary to-green-400"></div>
                      <div className="p-6 -mt-12">
                        <div className="w-20 h-20 rounded-xl border-4 border-white bg-white shadow-lg flex items-center justify-center mb-4">
                          {displayProfile.imageUrl ? (
                            <img
                              src={displayProfile.imageUrl}
                              alt={displayProfile.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building2 className="w-10 h-10 text-pet-primary" />
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {displayProfile.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {displayProfile.address}
                        </p>
                        {displayProfile.is24Hours && (
                          <Badge className="mt-2 bg-purple-100 text-purple-700">
                            <Clock className="w-3 h-3 mr-1" />
                            24 Horas
                          </Badge>
                        )}
                        <Link to="/profile" className="block mt-4">
                          <Button variant="outline" className="w-full">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Perfil
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Team Summary */}
                    {displayProfile.members && (
                      <div className="bg-white rounded-2xl border p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">
                            Equipo
                          </h3>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-pet-primary"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Agregar
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {displayProfile.members?.slice(0, 3).map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-3"
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={member.avatarUrl} />
                                <AvatarFallback className="bg-pet-primary/10 text-pet-primary">
                                  {member.firstName[0]}
                                  {member.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {member.firstName} {member.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {member.role}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setActiveTab("team")}
                          className="w-full mt-4 text-pet-primary text-sm font-medium hover:underline"
                        >
                          Ver equipo completo
                        </button>
                      </div>
                    )}

                    {/* Quick Stats */}
                    <div className="bg-linear-to-br from-pet-primary to-green-600 rounded-2xl p-6 text-white">
                      <h3 className="font-semibold mb-4">Esta Semana</h3>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold">23</div>
                          <div className="text-sm text-white/80">Turnos</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold">$248k</div>
                          <div className="text-sm text-white/80">Ingresos</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "services" && (
              <div className="bg-white rounded-2xl border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Servicios de la Clínica
                  </h2>
                  <Button className="bg-pet-primary hover:bg-green-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Servicio
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "team" && isAdmin && (
              <div className="bg-white rounded-2xl border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Equipo de la Clínica
                  </h2>
                  <Button className="bg-pet-primary hover:bg-green-600 text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Agregar Miembro
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayProfile.members?.map((member) => (
                    <div
                      key={member.id}
                      className="border rounded-xl p-4 text-center"
                    >
                      <Avatar className="w-20 h-20 mx-auto mb-3">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="bg-pet-primary/10 text-pet-primary text-xl">
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-gray-900">
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {member.role}
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
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
                    Próximamente podrás comunicarte con tus clientes desde aquí
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

export default ClinicDashboard;
