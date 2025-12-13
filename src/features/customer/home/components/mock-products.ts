export interface Product {
  id: string;
  name: string;
  currentPrice: number;
  originalPrice: number;
  image: string;
  store: string;
  storeColor: string;
  rating: number;
  reviewCount: number;
  badges?: string[];
  colors?: string;
  totalQuantity?: number;
  soldQuantity?: number;
}
export const mockProducts: Product[] = [{
  id: "1",
  name: "Slate Series 33 Inch French Door Refrigerator Slate",
  currentPrice: 1899.0,
  originalPrice: 1994.05,
  image: "/1-58.webp",
  store: "TehchiStore",
  storeColor: "bg-pink-500",
  rating: 5,
  reviewCount: 1,
  badges: ["Sale"],
  colors: "3 Colors",
  totalQuantity: 50,
  soldQuantity: 32
}, {
  id: "2",
  name: "MacBook Pro 16 with Retina Display (Space Gray)",
  currentPrice: 49.0,
  originalPrice: 54.9,
  image: "/1-58.webp",
  store: "Zone Shop",
  storeColor: "bg-purple-500",
  rating: 5,
  reviewCount: 2,
  badges: ["Sale"],
  totalQuantity: 30,
  soldQuantity: 18
}, {
  id: "3",
  name: "JOBY GripTight PRO TelePod Tripod",
  currentPrice: 125.0,
  originalPrice: 159.0,
  image: "/1-58.webp",
  store: "Zone Shop",
  storeColor: "bg-purple-500",
  rating: 5,
  reviewCount: 1,
  badges: ["Sale", "Hot"],
  totalQuantity: 25,
  soldQuantity: 22
}, {
  id: "4",
  name: "Galaxy Watch Active 2 Aluminum Smart Watch",
  currentPrice: 399.0,
  originalPrice: 489.0,
  image: "/1-58.webp",
  store: "Abra Co.",
  storeColor: "bg-green-500",
  rating: 5,
  reviewCount: 1,
  badges: ["Sale"],
  totalQuantity: 40,
  soldQuantity: 15
}, {
  id: "5",
  name: "1TB Gaming Console - Wireless Game Pad - Black",
  currentPrice: 300.0,
  originalPrice: 380.0,
  image: "/1-58.webp",
  store: "Casual",
  storeColor: "bg-red-500",
  rating: 5,
  reviewCount: 1,
  badges: ["Sale"],
  totalQuantity: 35,
  soldQuantity: 28
}, {
  id: "6",
  name: "Samsung 55-inch 4K Smart TV",
  currentPrice: 699.99,
  originalPrice: 899.99,
  image: "/1-58.webp",
  store: "TechStore",
  storeColor: "bg-blue-500",
  rating: 4,
  reviewCount: 12,
  badges: ["Sale", "Hot"],
  totalQuantity: 20,
  soldQuantity: 19
}, {
  id: "7",
  name: "iPhone 15 Pro Max 256GB",
  currentPrice: 1099.0,
  originalPrice: 1199.0,
  image: "/1-58.webp",
  store: "Apple Store",
  storeColor: "bg-gray-600",
  rating: 5,
  reviewCount: 8,
  badges: ["Sale"],
  totalQuantity: 15,
  soldQuantity: 12
}, {
  id: "8",
  name: "Sony WH-1000XM5 Wireless Headphones",
  currentPrice: 349.99,
  originalPrice: 399.99,
  image: "/1-58.webp",
  store: "Audio Pro",
  storeColor: "bg-indigo-500",
  rating: 5,
  reviewCount: 15,
  badges: ["Sale"],
  totalQuantity: 45,
  soldQuantity: 23
}, {
  id: "9",
  name: "Dell XPS 13 Laptop - 13.3 inch",
  currentPrice: 1299.0,
  originalPrice: 1499.0,
  image: "/1-58.webp",
  store: "TechWorld",
  storeColor: "bg-blue-600",
  rating: 4,
  reviewCount: 23,
  badges: ["Sale", "Hot"],
  totalQuantity: 12,
  soldQuantity: 10
}, {
  id: "10",
  name: "Canon EOS R5 Mirrorless Camera",
  currentPrice: 3899.0,
  originalPrice: 4299.0,
  image: "/1-58.webp",
  store: "PhotoPro",
  storeColor: "bg-red-600",
  rating: 5,
  reviewCount: 7,
  badges: ["Sale"],
  totalQuantity: 8,
  soldQuantity: 6
}];