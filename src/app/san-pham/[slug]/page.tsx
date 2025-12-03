import { Metadata } from "next";
import {
  ProductDetailPage,
  getProductDetailCached,
  getTopProductSlugs,
} from "@/features/customer/products";
import {
  generateMetaDescription,
  getOgImage,
  generateProductSchema,
} from "@/lib/utils/seo.utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

// Allow dynamic params for products not in generateStaticParams
export const dynamicParams = true;

// Generate static params for top 100 products at build time
export async function generateStaticParams() {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 30000)
    );

    const slugs = await Promise.race([getTopProductSlugs(100), timeoutPromise]);

    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProductDetailCached(slug);

    // Handle case where product is null (401 or not found)
    if (!product) {
      return {
        title: "Sản phẩm không tồn tại | PeShop",
        description: "Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
      };
    }

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

async function ProductDetailContent({ slug }: { slug: string }) {
  const product = await getProductDetailCached(slug);

  if (!product) {
    return null;
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/san-pham/${slug}`;
  const productSchema = generateProductSchema(product, url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailPage slug={slug} initialData={product} />
    </>
  );
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return <ProductDetailContent slug={slug} />;
}
