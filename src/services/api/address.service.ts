import axios from "axios";

const ADDRESS_API = "https://sandbox.goship.io/api/v2";
const Token = process.env.NEXT_PUBLIC_TOKEN_GOSHIP;

console.log(Token);

export const getProvinces = async () => {
    const response = await axios.get(`${ADDRESS_API}/cities`, {
        headers: {
            Authorization: `Bearer ${Token}`,
        },
    });
    return response.data;
};

export const getDistrictsByProvince = async (provinceCode: string) => {
    const response = await axios.get(
        `${ADDRESS_API}/cities/${encodeURIComponent(provinceCode)}/districts`,
        {
            headers: {
                Authorization: `Bearer ${Token}`,
            },
        },
    );
    return response.data;
};

export const getWardsByDistrict = async (districtCode: string) => {
    const response = await axios.get(
        `${ADDRESS_API}/districts/${encodeURIComponent(districtCode)}/wards`,
        {
            headers: {
                Authorization: `Bearer ${Token}`,
            },
        },
    );
    return response.data;
};
