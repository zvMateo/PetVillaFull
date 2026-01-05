// =============================================================================
// 🐾 PETVILLA FRONTEND - HOOK DE GEOLOCALIZACIÓN
// =============================================================================
// Hook reutilizable para obtener la ubicación del usuario con manejo de errores
// =============================================================================

import { useCallback, useState } from "react";

export interface GeolocationPosition {
  lat: number;
  lng: number;
}

export interface UseGeolocationResult {
  position: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
  getCurrentPosition: () => void;
}

export const useGeolocation = (): UseGeolocationResult => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError("La geolocalización no está soportada por este navegador");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = "Error al obtener la ubicación";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Permiso de geolocalización denegado";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Ubicación no disponible";
            break;
          case err.TIMEOUT:
            errorMessage = "Tiempo de espera agotado";
            break;
          default:
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos
      }
    );
  }, []);

  return {
    position,
    error,
    loading,
    getCurrentPosition,
  };
};
