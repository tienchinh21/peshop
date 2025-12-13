export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL_DOTNET,
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
} as const;
export const API_CONFIG_JAVA = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL_JAVA,
  TIMEOUT: 30000,
  HEADERS: {
    Accept: "application/json"
  }
} as const;
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/Auth/login",
    REGISTER: "/Auth/register",
    LOGOUT: "/Auth/logout",
    REFRESH_TOKEN: "/Auth/refresh",
    ME: "/User/me"
  },
  USER: {
    VIEW_PRODUCT: "/User/view-product"
  },
  MAIL: {
    SEND_OTP: "/Mail/send-otp",
    VERIFY_OTP: "/Mail/verify-otp",
    RESEND_OTP: "/Mail/resend-otp"
  },
  PRODUCTS: {
    LIST: "/Products",
    GET_PRODUCTS: "/Product/get-products",
    DETAIL: "/Products/:slug",
    DETAIL_FULL: "/Product/get-product-detail",
    SEARCH: "/Products/search",
    CATEGORIES: "/Products/categories"
  },
  SEARCH: {
    SUGGEST: "/Search/suggest",
    SEARCH: "/Search",
    SEARCH_BY_IMAGE: "/Search/search-by-image"
  },
  PROMOTION: {
    GET_BY_PRODUCT: "/Promotion/get-promotions-by-product",
    CHECK_IN_ORDER: "/Promotion/check-promotions-in-order"
  }
} as const;
export const API_ENDPOINTS_JAVA = {
  SHOPS: {
    CREATE: "/shop",
    PUT: "/shop/:id",
    DASHBOARD: "/shop/homepage/dashboard",
    TODO_LIST: "/shop/homepage/todo-list"
  }
} as const;
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  USER_ROLES: "user_roles",
  AUTH_EXPIRES: "auth_expires",
  BROWSING_HISTORY: "browsing_history",
  CART: "cart",
  WISHLIST: "wishlist"
} as const;
export const TIMEOUT_CONFIG = {
  SHORT: 5000,
  MEDIUM: 15000,
  LONG: 30000
} as const;