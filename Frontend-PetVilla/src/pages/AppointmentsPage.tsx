import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { appointmentsAPI } from "../lib/api";
import { formatDate, formatTime, formatCurrency } from "../lib/format";
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Dog,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Appointment {
  id: string;
  dateTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string;
  service?: {
    id: string;
    title: string;
    priceFrom: number;
    priceTo?: number;
  };
  clinic?: {
    id: string;
    name: string;
    address?: string;
  };
  freelancer?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  pet?: {
    id: string;
    name: string;
    species: string;
  };
}

const AppointmentsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: async () => {
      const response = await appointmentsAPI.getMyAppointments();
      return response.data || [];
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => appointmentsAPI.cancelMyAppointment(id),
    onSuccess: () => {
      toast.success("Cita cancelada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
    onError: () => {
      toast.error("Error al cancelar la cita");
    },
  });

  const getStatusBadge = (status: Appointment["status"]) => {
    const statusConfig = {
      PENDING: { label: "Pendiente", variant: "secondary" as const },
      CONFIRMED: { label: "Confirmada", variant: "default" as const },
      CANCELLED: { label: "Cancelada", variant: "destructive" as const },
      COMPLETED: { label: "Completada", variant: "outline" as const },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const upcomingAppointments = appointments.filter(
    (apt: Appointment) =>
      new Date(apt.dateTime) > new Date() && apt.status !== "CANCELLED"
  );

  const pastAppointments = appointments.filter(
    (apt: Appointment) =>
      new Date(apt.dateTime) <= new Date() || apt.status === "CANCELLED"
  );

  const renderAppointmentCard = (appointment: Appointment) => (
    <Card key={appointment.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {appointment.service?.title || "Servicio"}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              {formatDate(appointment.dateTime)}
              <Clock className="h-4 w-4 ml-2" />
              {formatTime(appointment.dateTime)}
            </CardDescription>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {/* Proveedor */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Stethoscope className="h-4 w-4" />
            {appointment.clinic ? (
              <span>{appointment.clinic.name}</span>
            ) : appointment.freelancer ? (
              <span>
                Dr. {appointment.freelancer.firstName}{" "}
                {appointment.freelancer.lastName}
              </span>
            ) : (
              <span>Proveedor no especificado</span>
            )}
          </div>

          {/* Dirección */}
          {appointment.clinic?.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{appointment.clinic.address}</span>
            </div>
          )}

          {/* Mascota */}
          {appointment.pet && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Dog className="h-4 w-4" />
              <span>
                {appointment.pet.name} ({appointment.pet.species})
              </span>
            </div>
          )}

          {/* Precio */}
          {appointment.service && (
            <div className="text-sm font-medium text-primary">
              {formatCurrency(appointment.service.priceFrom)}
              {appointment.service.priceTo &&
                ` - ${formatCurrency(appointment.service.priceTo)}`}
            </div>
          )}

          {/* Notas */}
          {appointment.notes && (
            <p className="text-sm text-muted-foreground italic">
              "{appointment.notes}"
            </p>
          )}

          {/* Acciones */}
          {appointment.status === "PENDING" ||
          appointment.status === "CONFIRMED" ? (
            <div className="flex gap-2 pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => cancelMutation.mutate(appointment.id)}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <X className="h-4 w-4 mr-1" />
                )}
                Cancelar
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-16rem)]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mis Citas</h1>
          <Link to="/clinics">
            <Button>Agendar Nueva Cita</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-8">
            {/* Próximas citas */}
            {upcomingAppointments.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Próximas Citas ({upcomingAppointments.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingAppointments.map(renderAppointmentCard)}
                </div>
              </section>
            )}

            {/* Citas pasadas/canceladas */}
            {pastAppointments.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
                  Historial ({pastAppointments.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pastAppointments.map(renderAppointmentCard)}
                </div>
              </section>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No tienes citas programadas
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Agenda tu primera cita veterinaria para cuidar de tus mascotas.
              </p>
              <Link to="/clinics">
                <Button>Buscar Clínicas</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AppointmentsPage;
