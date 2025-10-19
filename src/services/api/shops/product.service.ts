import { axiosJava, axiosJavaFormData } from "@/lib/config/axios.config";
import type {
  Product,
  ProductPayload,
  CreateProductPayload,
  ProductResponse,
  ProductFilters,
  ProductVariant,
  ProductImage,
} from "@/types/shops/product.type";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosJavaFormData(
    "/storage/upload/temp",
    formData,
    "POST"
  );

  return response as string;
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadImage(file));
  return Promise.all(uploadPromises);
};

/**
 * Upload product images and return ProductImage array with proper sortOrder
 * sortOrder is the array index, where 0 is the cover image
 */
export const uploadProductImages = async (
  imageFiles: File[]
): Promise<ProductImage[]> => {
  const uploadPromises = imageFiles.map((file, index) =>
    uploadImage(file).then((url) => ({
      urlImage: url,
      sortOrder: index, // index 0 = cover image
    }))
  );
  return Promise.all(uploadPromises);
};

/**
 * Upload variant images and return a map of variant value to image URL
 * Used for first-level classification images
 */
export const uploadVariantImages = async (variantImagesMap: {
  [key: string]: File;
}): Promise<{ [key: string]: string }> => {
  const entries = Object.entries(variantImagesMap);
  const uploadPromises = entries.map(async ([key, file]) => {
    const url = await uploadImage(file);
    return [key, url] as [string, string];
  });
  const results = await Promise.all(uploadPromises);
  return Object.fromEntries(results);
};

export const createProduct = async (
  data: CreateProductPayload
): Promise<ProductResponse> => {
  const formData = new FormData();

  // Add product as JSON blob with application/json type
  const productBlob = new Blob([JSON.stringify(data.product)], {
    type: "application/json",
  });
  formData.append("product", productBlob);

  // Add propertyValues as JSON blob with application/json type
  const propertyValuesBlob = new Blob([JSON.stringify(data.propertyValues)], {
    type: "application/json",
  });
  formData.append("propertyValues", propertyValuesBlob);

  // Add variants as JSON blob with application/json type
  const variantsBlob = new Blob([JSON.stringify(data.variants)], {
    type: "application/json",
  });
  formData.append("variants", variantsBlob);

  const response = await axiosJavaFormData("/shop/product", formData, "POST");
  return response;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await axiosJava.get<Product>(`/shop/product/${id}`);
  return response.data;
};

export const getProducts = async (
  filters?: ProductFilters
): Promise<Product[]> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const response = await axiosJava.get<Product[]>(
    `/products?${params.toString()}`
  );
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: Partial<ProductPayload>
): Promise<ProductResponse> => {
  const response = await axiosJava.put<ProductResponse>(
    `/products/${id}`,
    data
  );
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axiosJava.delete(`/products/${id}`);
};

export const addProductVariant = async (
  productId: string,
  variant: ProductVariant
): Promise<ProductVariant> => {
  const response = await axiosJava.post<ProductVariant>(
    `/products/${productId}/variants`,
    variant
  );
  return response.data;
};

export const updateProductVariant = async (
  productId: string,
  variantId: string,
  variant: Partial<ProductVariant>
): Promise<ProductVariant> => {
  const response = await axiosJava.put<ProductVariant>(
    `/products/${productId}/variants/${variantId}`,
    variant
  );
  return response.data;
};

export const deleteProductVariant = async (
  productId: string,
  variantId: string
): Promise<void> => {
  await axiosJava.delete(`/products/${productId}/variants/${variantId}`);
};

export const addProductImage = async (
  productId: string,
  imageFile: File,
  sortOrder: number
): Promise<string> => {
  // First upload the image
  const imageUrl = await uploadImage(imageFile);

  await axiosJava.post(`/products/${productId}/images`, {
    urlImage: imageUrl,
    sortOrder,
  });

  return imageUrl;
};

export const updateProductImageOrder = async (
  productId: string,
  imageId: string,
  sortOrder: number
): Promise<void> => {
  await axiosJava.put(`/products/${productId}/images/${imageId}`, {
    sortOrder,
  });
};

export const deleteProductImage = async (
  productId: string,
  imageId: string
): Promise<void> => {
  await axiosJava.delete(`/products/${productId}/images/${imageId}`);
};

// ============ Product Information Services ============

/**
 * Add product information
 * @param productId - Product ID
 * @param name - Information name
 * @param value - Information value
 * @returns Promise<void>
 */
export const addProductInformation = async (
  productId: string,
  name: string,
  value: string
): Promise<void> => {
  await axiosJava.post(`/products/${productId}/informations`, {
    name,
    value,
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
export const updateProductInformation = async (
  productId: string,
  infoId: string,
  name: string,
  value: string
): Promise<void> => {
  await axiosJava.put(`/products/${productId}/informations/${infoId}`, {
    name,
    value,
  });
};

/**
 * Delete product information
 * @param productId - Product ID
 * @param infoId - Information ID
 * @returns Promise<void>
 */
export const deleteProductInformation = async (
  productId: string,
  infoId: string
): Promise<void> => {
  await axiosJava.delete(`/products/${productId}/informations/${infoId}`);
};

// ============ Utility Functions ============

/**
 * Create product with image uploads
 * @param productData - Product data
 * @param imageFiles - Array of image files
 * @returns Promise<ProductResponse>
 */
export const createProductWithImages = async (
  productData: CreateProductPayload,
  imageFiles: File[]
): Promise<ProductResponse> => {
  // Upload all images first
  const imageUrls = await uploadImages(imageFiles);

  // Create image objects with URLs and sort orders
  const images = imageUrls.map((url, index) => ({
    urlImage: url,
    sortOrder: index,
  }));

  // Update product data with image URLs
  const updatedProductData: CreateProductPayload = {
    ...productData,
    product: {
      ...productData.product,
      images,
    },
  };

  // Create the product
  return createProduct(updatedProductData);
};

/**
 * Update product with new images
 * @param productId - Product ID
 * @param productData - Updated product data
 * @param newImageFiles - New image files to add
 * @returns Promise<ProductResponse>
 */
export const updateProductWithImages = async (
  productId: string,
  productData: Partial<ProductPayload>,
  newImageFiles?: File[]
): Promise<ProductResponse> => {
  let updatedData = { ...productData };

  // If new images are provided, upload them
  if (newImageFiles && newImageFiles.length > 0) {
    const imageUrls = await uploadImages(newImageFiles);
    const newImages = imageUrls.map((url, index) => ({
      urlImage: url,
      sortOrder: (productData.images?.length || 0) + index,
    }));

    updatedData = {
      ...updatedData,
      images: [...(productData.images || []), ...newImages],
    };
  }

  return updateProduct(productId, updatedData);
};
