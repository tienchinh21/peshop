import axios, { AxiosInstance } from "axios";
import {
  API_CONFIG,
  API_CONFIG_JAVA,
} from "@/lib/config/api.config";
import { getAuthTokenCookie } from "@/lib/utils/cookies.utils";

/**
 * Creates a configured Axios instance for .NET API
 * Handles base configuration without interceptors
 */
export const createDotnetAxiosClient = (): AxiosInstance => {
  return axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
    withCredentials: true,
    transformResponse: [
      (data, headers) => {
        // Log raw response for debugging
        console.log('Raw response data type:', typeof data);
        console.log('Content-Type:', headers?.['content-type']);

        // If data is already an object, return it
        if (typeof data === 'object' && data !== null) {
          return data;
        }

        // If data is a string, try to parse it as JSON
        if (typeof data === 'string') {
          // Remove BOM (Byte Order Mark) if present
          let cleanData = data;
          if (cleanData.charCodeAt(0) === 0xFEFF) {
            cleanData = cleanData.slice(1);
          }

          // Trim whitespace
          const trimmed = cleanData.trim();

          // Check if it looks like JSON
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
              return JSON.parse(trimmed);
            } catch (e) {
              console.error('Failed to parse JSON:', e);
              console.error('Data preview:', trimmed.substring(0, 200));
              console.error('First 10 char codes:',
                Array.from(trimmed.substring(0, 10)).map(c => c.charCodeAt(0))
              );
              return trimmed;
            }
          }

          // If it's a plain string (like a JWT token), return as is
          return trimmed;
        }

        return data;
      },
    ],
  });
};


/**
 * Creates a configured Axios instance for Java API
 * Handles base configuration without interceptors
 */
export const createJavaAxiosClient = (): AxiosInstance => {
  return axios.create({
    baseURL: API_CONFIG_JAVA.BASE_URL,
    timeout: API_CONFIG_JAVA.TIMEOUT,
    headers: API_CONFIG_JAVA.HEADERS,
    withCredentials: false,
  });
};

/**
 * Handles FormData uploads for .NET API
 * Used for file uploads with authentication
 */
export const uploadFormDataToDotnet = async (
  url: string,
  data: FormData,
  method: "POST" | "PUT" = "POST"
): Promise<any> => {
  if (typeof window === "undefined") {
    throw new Error(
      "uploadFormDataToDotnet can only be used in browser environment"
    );
  }

  const token = getAuthTokenCookie();

  const config = {
    baseURL: API_CONFIG.BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: 60000,
    withCredentials: true,
  };

  const response =
    method === "PUT"
      ? await axios.put(url, data, config)
      : await axios.post(url, data, config);

  return response.data;
};

/**
 * Handles FormData uploads for Java API
 * Used for file uploads with authentication
 */
export const uploadFormDataToJava = async (
  url: string,
  data: FormData,
  method: "POST" | "PUT" = "POST"
): Promise<any> => {
  if (typeof window === "undefined") {
    throw new Error(
      "uploadFormDataToJava can only be used in browser environment"
    );
  }

  const token = getAuthTokenCookie();

  const config = {
    baseURL: API_CONFIG_JAVA.BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: 60000,
    withCredentials: false,
  };

  const response =
    method === "PUT"
      ? await axios.put(url, data, config)
      : await axios.post(url, data, config);

  return response.data;
};
