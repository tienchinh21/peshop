import { AxiosInstance } from "axios";
import {
  createDotnetAxiosClient,
  createJavaAxiosClient,
  uploadFormDataToDotnet,
  uploadFormDataToJava,
} from "./axios.client";
import {
  setupAuthRequestInterceptor,
  setupDotnetAuthResponseInterceptor,
  setupJavaErrorResponseInterceptor,
} from "./interceptors";

/**
 * Configured Axios instance for .NET API
 * Includes auth token injection and automatic token refresh
 */
const axiosDotnet: AxiosInstance = createDotnetAxiosClient();
setupAuthRequestInterceptor(axiosDotnet);
setupDotnetAuthResponseInterceptor(axiosDotnet);

/**
 * Configured Axios instance for Java API
 * Includes auth token injection and error handling
 */
const axiosJava: AxiosInstance = createJavaAxiosClient();
setupAuthRequestInterceptor(axiosJava);
setupJavaErrorResponseInterceptor(axiosJava);

/**
 * FormData upload helper for .NET API
 * Handles file uploads with proper authentication
 */
export const axiosDotnetFormData = uploadFormDataToDotnet;

/**
 * FormData upload helper for Java API
 * Handles file uploads with proper authentication
 */
export const axiosJavaFormData = uploadFormDataToJava;

export { axiosDotnet, axiosJava };
export default axiosDotnet;
