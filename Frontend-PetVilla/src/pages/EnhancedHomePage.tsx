import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import {
  EnhancedCard,
  EnhancedButton,
  EnhancedRating,
  StatusCard,
  EnhancedAvatar,
} from "@/components/ui/enhanced-components";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/ui/loading-states";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  Heart,
  Clock,
  PawPrint,
  Users,
  Award,
  TrendingUp,
  Activity,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import {
  ServicesCarousel,
  TestimonialsCarousel,
} from "@/components/ServicesCarousel";

const EnhancedHomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoading message="Cargando PetVilla..." showLogo />;
  }

  const getRoleBasedContent = () => {
    if (!isAuthenticated) {
      return <GuestContent />;
    }

    switch (user?.role) {
      case "CONSUMER":
        return <ConsumerContent />;
      case "VET_INDIVIDUAL":
        return <VetIndividualContent />;
      case "CLINIC_ADMIN":
        return <ClinicAdminContent />;
      case "CLINIC_EMP":
        return <ClinicEmpContent />;
      default:
        return <GuestContent />;
    }
  };

  const GuestContent = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-pet-primary via-pet-primary-light to-pet-secondary text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 pet-animate-bounce">
              <PawPrint className="w-20 h-20 mx-auto text-white/90" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 pet-animate-slide-up">
              Cuidado Veterinario a tu Alcance
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 text-white/90 pet-animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Conecta con los mejores veterinarios y clínicas para el bienestar
              de tu mascota
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center pet-animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <EnhancedButton
                size="lg"
                onClick={() => navigate("/clinics")}
                icon={<Search className="w-5 h-5" />}
              >
                Buscar Veterinarios
              </EnhancedButton>
              <EnhancedButton
                variant="outline"
                size="lg"
                onClick={() => navigate("/register")}
                className="border-white text-white hover:bg-white hover:text-pet-primary"
              >
                Registrarse Gratis
              </EnhancedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-pet-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-pet-neutral-900 mb-4">
              Todo lo que necesitas para tu mascota
            </h2>
            <p className="text-xl text-pet-neutral-600 max-w-2xl mx-auto">
              La plataforma más completa para gestionar la salud y bienestar de
              tus mascotas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Encuentra Veterinarios",
                description:
                  "Localiza clínicas y veterinarios independientes cerca de ti",
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Agenda Citas",
                description:
                  "Reserva consultas con unos pocos clics y recibe recordatorios",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Reseñas Confiables",
                description:
                  "Toma decisiones informadas basadas en experiencias reales",
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Programa de Puntos",
                description:
                  "Gana puntos por cada cita y canjea beneficios exclusivos",
              },
            ].map((feature, index) => (
              <EnhancedCard
                key={index}
                className="text-center p-8 hover:shadow-2xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 text-pet-primary bg-pet-primary/10 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-pet-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-pet-neutral-600">{feature.description}</p>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 🎠 CARRUSEL DE SERVICIOS */}
      {/* ================================================================ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ServicesCarousel
            onServiceClick={(service) => {
              navigate("/clinics", { state: { service: service.title } });
            }}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-pet-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-pet-neutral-900 mb-4">
              ¿Cómo funciona PetVilla?
            </h2>
            <p className="text-xl text-pet-neutral-600">
              Simple, rápido y seguro para ti y tu mascota
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Regístrate",
                description: "Crea tu cuenta gratuita en menos de un minuto",
                icon: <UserCheck className="w-8 h-8" />,
              },
              {
                step: "2",
                title: "Busca y Compara",
                description:
                  "Encuentra el veterinario perfecto según tus necesidades",
                icon: <Search className="w-8 h-8" />,
              },
              {
                step: "3",
                title: "Agenda y Cuida",
                description: "Reserva tu cita y mantén a tu mascota saludable",
                icon: <Calendar className="w-8 h-8" />,
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-pet-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 mx-auto mb-4 text-pet-primary bg-pet-primary/10 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-pet-neutral-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-pet-neutral-600">{step.description}</p>
                </div>

                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-pet-primary mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 💬 CARRUSEL DE TESTIMONIOS */}
      {/* ================================================================ */}
      <section className="py-20 bg-pet-neutral-50">
        <div className="container mx-auto px-4">
          <TestimonialsCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-pet-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para cuidar mejor a tu mascota?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Únete a miles de dueños de mascotas que ya confían en PetVilla
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-white text-pet-primary hover:bg-pet-neutral-50"
            >
              Comenzar Gratis
            </EnhancedButton>
            <EnhancedButton
              variant="outline"
              size="lg"
              onClick={() => navigate("/clinics")}
              className="border-white text-white hover:bg-white hover:text-pet-primary"
            >
              Explorar Veterinarios
            </EnhancedButton>
          </div>
        </div>
      </section>
    </div>
  );

  const ConsumerContent = () => (
    <div className="min-h-screen bg-pet-neutral-50">
      {/* Welcome Header */}
      <section className="bg-linear-to-r from-pet-primary to-pet-primary-light text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                ¡Hola, {user?.profile?.firstName}! 👋
              </h1>
              <p className="text-white/90">
                Bienvenido de vuelta. ¿Cómo está tu mascota hoy?
              </p>
            </div>
            <EnhancedAvatar
              name={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
              size="xl"
              className="hidden sm:block"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: <Calendar />,
                label: "Agendar Cita",
                href: "/appointments",
              },
              { icon: <PawPrint />, label: "Mis Mascotas", href: "/pets" },
              { icon: <Heart />, label: "Favoritos", href: "/favorites" },
              { icon: <Award />, label: "Mis Puntos", href: "/points" },
            ].map((action, index) => (
              <Link key={index} to={action.href}>
                <EnhancedCard className="p-6 text-center hover:shadow-lg">
                  <div className="w-12 h-12 mx-auto mb-4 text-pet-primary bg-pet-primary/10 rounded-full flex items-center justify-center">
                    {action.icon}
                  </div>
                  <p className="font-medium text-pet-neutral-900">
                    {action.label}
                  </p>
                </EnhancedCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-pet-neutral-900 mb-6">
            Tu Actividad
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StatusCard
              title="Próxima Cita"
              value="Mañana 15:00"
              change="Consulta General"
              icon={<Calendar />}
              color="primary"
            />
            <StatusCard
              title="Mascotas Registradas"
              value="3"
              change="2 perros, 1 gato"
              icon={<PawPrint />}
              color="secondary"
            />
            <StatusCard
              title="Puntos Acumulados"
              value="250"
              change="+50 esta semana"
              icon={<Award />}
              color="success"
              trend="up"
            />
            <StatusCard
              title="Veterinarios Favoritos"
              value="5"
              change="2 nuevos este mes"
              icon={<Heart />}
              color="warning"
              trend="up"
            />
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-pet-neutral-900 mb-6">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            {[
              {
                action: "Cita agendada",
                detail: "Consulta para Max - Clínica Central",
                time: "Hace 2 horas",
              },
              {
                action: "Reseña dejada",
                detail: "5 estrellas - Dr. García",
                time: "Ayer",
              },
              {
                action: "Puntos ganados",
                detail: "+50 puntos por cita completada",
                time: "Hace 3 días",
              },
            ].map((activity, index) => (
              <EnhancedCard key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-pet-neutral-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-pet-neutral-600">
                      {activity.detail}
                    </p>
                  </div>
                  <span className="text-sm text-pet-neutral-500">
                    {activity.time}
                  </span>
                </div>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const VetIndividualContent = () => (
    <div className="min-h-screen bg-pet-neutral-50">
      {/* Welcome Header */}
      <section className="bg-linear-to-r from-pet-secondary to-pet-secondary-light text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Panel Profesional, Dr. {user?.profile?.lastName}!
              </h1>
              <p className="text-white/90">
                Gestiona tu práctica veterinaria de manera eficiente
              </p>
            </div>
            <EnhancedAvatar
              name={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
              size="xl"
              className="hidden sm:block"
            />
          </div>
        </div>
      </section>

      {/* Professional Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <StatusCard
              title="Citas Hoy"
              value="8"
              change="3 pendientes, 5 confirmadas"
              icon={<Calendar />}
              color="primary"
            />
            <StatusCard
              title="Pacientes Activos"
              value="156"
              change="+12 este mes"
              icon={<Users />}
              color="success"
              trend="up"
            />
            <StatusCard
              title="Rating Promedio"
              value="4.8"
              change="Basado en 89 reseñas"
              icon={<Star />}
              color="warning"
            />
            <StatusCard
              title="Ingresos Mes"
              value="$12,450"
              change="+15% vs mes anterior"
              icon={<TrendingUp />}
              color="success"
              trend="up"
            />
          </div>
        </div>
      </section>

      {/* Today's Schedule */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-pet-neutral-900 mb-6">
            Citas de Hoy
          </h2>
          <div className="space-y-4">
            {[
              {
                time: "09:00",
                patient: "Max - Labrador",
                type: "Vacunación",
                status: "confirmado",
              },
              {
                time: "10:30",
                patient: "Luna - Gato",
                type: "Revisión",
                status: "confirmado",
              },
              {
                time: "14:00",
                patient: "Charlie - Beagle",
                type: "Consulta",
                status: "pendiente",
              },
              {
                time: "16:00",
                patient: "Bella - Siames",
                type: "Control",
                status: "confirmado",
              },
            ].map((appointment, index) => (
              <EnhancedCard key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-bold text-pet-neutral-900">
                        {appointment.time}
                      </p>
                      <Badge variant="default" className="text-xs">
                        {appointment.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-pet-neutral-900">
                        {appointment.patient}
                      </p>
                      <p className="text-sm text-pet-neutral-600">
                        {appointment.type}
                      </p>
                    </div>
                  </div>
                  <EnhancedButton size="sm" variant="outline">
                    Ver Detalles
                  </EnhancedButton>
                </div>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const ClinicAdminContent = () => (
    <div className="min-h-screen bg-pet-neutral-50">
      {/* Welcome Header */}
      <section className="bg-linear-to-r from-pet-info to-pet-secondary text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Panel de Administración, {user?.profile?.firstName}! 🏥
              </h1>
              <p className="text-white/90">
                Gestiona tu clínica y equipo de manera integral
              </p>
            </div>
            <EnhancedAvatar
              name={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
              size="xl"
              className="hidden sm:block"
            />
          </div>
        </div>
      </section>

      {/* Clinic Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <StatusCard
              title="Empleados Activos"
              value="12"
              change="3 veterinarios, 2 asistentes"
              icon={<Users />}
              color="primary"
            />
            <StatusCard
              title="Citas del Mes"
              value="342"
              change="+18% vs mes anterior"
              icon={<Calendar />}
              color="success"
              trend="up"
            />
            <StatusCard
              title="Ocupación"
              value="78%"
              change="Meta: 85%"
              icon={<Activity />}
              color="warning"
            />
            <StatusCard
              title="Ingresos Mensuales"
              value="45,200"
              change="+22% vs mes anterior"
              icon={<TrendingUp />}
              color="success"
              trend="up"
            />
          </div>
        </div>
      </section>

      {/* Staff Overview */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-pet-neutral-900 mb-6">
            Equipo de Trabajo
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Dr. García",
                role: "Veterinario Principal",
                status: "Disponible",
                rating: 4.9,
              },
              {
                name: "Dra. Martínez",
                role: "Veterinario",
                status: "En consulta",
                rating: 4.8,
              },
              {
                name: "Lic. Rodríguez",
                role: "Asistente",
                status: "Disponible",
                rating: 4.7,
              },
            ].map((staff, index) => (
              <EnhancedCard key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <EnhancedAvatar name={staff.name} />
                    <div>
                      <p className="font-medium text-pet-neutral-900">
                        {staff.name}
                      </p>
                      <p className="text-sm text-pet-neutral-600">
                        {staff.role}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs">
                    {staff.status}
                  </Badge>
                </div>
                <EnhancedRating rating={staff.rating} size="sm" />
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const ClinicEmpContent = () => (
    <div className="min-h-screen bg-pet-neutral-50">
      {/* Welcome Header */}
      <section className="bg-linear-to-r from-pet-info to-pet-secondary text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                ¡Hola, {user?.profile?.firstName}! 👋
              </h1>
              <p className="text-white/90">Bienvenido a tu panel de trabajo</p>
            </div>
            <EnhancedAvatar
              name={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
              size="xl"
              className="hidden sm:block"
            />
          </div>
        </div>
      </section>

      {/* Employee Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <StatusCard
              title="Citas Hoy"
              value="6"
              change="2 pendientes, 4 confirmadas"
              icon={<Calendar />}
              color="primary"
            />
            <StatusCard
              title="Horario Trabajado"
              value="6h 30m"
              change="Meta: 8h"
              icon={<Clock />}
              color="warning"
            />
            <StatusCard
              title="Pacientes Atendidos"
              value="24"
              change="Esta semana"
              icon={<Users />}
              color="success"
              trend="up"
            />
          </div>
        </div>
      </section>

      {/* Today's Appointments */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-pet-neutral-900 mb-6">
            Mis Citas de Hoy
          </h2>
          <div className="space-y-4">
            {[
              {
                time: "09:00",
                patient: "Max - Labrador",
                type: "Vacunación",
                status: "confirmado",
              },
              {
                time: "11:00",
                patient: "Luna - Gato",
                type: "Revisión",
                status: "confirmado",
              },
              {
                time: "14:00",
                patient: "Charlie - Beagle",
                type: "Consulta",
                status: "pendiente",
              },
              {
                time: "16:00",
                patient: "Bella - Siames",
                type: "Control",
                status: "confirmado",
              },
              {
                time: "17:30",
                patient: "Rocky - Bulldog",
                type: "Baño",
                status: "confirmado",
              },
              {
                time: "18:00",
                patient: "Mia - Poodle",
                type: "Corte de uñas",
                status: "pendiente",
              },
            ].map((appointment, index) => (
              <EnhancedCard key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-bold text-pet-neutral-900">
                        {appointment.time}
                      </p>
                      <Badge variant="default" className="text-xs">
                        {appointment.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-pet-neutral-900">
                        {appointment.patient}
                      </p>
                      <p className="text-sm text-pet-neutral-600">
                        {appointment.type}
                      </p>
                    </div>
                  </div>
                  <EnhancedButton size="sm" variant="outline">
                    Ver Detalles
                  </EnhancedButton>
                </div>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  return getRoleBasedContent();
};

export default EnhancedHomePage;
