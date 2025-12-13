import axios from "axios";
const GOSHIP_API_BASE_URL = "https://sandbox.goship.io/api/v2";
const GOSHIP_TOKEN = process.env.NEXT_PUBLIC_TOKEN_GOSHIP;
const createGoShipConfig = () => ({
  headers: {
    Authorization: `Bearer ${GOSHIP_TOKEN}`
  }
});
export const getProvinces = async () => {
  const response = await axios.get(`${GOSHIP_API_BASE_URL}/cities`, createGoShipConfig());
  return response.data;
};
export const getDistrictsByProvince = async (provinceCode: string) => {
  const response = await axios.get(`${GOSHIP_API_BASE_URL}/cities/${encodeURIComponent(provinceCode)}/districts`, createGoShipConfig());
  return response.data;
};
export const getWardsByDistrict = async (districtCode: string) => {
  const response = await axios.get(`${GOSHIP_API_BASE_URL}/districts/${encodeURIComponent(districtCode)}/wards`, createGoShipConfig());
  return response.data;
};