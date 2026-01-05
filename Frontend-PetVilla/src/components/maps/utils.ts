// ============================================================================
// 🐾 PETVILLA FRONTEND - UTILIDADES DE MAPAS
// ============================================================================
// Funciones de utilidad para convertir datos a marcadores de mapa
// ============================================================================

import type { ClinicProfile, FreelancerProfile } from "../../types";

interface MapMarkerData {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  type: "clinic" | "freelancer";
  data: ClinicProfile | FreelancerProfile;
}

export const clinicToMarker = (clinic: ClinicProfile): MapMarkerData => ({
  id: clinic.id,
  position: {
    lat: clinic.location.coordinates[1], // GeoJSON: [lng, lat]
    lng: clinic.location.coordinates[0],
  },
  title: clinic.name,
  type: "clinic",
  data: clinic,
});

export const freelancerToMarker = (
  freelancer: FreelancerProfile
): MapMarkerData => {
  // For now, use a generic title since user data might not be populated
  // In the future, this could be enhanced with populated user data from API
  const title = `Veterinario independiente`;

  return {
    id: freelancer.id,
    position: {
      lat: freelancer.baseLocation.coordinates[1], // GeoJSON: [lng, lat]
      lng: freelancer.baseLocation.coordinates[0],
    },
    title,
    type: "freelancer",
    data: freelancer,
  };
};

export const clinicsToMarkers = (clinics: ClinicProfile[]): MapMarkerData[] =>
  clinics.map(clinicToMarker);

export const freelancersToMarkers = (
  freelancers: FreelancerProfile[]
): MapMarkerData[] => freelancers.map(freelancerToMarker);

export type { MapMarkerData };
