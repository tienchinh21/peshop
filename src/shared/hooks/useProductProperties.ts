import { useQuery } from "@tanstack/react-query";
import { axiosJava } from "@/lib/config/axios.config";

export interface ProductProperty {
  id: string;
  name: string;
}

export interface ProductPropertiesResponse {
  error: string | null;
  content: ProductProperty[];
}

// API function for fetching product properties
const getProductProperties = async (): Promise<ProductPropertiesResponse> => {
  const response = await axiosJava.get<ProductPropertiesResponse>(
    "/admin/property-product"
  );
  return response.data;
};

// Hook for fetching product properties
export const useProductProperties = () => {
  return useQuery<ProductProperty[]>({
    queryKey: ["product-properties"],
    queryFn: async () => {
      const response = await getProductProperties();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.content;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
