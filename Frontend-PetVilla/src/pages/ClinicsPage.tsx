import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Search,
  MapPin,
  Star,
  Building,
  User,
  RefreshCw,
  Navigation,
} from "lucide-react";
import { Header } from "../components/Header";
import { clinicsAPI, geoAPI } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PetVillaMap } from "../components/maps";
import { useGeolocation } from "../hooks/useGeolocation";
import type { MapMarkerData } from "../components/maps/utils";

interface Clinic {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  is24Hours: boolean;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  services?: Array<{
    id: string;
    title: string;
    priceFrom: number;
  }>;
  distance?: number;
  isEmergency?: boolean;
  providerType?: "clinic" | "freelancer";
}

const ClinicsPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [locationQuery, setLocationQuery] = useState("Buenos Aires, CABA");
  const [sortBy, setSortBy] = useState("recommended");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  // Geolocation hook
  const {
    position,
    loading: geoLoading,
    getCurrentPosition,
  } = useGeolocation();

  // Map center - use user location if available, otherwise Buenos Aires
  const mapCenter = useMemo(() => {
    if (position) {
      return { lat: position.lat, lng: position.lng };
    }
    return { lat: -34.6037, lng: -58.3816 }; // Buenos Aires
  }, [position]);

  const filters = [
    { id: "all", label: "Todas" },
    { id: "open", label: "Abierto Ahora" },
    { id: "home-visits", label: "A Domicilio" },
    { id: "clinics", label: "Solo Veterinarias" },
    { id: "emergency", label: "Emergencias" },
  ];

  // Fetch clinics data
  const {
    data: clinics = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clinics", searchQuery, sortBy, activeFilter],
    queryFn: async () => {
      const params: { limit?: number; offset?: number; search?: string } = {
        limit: 20,
      };
      if (searchQuery) params.search = searchQuery;

      const response = await clinicsAPI.getAll(params);
      let clinicsData = response.data || [];

      // Apply filters
      if (activeFilter === "open") {
        clinicsData = clinicsData.filter((c: Clinic) => c.is24Hours);
      } else if (activeFilter === "clinics") {
        clinicsData = clinicsData.filter(
          (c: Clinic) => c.providerType !== "freelancer"
        );
      } else if (activeFilter === "emergency") {
        clinicsData = clinicsData.filter(
          (c: Clinic) => c.is24Hours || c.isEmergency
        );
      }

      return clinicsData;
    },
  });

  // Fetch service categories for enhanced filtering
  const { data: categories = [] } = useQuery({
    queryKey: ["service-categories"],
    queryFn: async () => {
      try {
        const response = await geoAPI.getServiceCategories();
        return response.data?.categories || [];
      } catch {
        return [];
      }
    },
  });

  // Convert clinics to map markers
  const mapMarkers: MapMarkerData[] = useMemo(() => {
    if (!clinics || clinics.length === 0) return [];

    // Generate deterministic positions based on clinic id hash
    const hashCode = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return hash;
    };

    return clinics
      .filter((clinic: Clinic) => clinic.address) // Only include clinics with addresses
      .map((clinic: Clinic) => {
        // Use hash of clinic id to generate deterministic but varied positions
        const hash = hashCode(clinic.id);
        const latOffset = (hash % 1000) / 10000 - 0.05;
        const lngOffset = ((hash >> 10) % 1000) / 10000 - 0.05;

        return {
          id: clinic.id,
          position: {
            lat: mapCenter.lat + latOffset,
            lng: mapCenter.lng + lngOffset,
          },
          title: clinic.name,
          type: (clinic.providerType || "clinic") as "clinic" | "freelancer",
          data: {
            id: clinic.id,
            name: clinic.name,
            address: clinic.address,
            phone: clinic.phone,
            rating: clinic.rating,
            reviewCount: clinic.reviewCount,
            is24Hours: clinic.is24Hours,
            location: {
              type: "Point" as const,
              coordinates: [
                mapCenter.lng + lngOffset,
                mapCenter.lat + latOffset,
              ] as [number, number],
            },
          },
        };
      });
  }, [clinics, mapCenter]);

  // Handle marker click
  const handleMarkerClick = (marker: MapMarkerData) => {
    const clinic = clinics.find((c: Clinic) => c.id === marker.id);
    if (clinic) {
      setSelectedClinic(clinic);
      // Scroll to clinic in list
      const element = document.getElementById(`clinic-${clinic.id}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error("Error al cargar veterinarias");
    }
  }, [error]);

  // Get user location on mount
  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Search Results */}
        <div className="w-full lg:w-120 flex flex-col border-r overflow-hidden">
          {/* Search Header */}
          <div className="p-4 border-b space-y-4">
            {/* Search Inputs */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar veterinarias, especialidades..."
                  className="pl-9 h-10 bg-gray-50 border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative w-40">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Ubicación"
                  className="pl-9 h-10 bg-gray-50 border-gray-200"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter.id
                      ? "bg-pet-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
              {/* Service Category Filters from API */}
              {categories.slice(0, 3).map((category: string) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(`cat-${category}`)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === `cat-${category}`
                      ? "bg-pet-secondary text-white"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {clinics.length} Resultados encontrados
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 h-8 text-sm border-0 bg-transparent">
                <span className="text-gray-500">Ordenar: </span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recomendados</SelectItem>
                <SelectItem value="rating">Mejor Calificados</SelectItem>
                <SelectItem value="distance">Más Cercanos</SelectItem>
                <SelectItem value="price">Menor Precio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pet-primary"></div>
              </div>
            ) : clinics.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Building className="w-12 h-12 mb-4 text-gray-300" />
                <p className="font-medium">No se encontraron veterinarias</p>
                <p className="text-sm">Intentá ajustar tu búsqueda o filtros</p>
              </div>
            ) : (
              <div className="divide-y">
                {clinics.map((clinic: Clinic) => (
                  <ClinicListItem
                    key={clinic.id}
                    clinic={clinic}
                    isSelected={selectedClinic?.id === clinic.id}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {clinics.length > 0 && (
              <div className="p-4 text-center">
                <button className="text-pet-primary font-medium hover:underline">
                  Cargar más resultados
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="hidden lg:flex flex-1 relative bg-gray-100">
          {/* Search This Area Button */}
          <button
            onClick={() => refetch()}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Buscar en esta zona
          </button>

          {/* Geolocation Button */}
          <button
            onClick={getCurrentPosition}
            disabled={geoLoading}
            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md border text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Navigation
              className={`w-4 h-4 ${geoLoading ? "animate-pulse" : ""} ${
                position ? "text-pet-primary" : ""
              }`}
            />
            {geoLoading ? "Localizando..." : "Mi Ubicación"}
          </button>

          {/* Google Maps Integration */}
          <PetVillaMap
            center={mapCenter}
            zoom={13}
            markers={mapMarkers}
            onMarkerClick={handleMarkerClick}
            showUserLocation={!!position}
            userLocation={position || undefined}
            height="100%"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

// Clinic List Item Component
interface ClinicListItemProps {
  clinic: Clinic;
  isSelected?: boolean;
}

const ClinicListItem = ({ clinic, isSelected }: ClinicListItemProps) => {
  const providerType = clinic.providerType || "clinic";

  return (
    <div
      id={`clinic-${clinic.id}`}
      className={`p-4 hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-pet-primary/5 border-l-4 border-pet-primary" : ""
      }`}
    >
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
          {clinic.imageUrl ? (
            <img
              src={clinic.imageUrl}
              alt={clinic.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Building className="w-8 h-8 text-gray-300" />
            </div>
          )}
          {/* Provider Type Badge */}
          <div className="absolute top-1 left-1">
            <Badge
              className={`text-[10px] font-bold ${
                providerType === "freelancer"
                  ? "bg-blue-500 hover:bg-blue-500"
                  : "bg-pet-primary hover:bg-pet-primary"
              }`}
            >
              {providerType === "freelancer" ? "A DOMICILIO" : "VETERINARIA"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                to={`/book/${providerType}/${clinic.id}`}
                className="font-semibold text-gray-900 hover:text-pet-primary transition-colors line-clamp-1"
              >
                {clinic.name}
              </Link>
              <p className="text-sm text-gray-500 line-clamp-1">
                {clinic.reviewCount || 0} reseñas •{" "}
                {clinic.distance?.toFixed(1) || "0.8"} km
              </p>
            </div>
            {clinic.rating && (
              <div className="flex items-center gap-1 text-pet-primary font-semibold">
                {clinic.rating.toFixed(1)}
                <Star className="w-4 h-4 fill-current" />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {clinic.is24Hours && (
              <Badge
                variant="outline"
                className="text-xs bg-green-50 text-green-700 border-green-200"
              >
                Abierto
              </Badge>
            )}
            {clinic.services?.slice(0, 2).map((service) => (
              <Badge
                key={service.id}
                variant="outline"
                className="text-xs bg-gray-50"
              >
                {service.title}
              </Badge>
            ))}
          </div>

          {/* Availability & Action */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {providerType === "freelancer" && (
                <Avatar className="w-6 h-6 border">
                  <AvatarImage src={clinic.imageUrl} />
                  <AvatarFallback className="text-xs">
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="text-xs text-gray-500">Disponible Hoy</span>
            </div>
            <Button
              size="sm"
              className="bg-pet-primary hover:bg-pet-primary-dark text-white font-medium rounded-lg"
              asChild
            >
              <Link to={`/book/${providerType}/${clinic.id}`}>
                {providerType === "freelancer" ? "Ver Perfil" : "Reservar"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicsPage;
