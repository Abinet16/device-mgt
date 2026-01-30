import { useAuth } from "../app/providers/auth-provider";
import { apiMonitor } from "./api-monitor";
import { tokenManager } from "./token-manager";

export interface ApiError {
  error: {
    code: string;
    message: string;
    timestamp: string;
    details?: any;
    stack?: string;
  };
}

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export function useApi() {
  const { token, setToken } = useAuth();
  
  return async (path: string, options: RequestInit = {}) => {
    // Ensure path starts with /api/v1
    const fullPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`;
    const startTime = Date.now();
    const method = options.method || "GET";
    
    // Log request
    apiMonitor.logRequest(method, fullPath, startTime);
    
    // Use token manager for enhanced auth handling
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };

    // Add token if available
    const currentToken = token || tokenManager.getAccessToken();
    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${fullPath}`, {
      ...options,
      headers,
    });

    // Log response
    apiMonitor.logResponse(method, fullPath, res.status, startTime);

    // Handle non-OK responses
    if (!res.ok) {
      let errorData: ApiError;
      let error: ApiClientError;
      
      try {
        errorData = await res.json();
        error = new ApiClientError(
          res.status,
          errorData.error.code,
          errorData.error.message,
          errorData.error.details
        );
      } catch {
        // If JSON parsing fails, create a generic error
        error = new ApiClientError(
          res.status,
          "HTTP_ERROR",
          res.statusText || "Request failed"
        );
      }

      // Handle authentication errors
      if (res.status === 401) {
        // Clear invalid token
        setToken(null);
        localStorage.removeItem("access");
        
        // Re-throw with appropriate message
        if (errorData?.error?.code === "TOKEN_EXPIRED") {
          throw new ApiClientError(401, "TOKEN_EXPIRED", "Your session has expired. Please log in again.");
        } else if (errorData?.error?.code === "INVALID_TOKEN") {
          throw new ApiClientError(401, "INVALID_TOKEN", "Invalid authentication. Please log in again.");
        }
      }

      throw error;
    }

    // Handle 204 No Content
    if (res.status === 204) {
      return null;
    }

    return res.json();
  };
}

// Health check function
export async function checkApiHealth() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
    return await response.json();
  } catch (error) {
    throw new Error("API health check failed");
  }
}
