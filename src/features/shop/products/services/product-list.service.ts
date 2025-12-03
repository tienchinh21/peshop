import { axiosJava } from "@/lib/config/axios.config";
import type {
  ShopProductListResponse,
  ProductListFilters,
} from "../types";

/**
 * Build Spring Filter expression from filters
 * Supports Spring Filter syntax with operators: :, >, >=, <, <=, and, or, not, ~, ~~
 */
const buildFilterExpression = (filters: ProductListFilters): string => {
  const expressions: string[] = [];

  // Search by name (case-insensitive like)
  if (filters.search) {
    expressions.push(`name ~~ '*${filters.search}*'`);
  }

  if (filters.categoryId) {
    expressions.push(`category.id : '${filters.categoryId}'`);
  }

  if (filters.categoryChildId) {
    expressions.push(`categoryChild.id : '${filters.categoryChildId}'`);
  }

  if (filters.status !== undefined && filters.status !== null) {
    expressions.push(`status : ${filters.status}`);
  }

  if (filters.classify !== undefined) {
    if (filters.classify === null) {
      expressions.push(`classify : null`);
    } else {
      expressions.push(`classify : ${filters.classify}`);
    }
  }

  // Combine all expressions with 'and'
  return expressions.join(" and ");
};

/**
 * Build sort parameter
 * Format: property,(asc|desc)
 * Example: price,desc
 */
const buildSortParam = (filters: ProductListFilters): string | undefined => {
  if (!filters.sortBy) return undefined;

  const order = filters.sortOrder || "asc";
  return `${filters.sortBy},${order}`;
};

/**
 * Fetch shop products with filtering, pagination, and sorting
 *
 * @param filters - Filter parameters
 * @returns Promise<ShopProductListResponse>
 *
 * @example
 * // Simple - filter by name
 * getShopProducts({ page: 1, size: 10, search: 'iphone' })
 *
 * @example
 * // Filter by category
 * getShopProducts({ page: 1, size: 10, categoryId: 'CATEGORY_ID' })
 *
 * @example
 * // Advanced - filter, sort, and paginate
 * getShopProducts({
 *   page: 1,
 *   size: 10,
 *   search: 'pro',
 *   categoryId: 'CATEGORY_ID',
 *   status: ProductStatus.ACTIVE,
 *   sortBy: 'price',
 *   sortOrder: 'desc'
 * })
 */
export const getShopProducts = async (
  filters?: ProductListFilters
): Promise<ShopProductListResponse> => {
  const params = new URLSearchParams();

  // Pagination (Spring uses 0-based page index)
  const page = filters?.page ? filters.page - 1 : 0;
  const size = filters?.size || 10;

  params.append("page", page.toString());
  params.append("size", size.toString());

  // Sorting
  const sort = buildSortParam(filters || {});
  if (sort) {
    params.append("sort", sort);
  }

  // Filtering
  const filterExpression = buildFilterExpression(filters || {});
  if (filterExpression) {
    params.append("filter", filterExpression);
  }

  const url = `/shop/product?${params.toString()}`;
  const response = await axiosJava.get<ShopProductListResponse>(url);

  return response.data;
};

/**
 * Delete a product
 */
export const deleteShopProduct = async (productId: string): Promise<void> => {
  await axiosJava.delete(`/shop/product/${productId}`);
};

/**
 * Update product status
 */
export const updateProductStatus = async (
  productId: string,
  status: number
): Promise<void> => {
  await axiosJava.patch(`/shop/product/${productId}/status`, { status });
};
