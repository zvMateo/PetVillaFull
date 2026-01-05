import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Globe,
  Share2,
  Bookmark,
  CheckCircle,
  Search,
  AlertTriangle,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { clinicsAPI, reviewsAPI } from "../lib/api";

const ClinicDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch clinic data
  const { data: clinic, isLoading } = useQuery({
    queryKey: ["clinic", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await clinicsAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ["clinic-reviews", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await reviewsAPI.getByClinic(id);
      return response.data || [];
    },
    enabled: !!id,
  });

  // Mock data for demo
  const mockClinic = {
    id: id,
    name: "Veterinaria Patas & Garras",
    tagline: "Cuidado con amor para tus compañeros peludos.",
    rating: 4.8,
    reviewCount: 240,
    location: "Buenos Aires, CABA",
    yearsExp: "+15 Años de Exp.",
    verified: true,
    coverImage:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=300&fit=crop",
    description: `Somos un hospital veterinario de servicio completo que brinda atención médica integral a mascotas en Buenos Aires y alrededores. Nuestros veterinarios ofrecen una amplia variedad de servicios médicos, quirúrgicos y dentales. Estamos comprometidos a brindar atención de calidad en cada etapa de la vida de tu mascota. Desde cuidados preventivos de rutina hasta la detección temprana y tratamiento de diversas condiciones y enfermedades.`,
    specialties: ["Perros y Gatos", "Cirugía", "Vacunas", "Odontología"],
    address: "Av. Santa Fe 1234, Palermo, CABA",
    phone: "+54 11 5555-0123",
    website: "www.patasgarras.com.ar",
    businessHours: [
      { day: "Lunes", hours: "8:00 - 18:00" },
      { day: "Martes", hours: "8:00 - 18:00" },
      { day: "Miércoles", hours: "8:00 - 18:00" },
      { day: "Jueves", hours: "8:00 - 18:00" },
      { day: "Viernes", hours: "8:00 - 18:00" },
      { day: "Sábado", hours: "9:00 - 16:00" },
      { day: "Domingo", hours: "Cerrado", closed: true },
    ],
    hasEmergency: true,
    services: [
      {
        id: "1",
        title: "Consulta General",
        price: 15000,
        description: "Examen 30 min, Control de salud",
        popular: true,
      },
      {
        id: "2",
        title: "Vacunación",
        price: 8000,
        description: "Vacunas esenciales, Carnet",
        priceLabel: "desde",
      },
      {
        id: "3",
        title: "Limpieza Dental",
        price: 35000,
        description: "Anestesia, Pulido",
        priceLabel: "desde",
      },
    ],
    team: [
      {
        id: "1",
        name: "Dra. Laura Martínez",
        role: "Veterinaria Jefa",
        image:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
      },
      {
        id: "2",
        name: "Dr. Miguel Fernández",
        role: "Cirujano",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
      },
      {
        id: "3",
        name: "Dra. Camila Gómez",
        role: "Dermatología",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
      },
      {
        id: "4",
        name: "Dr. Santiago Rodríguez",
        role: "Medicina General",
        image:
          "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1628009368231-7bb7cf61a9f3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
    ],
  };

  const mockReviews = [
    {
      id: "1",
      author: "María López",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
      rating: 5,
      date: "hace 2 semanas",
      content:
        "¡Le salvaron la vida a mi perro! El equipo fue increíblemente atento durante la emergencia. La Dra. Martínez explicó todo claramente y el personal fue muy reconfortante.",
    },
    {
      id: "2",
      author: "Carlos García",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
      rating: 4,
      date: "hace 1 mes",
      content:
        "Excelente servicio e instalaciones muy limpias. Los precios son un poco más altos que mi veterinaria anterior, pero la calidad de atención lo vale.",
    },
  ];

  // Map API clinic data to display format
  const displayClinic = clinic
    ? {
        id: clinic.id,
        name: clinic.name,
        tagline:
          clinic.description?.substring(0, 80) + "..." ||
          "Cuidado con amor para tus compañeros peludos.",
        rating: 4.8, // TODO: Calculate from reviews
        reviewCount: reviews?.length || 0,
        location: clinic.address || "Villa del Rosario, Córdoba",
        yearsExp: "+10 Años de Exp.",
        verified: true,
        coverImage:
          clinic.imageUrl ||
          "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=300&fit=crop",
        description: clinic.description || "",
        phone: clinic.phone,
        email: clinic.email,
        website: clinic.website,
        is24Hours: clinic.is24Hours,
        specialties: clinic.is24Hours
          ? ["Emergencias 24hs", "Atención Integral", "Servicio Profesional"]
          : ["Atención Integral", "Servicio Profesional", "Cuidado Premium"],
        services: (clinic.services || []).map((s: any) => ({
          id: s.id,
          title: s.title,
          price: parseFloat(s.priceFrom) || 0,
          description: s.description || "",
          duration: s.duration,
          pointsReward: s.pointsReward,
          popular: s.pointsReward >= 200,
          priceLabel: s.duration ? `/ ${s.duration} min` : undefined,
        })),
        team: (clinic.members || []).map((m: any) => ({
          id: m.id,
          name:
            `${m.user?.profile?.firstName || ""} ${
              m.user?.profile?.lastName || ""
            }`.trim() || "Staff",
          role: m.role === "ADMIN" ? "Director/a" : "Veterinario/a",
          image:
            m.user?.profile?.avatarUrl ||
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
        })),
        gallery: [
          clinic.imageUrl ||
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1628009368231-7bb7cf61a9f3?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
        ],
        address: clinic.address || "",
        hasEmergency: clinic.is24Hours || false,
        businessHours: clinic.is24Hours
          ? [{ day: "Lunes - Domingo", hours: "Abierto 24 horas", open: true }]
          : [
              { day: "Lunes - Viernes", hours: "8:00 - 20:00", open: true },
              { day: "Sábados", hours: "9:00 - 14:00", open: true },
              { day: "Domingos", hours: "Cerrado", open: false },
            ],
      }
    : mockClinic;
  const displayReviews = reviews.length > 0 ? reviews : mockReviews;

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
      {/* Header with Search */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pet-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐾</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PetVilla</span>
            </Link>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar veterinarias..."
                  className="pl-9 h-10 bg-gray-50 border-gray-200 rounded-lg"
                />
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                to="/clinics"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Buscar Veterinaria
              </Link>
              <Link
                to="/emergency"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Emergencias
              </Link>
              <Link
                to="/community"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Comunidad
              </Link>
            </nav>

            {/* Profile */}
            <Avatar className="w-9 h-9 border-2 border-gray-200">
              <AvatarFallback className="bg-gray-100 text-gray-600">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative h-64 bg-gray-200">
        <img
          src={displayClinic.coverImage}
          alt={displayClinic.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clinic Header Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-20 h-20 bg-white rounded-xl border-4 border-white shadow-md flex items-center justify-center -mt-12">
                  <span className="text-3xl">🏥</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {displayClinic.name}
                    </h1>
                    {displayClinic.verified && (
                      <CheckCircle className="w-5 h-5 text-blue-500 fill-current" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{displayClinic.tagline}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">
                        {displayClinic.rating}
                      </span>
                      <span className="text-gray-500">
                        ({displayClinic.reviewCount} reseñas)
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">
                      {displayClinic.location}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">
                      {displayClinic.yearsExp}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-pet-primary hover:bg-pet-primary-dark text-white"
                    onClick={() => navigate(`/book/clinic/${id}`)}
                  >
                    Reservar Turno
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* About Us */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">ℹ</span>
                </span>
                Sobre Nosotros
              </h2>
              <p className="text-gray-600 mb-4">{displayClinic.description}</p>
              <div className="flex flex-wrap gap-2">
                {displayClinic.specialties.map(
                  (specialty: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-50 text-gray-700"
                    >
                      🐾 {specialty}
                    </Badge>
                  )
                )}
              </div>
            </div>

            {/* Services & Pricing */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Servicios y Precios
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {displayClinic.services.map(
                  (service: {
                    id: string;
                    title: string;
                    price: number;
                    description: string;
                    popular?: boolean;
                    priceLabel?: string;
                  }) => (
                    <div
                      key={service.id}
                      className="border rounded-xl p-4 hover:border-pet-primary transition-colors"
                    >
                      {service.popular && (
                        <Badge className="bg-red-500 text-white text-[10px] mb-2">
                          DESTACADO
                        </Badge>
                      )}
                      <h3 className="font-medium text-gray-900 mb-1">
                        {service.title}
                      </h3>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        ${service.price}
                        {service.priceLabel && (
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            {service.priceLabel}
                          </span>
                        )}
                      </div>
                      <ul className="text-sm text-gray-500 space-y-1">
                        {service.description
                          .split(", ")
                          .map((item: string, i: number) => (
                            <li key={i} className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-pet-primary" />
                              {item}
                            </li>
                          ))}
                      </ul>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => navigate(`/book/clinic/${id}`)}
                      >
                        Reservar
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Meet Our Vets */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Nuestro Equipo
                </h2>
                <button className="text-pet-primary text-sm font-medium hover:underline">
                  Ver Todos
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {displayClinic.team.map(
                  (member: {
                    id: string;
                    name: string;
                    role: string;
                    image: string;
                  }) => (
                    <div key={member.id} className="text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-2">
                        <AvatarImage src={member.image} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <h4 className="text-sm font-medium text-gray-900">
                        {member.name}
                      </h4>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Galería
              </h2>
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2 row-span-2 rounded-xl overflow-hidden">
                  <img
                    src={displayClinic.gallery[0]}
                    alt="Gallery"
                    className="w-full h-full object-cover"
                  />
                </div>
                {displayClinic.gallery
                  .slice(1, 4)
                  .map((img: string, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden aspect-square"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                <div className="rounded-xl bg-gray-100 flex items-center justify-center aspect-square cursor-pointer hover:bg-gray-200 transition-colors">
                  <span className="text-pet-primary font-medium">+12 más</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Reseñas
                  </h2>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold">
                      {displayClinic.rating}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(displayClinic.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({displayClinic.reviewCount} reseñas)
                    </span>
                  </div>
                </div>
                <Button variant="outline">Escribir Reseña</Button>
              </div>

              <div className="space-y-4">
                {displayReviews.map(
                  (review: {
                    id: string;
                    author: string;
                    avatar?: string;
                    rating: number;
                    date: string;
                    text?: string;
                    content?: string;
                  }) => (
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {review.author}
                            </span>
                            <span className="text-sm text-gray-500">
                              • {review.date}
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
                          <p className="text-gray-600 text-sm">
                            {review.content || review.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              <button className="w-full mt-4 text-pet-primary font-medium hover:underline">
                Leer las {displayClinic.reviewCount} reseñas
              </button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Map Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="h-40 bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-pet-primary mx-auto mb-2" />
                    <span className="text-xs text-gray-500">A 1.3 km</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-pet-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Dirección</p>
                    <p className="text-sm text-gray-600">
                      {displayClinic.address}
                    </p>
                    <button className="text-sm text-pet-primary hover:underline">
                      Cómo Llegar
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-pet-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Teléfono</p>
                    <a
                      href={`tel:${displayClinic.phone}`}
                      className="text-sm text-pet-primary hover:underline"
                    >
                      {displayClinic.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-pet-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Sitio Web</p>
                    <a
                      href={`https://${displayClinic.website}`}
                      className="text-sm text-pet-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {displayClinic.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">
                  Horarios de Atención
                </h3>
              </div>
              <div className="space-y-2">
                {displayClinic.businessHours.map(
                  (
                    item: { day: string; hours: string; closed?: boolean },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className={`flex justify-between text-sm ${
                        item.closed ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      <span className={item.closed ? "text-red-500" : ""}>
                        {item.day}
                      </span>
                      <span className={item.closed ? "text-red-500" : ""}>
                        {item.hours}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Emergency Services */}
            {displayClinic.hasEmergency && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-700">
                      SERVICIO DE EMERGENCIAS
                    </h4>
                    <p className="text-sm text-red-600">
                      Disponible 24/7 para urgencias. Por favor llamá antes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-center gap-4">
                <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-pet-primary hover:text-white transition-colors">
                  <Globe className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-pet-primary hover:text-white transition-colors">
                  📸
                </button>
                <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-pet-primary hover:text-white transition-colors">
                  ✉️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default ClinicDetailPage;
