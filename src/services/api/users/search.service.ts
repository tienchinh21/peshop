import { axiosDotnet } from "@/lib/config/axios.config";
import { API_ENDPOINTS } from "@/lib/config/api.config";
import type {
    SearchSuggestionsResponse,
    SearchResultsResponse,
    SearchFilters,
} from "@/types/users/search.types";

/**
 * Get search suggestions based on keyword
 * Used for autocomplete dropdown
 * @param keyword - Search keyword
 * @returns Promise<SearchSuggestionsResponse>
 */
export const getSearchSuggestions = async (
    keyword: string,
): Promise<SearchSuggestionsResponse> => {
    const params = new URLSearchParams();
    params.append("keyword", keyword);

    const url = `${API_ENDPOINTS.SEARCH.SUGGEST}?${params.toString()}`;
    const response = await axiosDotnet.get<SearchSuggestionsResponse>(url);
    return response.data;
};

/**
 * Search for products and shops
 * @param filters - Search filters including keyword, pagination, etc.
 * @returns Promise<SearchResultsResponse>
 */
export const searchProducts = async (
    filters: SearchFilters,
): Promise<SearchResultsResponse> => {
    const params = new URLSearchParams();

    // Required parameter
    params.append("keyword", filters.keyword);

    // Optional parameters
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.pageSize)
        params.append("pageSize", filters.pageSize.toString());
    if (filters.searchType) params.append("searchType", filters.searchType);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.minPrice)
        params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
        params.append("maxPrice", filters.maxPrice.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const url = `${API_ENDPOINTS.SEARCH.SEARCH}?${params.toString()}`;
    const response = await axiosDotnet.get<SearchResultsResponse>(url);
    return response.data;
};
