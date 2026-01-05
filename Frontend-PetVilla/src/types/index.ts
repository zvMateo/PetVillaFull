// ============================================================================
// 🐾 PETVILLA FRONTEND - TIPOS TYPESCRIPT COMPLETOS
// ============================================================================
// Tipos completamente alineados con la API backend de PetVilla
// Basados en el esquema de base de datos y DTOs del backend
// ============================================================================

// ============================================================================
// 🔐 AUTENTICACIÓN Y USUARIOS
// ============================================================================

export interface JwtUser {
  sub: string; // User ID
  email: string;
  role: "CONSUMER" | "VET_INDIVIDUAL" | "CLINIC_ADMIN" | "CLINIC_EMPLOYEE";
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "CONSUMER" | "VET_INDIVIDUAL" | "CLINIC_ADMIN";
}

// ============================================================================
// 👤 PERFILES DE USUARIO
// ============================================================================

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicProfile {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  location: GeoPoint;
  is24Hours: boolean;
  imageUrl?: string;
  createdAt: string;
  // Información adicional calculada
  rating?: number;
  reviewCount?: number;
  distance?: number; // en km desde ubicación del usuario
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  bio?: string;
  licenseNumber: string;
  specialties: string[];
  serviceRadiusKm: number;
  baseLocation: GeoPoint;
  createdAt: string;
  // Información adicional calculada
  rating?: number;
  reviewCount?: number;
  distance?: number; // en km desde ubicación del usuario
}

export interface ClinicMember {
  id: string;
  userId: string;
  clinicId: string;
  role: "ADMIN" | "EMPLOYEE";
  joinedAt: string;
  // Información populada
  user?: UserProfile;
}

// ============================================================================
// 🐾 MASCOTAS
// ============================================================================

export type PetSpecies = "DOG" | "CAT" | "BIRD" | "OTHER";

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: string;
  weight?: number;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  // Información calculada
  age?: string; // edad formateada
}

// ============================================================================
// 🏥 SERVICIOS VETERINARIOS
// ============================================================================

export interface Service {
  id: string;
  clinicId?: string;
  freelancerId?: string;
  title: string;
  description?: string;
  category: string;
  priceFrom: number;
  duration?: number; // en minutos
  pointsReward: number;
  isActive: boolean;
  createdAt: string;
  // Información populada
  clinic?: ClinicProfile;
  freelancer?: FreelancerProfile;
}

export interface ServiceCategory {
  name: string;
  count: number;
}

export interface CreateServiceRequest {
  clinicId?: string;
  freelancerId?: string;
  title: string;
  description?: string;
  category: string;
  priceFrom: number;
  duration?: number;
  pointsReward: number;
}

export interface UpdateServiceRequest {
  title?: string;
  description?: string;
  category?: string;
  priceFrom?: number;
  duration?: number;
  pointsReward?: number;
  isActive?: boolean;
}

// ============================================================================
// 📅 CITAS (APPOINTMENTS)
// ============================================================================

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface Appointment {
  id: string;
  consumerId: string;
  serviceId: string;
  petId: string;
  dateTime: string;
  status: AppointmentStatus;
  notes?: string;
  location?: GeoPoint; // para servicios a domicilio
  createdAt: string;
  updatedAt: string;
  // Información populada
  consumer?: UserProfile;
  service?: Service;
  pet?: Pet;
  clinic?: ClinicProfile;
  freelancer?: FreelancerProfile;
}

export interface CreateAppointmentRequest {
  serviceId: string;
  petId: string;
  dateTime: string;
  notes?: string;
  location?: GeoPoint;
}

export interface UpdateAppointmentRequest {
  dateTime?: string;
  notes?: string;
  status?: AppointmentStatus;
}

// ============================================================================
// ⭐ RESEÑAS Y CALIFICACIONES
// ============================================================================

export interface Review {
  id: string;
  authorId: string;
  targetId: string; // ID de clínica o freelancer
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  // Información populada
  author?: UserProfile;
  target?: ClinicProfile | FreelancerProfile;
}

export interface CreateReviewRequest {
  targetId: string;
  rating: number;
  comment?: string;
}

export interface ReviewSummary {
  targetId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// ============================================================================
// 🎯 SISTEMA DE PUNTOS (LOYALTY)
// ============================================================================

export type PointTransactionType =
  | "EARNED_SERVICE"
  | "REDEEMED_REWARD"
  | "ADJUST";

export interface PointTransaction {
  id: string;
  consumerId: string;
  amount: number; // positivo = ganancia, negativo = gasto
  type: PointTransactionType;
  referenceId?: string; // ID de cita o reward
  createdAt: string;
  // Información populada
  consumer?: UserProfile;
  appointment?: Appointment;
}

export interface PointBalance {
  consumerId: string;
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: PointTransaction[];
}

// ============================================================================
// 📊 DISPONIBILIDAD (AVAILABILITY)
// ============================================================================

export interface AvailabilitySlot {
  id: string;
  clinicId?: string;
  freelancerId?: string;
  dayOfWeek: number; // 0=Domingo, 6=Sábado
  startTime: string; // formato HH:mm
  endTime: string; // formato HH:mm
  isActive: boolean;
  // Información populada
  clinic?: ClinicProfile;
  freelancer?: FreelancerProfile;
}

export interface CreateAvailabilityRequest {
  clinicId?: string;
  freelancerId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateAvailabilityRequest {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export interface AvailableSlotsResponse {
  date: string;
  slots: {
    startTime: string;
    endTime: string;
    available: boolean;
  }[];
}

// ============================================================================
// 🌍 GEOLOCALIZACIÓN
// ============================================================================

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface SearchFilters {
  category?: string;
  rating?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  distance?: number; // en km
  availableToday?: boolean;
  is24Hours?: boolean;
}

export interface SearchClinicsRequest {
  query?: string;
  location?: GeoPoint;
  radius?: number; // en km
  filters?: SearchFilters;
}

export interface SearchFreelancersRequest {
  query?: string;
  location?: GeoPoint;
  radius?: number; // en km
  filters?: SearchFilters;
}

// ============================================================================
// 🔄 API RESPONSES GENÉRICOS
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// ============================================================================
// 🎨 UI/UX TYPES (para componentes)
// ============================================================================

export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  type: "clinic" | "freelancer";
  data: ClinicProfile | FreelancerProfile;
}

export interface NotificationItem {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
}

export interface FilterOptions {
  categories: string[];
  priceRanges: Array<{
    label: string;
    min: number;
    max: number;
  }>;
  ratings: number[];
  distances: number[];
}

// ============================================================================
// 🔧 UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Type guards
export const isClinic = (
  profile: ClinicProfile | FreelancerProfile
): profile is ClinicProfile => {
  return "name" in profile && "address" in profile;
};

export const isFreelancer = (
  profile: ClinicProfile | FreelancerProfile
): profile is FreelancerProfile => {
  return "userId" in profile && "licenseNumber" in profile;
};
