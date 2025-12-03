// Re-export from customer categories feature for backward compatibility
export {
  getUserCategories,
  getUserCategoryChildren,
} from "@/features/customer/categories";

export type {
  UserCategory,
  UserCategoryChild,
  CategoriesResponse,
  CategoryChildrenResponse,
} from "@/features/customer/categories";

