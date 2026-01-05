import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuthStore } from "../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { petsAPI, appointmentsAPI, usersAPI } from "../lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import {
  PawPrint,
  Calendar,
  Award,
  Heart,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Gift,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  AppointmentsChart,
  PointsChart,
  ServicesPieChart,
  PetActivityChart,
} from "../components/StatsCharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  // Fetch user's data
  const { data: pets = [], isLoading: petsLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const response = await petsAPI.getAll();
      return response.data || [];
    },
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await appointmentsAPI.getMyAppointments({ limit: 5 });
      return response.data || [];
    },
  });

  const { data: userPoints } = useQuery({
    queryKey: ["user-points", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await usersAPI.getPoints(user.id);
      return response.data;
    },
    enabled: !!user?.id,
  });

  const upcomingAppointments = appointments
    .filter(
      (apt: { dateTime: string; status: string }) =>
        new Date(apt.dateTime) > new Date() && apt.status !== "CANCELLED"
    )
    .slice(0, 3);

  const completedAppointments = appointments.filter(
    (apt: { status: string }) => apt.status === "COMPLETED"
  );

  // Calculate points progress to next level
  const currentPoints = userPoints?.total || 0;
  const nextLevelPoints = Math.ceil(currentPoints / 100) * 100;
  const progressPercentage = ((currentPoints % 100) / 100) * 100;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-pet-warning/10 text-pet-warning hover:bg-pet-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge className="bg-pet-info/10 text-pet-info hover:bg-pet-info/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmada
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-pet-success/10 text-pet-success hover:bg-pet-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-pet-error/10 text-pet-error hover:bg-pet-error/20">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 pet-animate-fade-in">
          <h1 className="text-4xl font-bold text-pet-neutral-900 mb-2">
            Mi Panel de Control
          </h1>
          <p className="text-lg text-pet-neutral-600">
            Gestiona tus mascotas, citas y beneficios en un solo lugar
          </p>
        </div>

        {/* Welcome Section */}
        <Card className="mb-8 pet-card bg-linear-to-r from-pet-primary/5 to-pet-secondary/5 border-pet-primary/20 pet-animate-slide-up">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.profile?.avatarUrl} />
                <AvatarFallback className="text-xl bg-pet-primary text-white">
                  {user?.profile?.firstName?.[0]}
                  {user?.profile?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-pet-neutral-900">
                  ¡Hola, {user?.profile?.firstName}!
                </h2>
                <p className="text-pet-neutral-600 text-lg">
                  Bienvenido de vuelta a PetVilla
                </p>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-2 bg-pet-accent/10 px-3 py-2 rounded-full">
                    <Award className="w-5 h-5 text-pet-accent" />
                    <span className="font-semibold text-pet-accent">
                      {currentPoints} puntos
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-pet-primary/10 px-3 py-2 rounded-full">
                    <PawPrint className="w-5 h-5 text-pet-primary" />
                    <span className="font-medium text-pet-primary">
                      {pets.length} mascota{pets.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-pet-success/10 px-3 py-2 rounded-full">
                    <Calendar className="w-5 h-5 text-pet-success" />
                    <span className="font-medium text-pet-success">
                      {completedAppointments.length} cita
                      {completedAppointments.length !== 1 ? "s" : ""} completada
                      {completedAppointments.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="mb-3 bg-pet-primary text-white hover:bg-pet-primary-dark">
                  Nivel {Math.floor(currentPoints / 100) + 1}
                </Badge>
                <div className="w-40">
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-sm text-pet-neutral-600 mt-2">
                    {nextLevelPoints - currentPoints} pts para el siguiente
                    nivel
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Pets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pets Section */}
            <Card className="pet-card pet-animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-pet-neutral-900">
                    <Heart className="w-5 h-5 text-pet-primary" />
                    Mis Mascotas
                  </CardTitle>
                  <CardDescription className="text-pet-neutral-600">
                    Gestiona las mascotas registradas
                  </CardDescription>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="bg-pet-primary hover:bg-pet-primary-dark transition-all duration-200"
                >
                  <Link to="/pets">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Mascota
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {petsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : pets.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {pets.map(
                      (pet: {
                        id: string;
                        name: string;
                        species: string;
                        breed?: string;
                        birthDate?: string;
                        weight?: number;
                        imageUrl?: string;
                      }) => (
                        <Card
                          key={pet.id}
                          className="border-l-4 border-l-primary"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={pet.imageUrl} />
                                <AvatarFallback>
                                  <PawPrint className="w-6 h-6" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{pet.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {pet.species} • {pet.breed || "Sin raza"}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-muted-foreground">
                                {pet.birthDate && (
                                  <span>
                                    {Math.floor(
                                      (new Date().getTime() -
                                        new Date(pet.birthDate).getTime()) /
                                        (1000 * 60 * 60 * 24 * 365)
                                    )}{" "}
                                    años
                                  </span>
                                )}
                                {pet.weight && (
                                  <span className="ml-2">• {pet.weight}kg</span>
                                )}
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/pets/${pet.id}`}>Ver Detalles</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PawPrint className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No tienes mascotas registradas
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Registra tu primera mascota para poder agendar citas
                      veterinarias
                    </p>
                    <Button asChild>
                      <Link to="/pets">
                        <Plus className="w-4 h-4 mr-2" />
                        Registrar Primera Mascota
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Appointments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Citas Recientes
                  </CardTitle>
                  <CardDescription>
                    Tus últimas citas veterinarias
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/appointments">Ver Todas</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments
                      .slice(0, 3)
                      .map(
                        (appointment: {
                          id: string;
                          dateTime: string;
                          status: string;
                          service: { title: string };
                          pet: { name: string };
                        }) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {appointment.service?.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.pet?.name} •{" "}
                                  {format(
                                    new Date(appointment.dateTime),
                                    "PPP",
                                    {
                                      locale: es,
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                        )
                      )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No tienes citas programadas
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Agenda tu primera cita veterinaria
                    </p>
                    <Button asChild>
                      <Link to="/clinics">Buscar Veterinarios</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Points & Stats */}
          <div className="space-y-6">
            {/* Loyalty Points Card */}
            <Card className="bg-linear-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Programa de Fidelidad
                </CardTitle>
                <CardDescription>
                  Acumula puntos con cada cita completada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {currentPoints}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Puntos acumulados
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso al siguiente nivel</span>
                    <span>{Math.floor(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {nextLevelPoints - currentPoints} puntos más para el nivel{" "}
                    {Math.floor(currentPoints / 100) + 2}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium text-sm">
                    Beneficios disponibles:
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span>Descuento 10% (100 pts)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-blue-600" />
                      <span>Consulta gratis (500 pts)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-600" />
                      <span>Producto exclusivo (1000 pts)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {pets.length}
                    </div>
                    <p className="text-xs text-muted-foreground">Mascotas</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {completedAppointments.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Citas completadas
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {upcomingAppointments.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Próximas citas
                    </p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {Math.floor(currentPoints / 100) + 1}
                    </div>
                    <p className="text-xs text-muted-foreground">Nivel</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Próximas Citas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingAppointments.map(
                      (appointment: {
                        id: string;
                        service: { title: string };
                        dateTime: string;
                        status: string;
                      }) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {appointment.service?.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(
                                new Date(appointment.dateTime),
                                "dd/MM/yyyy HH:mm"
                              )}
                            </p>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* ================================================================ */}
        {/* 📊 SECCIÓN DE ESTADÍSTICAS VISUALES */}
        {/* ================================================================ */}
        <div className="mt-10 pet-animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-pet-neutral-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-pet-primary" />
                Estadísticas y Actividad
              </h2>
              <p className="text-pet-neutral-600">
                Visualiza el historial de citas, puntos y servicios utilizados
              </p>
            </div>
          </div>

          {/* Grid de gráficos */}
          <div className="grid gap-6">
            {/* Primera fila - Historial de turnos y evolución de puntos */}
            <div className="grid md:grid-cols-2 gap-6">
              <AppointmentsChart />
              <PointsChart />
            </div>

            {/* Segunda fila - Servicios y actividad por mascota */}
            <div className="grid md:grid-cols-2 gap-6">
              <ServicesPieChart />
              <PetActivityChart />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
