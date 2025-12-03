"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

interface ProductTabsProps {
  product: {
    description: string;
    reviewCount: number;
  };
}

export default function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start border-b">
        <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
        <TabsTrigger value="reviews">
          Đánh giá ({product.reviewCount})
        </TabsTrigger>
        <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
        <TabsTrigger value="policies">Chính sách</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="text-center text-gray-600">
          Chức năng đánh giá đang được phát triển
        </div>
      </TabsContent>

      <TabsContent value="specifications" className="mt-6">
        <div className="text-center text-gray-600">
          Thông số kỹ thuật đang được cập nhật
        </div>
      </TabsContent>

      <TabsContent value="policies" className="mt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Chính sách đổi trả</h3>
            <p className="text-gray-600">
              Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Chính sách bảo hành</h3>
            <p className="text-gray-600">
              Bảo hành 12 tháng theo chính sách nhà sản xuất
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Chính sách vận chuyển</h3>
            <p className="text-gray-600">
              Miễn phí vận chuyển cho đơn hàng trên 500.000đ
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
