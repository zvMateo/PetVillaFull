// ============================================================================
// 🐾 PETVILLA FRONTEND - COMPONENTES DE MAPAS
// ============================================================================
// Integración completa con @vis.gl/react-google-maps
// Mapas interactivos para geolocalización y búsqueda
// ============================================================================

import React, { useCallback, useMemo, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Star, MapPin, Clock, Phone } from "lucide-react";
import type { ClinicProfile, GeoPoint } from "../../types";
import { geoService } from "../../services";
import {
  clinicsToMarkers,
  freelancersToMarkers,
  type MapMarkerData,
} from "./utils";

// ============================================================================
interface PetVillaMapProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: MapMarkerData[];
  onMarkerClick?: (marker: MapMarkerData) => void;
  onMapClick?: (position: { lat: number; lng: number }) => void;
  className?: string;
  height?: string;
  showUserLocation?: boolean;
  userLocation?: {
    lat: number;
    lng: number;
  };
}

interface MapClickEvent {
  detail?: {
    latLng?: {
      lat: number;
      lng: number;
    };
  };
}

interface MapMarkerProps {
  marker: MapMarkerData;
  onClick?: (marker: MapMarkerData) => void;
}

// ============================================================================
// 📍 COMPONENTE DE MARCADOR PERSONALIZADO
// ============================================================================

const PetVillaMarker: React.FC<MapMarkerProps> = ({ marker, onClick }) => {
  const [markerRef, markerInstance] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(() => {
    if (onClick) {
      onClick(marker);
    }
    setInfoWindowShown(true);
  }, [marker, onClick]);

  const handleClose = useCallback(() => {
    setInfoWindowShown(false);
  }, []);

  const isClinic = marker.type === "clinic";
  const data = marker.data;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={marker.position}
        title={marker.title}
        onClick={handleMarkerClick}
      >
        <Pin
          background={isClinic ? "#3b82f6" : "#10b981"} // Blue for clinics, Green for freelancers
          borderColor="#ffffff"
          glyphColor="#ffffff"
        ></Pin>
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow
          anchor={markerInstance}
          onClose={handleClose}
          headerContent={
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">{marker.title}</span>
              <Badge variant={isClinic ? "default" : "secondary"}>
                {isClinic ? "Clínica" : "Veterinario"}
              </Badge>
            </div>
          }
        >
          <div className="p-2 max-w-sm">
            {/* Información básica */}
            <div className="space-y-2 mb-3">
              {data.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {data.rating.toFixed(1)}
                  </span>
                  {data.reviewCount && (
                    <span className="text-sm text-muted-foreground">
                      ({data.reviewCount} reseñas)
                    </span>
                  )}
                </div>
              )}

              {isClinic && "address" in data && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">
                    {(data as ClinicProfile).address}
                  </span>
                </div>
              )}

              {isClinic && "phone" in data && (data as ClinicProfile).phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {(data as ClinicProfile).phone}
                  </span>
                </div>
              )}

              {isClinic &&
                "is24Hours" in data &&
                (data as ClinicProfile).is24Hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      24 horas
                    </span>
                  </div>
                )}
            </div>

            {/* Botón de acción */}
            <Button
              size="sm"
              className="w-full"
              onClick={() => {
                // Navigate to detail page
                window.location.href = `/${marker.type}s/${marker.id}`;
              }}
            >
              Ver detalles
            </Button>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

// ============================================================================
// 🗺️ COMPONENTE PRINCIPAL DEL MAPA
// ============================================================================

export const PetVillaMap: React.FC<PetVillaMapProps> = ({
  center = { lat: -34.6037, lng: -58.3816 }, // Buenos Aires por defecto
  zoom = 12,
  markers = [],
  onMarkerClick,
  onMapClick,
  className = "",
  height = "400px",
  showUserLocation = false,
  userLocation,
}) => {
  // Fetch public clinics/freelancers to enrich map when markers are not provided
  const { data: clinics } = geoService.useClinics();
  const { data: freelancers } = geoService.useFreelancers();

  // Derive user location marker using useMemo instead of useEffect + setState
  const userLocationMarker = useMemo<MapMarkerData | null>(() => {
    if (showUserLocation && userLocation) {
      return {
        id: "user-location",
        position: userLocation,
        title: "Tu ubicación",
        type: "clinic", // No importa el tipo para ubicación de usuario
        data: {
          id: "user-location",
          name: "Tu ubicación",
          location: {
            type: "Point",
            coordinates: [userLocation.lng, userLocation.lat],
          },
          is24Hours: false,
        } as ClinicProfile, // Type assertion for user location marker
      };
    }
    return null;
  }, [showUserLocation, userLocation]);

  const dataMarkers = useMemo<MapMarkerData[]>(() => {
    // If parent passes markers, respect them; otherwise derive from geo search
    if (markers.length > 0) return markers;
    const clinicMarkers = clinics ? clinicsToMarkers(clinics) : [];
    const freelancerMarkers = freelancers
      ? freelancersToMarkers(freelancers)
      : [];
    return [...clinicMarkers, ...freelancerMarkers];
  }, [markers, clinics, freelancers]);

  const handleMapClick = useCallback(
    (event: MapClickEvent) => {
      if (onMapClick && event.detail?.latLng) {
        const lat = event.detail.latLng.lat;
        const lng = event.detail.latLng.lng;
        onMapClick({ lat, lng });
      }
    },
    [onMapClick]
  );

  // Google Maps API Key - debería venir de variables de entorno
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Card className={className}>
        <CardContent
          className="flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2" />
            <p>Configuración de mapas incompleta</p>
            <p className="text-sm">
              Falta configurar la API Key de Google Maps
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <APIProvider apiKey={apiKey}>
          <Map
            mapId="petvilla-map"
            defaultCenter={center}
            defaultZoom={zoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onClick={handleMapClick}
            style={{ height }}
          >
            {/* Marcadores de clínicas y freelancers */}
            {(userLocationMarker
              ? [...dataMarkers, userLocationMarker]
              : dataMarkers
            ).map((markerData) => (
              <PetVillaMarker
                key={markerData.id}
                marker={markerData}
                onClick={onMarkerClick}
              />
            ))}

            {/* Marcador de ubicación del usuario */}
            {userLocationMarker && (
              <AdvancedMarker position={userLocationMarker.position}>
                <Pin
                  background="#ef4444"
                  borderColor="#ffffff"
                  glyphColor="#ffffff"
                >
                  📍
                </Pin>
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// 🔍 COMPONENTE DE BÚSQUEDA CON MAPA
// ============================================================================

interface MapSearchProps {
  onLocationSelect?: (location: GeoPoint) => void;
  initialCenter?: { lat: number; lng: number };
  className?: string;
}

export const MapLocationSelector: React.FC<MapSearchProps> = ({
  onLocationSelect,
  initialCenter,
  className = "",
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleMapClick = useCallback(
    (position: { lat: number; lng: number }) => {
      setSelectedLocation(position);
      if (onLocationSelect) {
        onLocationSelect({
          type: "Point",
          coordinates: [position.lng, position.lat], // GeoJSON format: [lng, lat]
        });
      }
    },
    [onLocationSelect]
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Seleccionar ubicación</h3>
        {selectedLocation && (
          <Badge variant="secondary">
            {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
          </Badge>
        )}
      </div>

      <PetVillaMap
        center={initialCenter}
        zoom={13}
        onMapClick={handleMapClick}
        height="300px"
        markers={
          selectedLocation
            ? [
                {
                  id: "selected",
                  position: selectedLocation,
                  title: "Ubicación seleccionada",
                  type: "clinic",
                  data: {
                    id: "selected-location",
                    name: "Ubicación seleccionada",
                    location: {
                      type: "Point",
                      coordinates: [selectedLocation.lng, selectedLocation.lat],
                    },
                  } as ClinicProfile,
                },
              ]
            : []
        }
      />

      <p className="text-sm text-muted-foreground">
        Haz clic en el mapa para seleccionar una ubicación
      </p>
    </div>
  );
};

// ============================================================================
// 📍 UTILIDADES PARA CONVERTIR DATOS A MARCADORES
// ============================================================================

// ============================================================================
// 🎯 EXPORTACIÓN DE COMPONENTES
// ============================================================================

export { PetVillaMap as default };
export type { MapMarkerData, PetVillaMapProps, MapMarkerProps, MapSearchProps };
