import axios, { AxiosResponse, AxiosError } from "axios";
import { authClient } from "./auth-client";

// Define custom error types
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export interface ApiError {
  status: number;
  message: string;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to inject authorization token
api.interceptors.request.use(
  async (config) => {
    try {
      // Client-side: Extract token using the jwtClient plugin
      // 'authClient.token()' is the specific method to get the JWT when using the jwt plugin
      // We explicitly cast to any because the plugin types might not be fully inferred in this context
      const { data } = await (authClient as any).token();

      const token = data?.token;

      // Debug logging
      if (token) {
        const isString = typeof token === 'string';
        const tokenLength = isString ? token.length : 'N/A';
        const tokenPreview = isString ? `${token.substring(0, 10)}...` : 'Not a string';
        console.log(`Token extracted via authClient.token(): Yes. Type: ${typeof token}, Length: ${tokenLength}, Preview: ${tokenPreview}`);
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log("Token extracted via authClient.token(): No (data is null or token missing)");
        // Fallback or just log session for debugging context
        const session = await authClient.getSession();
        console.log("Fallback Session Check:", JSON.stringify(session, null, 2));
      }
    } catch (error) {
      console.error("Error fetching token in interceptor:", error);
      // Continue with request even if token retrieval fails
    }

    // Add debug logging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and normalize responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Add debug logging
    console.log(`API Response: ${response.status} for ${response.config.method?.toUpperCase()} ${response.config.url}`);
    // Return successful responses as-is
    return response;
  },
    async (error: AxiosError) => {
      // Add error logging
      if (error.response) {
        console.error(`API Error: ${error.message} (${error.response.status}) for ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
        console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
      } else {
        console.error(`API Error: ${error.message} for ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      }

    const { response } = error;

    if (response) {
      // Normalize error response
      let errorMessage = "An error occurred";
      
      if ((response.data as any)?.detail) {
        if (typeof (response.data as any).detail === 'string') {
          errorMessage = (response.data as any).detail;
        } else {
          // Handle object/array error details (e.g. validation errors)
          errorMessage = JSON.stringify((response.data as any).detail);
        }
      } else if (response.statusText) {
        errorMessage = response.statusText;
      }

      const apiError: ApiError = {
        status: response.status,
        message: errorMessage,
      };

      console.error("Constructed ApiError:", apiError);

      // Handle 401 Unauthorized responses
      if (response.status === 401) {
        // Throw a specific auth error
        throw new AuthError(apiError.message);
      }

      // Reject with normalized error
      return Promise.reject(apiError);
    } else {
      // Network error or other issue
      const networkError: ApiError = {
        status: 0,
        message: error.message || "Network error occurred",
      };
      return Promise.reject(networkError);
    }
  }
);

export default api;
