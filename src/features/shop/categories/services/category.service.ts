import { axiosJava } from "@/lib/config/axios.config";
import {
  CategoryChildResponse,
  CategoryResponse,
  CategoryTemplateResponse,
} from "../types";

export const getCategories = async () => {
  const response = await axiosJava.get<CategoryResponse>("/admin/category");
  return response.data;
};

export const getCategoryChildren = async (categoryId: string) => {
  const response = await axiosJava.get<CategoryChildResponse>(
    `/admin/category/${categoryId}`
  );
  return response.data;
};

export const getCategoryTemplate = async (categoryChildId: string) => {
  const response = await axiosJava.get<CategoryTemplateResponse>(
    `/admin/category-child/${categoryChildId}`
  );
  return response.data;
};
