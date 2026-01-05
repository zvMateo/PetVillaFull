import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, PawPrint } from "lucide-react";

// Loading Spinner Component
export const LoadingSpinner = ({
  size = "md",
  className = "",
  color = "primary",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "primary" | "secondary" | "accent";
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-pet-primary",
    secondary: "text-pet-secondary",
    accent: "text-pet-accent",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
};

// Skeleton Loader Component
export const SkeletonLoader = ({
  lines = 3,
  className = "",
  height = "h-4",
}: {
  lines?: number;
  className?: string;
  height?: string;
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "pet-loading-skeleton",
            height,
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
};

// Card Skeleton Component
export const CardSkeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={cn("pet-card p-6 space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <div className="pet-loading-skeleton w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="pet-loading-skeleton h-4 w-3/4" />
          <div className="pet-loading-skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="pet-loading-skeleton h-3 w-full" />
        <div className="pet-loading-skeleton h-3 w-5/6" />
      </div>
    </div>
  );
};

// Page Loading Component
export const PageLoading = ({
  message = "Cargando...",
  showLogo = true,
}: {
  message?: string;
  showLogo?: boolean;
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pet-neutral-50">
      {showLogo && (
        <div className="mb-8 pet-animate-bounce">
          <PawPrint className="w-16 h-16 text-pet-primary" />
        </div>
      )}

      <LoadingSpinner size="xl" color="primary" className="mb-4" />

      <p className="text-pet-neutral-600 font-medium animate-pulse">
        {message}
      </p>

      <div className="mt-8 flex space-x-2">
        <div className="w-2 h-2 bg-pet-primary rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-pet-primary rounded-full animate-pulse delay-75" />
        <div className="w-2 h-2 bg-pet-primary rounded-full animate-pulse delay-150" />
      </div>
    </div>
  );
};

// List Loading Component
export const ListLoading = ({
  items = 5,
  className = "",
}: {
  items?: number;
  className?: string;
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

// Button Loading Component
export const ButtonLoading = ({
  children,
  loading,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  loading: boolean;
  className?: string;
  [key: string]: unknown;
}) => {
  return (
    <button
      className={cn(
        "pet-button-primary relative",
        loading && "opacity-75 cursor-not-allowed",
        className
      )}
      disabled={loading}
      {...props}
    >
      <span
        className={cn(
          "flex items-center justify-center",
          loading && "opacity-0"
        )}
      >
        {children}
      </span>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" color="primary" />
        </div>
      )}
    </button>
  );
};

// Table Loading Component
export const TableLoading = ({
  rows = 5,
  columns = 4,
  className = "",
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-pet-neutral-200",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-pet-neutral-50">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-3 text-left">
                  <div className="pet-loading-skeleton h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-pet-neutral-200">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: columns }).map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="pet-loading-skeleton h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Chart Loading Component
export const ChartLoading = ({
  height = "h-64",
  className = "",
}: {
  height?: string;
  className?: string;
}) => {
  return (
    <div className={cn("relative", height, className)}>
      <div className="absolute inset-0 flex items-center justify-center bg-pet-neutral-50 rounded-lg">
        <div className="text-center">
          <LoadingSpinner size="lg" color="primary" className="mb-2" />
          <p className="text-pet-neutral-600 text-sm">Cargando datos...</p>
        </div>
      </div>
    </div>
  );
};

// Form Loading Component
export const FormLoading = ({
  fields = 3,
  className = "",
}: {
  fields?: number;
  className?: string;
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="pet-loading-skeleton h-4 w-24" />
          <div className="pet-loading-skeleton h-10 w-full" />
        </div>
      ))}

      <div className="flex justify-end space-x-4 pt-4">
        <div className="pet-loading-skeleton h-10 w-24" />
        <div className="pet-loading-skeleton h-10 w-32" />
      </div>
    </div>
  );
};

// Overlay Loading Component
export const OverlayLoading = ({
  show,
  message = "Procesando...",
  className = "",
}: {
  show: boolean;
  message?: string;
  className?: string;
}) => {
  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
        className
      )}
    >
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4">
        <div className="text-center">
          <LoadingSpinner size="lg" color="primary" className="mb-4" />
          <p className="text-pet-neutral-700 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};
