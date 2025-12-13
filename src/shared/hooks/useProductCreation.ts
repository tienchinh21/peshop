import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Category, CategoryChild } from "@/features/shop/categories";
import { ProductClassification, ProductInformation, CreateProductPayload, ProductPayload } from "@/types/shops/product.type";
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
  selectedCategory: CategoryChild | null;
  setSelectedCategory: (category: CategoryChild | null) => void;
  selectedParentCategory: Category | null;
  setSelectedParentCategory: (category: Category | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sectionsRef: React.MutableRefObject<{
    [key: string]: HTMLElement | null;
  }>;
  registerSection: (id: string, element: HTMLElement | null) => void;
  scrollToSection: (tabId: string) => void;
  productImages: ProductImageWithUrl[];
  setProductImages: (images: ProductImageWithUrl[]) => void;
  productName: string;
  setProductName: (name: string) => void;
  productDescription: string;
  setProductDescription: (description: string) => void;
  selectedClassifications: ProductClassification[];
  setSelectedClassifications: (classifications: ProductClassification[]) => void;
  variants: UIVariant[];
  setVariants: (variants: UIVariant[]) => void;
  variantImages: {
    [key: string]: VariantImageWithUrl;
  };
  setVariantImages: (images: {
    [key: string]: VariantImageWithUrl;
  }) => void;
  simpleProductPrice: number;
  setSimpleProductPrice: (price: number) => void;
  simpleProductStock: number;
  setSimpleProductStock: (stock: number) => void;
  weight: number;
  setWeight: (weight: number) => void;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  setDimensions: (dimensions: {
    length: number;
    width: number;
    height: number;
  }) => void;
  productInformations: ProductInformation[];
  setProductInformations: (infos: ProductInformation[]) => void;
  isSubmitting: boolean;
  handleSubmitProduct: () => Promise<void>;
}
export interface UIVariant {
  id: string;
  values: {
    propertyId: string;
    value: string;
  }[];
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
const tabs = [{
  id: "basic-info",
  label: "Thông tin cơ bản"
}, {
  id: "product-info",
  label: "Thông tin bán hàng"
}, {
  id: "other-info",
  label: "Thông tin chi tiết"
}];
export const useProductCreation = (): UseProductCreationReturn => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryChild | null>(null);
  const [selectedParentCategory, setSelectedParentCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState("basic-info");
  const sectionsRef = useRef<{
    [key: string]: HTMLElement | null;
  }>({});
  const [productImages, setProductImages] = useState<ProductImageWithUrl[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedClassifications, setSelectedClassifications] = useState<ProductClassification[]>([]);
  const [variants, setVariants] = useState<UIVariant[]>([]);
  const [variantImages, setVariantImages] = useState<{
    [key: string]: VariantImageWithUrl;
  }>({});
  const [simpleProductPrice, setSimpleProductPrice] = useState(0);
  const [simpleProductStock, setSimpleProductStock] = useState(0);
  const [weight, setWeight] = useState(0);
  const [dimensions, setDimensions] = useState({
    length: 0,
    width: 0,
    height: 0
  });
  const [productInformations, setProductInformations] = useState<ProductInformation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = 56 + 64;
      const scrollPosition = window.scrollY + headerHeight;
      let currentActiveTab = tabs[0].id;
      for (const tab of tabs) {
        const section = sectionsRef.current[tab.id];
        if (section) {
          const {
            offsetTop
          } = section;
          if (scrollPosition >= offsetTop - 50) {
            currentActiveTab = tab.id;
          }
        }
      }
      setActiveTab(currentActiveTab);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const registerSection = (id: string, element: HTMLElement | null) => {
    sectionsRef.current[id] = element;
  };
  const scrollToSection = (tabId: string) => {
    const section = sectionsRef.current[tabId];
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.offsetTop;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
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
    const imagesWithoutUrl = productImages.filter(img => img.url === null);
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
        apiVariants = [{
          variantCreateDto: {
            price: simpleProductPrice,
            quantity: simpleProductStock,
            status: 1
          },
          code: null
        }];
      } else {
        const variantImageUrls: {
          [key: string]: string;
        } = {};
        Object.keys(variantImages).forEach(key => {
          const imageData = variantImages[key];
          if (imageData.url) {
            variantImageUrls[key] = imageData.url;
          }
        });
        const result = transformVariantsForAPI(variants, selectedClassifications, variantImageUrls);
        propertyValues = result.propertyValues;
        apiVariants = result.variants;
      }
      const productImagesWithSort = productImages.filter(img => img.url !== null).map((img, index) => ({
        urlImage: img.url!,
        sortOrder: index
      }));
      const productPayload: ProductPayload = {
        name: productName,
        description: productDescription,
        categoryChildId: selectedCategory.id,
        weight,
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
        classify: selectedClassifications.length
      };
      const createPayload: CreateProductPayload = {
        product: productPayload,
        productInformations: productInformations.filter(info => info.value.trim() !== ""),
        propertyValues: propertyValues,
        variants: apiVariants,
        imagesProduct: productImagesWithSort
      };
      toast.info("Đang tạo sản phẩm...");
      await createProduct(createPayload);
      toast.success("Tạo sản phẩm thành công!", {
        description: `Sản phẩm "${productName}" đã được tạo`
      });
      setSelectedCategory(null);
      setSelectedParentCategory(null);
      setActiveTab("basic-info");
      setProductImages([]);
      setProductName("");
      setProductDescription("");
      setSelectedClassifications([]);
      setVariants([]);
      setVariantImages({});
      setSimpleProductPrice(0);
      setSimpleProductStock(0);
      setWeight(0);
      setDimensions({ length: 0, width: 0, height: 0 });
      setProductInformations([]);
      router.push("/shop/san-pham");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Tạo sản phẩm thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    selectedCategory,
    setSelectedCategory,
    selectedParentCategory,
    setSelectedParentCategory,
    activeTab,
    setActiveTab,
    sectionsRef,
    registerSection,
    scrollToSection,
    productImages,
    setProductImages,
    productName,
    setProductName,
    productDescription,
    setProductDescription,
    selectedClassifications,
    setSelectedClassifications,
    variants,
    setVariants,
    variantImages,
    setVariantImages,
    simpleProductPrice,
    setSimpleProductPrice,
    simpleProductStock,
    setSimpleProductStock,
    weight,
    setWeight,
    dimensions,
    setDimensions,
    productInformations,
    setProductInformations,
    isSubmitting,
    handleSubmitProduct
  };
};
