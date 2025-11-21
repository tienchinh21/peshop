export interface ShopData {
    id: string;
    name?: string;
    address?: string;
    description?: string;
    logo?: string;
    newProviceId?: string;
    productCount?: number;
    followersCount?: number;
}

export interface GetShopResponse {
    error: null;
    data: ShopData;
}