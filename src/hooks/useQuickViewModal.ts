import { useState } from "react";
import type { Product } from "@/types/users/product.types";

interface UseQuickViewModalReturn {
  selectedProduct: Product | null;
  isModalOpen: boolean;
  isModalLoading: boolean;
  handleQuickView: (product: Product) => void;
  handleCloseModal: () => void;
  handleModalDataLoaded: () => void;
}

/**
 * Hook for managing QuickViewModal state across all pages
 * Provides consistent modal behavior for home, search, and product pages
 */
export function useQuickViewModal(): UseQuickViewModalReturn {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setIsModalLoading(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setIsModalLoading(false);
  };

  const handleModalDataLoaded = () => {
    setIsModalLoading(false);
  };

  return {
    selectedProduct,
    isModalOpen,
    isModalLoading,
    handleQuickView,
    handleCloseModal,
    handleModalDataLoaded,
  };
}
