export interface CreateAddressPayload {
  fullNewAddress: string;
  fullOldAddress: string;
  phone: string;
  newProviceId: string;
  newWardId: string;
  oldDistrictId: string;
  oldProviceId: string;
  oldWardId: string;
  streetLine: string;
  isDefault: boolean;
}

export interface UpdateAddressPayload extends CreateAddressPayload {
  id: string;
}

export interface UserAddress {
  id: string;
  fullNewAddress: string;
  phone: string | null;
  newProviceId: string | null;
  newWardId: string | null;
  streetLine: string | null;
  isDefault: boolean;
  oldDistrictId: string | null;
  oldProviceId: string | null;
  oldWardId: string | null;
  fullOldAddress: string | null;
}

export interface AddressListResponse {
  error: string | null;
  data: UserAddress[];
}

export interface AddressResponse {
  error: string | null;
  data: UserAddress;
}

