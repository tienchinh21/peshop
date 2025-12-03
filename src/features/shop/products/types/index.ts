// Product types
export type {
  ProductImage,
  ProductInformation,
  PropertyValue,
  VariantCreateDto,
  ProductVariant,
  Product,
  ProductPayload,
  ProductVariantsPayload,
  CreateProductPayload,
  UpdateProductInformation,
  UpdatePropertyValue,
  UpdateVariant,
  UpdateProductImage,
  UpdateProductPayload,
  ProductResponse,
  ProductFilters,
  ProductFormData,
  ProductProperty,
  ProductVariantValue,
  ProductClassification,
  ProductVariantTable,
} from "./product.types";

// Product list types
export type {
  ProductCategory,
  ProductCategoryChild,
  ShopProduct,
  ProductListPaginationInfo,
  ProductListContent,
  ShopProductListResponse,
  ProductListFilters,
} from "./product-list.types";
export { ProductStatus } from "./product-list.types";

// Product detail types
export type {
  ProductOption,
  ProductVariantDetail,
  ShopProductDetail,
  ShopProductDetailResponse,
} from "./product-detail.types";

// Category types
export type {
  Category,
  CategoryResponse,
  CategoryChild,
  CategoryChildResponse,
  AttributeTemplate,
  TemplateCategory,
  TemplateCategoryChild,
  CategoryTemplate,
  CategoryTemplateResponse,
} from "./category.types";
