import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/features/customer/auth/types";

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getRolesFromToken = (token: string): string[] => {
  const decoded = decodeToken(token);
  return decoded?.authorities || [];
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const getUserIdFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.sub || null;
};

export const hasRole = (token: string, role: string): boolean => {
  const roles = getRolesFromToken(token);
  return roles.includes(role);
};

export const isShopOwner = (token: string): boolean => {
  return hasRole(token, "Shop");
};

export const isAdmin = (token: string): boolean => {
  return hasRole(token, "Admin");
};
