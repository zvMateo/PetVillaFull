import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
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
  Mail,
  Filter,
  Grid3X3,
  List,
  Heart,
  Award,
  Navigation,
  DollarSign,
} from "lucide-react";
import { Layout } from "../components/Layout";
import { freelancersAPI } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Freelancer {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  bio?: string;
  licenseNumber: string;
  specialties: string[];
  serviceRadiusKm: number;
  rating?: number;
  reviewCount?: number;
  services?: Array<{
    id: string;
    title: string;
    priceFrom: number;
  }>;
  profileImageUrl?: string;
  distance?: number;
}

const FreelancersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    specialty: "",
    maxPrice: "",
    radius: "",
  });

  // Fetch freelancers data
  const {
    data: freelancers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["freelancers", searchQuery, sortBy, filters],
    queryFn: async () => {
      const params: {
        limit?: number;
        offset?: number;
        search?: string;
        specialty?: string;
      } = {};
      if (searchQuery) params.search = searchQuery;

      const response = await freelancersAPI.getAll(params);
      let freelancersData = response.data;

      // Apply filters
      if (filters.specialty) {
        freelancersData = freelancersData.filter((freelancer: Freelancer) =>
          freelancer.specialties.includes(filters.specialty)
        );
      }

      if (filters.maxPrice) {
        freelancersData = freelancersData.filter((freelancer: Freelancer) =>
          freelancer.services?.some(
            (service) => service.priceFrom <= parseInt(filters.maxPrice)
          )
        );
      }

      if (filters.radius) {
        freelancersData = freelancersData.filter(
          (freelancer: Freelancer) =>
            freelancer.serviceRadiusKm <= parseInt(filters.radius)
        );
      }

      // Sort freelancers
      switch (sortBy) {
        case "rating":
          freelancersData = freelancersData.sort(
            (a: Freelancer, b: Freelancer) => (b.rating || 0) - (a.rating || 0)
          );
          break;
        case "name":
          freelancersData = freelancersData.sort(
            (a: Freelancer, b: Freelancer) =>
              `${a.user.firstName} ${a.user.lastName}`.localeCompare(
                `${b.user.firstName} ${b.user.lastName}`
              )
          );
          break;
        case "distance":
          freelancersData = freelancersData.sort(
            (a: Freelancer, b: Freelancer) =>
              (a.distance || 0) - (b.distance || 0)
          );
          break;
        case "price":
          freelancersData = freelancersData.sort(
            (a: Freelancer, b: Freelancer) => {
              const aMinPrice = Math.min(
                ...(a.services?.map((s) => s.priceFrom) || [Infinity])
              );
              const bMinPrice = Math.min(
                ...(b.services?.map((s) => s.priceFrom) || [Infinity])
              );
              return aMinPrice - bMinPrice;
            }
          );
          break;
        default:
          break;
      }

      return freelancersData;
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Error al cargar los veterinarios");
    }
  }, [error]);

  const filteredFreelancers = freelancers.filter((freelancer: Freelancer) => {
    const fullName =
      `${freelancer.user.firstName} ${freelancer.user.lastName}`.toLowerCase();
    const specialtiesMatch = freelancer.specialties.some((specialty) =>
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return fullName.includes(searchQuery.toLowerCase()) || specialtiesMatch;
  });

  const specialties = [
    "Medicina General",
    "Cirugía",
    "Odontología",
    "Dermatología",
    "Oftalmología",
    "Cardiología",
    "Neurología",
    "Oncología",
    "Traumatología",
    "Medicina Preventiva",
  ];

  const FreelancerCard = ({
    freelancer,
    isListView,
  }: {
    freelancer: Freelancer;
    isListView: boolean;
  }) => (
    <Card
      className={`pet-card hover:shadow-xl transition-all duration-300 hover:scale-105 ${
        isListView ? "flex" : ""
      }`}
    >
      <div className={`${isListView ? "p-6 flex items-center gap-4" : "p-6"}`}>
        <div className="relative">
          <Avatar
            className={`${isListView ? "w-16 h-16" : "w-20 h-20 mx-auto mb-4"}`}
          >
            <AvatarImage
              src={freelancer.profileImageUrl}
              alt={`${freelancer.user.firstName} ${freelancer.user.lastName}`}
            />
            <AvatarFallback className="text-lg bg-pet-primary text-white">
              {freelancer.user.firstName[0]}
              {freelancer.user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          {freelancer.distance && (
            <Badge className="absolute -top-1 -right-1 bg-pet-info hover:bg-pet-info/80">
              <Navigation className="w-3 h-3 mr-1" />
              {freelancer.distance.toFixed(1)}km
            </Badge>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <CardTitle className="text-lg hover:text-pet-primary transition-colors">
                <Link to={`/freelancers/${freelancer.id}`}>
                  Dr. {freelancer.user.firstName} {freelancer.user.lastName}
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Award className="w-4 h-4 mr-1 text-pet-secondary" />
                Matrícula: {freelancer.licenseNumber}
              </CardDescription>
            </div>
            {freelancer.rating && (
              <div className="flex items-center bg-pet-accent/10 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 fill-pet-accent text-pet-accent" />
                <span className="ml-1 font-medium text-pet-accent">
                  {freelancer.rating.toFixed(1)}
                </span>
                {freelancer.reviewCount && (
                  <span className="text-sm text-pet-neutral-600 ml-1">
                    ({freelancer.reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          {freelancer.bio && (
            <p className="text-sm text-pet-neutral-600 mb-3 line-clamp-2">
              {freelancer.bio}
            </p>
          )}

          <div className="flex items-center gap-4 mb-3 text-sm text-pet-neutral-600">
            <div className="flex items-center hover:text-pet-primary transition-colors">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Radio: {freelancer.serviceRadiusKm}km</span>
            </div>
            {freelancer.user.email && (
              <div className="flex items-center hover:text-pet-primary transition-colors">
                <Mail className="w-4 h-4 mr-1" />
                <span>{freelancer.user.email}</span>
              </div>
            )}
          </div>

          {freelancer.specialties && freelancer.specialties.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-2 text-pet-neutral-700">
                Especialidades:
              </p>
              <div className="flex flex-wrap gap-1">
                {freelancer.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-pet-primary/10 text-pet-primary hover:bg-pet-primary/20"
                  >
                    {specialty}
                  </Badge>
                ))}
                {freelancer.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{freelancer.specialties.length - 3} más
                  </Badge>
                )}
              </div>
            </div>
          )}

          {freelancer.services && freelancer.services.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-2 text-pet-neutral-700">
                Servicios:
              </p>
              <div className="flex flex-wrap gap-1">
                {freelancer.services.slice(0, 2).map((service) => (
                  <Badge
                    key={service.id}
                    variant="outline"
                    className="text-xs border-pet-success text-pet-success hover:bg-pet-success/10"
                  >
                    {service.title} - ${service.priceFrom}
                  </Badge>
                ))}
                {freelancer.services.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{freelancer.services.length - 2} más
                  </Badge>
                )}
              </div>
            </div>
          )}

          {freelancer.services && freelancer.services.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center text-sm text-pet-success">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>
                  Desde $
                  {Math.min(
                    ...freelancer.services.map((s) => s.priceFrom)
                  ).toFixed(0)}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              asChild
              size="sm"
              className="bg-pet-primary hover:bg-pet-primary-dark transition-all duration-200"
            >
              <Link to={`/freelancers/${freelancer.id}`}>Ver Perfil</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-pet-primary hover:text-white transition-all duration-200"
            >
              <Heart className="w-4 h-4 mr-1" />
              Favorito
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="pet-loading-spinner"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 pet-animate-fade-in">
          <h1 className="text-4xl font-bold text-pet-neutral-900 mb-2">
            Veterinarios Independientes
          </h1>
          <p className="text-lg text-pet-neutral-600">
            Encuentra veterinarios certificados que ofrecen servicios a
            domicilio
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 pet-animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pet-neutral-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nombre, especialidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pet-input"
              />
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 pet-input">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Mejor valorados</SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="distance">Más cercanos</SelectItem>
                  <SelectItem value="price">Menor precio</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className="pet-button-secondary"
              >
                <Filter className="w-4 h-4" />
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="p-4 pet-animate-scale-up">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-pet-neutral-700">
                    Especialidad
                  </label>
                  <Select
                    value={filters.specialty}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, specialty: value }))
                    }
                  >
                    <SelectTrigger className="pet-input">
                      <SelectValue placeholder="Todas las especialidades" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-pet-neutral-700">
                    Radio de servicio
                  </label>
                  <Select
                    value={filters.radius}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, radius: value }))
                    }
                  >
                    <SelectTrigger className="pet-input">
                      <SelectValue placeholder="Cualquier distancia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Hasta 5km</SelectItem>
                      <SelectItem value="10">Hasta 10km</SelectItem>
                      <SelectItem value="20">Hasta 20km</SelectItem>
                      <SelectItem value="50">Hasta 50km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-pet-neutral-700">
                    Precio máximo
                  </label>
                  <Select
                    value={filters.maxPrice}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, maxPrice: value }))
                    }
                  >
                    <SelectTrigger className="pet-input">
                      <SelectValue placeholder="Sin límite" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">$50</SelectItem>
                      <SelectItem value="100">$100</SelectItem>
                      <SelectItem value="200">$200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      setFilters({ specialty: "", maxPrice: "", radius: "" })
                    }
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-pet-neutral-600">
            {filteredFreelancers.length} veterinarios encontrados
          </p>
        </div>

        {/* Freelancers Grid/List */}
        {filteredFreelancers.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredFreelancers.map(
              (freelancer: Freelancer, index: number) => (
                <div
                  key={freelancer.id}
                  className="pet-animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <FreelancerCard
                    freelancer={freelancer}
                    isListView={viewMode === "list"}
                  />
                </div>
              )
            )}
          </div>
        ) : (
          <div className="text-center py-12 pet-empty-state">
            <div className="pet-empty-state-icon">
              <Search className="w-16 h-16" />
            </div>
            <h3 className="pet-empty-state-title">
              No se encontraron veterinarios
            </h3>
            <p className="pet-empty-state-description">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilters({ specialty: "", maxPrice: "", radius: "" });
              }}
              className="bg-pet-primary hover:bg-pet-primary-dark"
            >
              Limpiar búsqueda
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FreelancersPage;
