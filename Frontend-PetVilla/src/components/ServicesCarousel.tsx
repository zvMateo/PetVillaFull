// ============================================================================
// 🐾 PETVILLA - CARRUSEL DE SERVICIOS CON EMBLA CAROUSEL
// ============================================================================
// Carrusel interactivo para mostrar servicios veterinarios destacados
// ============================================================================

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Syringe,
  Scissors,
  Heart,
  Bone,
  Activity,
  Pill,
  Eye,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 📋 DATOS DE SERVICIOS
// ============================================================================

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  color: string;
  bgColor: string;
}

const servicesData: ServiceItem[] = [
  {
    id: "1",
    title: "Consulta General",
    description:
      "Chequeo completo de salud para tu mascota con diagnóstico profesional",
    icon: <Stethoscope className="w-8 h-8" />,
    price: "Desde $5.500",
    rating: 4.9,
    reviews: 342,
    featured: true,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    id: "2",
    title: "Vacunación",
    description:
      "Programa completo de vacunas para mantener a tu mascota protegida",
    icon: <Syringe className="w-8 h-8" />,
    price: "Desde $3.800",
    rating: 4.8,
    reviews: 289,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "3",
    title: "Peluquería Canina",
    description:
      "Baño, corte y cuidado estético profesional para perros y gatos",
    icon: <Scissors className="w-8 h-8" />,
    price: "Desde $4.200",
    rating: 4.7,
    reviews: 456,
    featured: true,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    id: "4",
    title: "Cirugía",
    description: "Procedimientos quirúrgicos con equipos de última generación",
    icon: <Heart className="w-8 h-8" />,
    price: "Consultar",
    rating: 4.9,
    reviews: 127,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    id: "5",
    title: "Nutrición",
    description: "Planes alimenticios personalizados según la edad y condición",
    icon: <Bone className="w-8 h-8" />,
    price: "Desde $2.800",
    rating: 4.6,
    reviews: 198,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    id: "6",
    title: "Análisis Clínicos",
    description: "Laboratorio completo con resultados en el día",
    icon: <Activity className="w-8 h-8" />,
    price: "Desde $4.500",
    rating: 4.8,
    reviews: 234,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "7",
    title: "Farmacia",
    description: "Medicamentos veterinarios y productos especializados",
    icon: <Pill className="w-8 h-8" />,
    price: "Variable",
    rating: 4.5,
    reviews: 167,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  {
    id: "8",
    title: "Oftalmología",
    description: "Especialistas en salud ocular para tu mascota",
    icon: <Eye className="w-8 h-8" />,
    price: "Desde $6.500",
    rating: 4.9,
    reviews: 89,
    featured: true,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },
];

// ============================================================================
// 🎠 COMPONENTE DE CARRUSEL
// ============================================================================

interface ServicesCarouselProps {
  className?: string;
  autoplay?: boolean;
  onServiceClick?: (service: ServiceItem) => void;
}

export const ServicesCarousel: React.FC<ServicesCarouselProps> = ({
  className = "",
  autoplay = true,
  onServiceClick,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
    },
    autoplay ? [Autoplay({ delay: 4000, stopOnInteraction: true })] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-pet-neutral-900">
            Servicios Destacados
          </h2>
          <p className="text-pet-neutral-600 mt-1">
            Encuentra el cuidado perfecto para tu mascota
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev && !emblaApi?.canScrollPrev()}
            className="rounded-full border-pet-primary/30 hover:bg-pet-primary hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext && !emblaApi?.canScrollNext()}
            className="rounded-full border-pet-primary/30 hover:bg-pet-primary hover:text-white disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 -ml-1">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="shrink-0 grow-0 min-w-0 pl-4"
              style={{ flexBasis: "calc(100% / 1 - 16px)" }}
            >
              <ServiceCard
                service={service}
                onClick={() => onServiceClick?.(service)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="rounded-full border-pet-primary/30 hover:bg-pet-primary hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Dots */}
        <div className="flex gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === selectedIndex
                  ? "w-6 bg-pet-primary"
                  : "bg-pet-neutral-300 hover:bg-pet-primary/50"
              )}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="rounded-full border-pet-primary/30 hover:bg-pet-primary hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Desktop Dots */}
      <div className="hidden md:flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === selectedIndex
                ? "w-6 bg-pet-primary"
                : "bg-pet-neutral-300 hover:bg-pet-primary/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 📦 CARD DE SERVICIO
// ============================================================================

interface ServiceCardProps {
  service: ServiceItem;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1 border-0 shadow-md"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              "shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center",
              "transition-transform group-hover:scale-110",
              service.bgColor,
              service.color
            )}
          >
            {service.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-pet-neutral-900 truncate">
                {service.title}
              </h3>
              {service.featured && (
                <Badge className="bg-pet-accent text-white text-xs shrink-0">
                  Destacado
                </Badge>
              )}
            </div>

            <p className="text-pet-neutral-600 text-sm mb-3 line-clamp-2">
              {service.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-sm">{service.rating}</span>
                <span className="text-pet-neutral-500 text-xs">
                  ({service.reviews} reseñas)
                </span>
              </div>
              <span className="font-bold text-pet-primary">
                {service.price}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// 🎠 CARRUSEL DE TESTIMONIOS
// ============================================================================

interface Testimonial {
  id: string;
  name: string;
  petName: string;
  petType: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "María González",
    petName: "Luna",
    petType: "Gata Siamés",
    rating: 5,
    comment:
      "Excelente atención. Luna estaba muy nerviosa pero el veterinario la tranquilizó enseguida. Muy profesionales.",
    avatar: "",
    date: "Hace 2 días",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    petName: "Rocky",
    petType: "Bulldog Francés",
    rating: 5,
    comment:
      "El mejor servicio veterinario que encontré. Rocky se recuperó muy rápido de su cirugía. ¡Gracias!",
    avatar: "",
    date: "Hace 1 semana",
  },
  {
    id: "3",
    name: "Laura Martínez",
    petName: "Toby",
    petType: "Golden Retriever",
    rating: 4,
    comment:
      "Muy contentos con la atención. La peluquería dejó a Toby hermoso y el precio es muy accesible.",
    avatar: "",
    date: "Hace 3 días",
  },
  {
    id: "4",
    name: "Andrés Fernández",
    petName: "Michi",
    petType: "Gato Persa",
    rating: 5,
    comment:
      "Primera vez que uso PetVilla y quedé muy satisfecho. El proceso de agendar cita es muy fácil.",
    avatar: "",
    date: "Hace 5 días",
  },
];

interface TestimonialsCarouselProps {
  className?: string;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  className = "",
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", () =>
      setSelectedIndex(emblaApi.selectedScrollSnap())
    );
    return () => {
      emblaApi.off("select", () => {});
    };
  }, [emblaApi]);

  return (
    <div className={cn("relative", className)}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-pet-neutral-900 mb-2">
          Lo que dicen nuestros usuarios
        </h2>
        <p className="text-pet-neutral-600">
          Miles de dueños de mascotas confían en PetVilla
        </p>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="shrink-0 grow-0 min-w-0 w-full md:w-1/2 lg:w-1/3 px-3"
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < testimonial.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-pet-neutral-700 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pet-primary/20 flex items-center justify-center">
                      <span className="text-pet-primary font-medium">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-pet-neutral-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-pet-neutral-500">
                        {testimonial.petName} • {testimonial.petType}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === selectedIndex
                ? "w-6 bg-pet-primary"
                : "bg-pet-neutral-300 hover:bg-pet-primary/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesCarousel;
