"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ChevronRight, Search, X } from "lucide-react";
import { useCategories, useCategoryChildren } from "@/shared/hooks";
import type { Category, CategoryChild } from "@/features/shop/categories";
import { cn } from "@/lib/utils";

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: CategoryChild, parentCategory: Category) => void;
}

export function CategorySelectionModal({
  isOpen,
  onClose,
  onSelect,
}: CategorySelectionModalProps) {
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [selectedChild, setSelectedChild] = useState<CategoryChild | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query hooks
  const { data: parentCategories = [], isLoading: loadingParents } =
    useCategories();
  const { data: childCategories = [], isLoading: loadingChildren } =
    useCategoryChildren(selectedParent?.id || null);

  // Filter categories based on search
  const filteredParentCategories = parentCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChildCategories = Array.isArray(childCategories)
    ? childCategories.filter((category: CategoryChild) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleParentClick = (category: Category) => {
    setSelectedParent(category);
    setSelectedChild(null); // Clear previous child selection when switching parent
  };

  const handleChildClick = (child: CategoryChild) => {
    setSelectedChild(child);
  };

  const handleConfirm = () => {
    if (selectedChild && selectedParent) {
      onSelect(selectedChild, selectedParent);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedParent(null);
    setSelectedChild(null);
    setSearchQuery("");
    onClose();
  };

  const isConfirmDisabled = !selectedChild;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] w-[95vw] p-0">
        <DialogHeader className="p-4 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Chỉnh sửa ngành hàng
            </DialogTitle>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>
        <div className="flex flex-col h-[70vh]">
          {/* Search Bar */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Vui lòng nhập tối thiểu 1 ký tự"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel - Parent Categories */}
            <div className="w-1/3 border-r overflow-y-auto">
              <div className="p-4">
                {loadingParents ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredParentCategories.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleParentClick(category)}
                        className={cn(
                          "flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors",
                          selectedParent?.id === category.id
                            ? "bg-orange-50 border border-orange-200"
                            : ""
                        )}
                      >
                        <span
                          className={cn(
                            "text-sm",
                            selectedParent?.id === category.id
                              ? "font-medium text-orange-700"
                              : "text-gray-700"
                          )}
                        >
                          {category.name}
                        </span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4",
                            selectedParent?.id === category.id
                              ? "text-orange-500"
                              : "text-gray-400"
                          )}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Child Categories */}
            <div className="flex-1 overflow-y-auto">
              {selectedParent ? (
                <div className="p-4">
                  {loadingChildren ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredChildCategories.map((child: CategoryChild) => (
                        <div
                          key={child.id}
                          onClick={() => handleChildClick(child)}
                          className={cn(
                            "p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors",
                            selectedChild?.id === child.id
                              ? "bg-orange-50 border border-orange-200"
                              : ""
                          )}
                        >
                          <span
                            className={cn(
                              "text-sm",
                              selectedChild?.id === child.id
                                ? "text-orange-700 font-medium"
                                : "text-gray-700"
                            )}
                          >
                            {child.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <span className="text-sm">
                    Chọn danh mục bên trái để xem chi tiết
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedParent && selectedChild ? (
                <span>
                  Đã chọn: {selectedParent.name} {" > "} {selectedChild.name}
                </span>
              ) : selectedParent ? (
                <span>Đã chọn: {selectedParent.name}</span>
              ) : (
                <span>Chưa chọn ngành hàng</span>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isConfirmDisabled}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
