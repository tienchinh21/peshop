import axios from "axios";

const GOSHIP_API_BASE_URL = "https://sandbox.goship.io/api/v2";
const GOSHIP_TOKEN = process.env.NEXT_PUBLIC_TOKEN_GOSHIP;

/**
 * Creates axios config with GoShip authentication
 */
const createGoShipConfig = () => ({
  headers: {
    Authorization: `Bearer ${GOSHIP_TOKEN}`,
  },
});

/**
 * Fetches list of provinces/cities from GoShip API
 */
export const getProvinces = async () => {
  const response = await axios.get(
    `${GOSHIP_API_BASE_URL}/cities`,
    createGoShipConfig()
  );
  return response.data;
};

/**
 * Fetches districts for a specific province from GoShip API
 */
export const getDistrictsByProvince = async (provinceCode: string) => {
  const response = await axios.get(
    `${GOSHIP_API_BASE_URL}/cities/${encodeURIComponent(provinceCode)}/districts`,
    createGoShipConfig()
  );
  return response.data;
};

/**
 * Fetches wards for a specific district from GoShip API
 */
export const getWardsByDistrict = async (districtCode: string) => {
  const response = await axios.get(
    `${GOSHIP_API_BASE_URL}/districts/${encodeURIComponent(districtCode)}/wards`,
    createGoShipConfig()
  );
  return response.data;
};
