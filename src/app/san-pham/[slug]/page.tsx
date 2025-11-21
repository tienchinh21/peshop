import { Metadata } from "next";
import { ProductDetailPage } from "@/views/pages/san-pham/[slug]/ProductDetailPage";
import { getProductDetail } from "@/services/api/users/product.service";
import {
  generateMetaDescription,
  getOgImage,
  generateProductSchema,
} from "@/lib/utils/seo.utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProductDetail(slug);

    const title = `${product.productName} | PeShop`;
    const description = generateMetaDescription(product);
    const ogImage = getOgImage(product);
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/san-pham/${slug}`;

    return {
      title,
      description,
      keywords: [
        product.productName,
        product.shopName,
        ...product.variants.flatMap((v) =>
          v.variantValues.map((vv) => vv.propertyValue.value)
        ),
      ].join(", "),
      openGraph: {
        title,
        description,
        url,
        siteName: "PeShop",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: product.productName,
          },
        ],
        locale: "vi_VN",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    return {
      title: "Sản phẩm không tồn tại | PeShop",
      description: "Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  let productSchema = null;
  try {
    const product = await getProductDetail(slug);
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/san-pham/${slug}`;
    productSchema = generateProductSchema(product, url);
  } catch (error) {
    // Product not found, schema will be null
  }

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      <ProductDetailPage slug={slug} />
    </>
  );
}
