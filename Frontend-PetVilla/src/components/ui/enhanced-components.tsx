import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Search, TrendingUp, Activity } from "lucide-react";

// Enhanced Card Component with Hover Effects
export const EnhancedCard = ({
  children,
  className = "",
  hover = true,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  [key: string]: unknown;
}) => {
  return (
    <Card
      className={cn(
        "pet-card transition-all duration-300 cursor-pointer",
        hover &&
          "hover:shadow-xl hover:scale-[1.02] hover:border-pet-primary/20",
        onClick && "active:scale-[0.98]",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Card>
  );
};

// Enhanced Button with Micro-interactions
export const EnhancedButton = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = "relative overflow-hidden transition-all duration-200";
  const variantClasses = {
    primary: "pet-button-primary",
    secondary: "pet-button-secondary",
    outline:
      "border-2 border-pet-primary text-pet-primary hover:bg-pet-primary hover:text-white",
    ghost: "text-pet-primary hover:bg-pet-primary/10",
  };
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <Button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isPressed && "scale-95",
        loading && "opacity-75 cursor-not-allowed",
        className
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={loading}
      {...props}
    >
      <span className={cn("flex items-center gap-2", loading && "opacity-0")}>
        {icon && (
          <span className="transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}
        {children}
      </span>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Ripple effect overlay */}
      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Button>
  );
};

// Enhanced Input with Focus Effects
export const EnhancedInput = ({
  label,
  error,
  icon,
  className = "",
  ...props
}: {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-pet-neutral-700">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pet-neutral-400">
            {icon}
          </div>
        )}

        <Input
          className={cn(
            "pet-input transition-all duration-200",
            icon && "pl-10",
            isFocused && "ring-2 ring-pet-primary/20 border-pet-primary",
            error && "border-pet-error ring-2 ring-pet-error/20",
            className
          )}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if ("onFocus" in props && typeof props.onFocus === "function") {
              props.onFocus(e);
            }
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            if ("onBlur" in props && typeof props.onBlur === "function") {
              props.onBlur(e);
            }
          }}
          {...props}
        />

        {/* Focus indicator */}
        <div
          className={cn(
            "absolute bottom-0 left-0 h-0.5 bg-pet-primary transition-all duration-200",
            isFocused ? "w-full" : "w-0"
          )}
        />
      </div>

      {error && (
        <p className="text-sm text-pet-error flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-pet-error/20" />
          {error}
        </p>
      )}
    </div>
  );
};

// Enhanced Badge with Animations
export const EnhancedBadge = ({
  children,
  variant = "default",
  size = "md",
  animated = false,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
  [key: string]: unknown;
}) => {
  const variantClasses = {
    default: "bg-pet-primary text-white",
    secondary: "bg-pet-secondary text-white",
    success: "bg-pet-success text-white",
    warning: "bg-pet-warning text-white",
    error: "bg-pet-error text-white",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <Badge
      className={cn(
        "transition-all duration-200",
        variantClasses[variant],
        sizeClasses[size],
        animated && "animate-pulse hover:scale-105",
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  );
};

// Enhanced Rating Component
export const EnhancedRating = ({
  rating,
  maxRating = 5,
  size = "sm",
  interactive = false,
  onRatingChange,
  showCount = true,
  className = "",
}: {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showCount?: boolean;
  className?: string;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, i) => {
          const starValue = i + 1;
          const isFilled =
            starValue <= (interactive ? hoverRating || rating : rating);

          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                "transition-all duration-200 cursor-pointer",
                isFilled
                  ? "fill-pet-accent text-pet-accent"
                  : "fill-pet-neutral-200 text-pet-neutral-300",
                interactive && "hover:scale-110 hover:text-pet-accent"
              )}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => interactive && onRatingChange?.(starValue)}
            />
          );
        })}
      </div>

      {showCount && (
        <span className="text-sm text-pet-neutral-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Enhanced Search Bar
export const EnhancedSearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = "Buscar...",
  filters,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  filters?: React.ReactNode;
  className?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Search
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200",
            isFocused ? "text-pet-primary" : "text-pet-neutral-400"
          )}
        />

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "pet-input pl-10 pr-12",
            isFocused && "ring-2 ring-pet-primary/20 border-pet-primary"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            ×
          </Button>
        )}
      </div>

      {filters && (
        <div className="absolute right-0 top-0 h-full flex items-center">
          {filters}
        </div>
      )}
    </form>
  );
};

// Enhanced Status Card
export const StatusCard = ({
  title,
  value,
  change,
  icon,
  trend = "up",
  color = "primary",
  className = "",
}: {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  className?: string;
}) => {
  const colorClasses = {
    primary: "bg-pet-primary/10 text-pet-primary border-pet-primary/20",
    secondary: "bg-pet-secondary/10 text-pet-secondary border-pet-secondary/20",
    success: "bg-pet-success/10 text-pet-success border-pet-success/20",
    warning: "bg-pet-warning/10 text-pet-warning border-pet-warning/20",
    error: "bg-pet-error/10 text-pet-error border-pet-error/20",
  };

  const trendIcons = {
    up: <TrendingUp className="w-4 h-4" />,
    down: <TrendingUp className="w-4 h-4 rotate-180" />,
    neutral: <Activity className="w-4 h-4" />,
  };

  const trendColors = {
    up: "text-pet-success",
    down: "text-pet-error",
    neutral: "text-pet-neutral-500",
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn("p-2 rounded-lg border", colorClasses[color])}>
              {icon}
            </div>
          )}

          <div>
            <p className="text-sm text-pet-neutral-600">{title}</p>
            <p className="text-2xl font-bold text-pet-neutral-900">{value}</p>
          </div>
        </div>

        {change && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm",
              trendColors[trend]
            )}
          >
            {trendIcons[trend]}
            <span>{change}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

// Enhanced Avatar with Status
export const EnhancedAvatar = ({
  src,
  alt,
  name,
  status,
  size = "md",
  className = "",
}: {
  src?: string;
  alt?: string;
  name: string;
  status?: "online" | "offline" | "busy";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const statusColors = {
    online: "bg-pet-success",
    offline: "bg-pet-neutral-400",
    busy: "bg-pet-warning",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("relative inline-flex", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center text-white font-medium bg-gradient-to-br from-pet-primary to-pet-primary-dark",
          sizeClasses[size]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span
            className={
              size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"
            }
          >
            {initials}
          </span>
        )}
      </div>

      {status && (
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};

// Enhanced Progress Bar
export const EnhancedProgressBar = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = "primary",
  size = "md",
  animated = true,
  className = "",
}: {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    primary: "bg-pet-primary",
    secondary: "bg-pet-secondary",
    success: "bg-pet-success",
    warning: "bg-pet-warning",
    error: "bg-pet-error",
  };

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm font-medium text-pet-neutral-700">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-pet-neutral-600">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full bg-pet-neutral-200 rounded-full overflow-hidden",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            colorClasses[color],
            animated && "relative"
          )}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};
