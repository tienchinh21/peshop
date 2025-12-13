import axios, { AxiosInstance } from "axios";
import { API_CONFIG, API_CONFIG_JAVA } from "@/lib/config/api.config";
import { getAuthTokenCookie } from "@/lib/utils/cookies.utils";
export const createDotnetAxiosClient = (): AxiosInstance => {
  return axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
    withCredentials: true,
    transformResponse: [data => {
      if (typeof data === 'object' && data !== null) {
        return data;
      }
      if (typeof data === 'string') {
        let cleanData = data;
        if (cleanData.charCodeAt(0) === 0xFEFF) {
          cleanData = cleanData.slice(1);
        }
        const trimmed = cleanData.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          try {
            return JSON.parse(trimmed);
          } catch {
            return trimmed;
          }
        }
        return trimmed;
      }
      return data;
    }]
  });
};
export const createJavaAxiosClient = (): AxiosInstance => {
  return axios.create({
    baseURL: API_CONFIG_JAVA.BASE_URL,
    timeout: API_CONFIG_JAVA.TIMEOUT,
    headers: API_CONFIG_JAVA.HEADERS,
    withCredentials: false
  });
};
export const uploadFormDataToDotnet = async (url: string, data: FormData, method: "POST" | "PUT" = "POST"): Promise<any> => {
  if (typeof window === "undefined") {
    throw new Error("uploadFormDataToDotnet can only be used in browser environment");
  }
  const token = getAuthTokenCookie();
  const config = {
    baseURL: API_CONFIG.BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    timeout: 60000,
    withCredentials: true
  };
  const response = method === "PUT" ? await axios.put(url, data, config) : await axios.post(url, data, config);
  return response.data;
};
export const uploadFormDataToJava = async (url: string, data: FormData, method: "POST" | "PUT" = "POST"): Promise<any> => {
  if (typeof window === "undefined") {
    throw new Error("uploadFormDataToJava can only be used in browser environment");
  }
  const token = getAuthTokenCookie();
  const config = {
    baseURL: API_CONFIG_JAVA.BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    timeout: 60000,
    withCredentials: false
  };
  const response = method === "PUT" ? await axios.put(url, data, config) : await axios.post(url, data, config);
  return response.data;
};