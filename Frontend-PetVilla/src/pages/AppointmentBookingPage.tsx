import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  PawPrint,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Search,
} from "lucide-react";
import {
  clinicsAPI,
  freelancersAPI,
  appointmentsAPI,
  petsAPI,
  type AppointmentData,
} from "../lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

interface ServiceType {
  id: string;
  title: string;
  description?: string;
  priceFrom: number;
  priceTo?: number;
  category?: string;
  image?: string;
}

interface VeterinarianType {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  specialty?: string;
}

interface PetType {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  image?: string;
}

interface BookingFormData {
  serviceId?: string;
  serviceName?: string;
  servicePrice?: number;
  veterinarianId?: string;
  veterinarianName?: string;
  petId?: string;
  petName?: string;
  date?: Date;
  time?: string;
  notes?: string;
}

const AppointmentBookingPage = () => {
  const { providerType, providerId } = useParams<{
    providerType: string;
    providerId: string;
  }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const steps = [
    { id: 1, label: "Servicio" },
    { id: 2, label: "Veterinario" },
    { id: 3, label: "Fecha y Hora" },
    { id: 4, label: "Confirmar" },
  ];

  // Fetch provider data
  const { data: provider } = useQuery({
    queryKey: [providerType, providerId],
    queryFn: async () => {
      const response =
        providerType === "clinic"
          ? await clinicsAPI.getById(providerId!)
          : await freelancersAPI.getById(providerId!);
      return response.data;
    },
    enabled: !!providerId,
  });

  // Fetch services
  const { data: services = [] } = useQuery({
    queryKey: [`${providerType}-services`, providerId],
    queryFn: async () => {
      const response =
        providerType === "clinic"
          ? await clinicsAPI.getServices(providerId!)
          : await freelancersAPI.getServices(providerId!);
      return response.data || [];
    },
    enabled: !!providerId,
  });

  // Fetch user pets
  const { data: pets = [] } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const response = await petsAPI.getAll();
      return response.data || [];
    },
  });

  // Mock services if none available
  const displayServices =
    services.length > 0
      ? services
      : [
          {
            id: "1",
            title: "Consulta General",
            priceFrom: 15000,
            image:
              "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
          },
          {
            id: "2",
            title: "Vacunación",
            priceFrom: 8000,
            image:
              "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop",
          },
          {
            id: "3",
            title: "Baño y Peluquería",
            priceFrom: 12000,
            image:
              "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop",
          },
          {
            id: "4",
            title: "Odontología",
            priceFrom: 35000,
            image:
              "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=200&h=200&fit=crop",
          },
        ];

  // Mock veterinarians
  const veterinarians = [
    {
      id: "1",
      name: "Dra. Laura Martínez",
      role: "Veterinaria Senior",
      experience: "12 años exp.",
      distance: "A 1.3 km",
      rating: 4.9,
      reviewCount: 124,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
    },
    {
      id: "2",
      name: "Dr. Miguel Fernández",
      role: "Médico General",
      experience: "8 años exp.",
      distance: "A 2 km",
      rating: 4.7,
      reviewCount: 89,
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
    },
  ];

  // Mock pets if none available
  const displayPets =
    pets.length > 0
      ? pets
      : [
          {
            id: "1",
            name: "Toby",
            species: "Perro",
            image:
              "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
          },
          {
            id: "2",
            name: "Luna",
            species: "Gato",
            image:
              "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop",
          },
        ];

  // Available time slots
  const timeSlots = [
    { time: "09:00 AM", available: true },
    { time: "09:30 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: false },
    { time: "11:00 AM", available: true },
    { time: "11:30 AM", available: true },
    { time: "12:00 PM", available: false },
    { time: "01:00 PM", available: true },
  ];

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: appointmentsAPI.create,
    onSuccess: () => {
      toast.success("¡Turno reservado exitosamente!");
      navigate("/appointments");
    },
    onError: () => {
      toast.error("Error al reservar turno. Por favor intentá de nuevo.");
    },
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (
      !formData.serviceId ||
      !formData.petId ||
      !formData.date ||
      !formData.time
    ) {
      toast.error("Por favor completá todos los campos requeridos");
      return;
    }

    const appointmentData: AppointmentData = {
      serviceId: formData.serviceId,
      petId: formData.petId,
      dateTime: new Date(
        `${format(formData.date, "yyyy-MM-dd")}T${formData.time}`
      ).toISOString(),
      notes: formData.notes || "",
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const selectService = (service: ServiceType) => {
    setFormData({
      ...formData,
      serviceId: service.id,
      serviceName: service.title,
      servicePrice: Number(service.priceFrom) || 0,
    });
  };

  const selectVeterinarian = (vet: VeterinarianType) => {
    setFormData({
      ...formData,
      veterinarianId: vet.id,
      veterinarianName: vet.name,
    });
  };

  const selectPet = (pet: PetType) => {
    setFormData({
      ...formData,
      petId: pet.id,
      petName: pet.name,
    });
  };

  const selectDateTime = (date: Date, time: string) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      date,
      time,
    });
  };

  // Calculate progress
  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-pet-primary rounded-lg flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  PetVilla
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Inicio
                </Link>
                <Link
                  to="/appointments"
                  className="text-sm font-medium text-pet-primary"
                >
                  Mis Turnos
                </Link>
                <Link
                  to="/freelancers"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Veterinarios
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar servicios..."
                  className="pl-9 w-64 h-9 bg-gray-50 border-gray-200 rounded-lg"
                />
              </div>
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-pet-primary/10 text-pet-primary">
                  U
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Reservar Turno
          </h1>
          <p className="text-gray-600">
            Completá el formulario para agendar una visita para tu mascota.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              PASO {currentStep} DE 4:{" "}
              {steps[currentStep - 1].label.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">
              {progress}% Completado
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-pet-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                className={`text-sm font-medium transition-colors ${
                  step.id === currentStep
                    ? "text-pet-primary"
                    : step.id < currentStep
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-pet-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Selección de Servicio
                    </h2>
                  </div>
                  <button className="text-pet-primary text-sm font-medium hover:underline">
                    Cambiar
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {displayServices.map((service: ServiceType) => (
                    <button
                      key={service.id}
                      onClick={() => selectService(service)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        formData.serviceId === service.id
                          ? "border-pet-primary ring-2 ring-pet-primary/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 text-left">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {service.title}
                        </h3>
                      </div>
                      {formData.serviceId === service.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-pet-primary rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Choose Veterinarian */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-pet-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Elegir Veterinario
                    </h2>
                  </div>
                  <button className="text-pet-primary text-sm font-medium hover:underline">
                    Cambiar
                  </button>
                </div>

                <div className="space-y-4">
                  {veterinarians.map((vet) => (
                    <button
                      key={vet.id}
                      onClick={() => selectVeterinarian(vet)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        formData.veterinarianId === vet.id
                          ? "border-pet-primary bg-pet-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={vet.image} />
                        <AvatarFallback>{vet.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {vet.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {vet.role} • {vet.experience}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {vet.distance}
                          </span>
                          <span className="text-xs flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            {vet.rating} ({vet.reviewCount} reseñas)
                          </span>
                        </div>
                      </div>
                      {formData.veterinarianId === vet.id ? (
                        <Badge className="bg-pet-primary text-white">
                          SELECCIONADO
                        </Badge>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Select Date & Time */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                    3
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Seleccionar Fecha y Hora
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Calendar - using react-day-picker */}
                  <div className="flex justify-center">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate ?? undefined}
                      onSelect={(date) => setSelectedDate(date ?? null)}
                      locale={es}
                      disabled={(date) =>
                        isBefore(date, startOfDay(new Date()))
                      }
                      className="rounded-lg border shadow-sm"
                      classNames={{
                        day: "h-10 w-10 text-sm rounded-lg transition-colors hover:bg-pet-primary/10",
                        today:
                          "bg-pet-primary/10 text-pet-primary font-semibold",
                        selected:
                          "bg-pet-primary text-white hover:bg-pet-primary",
                        disabled: "text-gray-300 cursor-not-allowed opacity-50",
                      }}
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">
                      Horarios Disponibles{" "}
                      {selectedDate && (
                        <span className="text-gray-500 font-normal">
                          ({format(selectedDate, "d MMM")})
                        </span>
                      )}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() =>
                            slot.available &&
                            selectedDate &&
                            selectDateTime(selectedDate, slot.time)
                          }
                          disabled={!slot.available}
                          className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                            formData.time === slot.time
                              ? "bg-pet-primary text-white border-pet-primary"
                              : slot.available
                              ? "border-gray-200 text-gray-700 hover:border-pet-primary hover:text-pet-primary"
                              : "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Horarios en tu zona local (Argentina).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Who is this visit for? (Pet Selection) */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                    4
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    ¿Para quién es la consulta?
                  </h2>
                </div>

                <div className="flex gap-4 mb-6">
                  {displayPets.map((pet: PetType) => (
                    <button
                      key={pet.id}
                      onClick={() => selectPet(pet)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        formData.petId === pet.id
                          ? "border-pet-primary bg-pet-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={pet.image} />
                        <AvatarFallback className="bg-gray-100">
                          <PawPrint className="w-6 h-6 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {pet.name}
                      </span>
                    </button>
                  ))}
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-pet-primary hover:text-pet-primary transition-colors">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium">Agregar</span>
                  </button>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales (Opcional)
                  </label>
                  <Textarea
                    placeholder="Requisitos especiales o información sobre tu mascota..."
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="min-h-25"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Atrás
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !formData.serviceId) ||
                    (currentStep === 2 && !formData.veterinarianId) ||
                    (currentStep === 3 && (!formData.date || !formData.time))
                  }
                  className="bg-pet-primary hover:bg-pet-primary-dark gap-2"
                >
                  Continuar a {steps[currentStep]?.label}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !formData.petId || createAppointmentMutation.isPending
                  }
                  className="bg-pet-primary hover:bg-pet-primary-dark gap-2"
                >
                  {createAppointmentMutation.isPending
                    ? "Reservando..."
                    : "Confirmar Reserva"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">
                  Resumen del Turno
                </h3>
              </div>

              <div className="space-y-4">
                {/* Service */}
                <div>
                  <span className="text-xs font-medium text-pet-primary">
                    SERVICIO
                  </span>
                  <p className="font-medium text-gray-900">
                    {formData.serviceName || "No seleccionado"}
                  </p>
                  {formData.servicePrice != null && (
                    <p className="text-sm text-gray-500">
                      ${Number(formData.servicePrice).toLocaleString("es-AR")}
                    </p>
                  )}
                </div>

                {/* Specialist */}
                {formData.veterinarianName && (
                  <div>
                    <span className="text-xs font-medium text-pet-primary">
                      ESPECIALISTA
                    </span>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-gray-100 text-xs">
                          {formData.veterinarianName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {formData.veterinarianName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {provider?.name || "Central Vet Clinic"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date & Time */}
                {formData.date && formData.time && (
                  <div>
                    <span className="text-xs font-medium text-pet-primary">
                      FECHA Y HORA
                    </span>
                    <p className="font-medium text-gray-900">
                      {format(formData.date, "MMM d, yyyy")}
                    </p>
                    <p className="text-sm text-gray-500">{formData.time}</p>
                  </div>
                )}

                {/* Pet */}
                {formData.petName && (
                  <div>
                    <span className="text-xs font-medium text-pet-primary">
                      MASCOTA
                    </span>
                    <p className="font-medium text-gray-900">
                      {formData.petName}
                    </p>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="border-t mt-6 pt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Costo de Consulta</span>
                  <span className="font-medium">
                    ${formData.servicePrice?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Costo de Gestión</span>
                  <span className="font-medium">$750</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>
                    ${((formData.servicePrice || 0) + 750).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* CTA */}
              {currentStep === 4 && (
                <Button
                  className="w-full mt-6 bg-pet-primary hover:bg-pet-primary-dark"
                  onClick={handleSubmit}
                  disabled={
                    !formData.petId || createAppointmentMutation.isPending
                  }
                >
                  Continuar a Mascota →
                </Button>
              )}

              {/* Cancellation Policy */}
              <p className="text-xs text-center text-gray-500 mt-4">
                Cancelación gratuita hasta 24hs antes del turno.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
