/**
 * API Constants
 * Centralized configuration values for the API
 */

export const API_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  DEFAULT_PAGE: 1,

  // Cache
  CACHE_TTL: 300, // 5 minutes
  SWR_TTL: 60, // 1 minute

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  // Rate Limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,

  // Points System
  POINTS_PER_SERVICE_COMPLETED: 100,
  POINTS_REDEEMPTION_RATIO: 100, // 100 points = 1 unit of currency

  // Geolocation
  DEFAULT_SEARCH_RADIUS_KM: 10,
  MAX_SEARCH_RADIUS_KM: 100,

  // Appointments
  APPOINTMENT_CANCELLATION_HOURS: 24,
  APPOINTMENT_REMINDER_HOURS: 2,
} as const;

export const ERROR_MESSAGES = {
  // General
  INTERNAL_SERVER_ERROR: 'Internal server error',
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',

  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  ACCESS_DENIED: 'Access denied',

  // Validation
  VALIDATION_ERROR: 'Validation failed',
  INVALID_UUID: 'Invalid UUID format',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PHONE: 'Invalid phone number format',

  // Business Logic
  APPOINTMENT_NOT_FOUND: 'Appointment not found',
  APPOINTMENT_ALREADY_CANCELLED: 'Appointment is already cancelled',
  APPOINTMENT_CANNOT_CANCEL:
    'Cannot cancel appointment less than 24 hours before',
  INSUFFICIENT_POINTS: 'Insufficient points for this redemption',
  SERVICE_NOT_AVAILABLE: 'Service is not available',
  PET_NOT_FOUND: 'Pet not found',
  CLINIC_NOT_FOUND: 'Clinic not found',
  USER_NOT_FOUND: 'User not found',

  // File Upload
  FILE_TOO_LARGE: 'File size exceeds maximum allowed size',
  INVALID_FILE_TYPE: 'Invalid file type',
  UPLOAD_FAILED: 'File upload failed',
} as const;

export const SUCCESS_MESSAGES = {
  // General
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',

  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',

  // Business Logic
  APPOINTMENT_CREATED: 'Appointment created successfully',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully',
  APPOINTMENT_CONFIRMED: 'Appointment confirmed successfully',
  APPOINTMENT_COMPLETED: 'Appointment completed successfully',
  POINTS_EARNED: 'Points earned successfully',
  POINTS_REDEEMED: 'Points redeemed successfully',
  PET_CREATED: 'Pet created successfully',
  PET_UPDATED: 'Pet updated successfully',
  REVIEW_CREATED: 'Review created successfully',
} as const;
