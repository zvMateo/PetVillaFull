import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getAuthToken,
  getRefreshToken,
  useAuthStore,
} from "../stores/authStore";
import { toast } from "sonner";

declare module "axios" {
  // Extend AxiosRequestConfig to include _retry property
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Type definitions for API data
export interface AppointmentData {
  serviceId: string;
  petId: string;
  dateTime: string;
  notes?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

export interface PetData {
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
  notes?: string;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | InternalAxiosRequestConfig
      | undefined;
    const status = error.response?.status;

    // Handle refresh token flow once
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token");
        }
        const res = await api.post("/auth/refresh", {
          refresh_token: refreshToken,
        });
        const { access_token, refresh_token } = res.data as {
          access_token: string;
          refresh_token: string;
        };
        useAuthStore.getState().setTokens(access_token, refresh_token);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (typeof status === "number") {
      if (status === 403) {
        toast.error("No tienes permisos para realizar esta acción");
      } else if (status >= 500) {
        toast.error("Error del servidor. Inténtalo nuevamente.");
      }
    } else if (
      error.response?.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
    ) {
      const message = (error.response.data as { message: string }).message;
      toast.error(message);
    } else {
      toast.error("Ha ocurrido un error. Inténtalo nuevamente.");
    }

    return Promise.reject(error);
  }
);

// API endpoints helper functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (userData: {
    email: string;
    password: string;
    role: "CONSUMER" | "VET_INDIVIDUAL" | "CLINIC_ADMIN" | "CLINIC_EMP";
  }) => api.post("/auth/register", userData),

  me: () => api.get("/auth/me"),

  refresh: (refreshToken: string) =>
    api.post("/auth/refresh", { refresh_token: refreshToken }),
};

export const usersAPI = {
  /** Obtiene el usuario actual autenticado */
  getMe: () => api.get("/users/me"),

  /** Obtiene un usuario por ID (público) */
  getById: (id: string) => api.get(`/users/${id}`),

  /** Actualiza un usuario (usa PATCH, no PUT) */
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/users/${id}`, data),

  /** Obtiene los puntos de un usuario (público) */
  getPoints: (id: string) => api.get(`/users/${id}/points`),

  /** Crea un empleado de clínica (solo CLINIC_ADMIN) */
  createClinicEmployee: (data: { email: string; password: string }) =>
    api.post("/users/clinic/employee", data),

  /** Lista empleados de la clínica (solo CLINIC_ADMIN) */
  getClinicEmployees: () => api.get("/users/clinic/employees"),
};

// ============================================================================
// 🏥 CLINICS API - Usando /profiles/clinics del backend
// ============================================================================
export const clinicsAPI = {
  /** Lista todas las clínicas */
  getAll: (params?: { limit?: number; offset?: number; search?: string }) =>
    api.get("/profiles/clinics", { params }),

  /** Obtiene una clínica por ID */
  getById: (id: string) => api.get(`/profiles/clinic/${id}`),

  /** Obtiene servicios de una clínica */
  getServices: (id: string) => api.get(`/services/clinic/${id}`),

  /** Obtiene reseñas de una clínica */
  getReviews: (id: string) => api.get(`/reviews/clinic/${id}`),

  /** Obtiene rating promedio de una clínica */
  getAverageRating: (id: string) => api.get(`/reviews/clinic/${id}/average`),

  /** Actualiza perfil de clínica (requiere auth) */
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/profiles/clinic/${id}`, data),
};

// ============================================================================
// 👨‍⚕️ FREELANCERS API - Usando /profiles/freelancers del backend
// ============================================================================
export const freelancersAPI = {
  /** Lista todos los veterinarios independientes */
  getAll: (params?: { limit?: number; offset?: number; search?: string }) =>
    api.get("/profiles/freelancers", { params }),

  /** Obtiene un freelancer por ID */
  getById: (id: string) => api.get(`/profiles/freelancer/${id}`),

  /** Obtiene un freelancer por user ID */
  getByUserId: (userId: string) =>
    api.get(`/profiles/freelancer/user/${userId}`),

  /** Obtiene servicios de un freelancer */
  getServices: (id: string) => api.get(`/services/freelancer/${id}`),

  /** Obtiene reseñas de un freelancer */
  getReviews: (id: string) => api.get(`/reviews/freelancer/${id}`),

  /** Obtiene rating promedio de un freelancer */
  getAverageRating: (id: string) =>
    api.get(`/reviews/freelancer/${id}/average`),

  /** Actualiza perfil de freelancer (requiere auth) */
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/profiles/freelancer/user/${id}`, data),
};

// ============================================================================
// 🔧 SERVICES API
// ============================================================================
export const servicesAPI = {
  /** Lista todos los servicios */
  getAll: (params?: {
    category?: string;
    clinicId?: string;
    freelancerId?: string;
  }) => api.get("/services", { params }),

  /** Obtiene un servicio por ID */
  getById: (id: string) => api.get(`/services/${id}`),

  /** Lista categorías de servicios */
  getCategories: () => api.get("/services/categories"),

  /** Crea un nuevo servicio (requiere auth) */
  create: (data: {
    title: string;
    description?: string;
    priceFrom: number;
    priceTo?: number;
    category?: string;
    clinicId?: string;
    freelancerId?: string;
  }) => api.post("/services", data),

  /** Actualiza un servicio */
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/services/${id}`, data),

  /** Elimina un servicio */
  delete: (id: string) => api.delete(`/services/${id}`),
};

// ============================================================================
// 📅 APPOINTMENTS API - Corregido para usar /me endpoints
// ============================================================================
export const appointmentsAPI = {
  /** Crea una cita para el usuario actual */
  create: (data: AppointmentData) => api.post("/appointments/me", data),

  /** Obtiene las citas del usuario actual */
  getMyAppointments: (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => api.get("/appointments/me", { params }),

  /** Cancela una cita del usuario actual */
  cancelMyAppointment: (id: string) =>
    api.patch(`/appointments/me/${id}/cancel`),

  /** Lista todas las citas (admin/staff) */
  getAll: (params?: { status?: string; limit?: number; offset?: number }) =>
    api.get("/appointments", { params }),

  /** Obtiene una cita por ID */
  getById: (id: string) => api.get(`/appointments/${id}`),

  /** Actualiza una cita */
  update: (id: string, data: Partial<AppointmentData>) =>
    api.patch(`/appointments/${id}`, data),

  /** Cancela una cita por ID */
  cancel: (id: string) => api.patch(`/appointments/${id}/cancel`),
};

// ============================================================================
// 🐾 PETS API - Corregido para usar /me endpoints
// ============================================================================
export const petsAPI = {
  /** Obtiene las mascotas del usuario actual */
  getAll: () => api.get("/pets/me"),

  /** Crea una mascota para el usuario actual */
  create: (data: PetData) => api.post("/pets/me", data),

  /** Actualiza una mascota del usuario actual */
  update: (id: string, data: Partial<PetData>) =>
    api.patch(`/pets/me/${id}`, data),

  /** Elimina una mascota del usuario actual */
  delete: (id: string) => api.delete(`/pets/me/${id}`),

  /** Obtiene una mascota por ID (requiere auth) */
  getById: (id: string) => api.get(`/pets/${id}`),
};

// ============================================================================
// ⭐ REVIEWS API - Endpoints completos
// ============================================================================
export const reviewsAPI = {
  /** Crea una nueva reseña */
  create: (data: {
    clinicId?: string;
    freelancerId?: string;
    rating: number;
    comment?: string;
  }) => api.post("/reviews", data),

  /** Lista todas las reseñas */
  getAll: () => api.get("/reviews"),

  /** Obtiene una reseña por ID */
  getById: (id: string) => api.get(`/reviews/${id}`),

  /** Obtiene reseñas de una clínica */
  getByClinic: (clinicId: string) => api.get(`/reviews/clinic/${clinicId}`),

  /** Obtiene reseñas de un freelancer */
  getByFreelancer: (freelancerId: string) =>
    api.get(`/reviews/freelancer/${freelancerId}`),

  /** Obtiene reseñas del usuario actual */
  getMyReviews: () => api.get("/reviews/user/me"),

  /** Actualiza una reseña */
  update: (id: string, data: { rating?: number; comment?: string }) =>
    api.patch(`/reviews/${id}`, data),

  /** Elimina una reseña */
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// ============================================================================
// 👤 PROFILES API - Gestión de perfiles de usuario
// ============================================================================
export const profilesAPI = {
  /** Obtiene el perfil del usuario actual */
  getMe: () => api.get("/profiles/me"),

  /** Crea el perfil del usuario actual */
  create: (data: {
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
  }) => api.post("/profiles/me", data),

  /** Crea el perfil con userId explícito (para registro) */
  createWithUserId: (data: {
    userId: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
  }) => api.post("/profiles", data),

  /** Actualiza el perfil del usuario actual */
  update: (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
  }) => api.patch("/profiles/me", data),

  /** Obtiene un perfil por user ID */
  getByUserId: (userId: string) => api.get(`/profiles/${userId}`),
};

// ============================================================================
// 🏆 POINTS API - Sistema de puntos de fidelidad
// ============================================================================
export const pointsAPI = {
  /** Obtiene el balance de puntos del usuario actual */
  getMyBalance: () => api.get("/points/me/balance"),

  /** Obtiene el historial de puntos del usuario actual */
  getMyHistory: () => api.get("/points/me/history"),

  /** Canjea puntos por una recompensa */
  redeem: (data: { rewardId: string; pointsToRedeem: number }) =>
    api.post("/points/me/redeem", data),

  /** Obtiene balance de un usuario (admin) */
  getUserBalance: (userId: string) => api.get(`/points/${userId}/balance`),

  /** Obtiene historial de un usuario (admin) */
  getUserHistory: (userId: string) => api.get(`/points/${userId}/history`),

  /** Otorga puntos a un usuario (admin) */
  award: (userId: string, data: { points: number; reason: string }) =>
    api.post(`/points/${userId}/award`, data),
};

// ============================================================================
// 🌍 GEO API - Endpoints geográficos y de búsqueda
// ============================================================================
export const geoAPI = {
  /** Obtiene todas las clínicas con información de ubicación */
  getClinics: () => api.get("/geo/clinics"),

  /** Obtiene todos los veterinarios independientes con ubicación base */
  getFreelancers: () => api.get("/geo/freelancers"),

  /** Obtiene las categorías de servicios disponibles */
  getServiceCategories: () => api.get("/geo/services/categories"),

  /** Busca clínicas por texto (nombre, dirección, servicios) */
  searchClinics: (query: string) =>
    api.get("/geo/search/clinics", { params: { q: query } }),

  /** Busca veterinarios independientes por texto */
  searchFreelancers: (query: string) =>
    api.get("/geo/search/freelancers", { params: { q: query } }),

  /** Actualiza la ubicación de una clínica (requiere autenticación) */
  updateClinicLocation: (id: string, latitude: number, longitude: number) =>
    api.post(`/geo/clinics/${id}/location`, { latitude, longitude }),

  /** Actualiza la ubicación de un freelancer (requiere autenticación) */
  updateFreelancerLocation: (id: string, latitude: number, longitude: number) =>
    api.post(`/geo/freelancers/${id}/location`, { latitude, longitude }),
};

// ============================================================================
// 📅 AVAILABILITY API - Endpoints de disponibilidad
// ============================================================================
export const availabilityAPI = {
  /** Crea un nuevo slot de disponibilidad */
  create: (data: {
    clinicId?: string;
    freelancerId?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive?: boolean;
  }) => api.post("/availability", data),

  /** Obtiene disponibilidad de una clínica */
  getByClinic: (clinicId: string) =>
    api.get(`/availability/clinic/${clinicId}`),

  /** Obtiene disponibilidad de un freelancer */
  getByFreelancer: (freelancerId: string) =>
    api.get(`/availability/freelancer/${freelancerId}`),

  /** Obtiene slots disponibles para una fecha específica */
  getAvailableSlots: (params: {
    clinicId?: string;
    freelancerId?: string;
    date: string;
  }) => api.get("/availability/slots", { params }),

  /** Actualiza un slot de disponibilidad */
  update: (
    id: string,
    data: {
      startTime?: string;
      endTime?: string;
      isActive?: boolean;
    }
  ) => api.patch(`/availability/${id}`, data),

  /** Elimina un slot de disponibilidad */
  delete: (id: string) => api.delete(`/availability/${id}`),
};

export default api;
