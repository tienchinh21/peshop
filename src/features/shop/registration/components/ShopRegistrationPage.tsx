"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/shared/hooks";
import { Store } from "lucide-react";
import {
  AddressSelectModal,
  AddressSelection,
} from "@/shared/components/layout/AddressSelectModal";
import { createShop } from "../services";
import { useDispatch } from "react-redux";
import { updateUser } from "@/lib/store/slices/authSlice";
import { STORAGE_KEYS } from "@/lib/config/api.config";
import type { AppDispatch } from "@/lib/store";

import { BasicInfoSection } from "./BasicInfoSection";
import { AvatarUploadSection } from "./AvatarUploadSection";
import { AddressSection } from "./AddressSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { FormActions } from "./FormActions";

const ShopRegistrationPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    streetLine: "",
    phone: "",
    email: "",
    description: "123131231",
    oldProviceId: "",
    oldDistrictId: "",
    oldWardId: "",
    fullOldAddress: "",
    fullNewAddress: "132123123",
    newWardId: "12313123",
    newProviceId: "1231313123",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressSelection | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: user?.email || "",
      phone: user?.phone || "",
    }));
  }, [user]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error("Vui lòng chọn file hình ảnh");
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Kích thước file không được vượt quá 5MB");
          return;
        }

        setAvatarFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Clear error if exists
        setErrors((prev) => {
          if (prev.avatar) {
            const { avatar, ...rest } = prev;
            return rest;
          }
          return prev;
        });
      }
    },
    []
  );

  const removeAvatar = useCallback(() => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleOpenAddressModal = useCallback(() => {
    setAddressModalOpen(true);
  }, []);

  const handleCancelClick = useCallback(() => {
    router.back();
  }, [router]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "Tên shop là bắt buộc";
    }

    if (!formData.streetLine) {
      newErrors.streetLine = "Địa chỉ là bắt buộc";
    }

    if (!selectedAddress) {
      newErrors.streetLine =
        newErrors.streetLine || "Vui lòng chọn Tỉnh/Quận/Phường";
    }

    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ");
      return;
    }

    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ");
      return;
    }

    setIsLoading(true);

    try {
      const shopData = {
        name: formData.name,
        description: formData.description || "",
        oldProviceId: selectedAddress.provinceId,
        oldDistrictId: selectedAddress.districtId,
        oldWardId: selectedAddress.wardId,
        streetLine: formData.streetLine,
        fullOldAddress: `${formData.streetLine}, ${selectedAddress.wardName}, ${selectedAddress.districtName}, ${selectedAddress.provinceName}`,
        fullNewAddress: formData.fullNewAddress,
        newWardId: formData.newWardId,
        newProviceId: formData.newProviceId,
        ...(avatarFile && { logofile: avatarFile }),
      };

      const response = await createShop(shopData);

      if (user) {
        const updatedRoles = [...(user.roles || [])];
        if (!updatedRoles.includes("Shop")) {
          updatedRoles.push("Shop");
        }

        const updatedUser = {
          ...user,
          roles: updatedRoles,
        };

        dispatch(updateUser(updatedUser));

        if (typeof window !== "undefined") {
          localStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(updatedUser)
          );
        }
      }

      toast.success("Đăng ký shop thành công!", {
        description: "Chuyển hướng đến dashboard...",
      });

      setTimeout(() => router.push("/shop/dashboard"), 500);
    } catch (error) {
      console.error("Create shop error:", error);
      toast.error("Đăng ký shop thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header Section */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-primary/20 bg-primary/10">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Đăng ký cửa hàng
              </h1>
              <p className="text-muted-foreground">
                Tạo cửa hàng của bạn để bắt đầu kinh doanh
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1 border-b bg-card pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                Thông tin cửa hàng
              </CardTitle>
              <Badge variant="secondary" className="font-normal">
                Bắt buộc
              </Badge>
            </div>
            <CardDescription>
              Điền đầy đủ thông tin để tạo cửa hàng mới
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <BasicInfoSection
                name={formData.name}
                error={errors.name}
                onChange={handleInputChange}
              />

              <AvatarUploadSection
                avatarPreview={avatarPreview}
                avatarFile={avatarFile}
                fileInputRef={fileInputRef}
                error={errors.avatar}
                onAvatarChange={handleAvatarChange}
                onRemoveAvatar={removeAvatar}
                onUploadClick={handleUploadClick}
              />

              <AddressSection
                streetLine={formData.streetLine}
                selectedAddress={selectedAddress}
                error={errors.streetLine}
                onChange={handleInputChange}
                onOpenModal={handleOpenAddressModal}
              />

              <ContactInfoSection
                phone={formData.phone}
                email={formData.email}
                phoneError={errors.phone}
                emailError={errors.email}
                onChange={handleInputChange}
              />

              <FormActions isLoading={isLoading} onCancel={handleCancelClick} />
            </form>
          </CardContent>
        </Card>
      </div>

      <AddressSelectModal
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        onConfirm={(value) => setSelectedAddress(value)}
      />
    </div>
  );
};

export default ShopRegistrationPage;
