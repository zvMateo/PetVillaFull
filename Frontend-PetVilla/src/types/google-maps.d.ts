// ============================================================================
// 🐾 PETVILLA FRONTEND - TIPOS GOOGLE MAPS
// ============================================================================
// Declaración de tipos para Google Maps API
// ============================================================================

declare global {
  namespace google {
    namespace maps {
      interface MapMouseEvent {
        latLng?: {
          lat(): number;
          lng(): number;
        };
      }
    }
  }
}
