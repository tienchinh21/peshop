// .NET API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL_DOTNET,
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

// Java API Configuration
export const API_CONFIG_JAVA = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL_JAVA,
  TIMEOUT: 30000,
  HEADERS: {
    Accept: "application/json",
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/Auth/login",
    REGISTER: "/Auth/register",
    LOGOUT: "/Auth/logout",
    REFRESH_TOKEN: "/Auth/refresh",
    ME: "/User/me",
  },
  // Mail endpoints
  MAIL: {
    SEND_OTP: "/Mail/send-otp",
    VERIFY_OTP: "/Mail/verify-otp",
    RESEND_OTP: "/Mail/resend-otp",
  },
  // Product endpoints
  PRODUCTS: {
    LIST: "/Products",
    GET_PRODUCTS: "/Product/get-products",
    DETAIL: "/Products/:slug",
    DETAIL_FULL: "/Product/get-product-detail",
    SEARCH: "/Products/search",
    CATEGORIES: "/Products/categories",
  },
  // Search endpoints
  SEARCH: {
    SUGGEST: "/Search/suggest",
    SEARCH: "/Search",
  },
} as const;

// Java API Endpoints
export const API_ENDPOINTS_JAVA = {
  // Shops endpoints
  SHOPS: {
    CREATE: "/shop",
    PUT: "/shop/:id",
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  USER_ROLES: "user_roles",
  AUTH_EXPIRES: "auth_expires",
  BROWSING_HISTORY: "browsing_history",
  CART: "cart",
  WISHLIST: "wishlist",
} as const;

// Request timeout for different types
export const TIMEOUT_CONFIG = {
  SHORT: 5000, // 5s for quick operations
  MEDIUM: 15000, // 15s for normal operations
  LONG: 30000, // 30s for file uploads
} as const;
