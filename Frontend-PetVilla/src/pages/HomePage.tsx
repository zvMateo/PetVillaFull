import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { MapPin, Star, PawPrint, CheckCircle } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  ConsumerDashboard,
  FreelancerDashboard,
  ClinicDashboard,
} from "./dashboards";

const HomePage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  // If authenticated, show role-specific dashboard
  if (isAuthenticated && user) {
    switch (user.role) {
      case "VET_INDIVIDUAL":
        return <FreelancerDashboard />;
      case "CLINIC_ADMIN":
      case "CLINIC_EMP":
        return <ClinicDashboard />;
      case "CONSUMER":
      default:
        return <ConsumerDashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Cuidado Completo para{" "}
                <span className="text-pet-primary">Tu Mejor Amigo.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-gray-600 max-w-lg">
                Conectate con los mejores veterinarios, reservá turnos al
                instante y unite a una comunidad de amantes de las mascotas
                cerca tuyo.
              </p>

              {/* Search Bar */}
              <div className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Ingresá tu ciudad o código postal..."
                    className="pl-10 h-12 rounded-lg border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  className="h-12 px-6 bg-pet-primary hover:bg-pet-primary-dark text-white font-medium rounded-lg"
                  onClick={() =>
                    (window.location.href = `/clinics?search=${searchQuery}`)
                  }
                >
                  Buscar
                </Button>
              </div>

              {/* Popular Cities */}
              <p className="text-sm text-gray-500">
                Populares:{" "}
                <Link
                  to="/clinics?city=buenos-aires"
                  className="text-pet-primary hover:underline"
                >
                  Buenos Aires
                </Link>
                ,{" "}
                <Link
                  to="/clinics?city=cordoba"
                  className="text-pet-primary hover:underline"
                >
                  Córdoba
                </Link>
                ,{" "}
                <Link
                  to="/clinics?city=rosario"
                  className="text-pet-primary hover:underline"
                >
                  Rosario
                </Link>
              </p>

              {/* Guest Mode */}
              <Link
                to="/clinics"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <PawPrint className="w-4 h-4" />
                Explorar sin Cuenta
              </Link>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=400&fit=crop"
                  alt="Veterinarian with a happy dog"
                  className="w-full h-100 object-cover"
                />
              </div>

              {/* Floating Card - Vet Profile */}
              <div className="absolute -bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 border">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-pet-primary">
                    <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop" />
                    <AvatarFallback>MG</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      Dra. María González
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>4.9 (120+ reseñas)</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-pet-primary hover:bg-pet-primary-dark text-white"
                  >
                    Reservar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Steps */}
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Pasos simples para un mejor cuidado.
              </h2>

              <div className="space-y-6">
                <Step
                  number={1}
                  title="Buscá"
                  description="Encontrá los mejores especialistas o veterinarios cerca tuyo usando nuestra búsqueda con geolocalización."
                />
                <Step
                  number={2}
                  title="Reservá"
                  description="Asegurá tu turno en segundos. Veé la disponibilidad en tiempo real y reservá al instante."
                />
                <Step
                  number={3}
                  title="Acumulá"
                  description="Juntá puntos de fidelidad en cada visita y canjealos por descuentos o productos."
                />
              </div>
            </div>

            {/* Right - Mockup Card */}
            <div className="relative">
              <div className="bg-[#4a7c6f] rounded-2xl p-6 text-white">
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=200&fit=crop"
                  alt="Happy dog"
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />

                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-pet-primary" />
                  <span className="font-semibold">¡Turno Confirmado!</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/70">Veterinaria</div>
                    <div className="font-medium">Veterinaria Palermo</div>
                  </div>
                  <div>
                    <div className="text-white/70">Fecha</div>
                    <div className="font-medium">24 Oct, 10:00 hs</div>
                  </div>
                  <div>
                    <div className="text-white/70">Puntos Ganados</div>
                    <div className="font-medium text-pet-primary">+150 pts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Más de 10.000 Dueños de Mascotas Confían en Nosotros
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Encontré una guardia veterinaria en 5 minutos cuando mi gato se enfermó de noche. ¡El mapa es increíble!"
              author="Miguel R."
              role="Dueño de Gato"
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              rating={5}
            />
            <TestimonialCard
              quote="El programa de puntos es genial. Ya canjeé puntos por sesiones de peluquería gratis. ¡Súper recomendado!"
              author="Sofía L."
              role="Dueña de Perro"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              rating={5}
            />
            <TestimonialCard
              quote="Como veterinaria, PetVilla simplificó nuestro proceso de turnos. Menos ausencias y clientes más felices."
              author="Dra. Emilia Martínez"
              role="Dueña de Veterinaria"
              avatar="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1A3324]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                ¿Listo para darle lo mejor a tu mascota?
              </h2>
              <p className="text-white/80 text-lg">
                Unite a PetVilla hoy. Es gratis registrarse y empezar a explorar
                veterinarias cerca tuyo.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-pet-primary hover:bg-pet-primary-dark text-white font-medium"
                  asChild
                >
                  <Link to="/register">Registrate Ahora</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=400&fit=crop"
                alt="Happy pets"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Feature Card Component
// Step Component
interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-full bg-pet-primary/10 text-pet-primary font-bold flex items-center justify-center shrink-0">
      {number}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

// Testimonial Card Component
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

const TestimonialCard = ({
  quote,
  author,
  role,
  avatar,
  rating,
}: TestimonialCardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all">
    <div className="flex gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-700 mb-6">"{quote}"</p>
    <div className="flex items-center gap-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatar} />
        <AvatarFallback>{author[0]}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium text-gray-900">{author}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </div>
    </div>
  </div>
);

export default HomePage;
