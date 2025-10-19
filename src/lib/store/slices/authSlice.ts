import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types/users/auth.types";
import { getRolesFromToken, isTokenExpired } from "@/lib/utils/jwt.utils";
import { STORAGE_KEYS } from "@/lib/config/api.config";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  roles: string[]; // ["User", "Shop", "Admin"]
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  roles: [],
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
      }>
    ) => {
      const { user, token } = action.payload;

      // Decode token để lấy roles
      const roles = getRolesFromToken(token);

      state.user = { ...user, roles }; // Merge roles vào user
      state.token = token;
      state.roles = roles;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify({ ...user, roles })
        );
      }
    },

    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        if (typeof window !== "undefined") {
          localStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(state.user)
          );
        }
      }
    },

    updateToken: (state, action: PayloadAction<string>) => {
      const newToken = action.payload;
      const roles = getRolesFromToken(newToken);

      state.token = newToken;
      state.roles = roles;

      // Update roles in user
      if (state.user) {
        state.user.roles = roles;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
        if (state.user) {
          localStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(state.user)
          );
        }
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.isAuthenticated = false;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
      }
    },

    hydrateAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userStr) {
          try {
            // Check if token expired
            if (isTokenExpired(token)) {
              // Clear expired data
              localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
              localStorage.removeItem(STORAGE_KEYS.USER_DATA);
              localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
              state.isLoading = false;
              return;
            }

            const user = JSON.parse(userStr) as AuthUser;
            const roles = getRolesFromToken(token);

            state.user = { ...user, roles };
            state.token = token;
            state.roles = roles;
            state.isAuthenticated = true;
          } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
          }
        }
      }
      state.isLoading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCredentials,
  updateUser,
  updateToken,
  logout,
  hydrateAuth,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) =>
  state.auth.token;
export const selectUserRoles = (state: { auth: AuthState }) => state.auth.roles;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;

// Helper selectors
export const selectHasRole = (role: string) => (state: { auth: AuthState }) =>
  state.auth.roles.includes(role);
export const selectIsShopOwner = (state: { auth: AuthState }) =>
  state.auth.roles.includes("Shop");
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.roles.includes("Admin");
