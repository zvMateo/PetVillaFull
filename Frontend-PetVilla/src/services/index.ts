// ============================================================================
// 🐾 PETVILLA FRONTEND - SERVICIOS API CON TANSTACK QUERY
// ============================================================================
// Servicios API completamente alineados con la API backend
// Optimizados con TanStack Query para caching, sincronización y UX
// ============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import { toast } from "sonner";
import type {
  // Auth
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  // Profiles
  UserProfile,
  ClinicProfile,
  FreelancerProfile,

  // Pets
  Pet,

  // Services
  Service,
  ServiceCategory,
  CreateServiceRequest,
  UpdateServiceRequest,

  // Appointments
  Appointment,
  AppointmentStatus,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,

  // Reviews
  Review,
  CreateReviewRequest,
  ReviewSummary,

  // Points
  PointTransaction,
  PointBalance,

  // Availability
  AvailabilitySlot,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  AvailableSlotsResponse,

  // Geo
  SearchClinicsRequest,
  SearchFreelancersRequest,
  GeoPoint,

  // API
  PaginatedResponse,
} from "../types";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const messageFromData =
      typeof error.response?.data === "object" &&
      error.response?.data &&
      "message" in error.response.data
        ? String((error.response.data as { message?: string }).message)
        : undefined;
    return (
      messageFromData ||
      error.response?.statusText ||
      error.message ||
      "Error desconocido"
    );
  }
  if (error instanceof Error) return error.message;
  return "Error desconocido";
};

// ============================================================================
// 🔐 AUTENTICACIÓN
// ============================================================================

export const authService = {
  // Login
  useLogin: () => {
    return useMutation({
      mutationFn: async (data: LoginRequest): Promise<AuthTokens> => {
        const response = await api.post("/auth/login", data);
        return response.data;
      },
      onSuccess: (data) => {
        useAuthStore
          .getState()
          .setTokens(data.access_token, data.refresh_token);
        toast.success("Inicio de sesión exitoso");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Register
  useRegister: () => {
    return useMutation({
      mutationFn: async (data: RegisterRequest): Promise<AuthTokens> => {
        const response = await api.post("/auth/register", data);
        return response.data;
      },
      onSuccess: (data) => {
        useAuthStore
          .getState()
          .setTokens(data.access_token, data.refresh_token);
        toast.success("Registro exitoso");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Logout
  logout: () => {
    useAuthStore.getState().logout();
    window.location.href = "/login";
  },
};

// ============================================================================
// 👤 PERFILES DE USUARIO
// ============================================================================

export const profileService = {
  // Get current user profile
  useMyProfile: () => {
    return useQuery({
      queryKey: ["profile", "me"],
      queryFn: async (): Promise<UserProfile> => {
        const response = await api.get("/profiles/me");
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  // Update user profile
  useUpdateProfile: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        const response = await api.patch("/profiles/me", data);
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.setQueryData(["profile", "me"], data);
        toast.success("Perfil actualizado");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Get clinic profile
  useClinicProfile: (id: string) => {
    return useQuery({
      queryKey: ["clinic", id],
      queryFn: async (): Promise<ClinicProfile> => {
        const response = await api.get(`/profiles/clinic/${id}`);
        return response.data;
      },
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },

  // Get freelancer profile
  useFreelancerProfile: (id: string) => {
    return useQuery({
      queryKey: ["freelancer", id],
      queryFn: async (): Promise<FreelancerProfile> => {
        const response = await api.get(`/profiles/freelancer/${id}`);
        return response.data;
      },
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },
};

// ============================================================================
// 🐾 MASCOTAS
// ============================================================================

export const petService = {
  // Get user's pets
  useMyPets: () => {
    return useQuery({
      queryKey: ["pets", "me"],
      queryFn: async (): Promise<Pet[]> => {
        const response = await api.get("/pets/me");
        return response.data;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  },

  // Get pet by ID
  usePet: (id: string) => {
    return useQuery({
      queryKey: ["pet", id],
      queryFn: async (): Promise<Pet> => {
        const response = await api.get(`/pets/${id}`);
        return response.data;
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  // Create pet
  useCreatePet: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (
        data: Omit<Pet, "id" | "ownerId" | "createdAt">
      ): Promise<Pet> => {
        const response = await api.post("/pets", data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pets", "me"] });
        toast.success("Mascota registrada exitosamente");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Update pet
  useUpdatePet: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: Partial<Pet>;
      }): Promise<Pet> => {
        const response = await api.patch(`/pets/me/${id}`, data);
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["pets", "me"] });
        queryClient.setQueryData(["pet", data.id], data);
        toast.success("Mascota actualizada");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Delete pet
  useDeletePet: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (id: string): Promise<void> => {
        await api.delete(`/pets/me/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pets", "me"] });
        toast.success("Mascota eliminada");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },
};

// ============================================================================
// 🏥 SERVICIOS VETERINARIOS
// ============================================================================

export const serviceService = {
  // Get all services with pagination
  useServices: (params?: {
    page?: number;
    limit?: number;
    category?: string;
  }) => {
    return useQuery({
      queryKey: ["services", params],
      queryFn: async (): Promise<PaginatedResponse<Service>> => {
        const response = await api.get("/services", { params });
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  // Get service categories
  useServiceCategories: () => {
    return useQuery({
      queryKey: ["services", "categories"],
      queryFn: async (): Promise<ServiceCategory[]> => {
        const response = await api.get("/services/categories");
        return response.data;
      },
      staleTime: 30 * 60 * 1000, // 30 minutes (categories don't change often)
    });
  },

  // Get service by ID
  useService: (id: string) => {
    return useQuery({
      queryKey: ["service", id],
      queryFn: async (): Promise<Service> => {
        const response = await api.get(`/services/${id}`);
        return response.data;
      },
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },

  // Get clinic services
  useClinicServices: (clinicId: string) => {
    return useQuery({
      queryKey: ["services", "clinic", clinicId],
      queryFn: async (): Promise<Service[]> => {
        const response = await api.get(`/services/clinic/${clinicId}`);
        return response.data;
      },
      enabled: !!clinicId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  // Get freelancer services
  useFreelancerServices: (freelancerId: string) => {
    return useQuery({
      queryKey: ["services", "freelancer", freelancerId],
      queryFn: async (): Promise<Service[]> => {
        const response = await api.get(`/services/freelancer/${freelancerId}`);
        return response.data;
      },
      enabled: !!freelancerId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  // Create service (admin/freelancer only)
  useCreateService: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: CreateServiceRequest): Promise<Service> => {
        const response = await api.post("/services", data);
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["services"] });
        if (data.clinicId) {
          queryClient.invalidateQueries({
            queryKey: ["services", "clinic", data.clinicId],
          });
        }
        if (data.freelancerId) {
          queryClient.invalidateQueries({
            queryKey: ["services", "freelancer", data.freelancerId],
          });
        }
        toast.success("Servicio creado exitosamente");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Update service
  useUpdateService: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: UpdateServiceRequest;
      }): Promise<Service> => {
        const response = await api.patch(`/services/${id}`, data);
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["services"] });
        queryClient.setQueryData(["service", data.id], data);
        if (data.clinicId) {
          queryClient.invalidateQueries({
            queryKey: ["services", "clinic", data.clinicId],
          });
        }
        if (data.freelancerId) {
          queryClient.invalidateQueries({
            queryKey: ["services", "freelancer", data.freelancerId],
          });
        }
        toast.success("Servicio actualizado");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Delete service
  useDeleteService: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (id: string): Promise<void> => {
        await api.delete(`/services/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast.success("Servicio eliminado");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },
};

// ============================================================================
// 📅 CITAS (APPOINTMENTS)
// ============================================================================

export const appointmentService = {
  // Get user's appointments
  useMyAppointments: (status?: AppointmentStatus) => {
    return useQuery({
      queryKey: ["appointments", "me", status],
      queryFn: async (): Promise<Appointment[]> => {
        const params = status ? { status } : {};
        const response = await api.get("/appointments/me", { params });
        return response.data;
      },
      staleTime: 1 * 60 * 1000, // 1 minute (appointments change frequently)
    });
  },

  // Get appointment by ID
  useAppointment: (id: string) => {
    return useQuery({
      queryKey: ["appointment", id],
      queryFn: async (): Promise<Appointment> => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
      },
      enabled: !!id,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  },

  // Create appointment
  useCreateAppointment: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (
        data: CreateAppointmentRequest
      ): Promise<Appointment> => {
        const response = await api.post("/appointments", data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
        queryClient.invalidateQueries({ queryKey: ["points", "balance"] });
        toast.success("Cita agendada exitosamente");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Update appointment
  useUpdateAppointment: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: UpdateAppointmentRequest;
      }): Promise<Appointment> => {
        const response = await api.patch(`/appointments/${id}`, data);
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
        queryClient.setQueryData(["appointment", data.id], data);
        if (data.status === "COMPLETED") {
          queryClient.invalidateQueries({ queryKey: ["points", "balance"] });
        }
        toast.success("Cita actualizada");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Cancel appointment
  useCancelAppointment: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (id: string): Promise<Appointment> => {
        const response = await api.patch(`/appointments/${id}`, {
          status: "CANCELLED",
        });
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
        queryClient.setQueryData(["appointment", data.id], data);
        toast.success("Cita cancelada");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },
};

// ============================================================================
// ⭐ RESEÑAS Y CALIFICACIONES
// ============================================================================

export const reviewService = {
  // Get all reviews
  useReviews: (params?: { page?: number; limit?: number }) => {
    return useQuery({
      queryKey: ["reviews", params],
      queryFn: async (): Promise<PaginatedResponse<Review>> => {
        const response = await api.get("/reviews", { params });
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  // Get reviews for clinic/freelancer
  useTargetReviews: (targetId: string, type: "clinic" | "freelancer") => {
    return useQuery({
      queryKey: ["reviews", type, targetId],
      queryFn: async (): Promise<Review[]> => {
        const endpoint =
          type === "clinic"
            ? `/reviews/clinic/${targetId}`
            : `/reviews/freelancer/${targetId}`;
        const response = await api.get(endpoint);
        return response.data;
      },
      enabled: !!targetId,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },

  // Get user's reviews
  useMyReviews: () => {
    return useQuery({
      queryKey: ["reviews", "me"],
      queryFn: async (): Promise<Review[]> => {
        const response = await api.get("/reviews/me");
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  // Get rating summary
  useRatingSummary: (targetId: string, type: "clinic" | "freelancer") => {
    return useQuery({
      queryKey: ["reviews", "rating", type, targetId],
      queryFn: async (): Promise<ReviewSummary> => {
        const endpoint =
          type === "clinic"
            ? `/reviews/clinic/${targetId}/rating`
            : `/reviews/freelancer/${targetId}/rating`;
        const response = await api.get(endpoint);
        return response.data;
      },
      enabled: !!targetId,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },

  // Create review
  useCreateReview: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: CreateReviewRequest): Promise<Review> => {
        const response = await api.post("/reviews", data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        queryClient.invalidateQueries({ queryKey: ["reviews", "rating"] });
        queryClient.invalidateQueries({ queryKey: ["reviews", "me"] });
        toast.success("Reseña publicada exitosamente");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Update review
  useUpdateReview: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: Partial<CreateReviewRequest>;
      }): Promise<Review> => {
        const response = await api.patch(`/reviews/${id}`, data);
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        queryClient.invalidateQueries({ queryKey: ["reviews", "rating"] });
        queryClient.setQueryData(["review", data.id], data);
        toast.success("Reseña actualizada");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Delete review
  useDeleteReview: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (id: string): Promise<void> => {
        await api.delete(`/reviews/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        queryClient.invalidateQueries({ queryKey: ["reviews", "rating"] });
        toast.success("Reseña eliminada");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },
};

// ============================================================================
// 🎯 SISTEMA DE PUNTOS (LOYALTY)
// ============================================================================

export const pointsService = {
  // Get user's points balance
  usePointsBalance: () => {
    return useQuery({
      queryKey: ["points", "balance"],
      queryFn: async (): Promise<PointBalance> => {
        const response = await api.get("/points/me/balance");
        return response.data;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  },

  // Get points transactions
  usePointsTransactions: (params?: { page?: number; limit?: number }) => {
    return useQuery({
      queryKey: ["points", "transactions", params],
      queryFn: async (): Promise<PaginatedResponse<PointTransaction>> => {
        const response = await api.get("/points/me/transactions", { params });
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },
};

// ============================================================================
// 📊 DISPONIBILIDAD (AVAILABILITY)
// ============================================================================

export const availabilityService = {
  // Get clinic availability
  useClinicAvailability: (clinicId: string) => {
    return useQuery({
      queryKey: ["availability", "clinic", clinicId],
      queryFn: async (): Promise<AvailabilitySlot[]> => {
        const response = await api.get(`/availability/clinic/${clinicId}`);
        return response.data;
      },
      enabled: !!clinicId,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },

  // Get freelancer availability
  useFreelancerAvailability: (freelancerId: string) => {
    return useQuery({
      queryKey: ["availability", "freelancer", freelancerId],
      queryFn: async (): Promise<AvailabilitySlot[]> => {
        const response = await api.get(
          `/availability/freelancer/${freelancerId}`
        );
        return response.data;
      },
      enabled: !!freelancerId,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },

  // Get available slots for specific day
  useAvailableSlots: (
    targetId: string,
    type: "clinic" | "freelancer",
    date: string
  ) => {
    return useQuery({
      queryKey: ["availability", "slots", type, targetId, date],
      queryFn: async (): Promise<AvailableSlotsResponse> => {
        const endpoint =
          type === "clinic"
            ? `/availability/clinic/${targetId}/slots`
            : `/availability/freelancer/${targetId}/slots`;
        const response = await api.get(endpoint, { params: { date } });
        return response.data;
      },
      enabled: !!targetId && !!date,
      staleTime: 30 * 60 * 1000, // 30 minutes (availability doesn't change often)
    });
  },

  // Create availability slot (admin/freelancer only)
  useCreateAvailability: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (
        data: CreateAvailabilityRequest
      ): Promise<AvailabilitySlot> => {
        const response = await api.post("/availability", data);
        return response.data;
      },
      onSuccess: (data) => {
        if (data.clinicId) {
          queryClient.invalidateQueries({
            queryKey: ["availability", "clinic", data.clinicId],
          });
        }
        if (data.freelancerId) {
          queryClient.invalidateQueries({
            queryKey: ["availability", "freelancer", data.freelancerId],
          });
        }
        toast.success("Horario de disponibilidad creado");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Update availability slot
  useUpdateAvailability: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: UpdateAvailabilityRequest;
      }): Promise<AvailabilitySlot> => {
        const response = await api.patch(`/availability/${id}`, data);
        return response.data;
      },
      onSuccess: (data) => {
        if (data.clinicId) {
          queryClient.invalidateQueries({
            queryKey: ["availability", "clinic", data.clinicId],
          });
        }
        if (data.freelancerId) {
          queryClient.invalidateQueries({
            queryKey: ["availability", "freelancer", data.freelancerId],
          });
        }
        queryClient.invalidateQueries({ queryKey: ["availability", "slots"] });
        toast.success("Horario actualizado");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Delete availability slot
  useDeleteAvailability: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (id: string): Promise<void> => {
        await api.delete(`/availability/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast.success("Servicio eliminado");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },
};

// ============================================================================
// 🌍 GEOLOCALIZACIÓN Y BÚSQUEDA
// ============================================================================

export const geoService = {
  // Search clinics
  useSearchClinics: (params: SearchClinicsRequest) => {
    return useQuery({
      queryKey: ["search", "clinics", params],
      queryFn: async (): Promise<ClinicProfile[]> => {
        const response = await api.get("/geo/clinics/search", { params });
        return response.data;
      },
      enabled: !!(params.query || params.location),
      staleTime: 2 * 60 * 1000, // 2 minutes (search results can change)
    });
  },

  // Search freelancers
  useSearchFreelancers: (params: SearchFreelancersRequest) => {
    return useQuery({
      queryKey: ["search", "freelancers", params],
      queryFn: async (): Promise<FreelancerProfile[]> => {
        const response = await api.get("/geo/freelancers/search", { params });
        return response.data;
      },
      enabled: !!(params.query || params.location),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  },

  // Get all clinics (public)
  useClinics: () => {
    return useQuery({
      queryKey: ["clinics", "public"],
      queryFn: async (): Promise<ClinicProfile[]> => {
        const response = await api.get("/geo/clinics");
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  // Get all freelancers (public)
  useFreelancers: () => {
    return useQuery({
      queryKey: ["freelancers", "public"],
      queryFn: async (): Promise<FreelancerProfile[]> => {
        const response = await api.get("/geo/freelancers");
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  // Get service categories (public)
  useServiceCategoriesPublic: () => {
    return useQuery({
      queryKey: ["categories", "public"],
      queryFn: async (): Promise<string[]> => {
        const response = await api.get("/geo/categories");
        return response.data;
      },
      staleTime: 30 * 60 * 1000, // 30 minutes
    });
  },

  // Update clinic location (admin only)
  useUpdateClinicLocation: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        location,
      }: {
        id: string;
        location: GeoPoint;
      }): Promise<ClinicProfile> => {
        const response = await api.post(`/geo/clinics/${id}/location`, {
          location,
        });
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["clinics"] });
        queryClient.setQueryData(["clinic", data.id], data);
        toast.success("Ubicación actualizada");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },

  // Update freelancer location
  useUpdateFreelancerLocation: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        location,
      }: {
        id: string;
        location: GeoPoint;
      }): Promise<FreelancerProfile> => {
        const response = await api.post(`/geo/freelancers/${id}/location`, {
          location,
        });
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["freelancers"] });
        queryClient.setQueryData(["freelancer", data.id], data);
        toast.success("Ubicación actualizada");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  },
};

// ============================================================================
// 🎯 EXPORTACIÓN DE SERVICIOS
// ============================================================================

export const apiServices = {
  auth: authService,
  profile: profileService,
  pet: petService,
  service: serviceService,
  appointment: appointmentService,
  review: reviewService,
  points: pointsService,
  availability: availabilityService,
  geo: geoService,
};
