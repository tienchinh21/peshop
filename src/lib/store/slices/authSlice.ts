import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/features/customer/auth/types";
import { getRolesFromToken, isTokenExpired } from "@/lib/utils/jwt.utils";
import { STORAGE_KEYS } from "@/lib/config/api.config";
import { setAuthTokenCookie, getAuthTokenCookie, removeAuthTokenCookie } from "@/lib/utils/cookies.utils";

// Cookie name for user data
const USER_COOKIE_NAME = "user_data";

// Helper to set user data cookie
const setUserDataCookie = (user: AuthUser) => {
  if (typeof window === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const isSecure = window.location.protocol === "https:";
  const securePart = isSecure ? "; Secure" : "";
  const userData = JSON.stringify({
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    roles: user.roles
  });
  document.cookie = `${USER_COOKIE_NAME}=${encodeURIComponent(userData)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${securePart}`;
};

// Helper to get user data from cookie
const getUserDataCookie = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const name = USER_COOKIE_NAME + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      try {
        return JSON.parse(decodeURIComponent(cookie.substring(name.length)));
      } catch {
        return null;
      }
    }
  }
  return null;
};

// Helper to remove user data cookie
const removeUserDataCookie = () => {
  if (typeof window === "undefined") return;
  document.cookie = `${USER_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  roles: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
}
const initialState: AuthState = {
  user: null,
  token: null,
  roles: [],
  isAuthenticated: false,
  isLoading: true
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{
      user: AuthUser;
      token: string;
    }>) => {
      const {
        user,
        token
      } = action.payload;
      const roles = getRolesFromToken(token);
      state.user = {
        ...user,
        roles
      };
      state.token = token;
      state.roles = roles;
      state.isAuthenticated = true;
      state.isLoading = false;
      
      // Save to cookies
      setAuthTokenCookie(token);
      setUserDataCookie({ ...user, roles });
      
      // Also save to localStorage as backup
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({
          ...user,
          roles
        }));
      }
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload
        };
        setUserDataCookie(state.user);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
        }
      }
    },
    updateToken: (state, action: PayloadAction<string>) => {
      const newToken = action.payload;
      const roles = getRolesFromToken(newToken);
      state.token = newToken;
      state.roles = roles;
      if (state.user) {
        state.user.roles = roles;
        setUserDataCookie(state.user);
      }
      setAuthTokenCookie(newToken);
      if (typeof window !== "undefined" && state.user) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
      }
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.isAuthenticated = false;
      state.isLoading = false;
      
      // Remove from cookies
      removeAuthTokenCookie();
      removeUserDataCookie();
      
      // Remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
      }
    },
    hydrateAuth: state => {
      if (typeof window !== "undefined") {
        const token = getAuthTokenCookie();
        
        if (!token) {
          state.isLoading = false;
          return;
        }
        
        // Check if token is expired
        if (isTokenExpired(token)) {
          removeAuthTokenCookie();
          removeUserDataCookie();
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
          state.isLoading = false;
          return;
        }
        
        // Try to get user from cookie first, then localStorage
        let user = getUserDataCookie();
        if (!user) {
          const userStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
          if (userStr) {
            try {
              user = JSON.parse(userStr) as AuthUser;
            } catch (error) {
              console.error("Error parsing user data:", error);
            }
          }
        }
        
        const roles = getRolesFromToken(token);
        
        if (user) {
          state.user = { ...user, roles };
          state.token = token;
          state.roles = roles;
          state.isAuthenticated = true;
          
          // Sync user data to cookie if it was from localStorage
          setUserDataCookie({ ...user, roles });
        } else {
          // We have token but no user data - still authenticated but need to fetch user
          state.token = token;
          state.roles = roles;
          state.isAuthenticated = true;
        }
      }
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});
export const {
  setCredentials,
  updateUser,
  updateToken,
  logout,
  hydrateAuth,
  setLoading
} = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: {
  auth: AuthState;
}) => state.auth.user;
export const selectCurrentToken = (state: {
  auth: AuthState;
}) => state.auth.token;
export const selectUserRoles = (state: {
  auth: AuthState;
}) => state.auth.roles;
export const selectIsAuthenticated = (state: {
  auth: AuthState;
}) => state.auth.isAuthenticated;
export const selectIsLoading = (state: {
  auth: AuthState;
}) => state.auth.isLoading;
export const selectHasRole = (role: string) => (state: {
  auth: AuthState;
}) => state.auth.roles.includes(role);
export const selectIsShopOwner = (state: {
  auth: AuthState;
}) => state.auth.roles.includes("Shop");
export const selectIsAdmin = (state: {
  auth: AuthState;
}) => state.auth.roles.includes("Admin");