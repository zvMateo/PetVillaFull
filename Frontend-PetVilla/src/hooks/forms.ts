// ============================================================================
// 🐾 PETVILLA FRONTEND - HOOKS PERSONALIZADOS PARA FORMULARIOS
// ============================================================================
// Integración completa de React Hook Form + Zod + TanStack Query
// Hooks reutilizables para gestión de formularios con validación robusta
// ============================================================================

import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";

// Import services
import { apiServices } from "../services";

// Import schemas and derived form types
import { formSchemas } from "../schemas";
import type {
  LoginFormData,
  RegisterFormData,
  UpdateProfileFormData,
  CreateClinicProfileFormData,
  CreateFreelancerProfileFormData,
  CreatePetFormData,
  UpdatePetFormData,
  CreateServiceFormData,
  UpdateServiceFormData,
  CreateAppointmentFormData,
  CreateReviewFormData,
  UpdateReviewFormData,
  CreateAvailabilityFormData,
  UpdateAvailabilityFormData,
} from "../schemas";
import type { GeoPoint } from "../types";

// ============================================================================
// 🎯 TYPES GENÉRICOS PARA HOOKS
// ============================================================================

type UseFormOptions<T extends z.ZodSchema> = {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  onSuccess?: (data: z.infer<T>) => void;
  onError?: (error: unknown) => void;
};

// ============================================================================
// 🔐 HOOKS DE AUTENTICACIÓN
// ============================================================================

export const useLoginForm = (
  options?: UseFormOptions<typeof formSchemas.login>
) => {
  const loginMutation = apiServices.auth.useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchemas.login),
    defaultValues: options?.defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await loginMutation.mutateAsync(data);
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};

export const useRegisterForm = (
  options?: UseFormOptions<typeof formSchemas.register>
) => {
  const registerMutation = apiServices.auth.useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(formSchemas.register),
    defaultValues: options?.defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await registerMutation.mutateAsync(data);
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: registerMutation.isPending,
    error: registerMutation.error,
  };
};

// ============================================================================
// 👤 HOOKS DE PERFILES
// ============================================================================

export const useUpdateProfileForm = (
  options?: UseFormOptions<typeof formSchemas.updateProfile>
) => {
  const updateProfileMutation = apiServices.profile.useUpdateProfile();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(formSchemas.updateProfile),
    defaultValues: options?.defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: updateProfileMutation.isPending,
    error: updateProfileMutation.error,
  };
};

export const useCreateClinicProfileForm = (
  options?: UseFormOptions<typeof formSchemas.createClinicProfile>
) => {
  const createClinicMutation = useMutation<
    unknown,
    unknown,
    CreateClinicProfileFormData
  >({
    mutationFn: async () => {
      // This would need to be implemented in the API service
      // For now, this is a placeholder
      throw new Error("Create clinic profile not implemented yet");
    },
    onSuccess: (_data, variables) => {
      toast.success("Perfil de clínica creado exitosamente");
      options?.onSuccess?.(variables);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error instanceof Error ? error.message : undefined);
      toast.error(message || "Error al crear perfil de clínica");
      options?.onError?.(error);
    },
  });

  const form = useForm<CreateClinicProfileFormData>({
    resolver: zodResolver(
      formSchemas.createClinicProfile
    ) as Resolver<CreateClinicProfileFormData>,
    defaultValues: {
      is24Hours: false,
      ...options?.defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createClinicMutation.mutateAsync(data);
    } catch {
      // Error already handled in mutation
    }
  });

  return {
    form,
    onSubmit,
    isLoading: createClinicMutation.isPending,
    error: createClinicMutation.error,
  };
};

export const useCreateFreelancerProfileForm = (
  options?: UseFormOptions<typeof formSchemas.createFreelancerProfile>
) => {
  const createFreelancerMutation = useMutation<
    unknown,
    unknown,
    CreateFreelancerProfileFormData
  >({
    mutationFn: async (data: CreateFreelancerProfileFormData) => {
      // This would need to be implemented in the API service
      // For now, this is a placeholder
      void data;
      throw new Error("Create freelancer profile not implemented yet");
    },
    onSuccess: (_data, variables) => {
      toast.success("Perfil de freelancer creado exitosamente");
      options?.onSuccess?.(variables);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error instanceof Error ? error.message : undefined);
      toast.error(message || "Error al crear perfil de freelancer");
      options?.onError?.(error);
    },
  });

  const form = useForm<CreateFreelancerProfileFormData>({
    resolver: zodResolver(formSchemas.createFreelancerProfile),
    defaultValues: options?.defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createFreelancerMutation.mutateAsync(data);
    } catch {
      // Error already handled in mutation
    }
  });

  return {
    form,
    onSubmit,
    isLoading: createFreelancerMutation.isPending,
    error: createFreelancerMutation.error,
  };
};

// ============================================================================
// 🐾 HOOKS DE MASCOTAS
// ============================================================================

export const useCreatePetForm = (
  options?: UseFormOptions<typeof formSchemas.createPet>
) => {
  const createPetMutation = apiServices.pet.useCreatePet();

  const form = useForm<CreatePetFormData>({
    resolver: zodResolver(formSchemas.createPet),
    defaultValues: options?.defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createPetMutation.mutateAsync(data);
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: createPetMutation.isPending,
    error: createPetMutation.error,
  };
};

export const useUpdatePetForm = (
  petId: string,
  options?: UseFormOptions<typeof formSchemas.updatePet>
) => {
  const updatePetMutation = apiServices.pet.useUpdatePet();

  const form = useForm<UpdatePetFormData>({
    resolver: zodResolver(formSchemas.updatePet),
    defaultValues: options?.defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updatePetMutation.mutateAsync({ id: petId, data });
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: updatePetMutation.isPending,
    error: updatePetMutation.error,
  };
};

// ============================================================================
// 🏥 HOOKS DE SERVICIOS
// ============================================================================

export const useCreateServiceForm = (
  options?: UseFormOptions<typeof formSchemas.createService> & {
    clinicId?: string;
    freelancerId?: string;
  }
) => {
  const createServiceMutation = apiServices.service.useCreateService();

  const form = useForm<CreateServiceFormData>({
    resolver: zodResolver(formSchemas.createService),
    defaultValues: {
      pointsReward: 10, // Default 10 points
      ...options?.defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const serviceData = {
        ...data,
        clinicId: options?.clinicId,
        freelancerId: options?.freelancerId,
      };
      await createServiceMutation.mutateAsync(serviceData);
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: createServiceMutation.isPending,
    error: createServiceMutation.error,
  };
};

export const useUpdateServiceForm = (
  serviceId: string,
  options?: UseFormOptions<typeof formSchemas.updateService>
) => {
  const updateServiceMutation = apiServices.service.useUpdateService();

  const form = useForm<UpdateServiceFormData>({
    resolver: zodResolver(formSchemas.updateService),
    defaultValues: options?.defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateServiceMutation.mutateAsync({ id: serviceId, data });
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: updateServiceMutation.isPending,
    error: updateServiceMutation.error,
  };
};

// ============================================================================
// 📅 HOOKS DE CITAS
// ============================================================================

export const useCreateAppointmentForm = (
  options?: UseFormOptions<typeof formSchemas.createAppointment>
) => {
  const createAppointmentMutation =
    apiServices.appointment.useCreateAppointment();

  const form = useForm<CreateAppointmentFormData>({
    resolver: zodResolver(formSchemas.createAppointment),
    defaultValues: options?.defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createAppointmentMutation.mutateAsync(data);
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: createAppointmentMutation.isPending,
    error: createAppointmentMutation.error,
  };
};

// ============================================================================
// ⭐ HOOKS DE RESEÑAS
// ============================================================================

export const useCreateReviewForm = (
  options?: UseFormOptions<typeof formSchemas.createReview>
) => {
  const createReviewMutation = apiServices.review.useCreateReview();

  const form = useForm<CreateReviewFormData>({
    resolver: zodResolver(formSchemas.createReview),
    defaultValues: {
      rating: 5, // Default 5 stars
      ...options?.defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createReviewMutation.mutateAsync(data);
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: createReviewMutation.isPending,
    error: createReviewMutation.error,
  };
};

export const useUpdateReviewForm = (
  reviewId: string,
  options?: UseFormOptions<typeof formSchemas.updateReview>
) => {
  const updateReviewMutation = apiServices.review.useUpdateReview();

  const form = useForm<UpdateReviewFormData>({
    resolver: zodResolver(formSchemas.updateReview),
    defaultValues: options?.defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateReviewMutation.mutateAsync({ id: reviewId, data });
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: updateReviewMutation.isPending,
    error: updateReviewMutation.error,
  };
};

// ============================================================================
// 📊 HOOKS DE DISPONIBILIDAD
// ============================================================================

export const useCreateAvailabilityForm = (
  options?: UseFormOptions<typeof formSchemas.createAvailability> & {
    clinicId?: string;
    freelancerId?: string;
  }
) => {
  const createAvailabilityMutation =
    apiServices.availability.useCreateAvailability();

  const form = useForm<CreateAvailabilityFormData>({
    resolver: zodResolver(formSchemas.createAvailability),
    defaultValues: options?.defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const availabilityData = {
        ...data,
        clinicId: options?.clinicId,
        freelancerId: options?.freelancerId,
      };
      await createAvailabilityMutation.mutateAsync(availabilityData);
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: createAvailabilityMutation.isPending,
    error: createAvailabilityMutation.error,
  };
};

export const useUpdateAvailabilityForm = (
  availabilityId: string,
  options?: UseFormOptions<typeof formSchemas.updateAvailability>
) => {
  const updateAvailabilityMutation =
    apiServices.availability.useUpdateAvailability();

  const form = useForm<UpdateAvailabilityFormData>({
    resolver: zodResolver(formSchemas.updateAvailability),
    defaultValues: options?.defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateAvailabilityMutation.mutateAsync({
        id: availabilityId,
        data,
      });
      options?.onSuccess?.(data);
    } catch (error) {
      options?.onError?.(error);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: updateAvailabilityMutation.isPending,
    error: updateAvailabilityMutation.error,
  };
};

// ============================================================================
// 🌍 HOOKS DE GEOLOCALIZACIÓN
// ============================================================================

export const useUpdateClinicLocationForm = (clinicId: string) => {
  const updateLocationMutation = apiServices.geo.useUpdateClinicLocation();

  return useMutation({
    mutationFn: async (location: GeoPoint) => {
      return updateLocationMutation.mutateAsync({ id: clinicId, location });
    },
    onSuccess: () => {
      toast.success("Ubicación de clínica actualizada");
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Error al actualizar ubicación"
      );
    },
  });
};

export const useUpdateFreelancerLocationForm = (freelancerId: string) => {
  const updateLocationMutation = apiServices.geo.useUpdateFreelancerLocation();

  return useMutation({
    mutationFn: async (location: GeoPoint) => {
      return updateLocationMutation.mutateAsync({ id: freelancerId, location });
    },
    onSuccess: () => {
      toast.success("Ubicación de freelancer actualizada");
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Error al actualizar ubicación"
      );
    },
  });
};

// ============================================================================
// 🎯 EXPORTACIÓN DE HOOKS
// ============================================================================

export const formHooks = {
  // Auth
  useLoginForm,
  useRegisterForm,

  // Profile
  useUpdateProfileForm,
  useCreateClinicProfileForm,
  useCreateFreelancerProfileForm,

  // Pets
  useCreatePetForm,
  useUpdatePetForm,

  // Services
  useCreateServiceForm,
  useUpdateServiceForm,

  // Appointments
  useCreateAppointmentForm,

  // Reviews
  useCreateReviewForm,
  useUpdateReviewForm,

  // Availability
  useCreateAvailabilityForm,
  useUpdateAvailabilityForm,

  // Geo
  useUpdateClinicLocationForm,
  useUpdateFreelancerLocationForm,
};
