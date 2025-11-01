import { axiosJava, axiosJavaFormData } from "@/lib/config/axios.config";
import { API_ENDPOINTS_JAVA } from "@/lib/config/api.config";
import { createFormDataWithJson } from "@/lib/utils/formData.utils";
import type { Shop, CreateShopRequest } from "@/types/shops/shop.types";

export const createShop = async (data: CreateShopRequest) => {
    const shopData = {
        name: data.name,
        description: data.description || "",
        oldProviceId: data.oldProviceId,
        oldDistrictId: data.oldDistrictId,
        oldWardId: data.oldWardId,
        streetLine: data.streetLine,
        fullOldAddress: data.fullOldAddress,
        ...(data.newProviceId && { newProviceId: data.newProviceId }),
        ...(data.newWardId && { newWardId: data.newWardId }),
        ...(data.fullNewAddress && { fullNewAddress: data.fullNewAddress }),
    };

    const formData = createFormDataWithJson(shopData, data.logofile);
    const response = await axiosJavaFormData(
        API_ENDPOINTS_JAVA.SHOPS.CREATE,
        formData,
        "POST",
    );
    return response;
};

export const updateShop = async (id: string, data: CreateShopRequest) => {
    const shopData = {
        name: data.name,
        description: data.description || "",
        oldProviceId: data.oldProviceId,
        oldDistrictId: data.oldDistrictId,
        oldWardId: data.oldWardId,
        streetLine: data.streetLine,
        fullOldAddress: data.fullOldAddress,
        ...(data.newProviceId && { newProviceId: data.newProviceId }),
        ...(data.newWardId && { newWardId: data.newWardId }),
        ...(data.fullNewAddress && { fullNewAddress: data.fullNewAddress }),
    };

    const formData = createFormDataWithJson(shopData, data.logofile);

    const response = await axiosJavaFormData(
        API_ENDPOINTS_JAVA.SHOPS.PUT.replace(":id", id),
        formData,
        "PUT",
    );
    return response;
};

export const getShop = async (id: string) => {
    const response = await axiosJava.get<Shop>(
        API_ENDPOINTS_JAVA.SHOPS.PUT.replace(":id", id),
    );
    return response.data;
};
