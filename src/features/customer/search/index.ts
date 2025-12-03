// Components
export { SearchResultsPage, SearchFilters } from "./components";

// Hooks
export {
  searchKeys,
  useSearchSuggestions,
  useSearchResults,
  useSearchWithSuggestions,
} from "./hooks";

// Services
export { getSearchSuggestions, searchProducts } from "./services";

// Types
export type {
  SearchSuggestion,
  SearchSuggestionsResponse,
  SearchProduct,
  SearchShop,
  SearchResultsData,
  SearchResultsResponse,
  SearchFilters as SearchFiltersType,
} from "./types";
