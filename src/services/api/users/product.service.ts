import { axiosDotnet } from "@/lib/config/axios.config";
import { API_ENDPOINTS } from "@/lib/config/api.config";
import type {
    ProductsApiResponse,
    ProductFilters,
    Product,
    ProductDetail,
    ProductDetailApiResponse,
    ProductPromotion,
    ProductPromotionsResponse,
    OrderPromotion,
} from "@/types/users/product.types";

export const getProducts = async (
    filters?: ProductFilters,
): Promise<ProductsApiResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.pageSize)
        params.append("pageSize", filters.pageSize.toString());
    if (filters?.categoryId) params.append("categoryId", filters.categoryId);
    if (filters?.categoryChildId)
        params.append("categoryChildId", filters.categoryChildId);
    if (filters?.minPrice)
        params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice)
        params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.reviewPoint)
        params.append("reviewPoint", filters.reviewPoint.toString());

    const queryString = params.toString();
    const url = queryString
        ? `${API_ENDPOINTS.PRODUCTS.GET_PRODUCTS}?${queryString}`
        : API_ENDPOINTS.PRODUCTS.GET_PRODUCTS;

    const response = await axiosDotnet.get<ProductsApiResponse>(url);
    return response.data;
};


export const searchProducts = async (
    filters?: ProductFilters,
): Promise<ProductsApiResponse> => {
    const params = new URLSearchParams();

    if (filters?.keyword) params.append("keyword", filters.keyword);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.pageSize)
        params.append("pageSize", filters.pageSize.toString());

    const queryString = params.toString();
    const url = queryString
        ? `${API_ENDPOINTS.SEARCH.SEARCH}?${queryString}`
        : API_ENDPOINTS.SEARCH.SEARCH;

    const response = await axiosDotnet.get<ProductsApiResponse>(url);
    return response.data;
};


export const getProductBySlug = async (slug: string): Promise<Product> => {
    const url = API_ENDPOINTS.PRODUCTS.DETAIL.replace(":slug", slug);
    const response = await axiosDotnet.get<Product>(url);
    return response.data;
};


export const getProductDetail = async (
    slug: string,
): Promise<ProductDetail> => {
    const params = new URLSearchParams();
    params.append("slug", slug);

    const url = `${API_ENDPOINTS.PRODUCTS.DETAIL_FULL}?${params.toString()}`;
    const response = await axiosDotnet.get<ProductDetailApiResponse>(url);
    return response.data.data;
};


export const getSimilarProducts = async (
    productId: string,
    options?: {
        byCategory?: boolean;
        byShop?: boolean;
        limit?: number;
    },
): Promise<Product[]> => {
    const params = new URLSearchParams();

    params.append("productId", productId);
    if (options?.byCategory) params.append("byCategory", "true");
    if (options?.byShop) params.append("byShop", "true");
    if (options?.limit) params.append("limit", options.limit.toString());

    const url = `/Products/similar?${params.toString()}`;
    const response = await axiosDotnet.get<ProductsApiResponse>(url);
    return response.data.data.products;
};

export const getPromotionsByProduct = async (
    productId: string,
): Promise<ProductPromotion[]> => {
    const params = new URLSearchParams();
    params.append("productId", productId);

    const url = `${API_ENDPOINTS.PROMOTION.GET_BY_PRODUCT}?${params.toString()}`;
    const response = await axiosDotnet.get<ProductPromotionsResponse>(url);
    return response.data.data;
};

export const checkPromotionsInOrder = async (
    orderId: string,
): Promise<OrderPromotion[]> => {
    const params = new URLSearchParams();
    params.append("orderId", orderId);

    const url = `${API_ENDPOINTS.PROMOTION.CHECK_IN_ORDER}?${params.toString()}`;
    const response = await axiosDotnet.get<OrderPromotion[]>(url);
    return response.data;
};
