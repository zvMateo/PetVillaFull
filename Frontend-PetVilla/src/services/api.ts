/**
 * API Client Configuration
 * Centralized HTTP client with interceptors and error handling
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios";
import { API_CONFIG, ERROR_MESSAGES } from "@/constants";
import type { ApiResponse, ApiError } from "@/types";

// ============================================================================
// API CLIENT SETUP
// ============================================================================

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  // ============================================================================
  // INTERCEPTORS SETUP
  // ============================================================================

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        (config as unknown as Record<string, unknown>).metadata = {
          startTime: new Date(),
        };

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Calculate request duration
        const endTime = new Date();
        const metadata = (response.config as unknown as Record<string, unknown>)
          .metadata;
        const startTime =
          metadata && typeof metadata === "object" && "startTime" in metadata
            ? (metadata as { startTime: Date }).startTime
            : new Date();
        const duration = endTime.getTime() - startTime.getTime();

        // Log performance in development
        if (import.meta.env.DEV && duration > 1000) {
          console.warn(
            `Slow API request: ${response.config.url} took ${duration}ms`
          );
        }

        return response;
      },
      (error: AxiosError) => {
        return this.handleApiError(error);
      }
    );
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  private handleApiError(error: AxiosError): Promise<ApiError> {
    const apiError: ApiError = {
      success: false,
      message: ERROR_MESSAGES.GENERIC_ERROR,
      statusCode: error.response?.status || 500,
    };

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      apiError.statusCode = status;

      switch (status) {
        case 400:
          apiError.message = ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case 401:
          apiError.message = ERROR_MESSAGES.UNAUTHORIZED;
          this.handleUnauthorized();
          break;
        case 404:
          apiError.message = ERROR_MESSAGES.NOT_FOUND;
          break;
        case 500:
          apiError.message = ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          apiError.message =
            (data as unknown as { message?: string })?.message ||
            ERROR_MESSAGES.GENERIC_ERROR;
      }

      // Add validation errors if available
      if ((data as unknown as { errors?: Record<string, string[]> })?.errors) {
        apiError.errors = (
          data as unknown as { errors?: Record<string, string[]> }
        ).errors;
      }
    } else if (error.request) {
      // Network error
      apiError.message = ERROR_MESSAGES.NETWORK_ERROR;
      apiError.statusCode = 0;
    }

    return Promise.reject(apiError);
  }

  private handleUnauthorized(): void {
    // Clear auth token
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);

    // Redirect to login (only in browser)
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  // ============================================================================
  // HTTP METHODS
  // ============================================================================

  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // ============================================================================
  // RETRY MECHANISM
  // ============================================================================

  async requestWithRetry<T>(
    config: AxiosRequestConfig,
    maxRetries: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<ApiResponse<T>> {
    let lastError: AxiosError | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.request<ApiResponse<T>>(config);
        return response.data;
      } catch (error) {
        lastError = error as AxiosError;

        // Don't retry on client errors (4xx)
        if (
          lastError.response &&
          lastError.response.status >= 400 &&
          lastError.response.status < 500
        ) {
          break;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }
}

// ============================================================================
// EXPORT INSTANCE
// ============================================================================

export const apiClient = new ApiClient();

// ============================================================================
// CONVENIENCE METHODS
// ============================================================================

/**
 * Wrapper for GET requests with error handling
 */
export const get = <T>(url: string, config?: AxiosRequestConfig) =>
  apiClient.get<T>(url, config);

/**
 * Wrapper for POST requests with error handling
 */
export const post = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => apiClient.post<T>(url, data, config);

/**
 * Wrapper for PUT requests with error handling
 */
export const put = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => apiClient.put<T>(url, data, config);

/**
 * Wrapper for PATCH requests with error handling
 */
export const patch = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => apiClient.patch<T>(url, data, config);

/**
 * Wrapper for DELETE requests with error handling
 */
export const del = <T>(url: string, config?: AxiosRequestConfig) =>
  apiClient.delete<T>(url, config);

/**
 * Request with retry mechanism
 */
export const requestWithRetry = <T>(
  config: AxiosRequestConfig,
  maxRetries?: number
) => apiClient.requestWithRetry<T>(config, maxRetries);
