import { axiosJava } from "@/lib/config/axios.config";
import type {
  PromotionListResponse,
  PromotionListFilters,
  CreatePromotionPayload,
  UpdatePromotionPayload,
  AddPromotionRulesPayload,
  AddPromotionGiftsPayload,
} from "../types";

const buildSortParam = (filters: PromotionListFilters): string => {
  if (!filters.sortBy) return "";
  const order = filters.sortOrder || "asc";
  return `${filters.sortBy},${order}`;
};

const buildFilterExpression = (filters: PromotionListFilters): string => {
  const expressions: string[] = [];

  if (filters.search) {
    expressions.push(`name ~~ '*${filters.search}*'`);
  }

  if (filters.status !== undefined && filters.status !== null) {
    expressions.push(`status : ${filters.status}`);
  }

  return expressions.join(" and ");
};

export const getPromotions = async (
  filters?: PromotionListFilters
): Promise<PromotionListResponse> => {
  const params = new URLSearchParams();
  const page = filters?.page ? filters.page - 1 : 0;
  const size = filters?.size || 10;

  params.append("page", page.toString());
  params.append("size", size.toString());

  const sort = buildSortParam(filters || {});
  if (sort) params.append("sort", sort);

  const filterExpression = buildFilterExpression(filters || {});
  if (filterExpression) params.append("filter", filterExpression);

  const url = `/shop/promotion?${params.toString()}`;
  const response = await axiosJava.get<PromotionListResponse>(url);
  return response.data;
};

export const createPromotion = async (payload: CreatePromotionPayload) => {
  const response = await axiosJava.post("/shop/promotion", payload);
  return response.data;
};

export const updatePromotion = async (
  id: string,
  payload: UpdatePromotionPayload
) => {
  const response = await axiosJava.put(`/shop/promotion/${id}`, payload);
  return response.data;
};

export const deletePromotion = async (id: string) => {
  const response = await axiosJava.delete(`/shop/promotion/${id}`);
  return response.data;
};

export const addPromotionRules = async (
  id: string,
  payload: AddPromotionRulesPayload[]
) => {
  const response = await axiosJava.post(`/shop/promotion/${id}/rules`, payload);
  return response.data;
};

export const addPromotionGifts = async (
  id: string,
  payload: AddPromotionGiftsPayload[]
) => {
  const response = await axiosJava.post(`/shop/promotion/${id}/gifts`, payload);
  return response.data;
};

export const deletePromotionRules = async (ruleIds: string[]) => {
  const response = await axiosJava.delete("/shop/promotion/rules", {
    data: ruleIds,
  });
  return response.data;
};

export const deletePromotionGifts = async (giftIds: string[]) => {
  const response = await axiosJava.delete("/shop/promotion/gifts", {
    data: giftIds,
  });
  return response.data;
};
