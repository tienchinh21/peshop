import { axiosDotnet } from "@/lib/config/axios.config";
import type { VoucherEligibilityResponse } from "../types";
import _ from "lodash";
export const checkVoucherEligibility = async (orderId: string): Promise<VoucherEligibilityResponse> => {
  const res = await axiosDotnet.get("/Voucher/check-eligibility", {
    params: {
      orderId
    }
  });
  return _.get(res, "data.data");
};
export const getVouchers = async (): Promise<VoucherEligibilityResponse> => {
  const res = await axiosDotnet.get<VoucherEligibilityResponse>("/Voucher/get-vouchers");
  return res.data;
};