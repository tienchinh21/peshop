import { axiosJava } from "@/lib/config/axios.config";
import type {
    ShopVoucherListResponse,
    VoucherListFilters,
    CreateVoucherPayload,
    UpdateVoucherPayload,
} from "@/types/shops/voucher.type";

const buildSortParam = (filters: VoucherListFilters): string => {
    if (!filters.sortBy) return "";
    const order = filters.sortOrder || "asc";
    return `${filters.sortBy},${order}`;
};

const buildFilterExpression = (filters: VoucherListFilters): string => {
    const expressions: string[] = [];

    if (filters.search) {
        expressions.push(
            `(name ~~ '*${filters.search}*' or code ~~ '*${filters.search}*')`,
        );
    }

    if (filters.status !== undefined && filters.status !== null) {
        expressions.push(`status : ${filters.status}`);
    }

    if (filters.type !== undefined && filters.type !== null) {
        expressions.push(`type : ${filters.type}`);
    }

    return expressions.join(" and ");
};

export const getShopVouchers = async (
    filters?: VoucherListFilters,
): Promise<ShopVoucherListResponse> => {
    const params = new URLSearchParams();
    const page = filters?.page ? filters.page - 1 : 0;
    const size = filters?.size || 10;

    params.append("page", page.toString());
    params.append("size", size.toString());

    const sort = buildSortParam(filters || {});
    if (sort) params.append("sort", sort);

    const filterExpression = buildFilterExpression(filters || {});
    if (filterExpression) params.append("filter", filterExpression);

    const url = `/voucher-shop?${params.toString()}`;
    const response = await axiosJava.get<ShopVoucherListResponse>(url);
    return response.data;
};

export const getVoucherById = async (id: string) => {
    const response = await axiosJava.get(`/voucher-shop/${id}`);
    return response.data;
};

export const createVoucher = async (payload: CreateVoucherPayload) => {
    const response = await axiosJava.post("/voucher-shop", payload);
    return response.data;
};

export const updateVoucher = async (
    id: string,
    payload: UpdateVoucherPayload,
) => {
    const response = await axiosJava.put(`/voucher-shop/${id}`, payload);
    return response.data;
};

export const deleteVoucher = async (id: string) => {
    const response = await axiosJava.delete(`/voucher-shop/${id}`);
    return response.data;
};
