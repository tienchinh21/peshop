"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { MapPin, Plus } from "lucide-react";
import {
  useDefaultAddress,
  useAddressList,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../hooks";
import { AddressFormModal, type AddressFormData } from "./AddressFormModal";
import { AddressListModal } from "./AddressListModal";
import type { UserAddress } from "../types";
import _ from "lodash";

interface AddressSectionProps {
  address: string;
  onAddressChange: (address: string) => void;
}

export function AddressSection({
  address,
  onAddressChange,
}: AddressSectionProps) {
  const { data: defaultAddress, isLoading } = useDefaultAddress();
  const { data: addressList = [] } = useAddressList();
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  useEffect(() => {
    if (defaultAddress && !address) {
      const fullAddress = _.get(defaultAddress, "fullOldAddress", "");
      if (fullAddress) {
        onAddressChange(fullAddress);
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }, [defaultAddress, address, onAddressChange]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsListModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleEditAddress = (addr: UserAddress) => {
    setEditingAddress(addr);
    setIsListModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      await deleteAddressMutation.mutateAsync(id);
    }
  };

  const handleSubmitAddress = async (data: AddressFormData) => {
    try {
      if (editingAddress) {
        await updateAddressMutation.mutateAsync({
          id: editingAddress.id,
          ...data,
        });
      } else {
        await createAddressMutation.mutateAsync(data);
      }
      setIsFormModalOpen(false);
      setEditingAddress(null);
      setIsListModalOpen(true);
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  const handleSelectAddress = (addr: UserAddress) => {
    const fullAddress = _.get(addr, "fullOldAddress") || "";
    onAddressChange(fullAddress);
    setSelectedAddressId(addr.id);
    setIsListModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Địa chỉ nhận hàng
            </h3>
          </div>

          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : defaultAddress ? (
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-900">
                    {defaultAddress.phone || "Chưa có số điện thoại"}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded border border-purple-200">
                    Mặc định
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {_.get(defaultAddress, "fullOldAddress", "")}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsListModalOpen(true)}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                Thay đổi
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Chưa có địa chỉ nào</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAddress}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm địa chỉ
              </Button>
            </div>
          )}
        </div>
      </div>

      <AddressListModal
        open={isListModalOpen}
        onOpenChange={setIsListModalOpen}
        addressList={addressList}
        selectedAddressId={selectedAddressId}
        onSelectAddress={handleSelectAddress}
        onEditAddress={handleEditAddress}
        onDeleteAddress={handleDeleteAddress}
        onAddAddress={handleAddAddress}
        isDeleting={deleteAddressMutation.isPending}
      />

      <AddressFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        onSubmit={handleSubmitAddress}
        editAddress={editingAddress}
        isLoading={
          createAddressMutation.isPending || updateAddressMutation.isPending
        }
      />
    </>
  );
}
