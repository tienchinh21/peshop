export interface VoucherItem {
  Id: string;
  Name: string;
  Code: string;
  Quantity: number;
  DiscountValue: number;
  MaxdiscountAmount: number;
  MiniumOrderValue: number;
  StartTime: string;
  EndTime: string;
  ValueType: number;
  ValueTypeName: string;
}
export interface VoucherAbility {
  IsAllowed: boolean;
  Reason: string;
  Voucher: VoucherItem;
}
export interface SystemVoucherList {
  VoucherType: string;
  Vouchers: VoucherAbility[];
  BestVoucherId: string;
}
export interface ShopVoucherList {
  ShopId: string;
  ShopName: string;
  Vouchers: VoucherAbility[];
  BestVoucherId: string;
}
export interface VoucherEligibilityResponse {
  SystemVouchers: SystemVoucherList;
  ShopVouchers: ShopVoucherList[];
}