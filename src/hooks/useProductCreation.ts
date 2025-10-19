import { useState, useRef, useEffect } from "react";
import { Category, CategoryChild } from "@/types/shops/category.type";
import {
  ProductClassification,
  ProductInformation,
  CreateProductPayload,
  ProductPayload,
} from "@/types/shops/product.type";
import { createProduct } from "@/services/api/shops/product.service";
import { transformVariantsForAPI } from "@/lib/utils/product.utils";
import { toast } from "sonner";

export interface ProductImageWithUrl {
  file: File;
  url: string | null;
}

export interface VariantImageWithUrl {
  file: File;
  url: string | null;
}

interface UseProductCreationReturn {
  // Category state
  selectedCategory: CategoryChild | null;
  setSelectedCategory: (category: CategoryChild | null) => void;
  selectedParentCategory: Category | null;
  setSelectedParentCategory: (category: Category | null) => void;

  // Tab navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sectionsRef: React.MutableRefObject<{ [key: string]: HTMLElement | null }>;
  registerSection: (id: string, element: HTMLElement | null) => void;
  scrollToSection: (tabId: string) => void;

  // Basic Info state - Store File for preview, URL for submission
  productImages: ProductImageWithUrl[];
  setProductImages: (images: ProductImageWithUrl[]) => void;
  productName: string;
  setProductName: (name: string) => void;
  productDescription: string;
  setProductDescription: (description: string) => void;

  // Product Info (Variants) state - Store File for preview, URL for submission
  selectedClassifications: ProductClassification[];
  setSelectedClassifications: (
    classifications: ProductClassification[]
  ) => void;
  variants: UIVariant[];
  setVariants: (variants: UIVariant[]) => void;
  variantImages: { [key: string]: VariantImageWithUrl };
  setVariantImages: (images: { [key: string]: VariantImageWithUrl }) => void;

  // Other Info state
  weight: number;
  setWeight: (weight: number) => void;
  dimensions: { length: number; width: number; height: number };
  setDimensions: (dimensions: {
    length: number;
    width: number;
    height: number;
  }) => void;
  productInformations: ProductInformation[];
  setProductInformations: (infos: ProductInformation[]) => void;

  // Submission
  isSubmitting: boolean;
  handleSubmitProduct: () => Promise<void>;
}

// UI Variant structure (used in ProductInfoSection)
export interface UIVariant {
  id: string;
  values: { propertyId: string; value: string }[];
  price: number;
  stock: number;
  image: string | null;
}

interface AttributeValue {
  templateId: number;
  templateName: string;
  value: string;
}

const tabs = [
  { id: "basic-info", label: "Thông tin cơ bản" },
  { id: "product-info", label: "Thông tin bán hàng" },
  { id: "other-info", label: "Thông tin chi tiết" },
];

export const useProductCreation = (): UseProductCreationReturn => {
  // Category state
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryChild | null>(null);
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<Category | null>(null);

  // Tab navigation state
  const [activeTab, setActiveTab] = useState("basic-info");
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  // Basic Info state - Store File for preview, URL for submission
  const [productImages, setProductImages] = useState<ProductImageWithUrl[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");

  // Product Info (Variants) state - Store File for preview, URL for submission
  const [selectedClassifications, setSelectedClassifications] = useState<
    ProductClassification[]
  >([]);
  const [variants, setVariants] = useState<UIVariant[]>([]);
  const [variantImages, setVariantImages] = useState<{
    [key: string]: VariantImageWithUrl;
  }>({});

  // Other Info state
  const [weight, setWeight] = useState(0);
  const [dimensions, setDimensions] = useState({
    length: 0,
    width: 0,
    height: 0,
  });
  const [productInformations, setProductInformations] = useState<
    ProductInformation[]
  >([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle scroll to update active tab
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = 56 + 64; // ShopHeader (56px) + TabsHeader (64px)
      const scrollPosition = window.scrollY + headerHeight;

      let currentActiveTab = tabs[0].id; // Default to first tab

      for (const tab of tabs) {
        const section = sectionsRef.current[tab.id];
        if (section) {
          const { offsetTop } = section;
          if (scrollPosition >= offsetTop - 50) {
            // 50px buffer
            currentActiveTab = tab.id;
          }
        }
      }

      setActiveTab(currentActiveTab);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Register section refs
  const registerSection = (id: string, element: HTMLElement | null) => {
    sectionsRef.current[id] = element;
  };

  // Handle tab click to scroll to section
  const scrollToSection = (tabId: string) => {
    const section = sectionsRef.current[tabId];
    if (section) {
      const headerOffset = 80; // Account for sticky header
      const elementPosition = section.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Product submission handler - Images are already uploaded as URLs
  const handleSubmitProduct = async () => {
    // Validate product data
    if (!productName.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (productImages.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 ảnh sản phẩm");
      return;
    }

    if (!selectedCategory) {
      toast.error("Vui lòng chọn ngành hàng");
      return;
    }

    if (variants.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 phân loại sản phẩm");
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Extract URLs from variantImages for API
      const variantImageUrls: { [key: string]: string } = {};
      Object.keys(variantImages).forEach((key) => {
        const imageData = variantImages[key];
        if (imageData.url) {
          variantImageUrls[key] = imageData.url;
        }
      });

      // Step 2: Transform variants to new API format (generates propertyValueIds)
      const { propertyValues, variants: apiVariants } = transformVariantsForAPI(
        variants,
        selectedClassifications,
        variantImageUrls
      );

      // Step 3: Build product images with sortOrder (using URLs)
      const productImagesWithSort = productImages
        .filter((img) => img.url !== null)
        .map((img, index) => ({
          urlImage: img.url!,
          sortOrder: index,
        }));

      // Step 4: Build product payload
      const productPayload: ProductPayload = {
        name: productName,
        description: productDescription,
        categoryChildId: selectedCategory.id,
        images: productImagesWithSort,
        productInformations: productInformations.filter(
          (info) => info.value.trim() !== ""
        ),
        weight,
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
      };

      // Step 5: Build complete payload with new structure
      const createPayload: CreateProductPayload = {
        product: productPayload,
        propertyValues: propertyValues, // All unique property values with UUIDs
        variants: apiVariants, // Variants reference propertyValueIds
      };

      // Step 6: Submit to API
      toast.info("Đang tạo sản phẩm...");
      const response = await createProduct(createPayload);

      // Success
      toast.success("Tạo sản phẩm thành công!", {
        description: `Sản phẩm "${productName}" đã được tạo`,
      });

      console.log("Product created successfully:", response);
    } catch (error: any) {
      console.error("Error submitting product:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Tạo sản phẩm thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Category state
    selectedCategory,
    setSelectedCategory,
    selectedParentCategory,
    setSelectedParentCategory,

    // Tab navigation
    activeTab,
    setActiveTab,
    sectionsRef,
    registerSection,
    scrollToSection,

    // Basic Info state
    productImages,
    setProductImages,
    productName,
    setProductName,
    productDescription,
    setProductDescription,

    // Product Info (Variants) state
    selectedClassifications,
    setSelectedClassifications,
    variants,
    setVariants,
    variantImages,
    setVariantImages,

    // Other Info state
    weight,
    setWeight,
    dimensions,
    setDimensions,
    productInformations,
    setProductInformations,

    // Submission
    isSubmitting,
    handleSubmitProduct,
  };
};
