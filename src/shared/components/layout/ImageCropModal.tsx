"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Slider } from "@/shared/components/ui/slider";
import { ZoomIn, ZoomOut } from "lucide-react";
interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImage: Blob) => void;
  aspectRatio?: number;
}
export function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatio = 1
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0
  });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropChange = useCallback((crop: {
    x: number;
    y: number;
  }) => {
    setCrop(crop);
  }, []);
  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);
  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa ảnh</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {}
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={aspectRatio} onCropChange={onCropChange} onZoomChange={onZoomChange} onCropComplete={onCropCompleteHandler} />
          </div>

          {}
          <div className="flex items-center space-x-4">
            <ZoomOut className="w-5 h-5 text-gray-500" />
            <Slider value={[zoom]} onValueChange={value => setZoom(value[0])} min={1} max={3} step={0.1} className="flex-1" />
            <ZoomIn className="w-5 h-5 text-gray-500" />
          </div>

          {}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={createCroppedImage} className="bg-orange-500 hover:bg-orange-600">
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/jpeg");
  });
}
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", error => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}