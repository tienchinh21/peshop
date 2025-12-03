import { axiosDotnet } from "@/lib/config/axios.config";
import _ from "lodash";
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
  UserAddress,
  AddressListResponse,
  AddressResponse,
} from "../types";

export const getAddressList = async (): Promise<UserAddress[]> => {
  const response = await axiosDotnet.get<AddressListResponse>(
    "/UserAddress/get-list-address"
  );
  return _.get(response, "data.data", []);
};

export const getDefaultAddress = async (): Promise<UserAddress | null> => {
  try {
    const response = await axiosDotnet.get<AddressResponse>(
      "/UserAddress/get-address-default"
    );
    return _.get(response, "data.data", null);
  } catch (error: any) {
    if (error?.response?.status === 400) {
      const addresses = await getAddressList();
      return addresses.length > 0 ? addresses[0] : null;
    }
    throw error;
  }
};

export const createAddress = async (
  payload: CreateAddressPayload
): Promise<UserAddress> => {
  const response = await axiosDotnet.post<AddressResponse>(
    "/UserAddress/create-list-address",
    payload
  );
  return _.get(response, "data.data");
};

export const updateAddress = async (
  payload: UpdateAddressPayload
): Promise<UserAddress> => {
  const response = await axiosDotnet.put<AddressResponse>(
    "/UserAddress/update-address",
    payload
  );
  return _.get(response, "data.data");
};

export const deleteAddress = async (id: string): Promise<void> => {
  await axiosDotnet.delete("/UserAddress/delete-address", {
    params: { id },
  });
};
