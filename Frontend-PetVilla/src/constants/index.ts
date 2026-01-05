/**
 * Constants for PetVilla Application
 * Centralized configuration values
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  STORAGE_KEYS: {
    AUTH_TOKEN: "auth_token",
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: "PetVilla",
  VERSION: "1.0.0",
  DESCRIPTION: "Plataforma de Servicios Veterinarios",
  AUTHOR: "PetVilla Team",
} as const;

// UI Constants
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  INFINITE_SCROLL_THRESHOLD: 100,
  TOAST_DURATION: 4000,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER: "user",
  CLINICS: "clinics",
  FREELANCERS: "freelancers",
  APPOINTMENTS: "appointments",
  PETS: "pets",
  SERVICES: "services",
  REVIEWS: "reviews",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CLINICS: "/clinics",
  FREELANCERS: "/freelancers",
  APPOINTMENTS: "/appointments",
  PETS: "/pets",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  BOOKING: "/booking",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Error de conexión. Por favor, verifica tu internet.",
  UNAUTHORIZED: "No tienes permisos para realizar esta acción.",
  NOT_FOUND: "El recurso solicitado no fue encontrado.",
  SERVER_ERROR: "Error interno del servidor. Inténtalo más tarde.",
  VALIDATION_ERROR: "Por favor, verifica los datos ingresados.",
  GENERIC_ERROR: "Ocurrió un error inesperado.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  APPOINTMENT_CREATED: "Cita agendada exitosamente.",
  APPOINTMENT_CANCELLED: "Cita cancelada exitosamente.",
  PROFILE_UPDATED: "Perfil actualizado exitosamente.",
  PET_CREATED: "Mascota registrada exitosamente.",
  PET_UPDATED: "Mascota actualizada exitosamente.",
  REVIEW_SUBMITTED: "Reseña enviada exitosamente.",
} as const;
