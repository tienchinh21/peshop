import { axiosDotnet } from "@/lib/config/axios.config";
import _ from "lodash";
import type {
  UserCategory,
  UserCategoryChild,
  CategoriesResponse,
  CategoryChildrenResponse,
} from "../types";

/**
 * Get all categories for user side (using .NET API)
 */
export const getUserCategories = async (): Promise<UserCategory[]> => {
  const response = await axiosDotnet.get<CategoriesResponse>(
    "/Category/get-categories"
  );
  return _.get(response, "data.data.categories", []);
};

/**
 * Get category children by parent category ID (using .NET API)
 */
export const getUserCategoryChildren = async (
  categoryId: string
): Promise<UserCategoryChild[]> => {
  const response = await axiosDotnet.get<CategoryChildrenResponse>(
    "/CategoryChild/get-category-children",
    {
      params: { categoryId },
    }
  );
  return _.get(response, "data.data.categoryChildren", []);
};
