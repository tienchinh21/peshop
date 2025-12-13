"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, BarChart3, Settings, PlusCircle, List, PackageCheck, Clock, Users, MessageSquare, Store, Megaphone, Ticket, Gift, Zap } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarRail } from "@/shared/components/ui/sidebar";
const menuItems = [{
  title: "Dashboard",
  url: "/shop/dashboard",
  icon: Home
}, {
  title: "Quản lý sản phẩm",
  icon: Package,
  items: [{
    title: "Danh sách sản phẩm",
    url: "/shop/san-pham",
    icon: List
  }, {
    title: "Thêm sản phẩm",
    url: "/shop/san-pham/them",
    icon: PlusCircle
  }]
}, {
  title: "Quản lý đơn hàng",
  icon: ShoppingCart,
  items: [{
    title: "Đơn hàng mới",
    url: "/shop/don-hang/moi",
    icon: Clock
  }, {
    title: "Đang xử lý",
    url: "/shop/don-hang/dang-xu-ly",
    icon: PackageCheck
  }, {
    title: "Tất cả đơn hàng",
    url: "/shop/don-hang",
    icon: List
  }]
}, {
  title: "Thống kê",
  url: "/shop/thong-ke",
  icon: BarChart3
}, {
  title: "Khách hàng",
  url: "/shop/khach-hang",
  icon: Users
}, {
  title: "Đánh giá",
  url: "/shop/danh-gia",
  icon: MessageSquare
}, {
  title: "Chiến dịch",
  icon: Megaphone,
  items: [{
    title: "Mã giảm giá",
    url: "/shop/chien-dich/ma-giam-gia",
    icon: Ticket
  }, {
    title: "Mua X Tặng Y",
    url: "/shop/chien-dich/muaXtangY",
    icon: Gift
  }, {
    title: "Flash Sale",
    url: "/shop/flash-sale",
    icon: Zap
  }]
}, {
  title: "Cài đặt",
  icon: Settings,
  items: [{
    title: "Thông tin shop",
    url: "/shop/cai-dat/thong-tin",
    icon: Store
  }, {
    title: "Cài đặt chung",
    url: "/shop/cai-dat",
    icon: Settings
  }]
}];
export function ShopSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = React.useState<string[]>([]);
  React.useEffect(() => {
    menuItems.forEach(item => {
      if (item.items) {
        const hasActiveSubmenu = item.items.some(subItem => pathname === subItem.url);
        if (hasActiveSubmenu && !openMenus.includes(item.title)) {
          setOpenMenus(prev => [...prev, item.title]);
        }
      }
    });
  }, [pathname]);
  const toggleMenu = (title: string) => {
    setOpenMenus(prev => prev.includes(title) ? prev.filter(item => item !== title) : [...prev, title]);
  };
  return <Sidebar>
      {}
      <SidebarHeader className="border-b p-6">
        <Link href="/shop/dashboard" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-gray-900">
              Quản lý Shop
            </span>
            <span className="text-sm text-gray-500">PeShop Seller</span>
          </div>
        </Link>
      </SidebarHeader>

      {}
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-2 text-sm font-semibold text-gray-600">
            Menu chính
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-2">
            <SidebarMenu className="space-y-1">
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  {item.items ? <>
                      <SidebarMenuButton onClick={() => toggleMenu(item.title)} isActive={openMenus.includes(item.title)} className="cursor-pointer px-4 py-3 h-auto min-h-[48px] text-sm font-medium">
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm">{item.title}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`ml-auto h-4 w-4 transition-transform ${openMenus.includes(item.title) ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </SidebarMenuButton>

                      {}
                      {openMenus.includes(item.title) && <SidebarMenuSub className="ml-4 mt-2 space-y-1">
                          {item.items.map(subItem => <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url} className="px-4 py-2 h-auto min-h-[40px] text-sm">
                                <Link href={subItem.url}>
                                  <subItem.icon className="w-4 h-4" />
                                  <span className="text-sm">
                                    {subItem.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>)}
                        </SidebarMenuSub>}
                    </> : <SidebarMenuButton asChild isActive={pathname === item.url} className="px-4 py-3 h-auto min-h-[48px] text-sm font-medium">
                      <Link href={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>}
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>;
}