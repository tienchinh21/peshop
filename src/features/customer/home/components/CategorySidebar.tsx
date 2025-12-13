"use client";

import { Button } from "@/shared/components/ui/button";
import { Percent, Star, Home, Smartphone, ShoppingBag, Heart, Gamepad2, Baby, Trophy, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
const categories = [{
  icon: Percent,
  label: "Deals",
  color: "bg-pink-500",
  children: ["Flash Sales", "Daily Deals", "Clearance", "Bundle Offers", "Seasonal Sales"]
}, {
  icon: Star,
  label: "What's New",
  color: "bg-yellow-500",
  children: ["Latest Products", "New Arrivals", "Trending Items", "Featured Products", "Just Launched"]
}, {
  icon: Home,
  label: "Home & Garden",
  color: "bg-blue-600",
  children: ["Furniture", "Home Decor", "Kitchen & Dining", "Garden Tools", "Lighting", "Storage Solutions"]
}, {
  icon: Smartphone,
  label: "Electronics",
  color: "bg-gray-700",
  children: ["Smartphones", "Laptops", "Tablets", "Audio & Video", "Gaming", "Accessories"]
}, {
  icon: ShoppingBag,
  label: "Fashion",
  color: "bg-black",
  children: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories", "Jewelry", "Bags"]
}, {
  icon: Heart,
  label: "Beauty & Health",
  color: "bg-red-500",
  children: ["Skincare", "Makeup", "Hair Care", "Health Supplements", "Personal Care", "Fragrances"]
}, {
  icon: Trophy,
  label: "Sports & Entertainment",
  color: "bg-gray-600",
  children: ["Fitness Equipment", "Sports Gear", "Outdoor Activities", "Team Sports", "Water Sports", "Winter Sports"]
}, {
  icon: Gamepad2,
  label: "Toys & Games",
  color: "bg-purple-500",
  children: ["Action Figures", "Board Games", "Educational Toys", "Puzzles", "Video Games", "Outdoor Toys"]
}, {
  icon: Baby,
  label: "Mother & Kids",
  color: "bg-teal-500",
  children: ["Baby Care", "Kids Clothing", "Nursery", "Feeding", "Safety", "Learning Toys"]
}];
export default function CategorySidebar() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleMouseEnter = (categoryIndex: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredCategory(categoryIndex);
    setIsModalVisible(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsModalVisible(false);
      setHoveredCategory(null);
    }, 50);
  };
  const handleModalMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  const handleModalMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsModalVisible(false);
      setHoveredCategory(null);
    }, 50);
  };
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return <>
      {}
      <div className="lg:hidden w-full mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category, index) => <button key={index} className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors min-w-[80px]">
              <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center`}>
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-800 text-center line-clamp-2">
                {category.label}
              </span>
            </button>)}
          <button className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors min-w-[80px]">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
              <Menu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-800 text-center">
              All
            </span>
          </button>
        </div>
      </div>

      {}
      <div className="hidden lg:block relative">
        <aside className="w-full lg:w-60 xl:w-64 bg-white rounded-lg overflow-hidden">
          <div className="space-y-1 p-3">
            {categories.map((category, index) => <Button key={index} variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-gray-50" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium text-sm">
                    {category.label}
                  </span>
                </div>
                <span className="text-gray-400 text-lg">›</span>
              </Button>)}

            <Button variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-gray-50 mt-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                  <Menu className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-800 font-medium text-sm">
                  All Categories
                </span>
              </div>
              <span className="text-gray-400 text-lg">›</span>
            </Button>
          </div>
        </aside>

        {}
        {isModalVisible && hoveredCategory !== null && <div className="absolute left-60 top-0 bg-white shadow-lg border border-gray-200 z-50 transition-opacity duration-200 ease-in-out" style={{
        width: "min(900px, calc(100vw - 20rem))",
        height: "100%"
      }} onMouseEnter={handleModalMouseEnter} onMouseLeave={handleModalMouseLeave}>
            <div className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">
                  {categories[hoveredCategory].label}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                  {categories[hoveredCategory].children.map((item, itemIndex) => <a key={itemIndex} href="#" className="block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded">
                        {item}
                      </a>)}
                </div>
              </div>
            </div>
          </div>}
      </div>
    </>;
}