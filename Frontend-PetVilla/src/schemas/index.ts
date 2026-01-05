// ============================================================================
// 🐾 PETVILLA FRONTEND - ESQUEMAS ZOD PARA VALIDACIÓN
// ============================================================================
// Validación robusta de formularios con Zod
// Alineados con los tipos TypeScript y DTOs del backend
// ============================================================================

import { z } from "zod";
// (Sin imports adicionales requeridos)

const geoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z
    .tuple([z.number(), z.number()]) // [lng, lat]
    .refine(
      ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
      "Coordenadas inválidas"
    ),
});

// ============================================================================
// 🔐 AUTENTICACIÓN
// ============================================================================

export const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z
  .object({
    email: z.string().min(1, "El email es requerido").email("Email inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número"
      ),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(1, "El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres"),
    lastName: z
      .string()
      .min(1, "El apellido es requerido")
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede exceder 50 caracteres"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
        "Número de teléfono inválido"
      ),
    role: z.enum(["CONSUMER", "VET_INDIVIDUAL", "CLINIC_ADMIN"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================================================
// 👤 PERFILES DE USUARIO
// ============================================================================

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  lastName: z
    .string()
    .min(1, "El apellido es requerido")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      "Número de teléfono inválido"
    ),
  avatarUrl: z
    .string()
    .url("URL de avatar inválida")
    .optional()
    .or(z.literal("")),
});

export const createClinicProfileSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre de la clínica es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  address: z
    .string()
    .min(1, "La dirección es requerida")
    .min(10, "La dirección debe tener al menos 10 caracteres"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      "Número de teléfono inválido"
    ),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  website: z
    .string()
    .url("URL del sitio web inválida")
    .optional()
    .or(z.literal("")),
  is24Hours: z.boolean().default(false),
  imageUrl: z
    .string()
    .url("URL de imagen inválida")
    .optional()
    .or(z.literal("")),
});

export const createFreelancerProfileSchema = z.object({
  bio: z
    .string()
    .max(1000, "La biografía no puede exceder 1000 caracteres")
    .optional(),
  licenseNumber: z
    .string()
    .min(1, "El número de matrícula es requerido")
    .min(5, "El número de matrícula debe tener al menos 5 caracteres"),
  specialties: z
    .array(
      z.string().min(1, "Cada especialidad debe tener al menos 1 caracter")
    )
    .min(1, "Debes seleccionar al menos una especialidad")
    .max(10, "No puedes seleccionar más de 10 especialidades"),
  serviceRadiusKm: z
    .number()
    .min(1, "El radio debe ser al menos 1 km")
    .max(500, "El radio no puede exceder 500 km"),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type CreateClinicProfileFormData = z.infer<
  typeof createClinicProfileSchema
>;
export type CreateFreelancerProfileFormData = z.infer<
  typeof createFreelancerProfileSchema
>;

// ============================================================================
// 🐾 MASCOTAS
// ============================================================================

export const createPetSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre de la mascota es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  species: z.enum(["DOG", "CAT", "BIRD", "OTHER"]),
  breed: z
    .string()
    .max(50, "La raza no puede exceder 50 caracteres")
    .optional(),
  birthDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Fecha de nacimiento inválida (formato: YYYY-MM-DD)"
    ),
  weight: z
    .number()
    .positive("El peso debe ser un número positivo")
    .max(500, "El peso no puede exceder 500 kg")
    .optional(),
  notes: z
    .string()
    .max(1000, "Las notas no pueden exceder 1000 caracteres")
    .optional(),
  imageUrl: z
    .string()
    .url("URL de imagen inválida")
    .optional()
    .or(z.literal("")),
});

export const updatePetSchema = createPetSchema.partial();

export type CreatePetFormData = z.infer<typeof createPetSchema>;
export type UpdatePetFormData = z.infer<typeof updatePetSchema>;

// ============================================================================
// 🏥 SERVICIOS VETERINARIOS
// ============================================================================

export const createServiceSchema = z
  .object({
    clinicId: z.string().uuid().optional(),
    freelancerId: z.string().uuid().optional(),
    title: z
      .string()
      .min(1, "El título del servicio es requerido")
      .min(5, "El título debe tener al menos 5 caracteres")
      .max(100, "El título no puede exceder 100 caracteres"),
    description: z
      .string()
      .max(500, "La descripción no puede exceder 500 caracteres")
      .optional(),
    category: z
      .string()
      .min(1, "La categoría es requerida")
      .min(2, "La categoría debe tener al menos 2 caracteres"),
    priceFrom: z
      .number()
      .positive("El precio debe ser un número positivo")
      .max(10000, "El precio no puede exceder $10,000"),
    duration: z
      .number()
      .int("La duración debe ser un número entero")
      .positive("La duración debe ser un número positivo")
      .max(480, "La duración no puede exceder 8 horas (480 minutos)")
      .optional(),
    pointsReward: z
      .number()
      .int("Los puntos deben ser un número entero")
      .min(0, "Los puntos no pueden ser negativos")
      .max(1000, "Los puntos no pueden exceder 1000"),
  })
  .refine((data) => data.clinicId || data.freelancerId, {
    message: "Debes seleccionar una clínica o veterinario independiente",
    path: ["clinicId"],
  });

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceFormData = z.infer<typeof createServiceSchema>;
export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;

// ============================================================================
// 📅 CITAS (APPOINTMENTS)
// ============================================================================

export const createAppointmentSchema = z
  .object({
    serviceId: z
      .string()
      .min(1, "Debes seleccionar un servicio")
      .uuid("ID de servicio inválido"),
    petId: z
      .string()
      .min(1, "Debes seleccionar una mascota")
      .uuid("ID de mascota inválido"),
    dateTime: z
      .string()
      .min(1, "La fecha y hora son requeridas")
      .refine((val) => {
        const date = new Date(val);
        return date > new Date();
      }, "La cita debe ser en el futuro"),
    notes: z
      .string()
      .max(500, "Las notas no pueden exceder 500 caracteres")
      .optional(),
    location: geoPointSchema.optional(),
  })
  .refine(
    (data) => {
      // Validar que la fecha esté en formato correcto
      const date = new Date(data.dateTime);
      return !isNaN(date.getTime());
    },
    {
      message: "Fecha y hora inválidas",
      path: ["dateTime"],
    }
  );

export type CreateAppointmentFormData = z.infer<typeof createAppointmentSchema>;

// ============================================================================
// ⭐ RESEÑAS Y CALIFICACIONES
// ============================================================================

export const createReviewSchema = z.object({
  targetId: z
    .string()
    .min(1, "Debes seleccionar un proveedor")
    .uuid("ID de proveedor inválido"),
  rating: z
    .number()
    .int("La calificación debe ser un número entero")
    .min(1, "La calificación mínima es 1 estrella")
    .max(5, "La calificación máxima es 5 estrellas"),
  comment: z
    .string()
    .max(1000, "El comentario no puede exceder 1000 caracteres")
    .optional(),
});

export const updateReviewSchema = createReviewSchema.partial();

export type CreateReviewFormData = z.infer<typeof createReviewSchema>;
export type UpdateReviewFormData = z.infer<typeof updateReviewSchema>;

// ============================================================================
// 📊 DISPONIBILIDAD (AVAILABILITY)
// ============================================================================

export const createAvailabilitySchema = z
  .object({
    dayOfWeek: z
      .number()
      .int("El día de la semana debe ser un número entero")
      .min(0, "El día debe ser 0 (Domingo) o mayor")
      .max(6, "El día no puede ser mayor a 6 (Sábado)"),
    startTime: z
      .string()
      .min(1, "La hora de inicio es requerida")
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Formato de hora inválido (HH:mm)"
      ),
    endTime: z
      .string()
      .min(1, "La hora de fin es requerida")
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Formato de hora inválido (HH:mm)"
      ),
  })
  .refine(
    (data) => {
      // Validar que endTime sea posterior a startTime
      const start = new Date(`2000-01-01T${data.startTime}:00`);
      const end = new Date(`2000-01-01T${data.endTime}:00`);
      return end > start;
    },
    {
      message: "La hora de fin debe ser posterior a la hora de inicio",
      path: ["endTime"],
    }
  );

export const updateAvailabilitySchema = createAvailabilitySchema.partial();

export type CreateAvailabilityFormData = z.infer<
  typeof createAvailabilitySchema
>;
export type UpdateAvailabilityFormData = z.infer<
  typeof updateAvailabilitySchema
>;

export const searchFiltersSchema = z.object({
  category: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  priceRange: z
    .object({
      min: z.number().min(0),
      max: z.number().positive(),
    })
    .optional(),
  distance: z.number().positive().max(500).optional(),
  availableToday: z.boolean().optional(),
  is24Hours: z.boolean().optional(),
});

export const searchClinicsSchema = z.object({
  query: z.string().optional(),
  location: geoPointSchema.optional(),
  radius: z.number().positive().max(500).optional(),
  filters: searchFiltersSchema.optional(),
});

export const searchFreelancersSchema = z.object({
  query: z.string().optional(),
  location: geoPointSchema.optional(),
  radius: z.number().positive().max(500).optional(),
  filters: searchFiltersSchema.optional(),
});

export type GeoPointFormData = z.infer<typeof geoPointSchema>;
export type SearchFiltersFormData = z.infer<typeof searchFiltersSchema>;
export type SearchClinicsFormData = z.infer<typeof searchClinicsSchema>;
export type SearchFreelancersFormData = z.infer<typeof searchFreelancersSchema>;

// ============================================================================
// 🎯 EXPORTACIÓN DE ESQUEMAS
// ============================================================================

export const formSchemas = {
  // Auth
  login: loginSchema,
  register: registerSchema,

  // Profile
  updateProfile: updateProfileSchema,
  createClinicProfile: createClinicProfileSchema,
  createFreelancerProfile: createFreelancerProfileSchema,

  // Pets
  createPet: createPetSchema,
  updatePet: updatePetSchema,

  // Services
  createService: createServiceSchema,
  updateService: updateServiceSchema,

  // Appointments
  createAppointment: createAppointmentSchema,

  // Reviews
  createReview: createReviewSchema,
  updateReview: updateReviewSchema,

  // Availability
  createAvailability: createAvailabilitySchema,
  updateAvailability: updateAvailabilitySchema,

  // Geo
  geoPoint: geoPointSchema,
  searchFilters: searchFiltersSchema,
  searchClinics: searchClinicsSchema,
  searchFreelancers: searchFreelancersSchema,
};
