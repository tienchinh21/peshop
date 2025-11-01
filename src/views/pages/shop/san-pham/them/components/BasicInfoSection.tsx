"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor, ImageCropModal } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Upload,
  X,
  Plus,
  Video,
  ChevronDown,
  Camera,
  Loader2,
  Edit2,
} from "lucide-react";
import { CategorySelectionModal } from "@/components/common/Modal/CategorySelectionModal";
import { Category, CategoryChild } from "@/types/shops/category.type";
import { uploadImage } from "@/services/api/shops/product.service";
import { toast } from "sonner";
import { ProductImageWithUrl } from "@/hooks/useProductCreation";

interface BasicInfoSectionProps {
  selectedCategory: CategoryChild | null;
  setSelectedCategory: (category: CategoryChild | null) => void;
  selectedParentCategory: Category | null;
  setSelectedParentCategory: (category: Category | null) => void;
  productImages: ProductImageWithUrl[];
  setProductImages: (images: ProductImageWithUrl[]) => void;
  productName: string;
  setProductName: (name: string) => void;
  productDescription: string;
  setProductDescription: (description: string) => void;
}

export function BasicInfoSection({
  selectedCategory,
  setSelectedCategory,
  selectedParentCategory,
  setSelectedParentCategory,
  productImages,
  setProductImages,
  productName,
  setProductName,
  productDescription,
  setProductDescription,
}: BasicInfoSectionProps) {
  const [productVideo, setProductVideo] = useState<File | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [cropAspectRatio, setCropAspectRatio] = useState(1);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(
    null
  );

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const remainingSlots = 9 - productImages.length;
    const filesToAdd = filesArray.slice(0, remainingSlots);

    if (filesToAdd.length === 0) {
      toast.warning("Đã đạt giới hạn 9 ảnh");
      return;
    }

    // Show preview immediately with File objects
    const newImages: ProductImageWithUrl[] = filesToAdd.map((file) => ({
      file,
      url: null,
    }));
    const updatedImagesWithNew = [...productImages, ...newImages];
    setProductImages(updatedImagesWithNew);

    // Upload in background
    setUploadingImages(true);
    try {
      const uploadPromises = filesToAdd.map((file, idx) =>
        uploadImage(file).then((url) => ({
          index: productImages.length + idx,
          url,
        }))
      );
      const uploadResults = await Promise.all(uploadPromises);

      // Update URLs after upload completes
      const updated = [...updatedImagesWithNew];
      uploadResults.forEach(({ index, url }) => {
        if (updated[index]) {
          updated[index] = { ...updated[index], url };
        }
      });
      setProductImages(updated);

      toast.success(`Đã tải lên ${uploadResults.length} ảnh thành công`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleEditImage = (index: number) => {
    const imageData = productImages[index];
    const previewUrl = URL.createObjectURL(imageData.file);
    setImageToCrop(previewUrl);
    setCropAspectRatio(1);
    setEditingImageIndex(index);
    setCropModalOpen(true);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (editingImageIndex === null) return;

    const croppedFile = new File([croppedBlob], `product-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    // Show preview immediately
    const updatedImages = productImages.map((img, i) =>
      i === editingImageIndex ? { file: croppedFile, url: null } : img
    );
    setProductImages(updatedImages);
    setEditingImageIndex(null);

    // Upload in background
    setUploadingImages(true);
    try {
      const uploadedUrl = await uploadImage(croppedFile);
      const updatedImages = productImages.map(
        (img: ProductImageWithUrl, i: number) =>
          i === editingImageIndex ? { ...img, url: uploadedUrl } : img
      );
      setProductImages(updatedImages);
      toast.success("Đã cập nhật ảnh");
    } catch (error) {
      console.error("Error uploading cropped image:", error);
      toast.error("Cập nhật ảnh thất bại");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
    toast.success("Đã xóa ảnh");
  };

  const handleVideoUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setProductVideo(files[0]);
  };

  const removeVideo = () => {
    setProductVideo(null);
  };

  const handleCategorySelect = (
    category: CategoryChild,
    parentCategory: Category
  ) => {
    setSelectedCategory(category);
    setSelectedParentCategory(parentCategory);
    setIsCategoryModalOpen(false);
  };

  const openCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Thông tin cơ bản
        </h2>
      </div>

      {/* Product Images */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Hình ảnh sản phẩm <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-gray-500 mt-1">
            Ảnh đầu tiên sẽ là ảnh bìa sản phẩm. Tỷ lệ 1:1
          </p>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {/* Product Images */}
          {productImages.map((imageData, index) => (
            <div key={index} className="relative group">
              <div className="relative">
                <img
                  src={imageData.url || URL.createObjectURL(imageData.file)}
                  alt={`Product ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border"
                />
                {index === 0 && (
                  <div className="absolute bottom-1 left-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded">
                    Ảnh bìa
                  </div>
                )}

                {/* Edit button - hiển thị khi hover */}
                <button
                  onClick={() => handleEditImage(index)}
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg"
                >
                  <div className="bg-white rounded-full p-1.5">
                    <Edit2 className="w-3 h-3 text-gray-700" />
                  </div>
                </button>
              </div>

              <button
                onClick={() => removeImage(index)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          {productImages.length < 9 && (
            <div className="relative">
              <div className="w-full h-20 border-2 border-dashed border-orange-300 bg-gray-50 rounded-lg flex flex-col items-center justify-center hover:border-orange-400 transition-all duration-200 cursor-pointer relative group">
                {uploadingImages ? (
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-4 h-4 text-orange-500" />
                    <Plus className="w-2.5 h-2.5 text-orange-500 absolute top-1 right-1" />
                  </>
                )}
                <span className="text-[10px] text-orange-500 group-hover:text-orange-600 mt-0.5 font-medium">
                  {productImages.length}/9
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingImages}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 flex flex-col gap-2">
        <Label
          htmlFor="product-name"
          className="text-sm font-medium text-gray-700"
        >
          Tên sản phẩm <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="product-name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Tên sản phẩm + Thương hiệu + Model + Thông số kỹ thuật"
            className="pr-16"
            maxLength={120}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
            {productName.length}/120
          </span>
        </div>
      </div>

      <div className="space-y-2 flex flex-col gap-2">
        <Label className="text-sm font-medium text-gray-700">
          Ngành hàng <span className="text-red-500">*</span>
        </Label>
        <Button
          variant="outline"
          onClick={openCategoryModal}
          className="w-full justify-between h-10 px-3 py-2 text-left font-normal"
        >
          <span
            className={selectedCategory ? "text-gray-900" : "text-gray-500"}
          >
            {selectedCategory
              ? `${selectedParentCategory?.name} > ${selectedCategory.name}`
              : "Chọn ngành hàng"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>

      {/* Product Description */}
      <div className="space-y-2 flex flex-col gap-2">
        <Label
          htmlFor="product-description"
          className="text-sm font-medium text-gray-700"
        >
          Mô tả sản phẩm <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <RichTextEditor
            value={productDescription}
            onChange={setProductDescription}
            placeholder="Mô tả chi tiết về sản phẩm, tính năng, chất liệu, cách sử dụng..."
            maxLength={3000}
          />
        </div>
      </div>

      <CategorySelectionModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelect={handleCategorySelect}
      />

      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={imageToCrop}
        onClose={() => setCropModalOpen(false)}
        onCropComplete={handleCropComplete}
        aspectRatio={cropAspectRatio}
      />
    </div>
  );
}
