import { useQuery } from "@tanstack/react-query";
import { getUserCategories, getUserCategoryChildren } from "../services";
import type { UserCategory, UserCategoryChild } from "../types";

export const categoryKeys = {
  all: ["user-categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  children: (categoryId: string) =>
    [...categoryKeys.all, "children", categoryId] as const,
};

/**
 * Hook for fetching user-side categories (from .NET API)
 */
export const useUserCategories = () => {
  return useQuery<UserCategory[]>({
    queryKey: categoryKeys.list(),
    queryFn: getUserCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for fetching category children by parent ID (from .NET API)
 */
export const useUserCategoryChildren = (categoryId: string | null) => {
  return useQuery<UserCategoryChild[]>({
    queryKey: categoryKeys.children(categoryId || ""),
    queryFn: () => getUserCategoryChildren(categoryId!),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
