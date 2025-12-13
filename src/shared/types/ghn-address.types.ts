/**
 * GHN (Giao Hàng Nhanh) Address Types
 * Used for fetching Vietnamese provinces, districts, and wards from backend GHN API
 */

/**
 * Inner GHN API response structure
 */
export interface GHNInnerResponse<T> {
  code: number;
  message: string;
  data: T[];
}

/**
 * Outer API response wrapper from backend
 * Structure: { error: null, data: { code, message, data: [...] } }
 */
export interface GHNApiResponse<T> {
  error: string | null;
  data: GHNInnerResponse<T>;
}

/**
 * Province (Tỉnh/Thành phố) data from GHN API
 * Endpoint: /ghn/get-list-province
 */
export interface GHNProvince {
  provinceID: number;
  provinceName: string;
  code: string;
  updatedSource: string;
}

/**
 * District (Quận/Huyện) data from GHN API
 * Endpoint: /ghn/get-list-district?provinceId=X
 */
export interface GHNDistrict {
  districtID: number;
  provinceID: number;
  districtName: string;
  code: string;
  supportType: number;
  type: number;
  updatedSource: string;
}

/**
 * Ward (Phường/Xã) data from GHN API
 * Endpoint: /ghn/get-list-ward?districtId=X
 */
export interface GHNWard {
  wardCode: string;
  districtID: number;
  wardName: string;
  updatedSource: string;
}
