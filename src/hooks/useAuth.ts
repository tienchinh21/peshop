"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setCredentials,
  logout as logoutAction,
  selectCurrentUser,
  selectCurrentToken,
  selectUserRoles,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsShopOwner,
  selectIsAdmin,
} from "@/lib/store/slices/authSlice";
import {
  login as loginAPI,
  register as registerAPI,
  logout as logoutAPI,
  getCurrentUserFromAPI,
} from "@/services/api/users/auth.service";
import type { LoginRequest, RegisterRequest } from "@/types/users/auth.types";
import { toast } from "sonner";
import { setAuthTokenCookie, removeAuthTokenCookie } from "@/lib/utils/cookies.utils";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);
  const roles = useAppSelector(selectUserRoles);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const isShopOwner = useAppSelector(selectIsShopOwner);
  const isAdmin = useAppSelector(selectIsAdmin);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const response = await loginAPI(credentials);

        if (response.error) {
          toast.error(response.error);
          return { success: false, error: response.error };
        }

        if (response.data) {
          const token = response.data;

          // Save token to cookie
          setAuthTokenCookie(token);

          const user = await getCurrentUserFromAPI();

          if (user) {
            dispatch(
              setCredentials({
                user,
                token,
              })
            );

            toast.success("Đăng nhập thành công!");
            return { success: true };
          } else {
            removeAuthTokenCookie();
            return { success: false, error: "Không thể lấy thông tin user" };
          }
        }

        return { success: false, error: "Không nhận được token từ server" };
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
        toast.error(errorMessage);
        removeAuthTokenCookie();
        return { success: false, error: errorMessage };
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        const response = await registerAPI(data);

        if (response.error) {
          toast.error(response.error);
          return { success: false, error: response.error };
        }

        if (response.data) {
          const token = response.data;
          
          // Save token to cookie
          setAuthTokenCookie(token);

          const user = await getCurrentUserFromAPI();

          if (user) {
            dispatch(
              setCredentials({
                user,
                token,
              })
            );

            toast.success("Đăng ký thành công!");
            return { success: true };
          } else {
            removeAuthTokenCookie();
            return { success: false, error: "Không thể lấy thông tin user" };
          }
        }

        return { success: false, error: "Không nhận được token từ server" };
      } catch (error) {
        console.error("Register error:", error);
        const errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
        toast.error(errorMessage);
        removeAuthTokenCookie();
        return { success: false, error: errorMessage };
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logoutAction());
      toast.success("Đăng xuất thành công");
      router.push("/xac-thuc");
    }
  }, [dispatch, router]);

  const hasRole = useCallback(
    (role: string) => {
      return roles.includes(role);
    },
    [roles]
  );

  const canAccessShop = useCallback(() => {
    return isShopOwner || isAdmin;
  }, [isShopOwner, isAdmin]);

  return {
    user,
    token,
    roles,
    isAuthenticated,
    isLoading,
    isShopOwner,
    isAdmin,

    login,
    register,
    logout,

    hasRole,
    canAccessShop,
  };
};
