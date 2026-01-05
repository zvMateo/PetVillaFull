import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  MapPin,
  Search,
  Star,
  Clock,
  X,
  Heart,
  Building2,
  Navigation,
  ChevronDown,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { clinicsAPI, freelancersAPI } from "../../lib/api";
import { Header } from "../../components/Header";
import { useGeolocation } from "../../hooks/useGeolocation";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

interface Provider {
  id: string;
  name: string;
  type: "clinic" | "freelancer";
  rating: number;
  reviewCount: number;
  distance?: string;
  address?: string;
  imageUrl?: string;
  specialties?: string[];
  isOpen?: boolean;
  is24Hours?: boolean;
  isEmergency?: boolean;
  services?: string[];
  priceRange?: string;
  lat?: number;
  lng?: number;
}

const FILTER_OPTIONS = [
  { id: "all", label: "Todos", icon: null },
  { id: "open", label: "Abierto Ahora", icon: Clock },
  { id: "home-visits", label: "A Domicilio", icon: Navigation },
  { id: "clinics", label: "Solo Clínicas", icon: Building2 },
  { id: "emergency", label: "Emergencia", icon: Heart },
];

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

// Default center (Villa del Rosario, Córdoba)
const DEFAULT_CENTER = { lat: -31.5606, lng: -63.5356 };

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [hoveredProviderId, setHoveredProviderId] = useState<string | null>(
    null
  );

  const { position, error: geoError, loading: geoLoading } = useGeolocation();

  // Fetch clinics
  const { data: clinicsData, isLoading: clinicsLoading } = useQuery({
    queryKey: ["clinics-dashboard"],
    queryFn: async () => {
      const response = await clinicsAPI.getAll();
      return response.data || [];
    },
  });

  // Fetch freelancers
  const { data: freelancersData, isLoading: freelancersLoading } = useQuery({
    queryKey: ["freelancers-dashboard"],
    queryFn: async () => {
      const response = await freelancersAPI.getAll();
      return response.data || [];
    },
  });

  // Mock providers for demo (with coordinates in Villa del Rosario, Córdoba area)
  const mockProviders: Provider[] = [
    {
      id: "clinic-1",
      name: "Veterinaria Patitas Felices",
      type: "clinic",
      rating: 4.9,
      reviewCount: 120,
      distance: "0.8 km",
      address: "Av. San Martín 456, Villa del Rosario",
      imageUrl:
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=200&fit=crop",
      isOpen: true,
      services: ["Consulta General", "Vacunación"],
      specialties: ["Mascotas Exóticas"],
      lat: -31.5606,
      lng: -63.5356,
    },
    {
      id: "freelancer-1",
      name: "Dr. Carlos Fernández",
      type: "freelancer",
      rating: 4.8,
      reviewCount: 85,
      distance: "1.2 km",
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop",
      services: ["A Domicilio", "Vacunación"],
      specialties: ["Medicina General"],
      lat: -31.558,
      lng: -63.54,
    },
    {
      id: "clinic-2",
      name: "Hospital Veterinario Villa del Rosario",
      type: "clinic",
      rating: 4.6,
      reviewCount: 210,
      distance: "2.1 km",
      address: "Ruta 9 Km 685, Villa del Rosario",
      imageUrl:
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&h=200&fit=crop",
      is24Hours: true,
      isEmergency: true,
      services: ["Emergencia", "Cirugía"],
      specialties: ["Emergencias 24hs"],
      lat: -31.565,
      lng: -63.528,
    },
    {
      id: "clinic-3",
      name: "Clínica Felina Córdoba",
      type: "clinic",
      rating: 5.0,
      reviewCount: 67,
      distance: "1.5 km",
      address: "Calle Belgrano 123, Villa del Rosario",
      imageUrl:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop",
      isOpen: true,
      services: ["Solo Gatos", "Peluquería"],
      specialties: ["Especialista en Felinos"],
      lat: -31.562,
      lng: -63.532,
    },
    {
      id: "freelancer-2",
      name: "Dra. María González",
      type: "freelancer",
      rating: 4.9,
      reviewCount: 156,
      distance: "0.5 km",
      imageUrl:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop",
      services: ["A Domicilio", "Control General"],
      specialties: ["Medicina Felina"],
      lat: -31.559,
      lng: -63.538,
    },
    {
      id: "clinic-4",
      name: "Centro Veterinario El Campo",
      type: "clinic",
      rating: 4.7,
      reviewCount: 89,
      distance: "1.8 km",
      address: "Av. Libertad 789, Villa del Rosario",
      imageUrl:
        "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=300&h=200&fit=crop",
      isOpen: true,
      services: ["Consulta General", "Cirugía"],
      specialties: ["Grandes Animales"],
      lat: -31.555,
      lng: -63.542,
    },
  ];

  // Combine real data with mock data
  const providers: Provider[] = useMemo(() => {
    const hasRealData =
      (clinicsData && clinicsData.length > 0) ||
      (freelancersData && freelancersData.length > 0);

    if (hasRealData) {
      return [
        ...(clinicsData || []).map((clinic: any) => ({
          id: `clinic-${clinic.id}`,
          name: clinic.name,
          type: "clinic" as const,
          rating: clinic.averageRating || 4.5,
          reviewCount: clinic.reviewCount || 0,
          address: clinic.address,
          imageUrl: clinic.imageUrl,
          is24Hours: clinic.is24Hours,
          isOpen: true, // TODO: Calculate based on availability
          isEmergency: clinic.is24Hours, // 24hs clinics are considered emergency
          services: clinic.services?.map((s: any) => s.title) || [],
          specialties: clinic.is24Hours ? ["Emergencias 24hs"] : [],
          lat: clinic.latitude,
          lng: clinic.longitude,
        })),
        ...(freelancersData || []).map((freelancer: any) => ({
          id: `freelancer-${freelancer.id}`,
          name: `${freelancer.user?.profile?.firstName || "Dr."} ${
            freelancer.user?.profile?.lastName || ""
          }`.trim(),
          type: "freelancer" as const,
          rating: freelancer.averageRating || 4.5,
          reviewCount: freelancer.reviewCount || 0,
          imageUrl: freelancer.user?.profile?.avatarUrl || freelancer.imageUrl,
          specialties: freelancer.specialties || [],
          services: freelancer.services?.map((s: any) => s.title) || [
            "A Domicilio",
          ],
          isOpen: true,
          lat: freelancer.latitude,
          lng: freelancer.longitude,
        })),
      ];
    }
    return mockProviders;
  }, [clinicsData, freelancersData]);

  // Filter providers
  const filteredProviders = providers.filter((provider) => {
    if (activeFilter === "clinics" && provider.type !== "clinic") return false;
    if (activeFilter === "home-visits" && provider.type !== "freelancer")
      return false;
    if (activeFilter === "emergency" && !provider.isEmergency) return false;
    if (activeFilter === "open" && !provider.isOpen && !provider.is24Hours)
      return false;
    if (
      searchQuery &&
      !provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleProviderClick = useCallback(
    (provider: Provider) => {
      console.log("handleProviderClick called with:", provider.id);
      const parts = provider.id.split("-");
      const type = parts[0];
      const id = parts.slice(1).join("-"); // UUID can have dashes, so join the rest
      console.log(
        "Navigating to:",
        type === "clinic" ? `/clinics/${id}` : `/freelancers/${id}`
      );
      if (type === "clinic") {
        navigate(`/clinics/${id}`);
      } else {
        navigate(`/freelancers/${id}`);
      }
    },
    [navigate]
  );

  const isLoading = clinicsLoading || freelancersLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Search & Results */}
        <div className="w-full lg:w-[450px] bg-white border-r flex flex-col">
          {/* Search Header */}
          <div className="p-4 border-b space-y-4">
            {/* Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar veterinarios, clínicas..."
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 px-3 bg-gray-100 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 whitespace-nowrap">
                  {geoLoading
                    ? "Localizando..."
                    : geoError
                    ? "Mi ubicación"
                    : "Cerca de mí"}
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {FILTER_OPTIONS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter.id
                      ? "bg-pet-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.icon && <filter.icon className="w-4 h-4" />}
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="text-sm text-gray-600">
              <strong className="text-gray-900">
                {filteredProviders.length}
              </strong>{" "}
              resultados encontrados
            </span>
            <button className="flex items-center gap-1 text-sm text-pet-primary font-medium">
              Ordenar: Recomendados
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pet-primary"></div>
              </div>
            ) : filteredProviders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Search className="w-8 h-8 mb-2" />
                <p>No se encontraron resultados</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onClick={() => handleProviderClick(provider)}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredProviders.length > 0 && (
              <div className="p-4 text-center">
                <button className="text-pet-primary font-medium hover:underline">
                  Cargar más resultados
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="hidden lg:flex flex-1 relative">
          {GOOGLE_MAPS_API_KEY ? (
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <Map
                className="w-full h-full"
                defaultCenter={position || DEFAULT_CENTER}
                defaultZoom={13}
                gestureHandling="greedy"
                disableDefaultUI={false}
                mapId="pet-villa-map"
              >
                {/* User Location Marker */}
                {position && (
                  <AdvancedMarker position={position}>
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                  </AdvancedMarker>
                )}

                {/* Provider Markers */}
                {filteredProviders
                  .filter((p) => p.lat && p.lng)
                  .map((provider) => (
                    <AdvancedMarker
                      key={provider.id}
                      position={{ lat: provider.lat!, lng: provider.lng! }}
                      onClick={() => setSelectedProvider(provider)}
                    >
                      <div
                        className={`relative cursor-pointer transition-transform ${
                          hoveredProviderId === provider.id
                            ? "scale-125 z-10"
                            : ""
                        }`}
                        onMouseEnter={() => setHoveredProviderId(provider.id)}
                        onMouseLeave={() => setHoveredProviderId(null)}
                      >
                        <Pin
                          background={
                            provider.type === "clinic" ? "#3B82F6" : "#22C55E"
                          }
                          glyphColor="#FFFFFF"
                          borderColor="#FFFFFF"
                        />
                        {provider.isEmergency && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
                        )}
                      </div>
                    </AdvancedMarker>
                  ))}

                {/* Info Window for Selected Provider */}
                {selectedProvider &&
                  selectedProvider.lat &&
                  selectedProvider.lng && (
                    <InfoWindow
                      position={{
                        lat: selectedProvider.lat,
                        lng: selectedProvider.lng,
                      }}
                      onCloseClick={() => setSelectedProvider(null)}
                    >
                      <div className="p-2 min-w-[200px]">
                        <div className="flex items-start gap-3">
                          {selectedProvider.imageUrl && (
                            <img
                              src={selectedProvider.imageUrl}
                              alt={selectedProvider.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {selectedProvider.name}
                            </h4>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>
                                {selectedProvider.rating} (
                                {selectedProvider.reviewCount})
                              </span>
                            </div>
                            {selectedProvider.address && (
                              <p className="text-xs text-gray-500 mt-1">
                                {selectedProvider.address}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-3 bg-pet-primary hover:bg-green-600 text-white h-8 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleProviderClick(selectedProvider);
                          }}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </InfoWindow>
                  )}
              </Map>

              {/* Search This Area Button */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                {/* <Button
                  variant="outline"
                  className="bg-white shadow-lg hover:bg-gray-50"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar en esta área
                </Button> */}
              </div>

              {/* Legend */}
              <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-3 z-10">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Referencias
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-gray-600">Clínicas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-gray-600">A Domicilio</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow" />
                    <span className="text-gray-600">Tu ubicación</span>
                  </div>
                </div>
              </div>
            </APIProvider>
          ) : (
            /* Fallback if no API key */
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-pet-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-12 h-12 text-pet-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mapa no disponible
                </h3>
                <p className="text-gray-600 max-w-sm">
                  Configura la API key de Google Maps para ver el mapa
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Provider Card Component
interface ProviderCardProps {
  provider: Provider;
  onClick: () => void;
}

const ProviderCard = ({ provider, onClick }: ProviderCardProps) => {
  return (
    <div
      onClick={onClick}
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative shrink-0">
          {provider.type === "clinic" ? (
            <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-100">
              {provider.imageUrl ? (
                <img
                  src={provider.imageUrl}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
          ) : (
            <Avatar className="w-20 h-20">
              <AvatarImage src={provider.imageUrl} alt={provider.name} />
              <AvatarFallback className="bg-pet-primary/10 text-pet-primary text-xl">
                {provider.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}

          {/* Type Badge */}
          <div className="absolute -top-1 -left-1">
            <Badge
              className={`text-[10px] px-1.5 py-0.5 ${
                provider.type === "clinic"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {provider.type === "clinic" ? "CLÍNICA" : "A DOMICILIO"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {provider.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <span className="font-semibold text-gray-900">
                {provider.rating}
              </span>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            {provider.reviewCount} reseñas
            {provider.distance && ` • ${provider.distance}`}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {provider.isOpen && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                Abierto
              </Badge>
            )}
            {provider.is24Hours && (
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs">
                24hs
              </Badge>
            )}
            {provider.isEmergency && (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                Emergencia
              </Badge>
            )}
            {provider.specialties?.slice(0, 2).map((specialty, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-xs text-gray-600"
              >
                {specialty}
              </Badge>
            ))}
          </div>

          {/* Available Today */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Disponible hoy
            </span>
            <Button
              size="sm"
              className="bg-pet-primary hover:bg-green-600 text-white h-8"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Reservar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
