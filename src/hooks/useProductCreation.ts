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

  // Level 0 (Simple Product) state
  simpleProductPrice: number;
  setSimpleProductPrice: (price: number) => void;
  simpleProductStock: number;
  setSimpleProductStock: (stock: number) => void;

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
  status?: number;
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

  // Level 0 (Simple Product) state
  const [simpleProductPrice, setSimpleProductPrice] = useState(0);
  const [simpleProductStock, setSimpleProductStock] = useState(0);

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

  const handleSubmitProduct = async () => {
    if (!productName.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (productImages.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 ảnh sản phẩm");
      return;
    }

    const imagesWithoutUrl = productImages.filter((img) => img.url === null);
    if (imagesWithoutUrl.length > 0) {
      toast.error("Vui lòng đợi tải ảnh hoàn tất");
      return;
    }

    if (!selectedCategory) {
      toast.error("Vui lòng chọn ngành hàng");
      return;
    }

    const isLevel0 = selectedClassifications.length === 0;

    if (isLevel0) {
      if (simpleProductPrice <= 0) {
        toast.error("Vui lòng nhập giá sản phẩm");
        return;
      }
      if (simpleProductStock <= 0) {
        toast.error("Vui lòng nhập số lượng sản phẩm");
        return;
      }
    } else {
      if (variants.length === 0) {
        toast.error("Vui lòng thêm ít nhất 1 phân loại sản phẩm");
        return;
      }
    }

    if (selectedClassifications.length > 2) {
      toast.error("Chỉ hỗ trợ tối đa 2 cấp phân loại");
      return;
    }

    setIsSubmitting(true);
    try {
      let propertyValues: any = null;
      let apiVariants: any[] = [];

      if (isLevel0) {
        apiVariants = [
          {
            variantCreateDto: {
              price: simpleProductPrice,
              quantity: simpleProductStock,
              status: 1,
            },
            code: null,
          },
        ];
      } else {
        const variantImageUrls: { [key: string]: string } = {};
        Object.keys(variantImages).forEach((key) => {
          const imageData = variantImages[key];
          if (imageData.url) {
            variantImageUrls[key] = imageData.url;
          }
        });

        const result = transformVariantsForAPI(
          variants,
          selectedClassifications,
          variantImageUrls
        );
        propertyValues = result.propertyValues;
        apiVariants = result.variants;
      }

      const productImagesWithSort = productImages
        .filter((img) => img.url !== null)
        .map((img, index) => ({
          urlImage: img.url!,
          sortOrder: index,
        }));

      console.log("Product images for submission:", productImagesWithSort);

      const productPayload: ProductPayload = {
        name: productName,
        description: productDescription,
        categoryChildId: selectedCategory.id,
        weight,
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
        classify: selectedClassifications.length,
      };

      const createPayload: CreateProductPayload = {
        product: productPayload,
        productInformations: productInformations.filter(
          (info) => info.value.trim() !== ""
        ),
        propertyValues: propertyValues,
        variants: apiVariants,
        imagesProduct: productImagesWithSort,
      };

      console.log("Complete create product payload:", JSON.stringify(createPayload, null, 2));

      toast.info("Đang tạo sản phẩm...");
      const response = await createProduct(createPayload);

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

    // Level 0 (Simple Product) state
    simpleProductPrice,
    setSimpleProductPrice,
    simpleProductStock,
    setSimpleProductStock,

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
