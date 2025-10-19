import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryChildren,
  getCategoryTemplate,
} from "@/services/api/shops/category.service";
import {
  Category,
  CategoryChild,
  CategoryTemplateResponse,
} from "@/types/shops/category.type";

// Hook for fetching parent categories
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.content;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching category children
export const useCategoryChildren = (categoryId: string | null) => {
  return useQuery<CategoryChild[]>({
    queryKey: ["category-children", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const response = await getCategoryChildren(categoryId);
      return response.content.categoryChildren;
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching category template
export const useCategoryTemplate = (categoryChildId: string | null) => {
  return useQuery<CategoryTemplateResponse>({
    queryKey: ["category-template", categoryChildId],
    queryFn: async () => {
      if (!categoryChildId) throw new Error("Category child ID is required");
      return await getCategoryTemplate(categoryChildId);
    },
    enabled: !!categoryChildId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
