import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/features/customer/auth/types";
import { getRolesFromToken, isTokenExpired } from "@/lib/utils/jwt.utils";
import { STORAGE_KEYS } from "@/lib/config/api.config";
import { setAuthTokenCookie, getAuthTokenCookie, removeAuthTokenCookie } from "@/lib/utils/cookies.utils";
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
      setAuthTokenCookie(token);
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
      removeAuthTokenCookie();
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
      }
    },
    hydrateAuth: state => {
      if (typeof window !== "undefined") {
        const token = getAuthTokenCookie();
        const userStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (token && userStr) {
          try {
            if (isTokenExpired(token)) {
              removeAuthTokenCookie();
              localStorage.removeItem(STORAGE_KEYS.USER_DATA);
              localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
              state.isLoading = false;
              return;
            }
            const user = JSON.parse(userStr) as AuthUser;
            const roles = getRolesFromToken(token);
            state.user = {
              ...user,
              roles
            };
            state.token = token;
            state.roles = roles;
            state.isAuthenticated = true;
          } catch (error) {
            console.error("Error parsing user data:", error);
            removeAuthTokenCookie();
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
          }
        } else if (token && !userStr) {
          const roles = getRolesFromToken(token);
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