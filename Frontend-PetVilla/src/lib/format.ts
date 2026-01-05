// ============================================================================
// 🇦🇷 UTILIDADES DE FORMATO - ARGENTINA
// ============================================================================
// Funciones para formatear moneda, fechas y números según estándares argentinos
// ============================================================================

import { format, formatDistance, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";

// ============================================================================
// 💰 FORMATO DE MONEDA (ARS)
// ============================================================================

/**
 * Formatea un número como moneda argentina (pesos)
 * @param amount - Monto a formatear
 * @param showDecimals - Mostrar decimales (default: true)
 * @returns String formateado (ej: "$ 15.000,00")
 */
export const formatCurrency = (
  amount: number | string | null | undefined,
  showDecimals: boolean = true
): string => {
  if (amount === null || amount === undefined) return "$ 0";

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return "$ 0";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(numAmount);
};

/**
 * Formatea un precio con rango (desde X)
 * @param priceFrom - Precio base
 * @returns String formateado (ej: "Desde $ 5.000")
 */
export const formatPriceFrom = (
  priceFrom: number | string | null | undefined
): string => {
  if (!priceFrom) return "Consultar precio";
  return `Desde ${formatCurrency(priceFrom, false)}`;
};

/**
 * Formatea un rango de precios
 * @param min - Precio mínimo
 * @param max - Precio máximo
 * @returns String formateado
 */
export const formatPriceRange = (
  min: number | null | undefined,
  max: number | null | undefined
): string => {
  if (!min && !max) return "Consultar precio";
  if (min && !max) return formatPriceFrom(min);
  if (!min && max) return `Hasta ${formatCurrency(max, false)}`;
  return `${formatCurrency(min, false)} - ${formatCurrency(max, false)}`;
};

// ============================================================================
// 📅 FORMATO DE FECHAS
// ============================================================================

/**
 * Formatea una fecha en formato argentino
 * @param date - Fecha a formatear (string ISO, Date, o timestamp)
 * @param formatStr - Formato deseado
 * @returns String formateado
 */
export const formatDate = (
  date: string | Date | number | null | undefined,
  formatStr: string = "dd/MM/yyyy"
): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(dateObj)) return "";

  return format(dateObj, formatStr, { locale: es });
};

/**
 * Formatea fecha y hora
 * @param date - Fecha a formatear
 * @returns String formateado (ej: "30/12/2025 14:30")
 */
export const formatDateTime = (
  date: string | Date | null | undefined
): string => {
  return formatDate(date, "dd/MM/yyyy HH:mm");
};

/**
 * Formatea solo la hora
 * @param date - Fecha a formatear
 * @returns String formateado (ej: "14:30 hs")
 */
export const formatTime = (date: string | Date | null | undefined): string => {
  const time = formatDate(date, "HH:mm");
  return time ? `${time} hs` : "";
};

/**
 * Formatea fecha de forma legible
 * @param date - Fecha a formatear
 * @returns String formateado (ej: "Lunes 30 de Diciembre, 2025")
 */
export const formatDateLong = (
  date: string | Date | null | undefined
): string => {
  return formatDate(date, "EEEE d 'de' MMMM, yyyy");
};

/**
 * Formatea fecha corta con día de semana
 * @param date - Fecha a formatear
 * @returns String formateado (ej: "Lun 30 Dic")
 */
export const formatDateShort = (
  date: string | Date | null | undefined
): string => {
  return formatDate(date, "EEE d MMM");
};

/**
 * Formatea tiempo relativo (hace X tiempo)
 * @param date - Fecha a comparar
 * @returns String formateado (ej: "hace 2 horas")
 */
export const formatRelativeTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(dateObj)) return "";

  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: es,
  });
};

/**
 * Obtiene el nombre del día de la semana
 * @param dayIndex - Índice del día (0 = Domingo)
 * @returns Nombre del día
 */
export const getDayName = (dayIndex: number): string => {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return days[dayIndex] || "";
};

/**
 * Obtiene el nombre corto del día
 * @param dayIndex - Índice del día (0 = Domingo)
 * @returns Nombre corto del día
 */
export const getDayNameShort = (dayIndex: number): string => {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return days[dayIndex] || "";
};

// ============================================================================
// 📞 FORMATO DE TELÉFONO
// ============================================================================

/**
 * Formatea un número de teléfono argentino
 * @param phone - Número a formatear
 * @returns String formateado
 */
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return "";

  // Remover todo excepto números
  const cleaned = phone.replace(/\D/g, "");

  // Si tiene código de país
  if (cleaned.startsWith("54")) {
    const withoutCountry = cleaned.slice(2);
    if (withoutCountry.startsWith("9")) {
      // Celular: +54 9 11 XXXX-XXXX
      const areaCode = withoutCountry.slice(1, 3);
      const firstPart = withoutCountry.slice(3, 7);
      const secondPart = withoutCountry.slice(7);
      return `+54 9 ${areaCode} ${firstPart}-${secondPart}`;
    } else {
      // Fijo: +54 11 XXXX-XXXX
      const areaCode = withoutCountry.slice(0, 2);
      const firstPart = withoutCountry.slice(2, 6);
      const secondPart = withoutCountry.slice(6);
      return `+54 ${areaCode} ${firstPart}-${secondPart}`;
    }
  }

  // Número local
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

// ============================================================================
// 🔢 FORMATO DE NÚMEROS
// ============================================================================

/**
 * Formatea un número con separadores argentinos
 * @param num - Número a formatear
 * @returns String formateado (ej: "1.234.567")
 */
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return "0";

  return new Intl.NumberFormat("es-AR").format(num);
};

/**
 * Formatea puntos de fidelidad
 * @param points - Cantidad de puntos
 * @returns String formateado (ej: "1.500 pts")
 */
export const formatPoints = (points: number | null | undefined): string => {
  return `${formatNumber(points)} pts`;
};

/**
 * Formatea duración en minutos
 * @param minutes - Duración en minutos
 * @returns String formateado (ej: "1h 30min")
 */
export const formatDuration = (minutes: number | null | undefined): string => {
  if (!minutes) return "";

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}min`;
};

/**
 * Formatea distancia en kilómetros
 * @param km - Distancia en kilómetros
 * @returns String formateado
 */
export const formatDistance2 = (km: number | null | undefined): string => {
  if (!km) return "";

  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }

  return `${km.toFixed(1)} km`;
};

// ============================================================================
// 🐾 FORMATO DE ESPECIES
// ============================================================================

const speciesMap: Record<string, string> = {
  DOG: "Perro",
  CAT: "Gato",
  BIRD: "Ave",
  RABBIT: "Conejo",
  HAMSTER: "Hámster",
  OTHER: "Otro",
};

/**
 * Traduce especie al español
 * @param species - Código de especie
 * @returns Nombre en español
 */
export const formatSpecies = (species: string | null | undefined): string => {
  if (!species) return "";
  return speciesMap[species] || species;
};

// ============================================================================
// 📋 FORMATO DE ESTADOS
// ============================================================================

const appointmentStatusMap: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: "Pendiente",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  CONFIRMED: {
    label: "Confirmado",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  COMPLETED: {
    label: "Completado",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  CANCELLED: {
    label: "Cancelado",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
};

/**
 * Obtiene información del estado de turno
 * @param status - Código de estado
 * @returns Objeto con label y colores
 */
export const getAppointmentStatus = (
  status: string | null | undefined
): { label: string; color: string; bgColor: string } => {
  if (!status) return { label: "", color: "", bgColor: "" };
  return (
    appointmentStatusMap[status] || { label: status, color: "", bgColor: "" }
  );
};

const roleMap: Record<string, string> = {
  CONSUMER: "Dueño de Mascota",
  VET_INDIVIDUAL: "Veterinario",
  CLINIC_ADMIN: "Admin. de Veterinaria",
  CLINIC_EMPLOYEE: "Empleado de Veterinaria",
};

/**
 * Traduce rol al español
 * @param role - Código de rol
 * @returns Nombre en español
 */
export const formatRole = (role: string | null | undefined): string => {
  if (!role) return "";
  return roleMap[role] || role;
};
