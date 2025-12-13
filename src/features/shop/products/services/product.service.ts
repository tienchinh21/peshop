import { axiosJava, axiosJavaFormData } from "@/lib/config/axios.config";
import type { Product, ProductPayload, CreateProductPayload, UpdateProductPayload, ProductResponse, ProductFilters, ProductVariant, ProductImage } from "../types";
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosJavaFormData("/storage/upload/temp", formData, "POST");
  return response as string;
};
export const uploadImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file));
  return Promise.all(uploadPromises);
};
export const uploadProductImages = async (imageFiles: File[]): Promise<ProductImage[]> => {
  const uploadPromises = imageFiles.map((file, index) => uploadImage(file).then(url => ({
    urlImage: url,
    sortOrder: index
  })));
  return Promise.all(uploadPromises);
};
export const uploadVariantImages = async (variantImagesMap: {
  [key: string]: File;
}): Promise<{
  [key: string]: string;
}> => {
  const entries = Object.entries(variantImagesMap);
  const uploadPromises = entries.map(async ([key, file]) => {
    const url = await uploadImage(file);
    return [key, url] as [string, string];
  });
  const results = await Promise.all(uploadPromises);
  return Object.fromEntries(results);
};
export const createProduct = async (data: CreateProductPayload): Promise<ProductResponse> => {
  const response = await axiosJava.post("/shop/product", data);
  return response.data;
};
export const getProduct = async (id: string): Promise<Product> => {
  const response = await axiosJava.get<Product>(`/shop/product/${id}`);
  return response.data;
};
export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "classify" && value === null) {
          params.append(key, "null");
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }
  const response = await axiosJava.get<Product[]>(`/products?${params.toString()}`);
  return response.data;
};
export const updateProduct = async (id: string, data: Partial<ProductPayload>): Promise<ProductResponse> => {
  const response = await axiosJava.put<ProductResponse>(`/products/${id}`, data);
  return response.data;
};
export const updateProductFull = async (id: string, data: UpdateProductPayload): Promise<ProductResponse> => {
  const response = await axiosJava.put<ProductResponse>(`/shop/product/${id}`, data);
  return response.data;
};
export const deleteProduct = async (id: string): Promise<void> => {
  await axiosJava.delete(`/products/${id}`);
};
export const addProductVariant = async (productId: string, variant: ProductVariant): Promise<ProductVariant> => {
  const response = await axiosJava.post<ProductVariant>(`/products/${productId}/variants`, variant);
  return response.data;
};
export const updateProductVariant = async (productId: string, variantId: string, variant: Partial<ProductVariant>): Promise<ProductVariant> => {
  const response = await axiosJava.put<ProductVariant>(`/products/${productId}/variants/${variantId}`, variant);
  return response.data;
};
export const deleteProductVariant = async (productId: string, variantId: string): Promise<void> => {
  await axiosJava.delete(`/products/${productId}/variants/${variantId}`);
};
export const addProductImage = async (productId: string, imageFile: File, sortOrder: number): Promise<string> => {
  const imageUrl = await uploadImage(imageFile);
  await axiosJava.post(`/products/${productId}/images`, {
    urlImage: imageUrl,
    sortOrder
  });
  return imageUrl;
};
export const updateProductImageOrder = async (productId: string, imageId: string, sortOrder: number): Promise<void> => {
  await axiosJava.put(`/products/${productId}/images/${imageId}`, {
    sortOrder
  });
};
export const deleteProductImage = async (productId: string, imageId: string): Promise<void> => {
  await axiosJava.delete(`/products/${productId}/images/${imageId}`);
};

/**
 * Add product information
 * @param productId - Product ID
 * @param name - Information name
 * @param value - Information value
 * @returns Promise<void>
 */
export const addProductInformation = async (productId: string, name: string, value: string): Promise<void> => {
  await axiosJava.post(`/products/${productId}/informations`, {
    name,
    value
  });
};

/**
 * Update product information
 * @param productId - Product ID
 * @param infoId - Information ID
 * @param name - Updated name
 * @param value - Updated value
 * @returns Promise<void>
 */
export const updateProductInformation = async (productId: string, infoId: string, name: string, value: string): Promise<void> => {
  await axiosJava.put(`/products/${productId}/informations/${infoId}`, {
    name,
    value
  });
};

/**
 * Delete product information
 * @param productId - Product ID
 * @param infoId - Information ID
 * @returns Promise<void>
 */
export const deleteProductInformation = async (productId: string, infoId: string): Promise<void> => {
  await axiosJava.delete(`/products/${productId}/informations/${infoId}`);
};

/**
 * Create product with image uploads
 * @param productData - Product data
 * @param imageFiles - Array of image files
 * @returns Promise<ProductResponse>
 */
export const createProductWithImages = async (productData: CreateProductPayload, imageFiles: File[]): Promise<ProductResponse> => {
  const imageUrls = await uploadImages(imageFiles);
  const images = imageUrls.map((url, index) => ({
    urlImage: url,
    sortOrder: index
  }));
  const updatedProductData: CreateProductPayload = {
    ...productData,
    imagesProduct: images
  };
  return createProduct(updatedProductData);
};

/**
 * Update product with new images
 * @param productId - Product ID
 * @param productData - Updated product data
 * @param newImageFiles - New image files to add
 * @returns Promise<ProductResponse>
 */
export const updateProductWithImages = async (productId: string, productData: Partial<ProductPayload>, newImageFiles?: File[]): Promise<ProductResponse> => {
  let updatedData = {
    ...productData
  };
  if (newImageFiles && newImageFiles.length > 0) {
    const imageUrls = await uploadImages(newImageFiles);
    const newImages = imageUrls.map((url, index) => ({
      urlImage: url,
      // @ts-ignore
      sortOrder: (productData.images?.length || 0) + index
    }));
    updatedData = {
      ...updatedData,
      // @ts-ignore
      images: [...(productData.images || []), ...newImages]
    };
  }
  return updateProduct(productId, updatedData);
};