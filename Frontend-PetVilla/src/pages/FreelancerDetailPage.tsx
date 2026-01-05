import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import {
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  Share2,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  MessageCircle,
  Heart,
  Shield,
  Navigation,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { freelancersAPI, reviewsAPI, availabilityAPI } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";

interface FreelancerProfile {
  id: string;
  userId: string;
  bio?: string;
  licenseNumber?: string;
  specialties: string[];
  serviceRadiusKm: number;
  imageUrl?: string;
  user?: {
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      avatarUrl?: string;
    };
  };
  services?: ServiceType[];
  availabilitySlots?: AvailabilitySlot[];
}

interface ServiceType {
  id: string;
  title: string;
  description?: string;
  category: string;
  priceFrom?: number;
  duration?: number;
  pointsReward: number;
  isActive: boolean;
}

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface Review {
  id: string;
  authorId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  author?: {
    profile?: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
    };
  };
}

const FreelancerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch freelancer data
  const { data: freelancer, isLoading } = useQuery({
    queryKey: ["freelancer", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await freelancersAPI.getById(id);
      return response.data as FreelancerProfile;
    },
    enabled: !!id,
  });

  // Fetch services
  const { data: services = [] } = useQuery({
    queryKey: ["freelancer-services", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await freelancersAPI.getServices(id);
      return (response.data || []) as ServiceType[];
    },
    enabled: !!id,
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ["freelancer-reviews", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await reviewsAPI.getByFreelancer(id);
      return (response.data || []) as Review[];
    },
    enabled: !!id,
  });

  // Fetch availability
  const { data: availability = [] } = useQuery({
    queryKey: ["freelancer-availability", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await availabilityAPI.getByFreelancer(id);
      return (response.data || []) as AvailabilitySlot[];
    },
    enabled: !!id,
  });

  // Mock data for demo (fallback)
  const mockFreelancer: FreelancerProfile = {
    id: id || "1",
    userId: "user-1",
    bio: "Veterinario con más de 10 años de experiencia especializado en medicina felina y canina. Atención a domicilio en toda la zona norte de Buenos Aires. Mi pasión es brindar atención personalizada y cercana a cada mascota, entendiendo que cada animal es único y merece un trato especial.",
    licenseNumber: "MN-12345",
    specialties: [
      "Medicina Felina",
      "Dermatología",
      "Medicina Preventiva",
      "Cirugía Menor",
    ],
    serviceRadiusKm: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    user: {
      email: "dr.martinez@petvilla.com",
      profile: {
        firstName: "Carlos",
        lastName: "Martínez",
        phone: "+54 11 5555-1234",
        avatarUrl:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
      },
    },
  };

  const mockServices: ServiceType[] = [
    {
      id: "1",
      title: "Consulta a Domicilio",
      description: "Examen completo en la comodidad de tu hogar",
      category: "Consulta",
      priceFrom: 18000,
      duration: 45,
      pointsReward: 180,
      isActive: true,
    },
    {
      id: "2",
      title: "Vacunación",
      description: "Aplicación de vacunas con carnet incluido",
      category: "Vacunas",
      priceFrom: 12000,
      duration: 30,
      pointsReward: 120,
      isActive: true,
    },
    {
      id: "3",
      title: "Control Dermatológico",
      description: "Diagnóstico y tratamiento de problemas de piel",
      category: "Dermatología",
      priceFrom: 22000,
      duration: 60,
      pointsReward: 220,
      isActive: true,
    },
    {
      id: "4",
      title: "Desparasitación",
      description: "Tratamiento antiparasitario interno y externo",
      category: "Preventivo",
      priceFrom: 8000,
      duration: 20,
      pointsReward: 80,
      isActive: true,
    },
  ];

  const mockReviews: Review[] = [
    {
      id: "1",
      authorId: "user-2",
      rating: 5,
      comment:
        "Excelente profesional. Muy atento con mi gatita y explicó todo con mucha paciencia. La atención a domicilio fue súper cómoda.",
      createdAt: "2024-12-23T10:00:00Z",
      author: {
        profile: {
          firstName: "María",
          lastName: "López",
          avatarUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
        },
      },
    },
    {
      id: "2",
      authorId: "user-3",
      rating: 5,
      comment:
        "El Dr. Martínez salvó a mi perro de una situación complicada. Llegó rápido y actuó con mucha profesionalidad.",
      createdAt: "2024-12-16T10:00:00Z",
      author: {
        profile: {
          firstName: "Juan",
          lastName: "García",
          avatarUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
        },
      },
    },
    {
      id: "3",
      authorId: "user-4",
      rating: 4,
      comment:
        "Muy buen servicio, puntual y profesional. Mi único comentario es que podría tener más disponibilidad los fines de semana.",
      createdAt: "2024-11-30T10:00:00Z",
      author: {
        profile: {
          firstName: "Ana",
          lastName: "Rodríguez",
          avatarUrl:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
        },
      },
    },
  ];

  const mockAvailability: AvailabilitySlot[] = [
    {
      id: "1",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "18:00",
      isActive: true,
    },
    {
      id: "2",
      dayOfWeek: 2,
      startTime: "09:00",
      endTime: "18:00",
      isActive: true,
    },
    {
      id: "3",
      dayOfWeek: 3,
      startTime: "09:00",
      endTime: "18:00",
      isActive: true,
    },
    {
      id: "4",
      dayOfWeek: 4,
      startTime: "09:00",
      endTime: "18:00",
      isActive: true,
    },
    {
      id: "5",
      dayOfWeek: 5,
      startTime: "09:00",
      endTime: "18:00",
      isActive: true,
    },
    {
      id: "6",
      dayOfWeek: 6,
      startTime: "10:00",
      endTime: "14:00",
      isActive: true,
    },
  ];

  // Map API freelancer data to display format - handle both API and mock data structures
  const displayFreelancer = freelancer
    ? {
        ...freelancer,
        // Map firstName/lastName from either root level (API) or nested (mock)
        user: {
          email: freelancer.user?.email || "",
          profile: {
            firstName:
              (freelancer as any).firstName ||
              freelancer.user?.profile?.firstName ||
              "",
            lastName:
              (freelancer as any).lastName ||
              freelancer.user?.profile?.lastName ||
              "",
            phone:
              (freelancer as any).phone ||
              freelancer.user?.profile?.phone ||
              "",
            avatarUrl:
              (freelancer as any).avatarUrl ||
              freelancer.user?.profile?.avatarUrl ||
              freelancer.imageUrl ||
              "",
          },
        },
      }
    : mockFreelancer;
  const displayServices =
    freelancer?.services && freelancer.services.length > 0
      ? freelancer.services.map((s: any) => ({
          ...s,
          priceFrom: parseFloat(s.priceFrom) || 0,
        }))
      : services.length > 0
      ? services.map((s: any) => ({
          ...s,
          priceFrom: parseFloat(s.priceFrom) || 0,
        }))
      : mockServices;
  const displayReviews = reviews.length > 0 ? reviews : mockReviews;
  const displayAvailability =
    availability.length > 0 ? availability : mockAvailability;

  const fullName = displayFreelancer.user?.profile
    ? `${displayFreelancer.user.profile.firstName || ""} ${
        displayFreelancer.user.profile.lastName || ""
      }`.trim()
    : "Veterinario";

  const avatarUrl =
    displayFreelancer.user?.profile?.avatarUrl || displayFreelancer.imageUrl;

  // Calculate average rating
  const averageRating =
    displayReviews.length > 0
      ? displayReviews.reduce((acc, r) => acc + r.rating, 0) /
        displayReviews.length
      : 4.8;

  // Days of week mapping
  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  // Format availability for display
  const formattedAvailability = daysOfWeek.map((day, index) => {
    const slot = displayAvailability.find(
      (s) => s.dayOfWeek === index && s.isActive
    );
    return {
      day,
      hours: slot ? `${slot.startTime} - ${slot.endTime}` : "Cerrado",
      closed: !slot,
    };
  });

  const handleBookAppointment = () => {
    navigate(`/book/freelancer/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pet-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-pet-primary/10 via-blue-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Profile Image */}
            <div className="relative">
              <Avatar className="w-40 h-40 border-4 border-white shadow-xl">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="text-4xl bg-pet-primary text-white">
                  {fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-pet-primary text-white rounded-full p-2">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Dr. {fullName}
                </h1>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  <Shield className="w-3 h-3 mr-1" />
                  Verificado
                </Badge>
              </div>

              <p className="text-lg text-gray-600 mb-4">
                Veterinario Independiente
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <span>({displayReviews.length} reseñas)</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Navigation className="w-4 h-4 text-pet-primary" />
                  <span>
                    Radio de cobertura: {displayFreelancer.serviceRadiusKm} km
                  </span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-pet-primary" />
                  <span>Mat. {displayFreelancer.licenseNumber}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-6">
                {displayFreelancer.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="bg-white">
                    {specialty}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  className="bg-pet-primary hover:bg-green-600 text-white"
                  onClick={handleBookAppointment}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Reservar Turno
                </Button>
                <Button variant="outline" size="lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Enviar Mensaje
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-pet-primary" />
                Sobre Mí
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {displayFreelancer.bio}
              </p>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-pet-primary" />
                Servicios y Precios
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {displayServices
                  .filter((s) => s.isActive)
                  .map((service) => (
                    <div
                      key={service.id}
                      className="border rounded-xl p-4 hover:border-pet-primary hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-pet-primary transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {service.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {service.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(service.priceFrom || 0)}
                          </div>
                          {service.duration && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {service.duration} min
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-pet-primary font-medium">
                            +{service.pointsReward} puntos
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={handleBookAppointment}
                          >
                            Reservar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-pet-primary" />
                  Reseñas
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {averageRating.toFixed(1)}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(averageRating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({displayReviews.length} reseñas)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {displayReviews.map((review) => {
                  const reviewerName = review.author?.profile
                    ? `${review.author.profile.firstName || ""} ${
                        review.author.profile.lastName || ""
                      }`.trim()
                    : "Usuario";
                  const dateLabel = formatDate(review.createdAt);

                  return (
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={review.author?.profile?.avatarUrl}
                          />
                          <AvatarFallback>
                            {reviewerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {reviewerName}
                            </span>
                            <span className="text-sm text-gray-500">
                              • {dateLabel}
                            </span>
                          </div>
                          <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          {review.comment && (
                            <p className="text-gray-600 text-sm">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {displayReviews.length > 3 && (
                <button className="w-full mt-4 text-pet-primary font-medium hover:underline">
                  Ver todas las reseñas
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Información de Contacto
              </h3>
              <div className="space-y-3">
                {displayFreelancer.user?.profile?.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-pet-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-pet-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Teléfono</div>
                      <div className="font-medium">
                        {displayFreelancer.user.profile.phone}
                      </div>
                    </div>
                  </div>
                )}
                {displayFreelancer.user?.email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-pet-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-pet-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium text-sm">
                        {displayFreelancer.user.email}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coverage Area */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-pet-primary" />
                Zona de Cobertura
              </h3>
              <div className="h-40 bg-linear-to-br from-green-50 to-blue-50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-pet-primary/20 animate-pulse"></div>
                  <div className="absolute w-24 h-24 rounded-full bg-pet-primary/30"></div>
                  <div className="absolute w-16 h-16 rounded-full bg-pet-primary/40"></div>
                  <Navigation className="absolute w-8 h-8 text-pet-primary" />
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Atención a domicilio en un radio de{" "}
                <span className="font-semibold text-pet-primary">
                  {displayFreelancer.serviceRadiusKm} km
                </span>
              </p>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-pet-primary" />
                Horarios de Atención
              </h3>
              <div className="space-y-2">
                {formattedAvailability.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between text-sm ${
                      item.closed ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span className="font-medium">{item.day}</span>
                    <span>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Book CTA */}
            <div className="bg-linear-to-br from-pet-primary to-green-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-2">
                ¿Necesitás atención?
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Reservá tu turno ahora y recibí atención veterinaria de calidad
                en tu domicilio.
              </p>
              <Button
                className="w-full bg-white text-pet-primary hover:bg-gray-100"
                onClick={handleBookAppointment}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reservar Ahora
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FreelancerDetailPage;
