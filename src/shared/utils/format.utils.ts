export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(price);
};
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("vi-VN").format(num);
};