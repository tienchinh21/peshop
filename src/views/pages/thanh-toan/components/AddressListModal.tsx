"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Plus, Edit2, Trash2 } from "lucide-react";
import { AddressFormModal, type AddressFormData } from "./AddressFormModal";
import type { UserAddress } from "@/types/users/address.types";
import _ from "lodash";

interface AddressListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressList: UserAddress[];
  selectedAddressId: string;
  onSelectAddress: (addr: UserAddress) => void;
  onEditAddress: (addr: UserAddress) => void;
  onDeleteAddress: (id: string) => void;
  onAddAddress: () => void;
  isDeleting?: boolean;
}

export function AddressListModal({
  open,
  onOpenChange,
  addressList,
  selectedAddressId,
  onSelectAddress,
  onEditAddress,
  onDeleteAddress,
  onAddAddress,
  isDeleting = false,
}: AddressListModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Quản lý địa chỉ giao hàng</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddAddress}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm địa chỉ
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {addressList.length > 0 ? (
            addressList.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedAddressId === addr.id
                    ? "bg-purple-50 border-purple-500 ring-2 ring-purple-200"
                    : "bg-white border-gray-200 hover:border-purple-300"
                }`}
                onClick={() => onSelectAddress(addr)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <MapPin
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        selectedAddressId === addr.id
                          ? "text-purple-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          {_.get(addr, "fullOldAddress", "")}
                        </p>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                      {addr.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-600">{addr.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAddress(addr);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    {!addr.isDefault && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAddress(addr.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="w-16 h-16 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium">Chưa có địa chỉ nào</p>
              <p className="text-xs mt-1 mb-4">
                Nhấn "Thêm địa chỉ" để tạo địa chỉ mới
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

