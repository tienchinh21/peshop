"use client";

import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { generateBreadcrumbSchema } from "@/lib/utils/seo.utils";
interface BreadcrumbItem {
  name: string;
  url?: string;
}
interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  currentPage: string;
}
export const BreadcrumbNavigation = ({
  items,
  currentPage
}: BreadcrumbNavigationProps) => {
  const breadcrumbSchema = generateBreadcrumbSchema([{
    name: "Trang chủ",
    url: "/"
  }, ...items, {
    name: currentPage
  }]);
  return <>
      {}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify(breadcrumbSchema)
    }} />

      {}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>Trang chủ</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {items.map((item, index) => <div key={index} className="flex items-center gap-2">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.url ? <BreadcrumbLink asChild>
                    <Link href={item.url}>{item.name}</Link>
                  </BreadcrumbLink> : <span>{item.name}</span>}
              </BreadcrumbItem>
            </div>)}

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>;
};