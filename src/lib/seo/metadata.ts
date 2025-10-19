// import { Metadata } from "next";
// import { Product } from "@/lib/store/slices/productsSlice";
// import { Article } from "@/lib/api/articles";
// import { Event } from "@/types/events";

// const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webcoreinc.com";

// // Utility functions for SEO optimization
// export const stripHtml = (html: string): string => {
//   return html.replace(/<[^>]*>/g, "").trim();
// };

// export const truncateText = (text: string, maxLength: number = 160): string => {
//   if (text.length <= maxLength) return text;
//   return text.substring(0, maxLength - 3) + "...";
// };

// export const generateSlug = (text: string): string => {
//   return text
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
//     .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
//     .replace(/\s+/g, "-") // Replace spaces with hyphens
//     .replace(/-+/g, "-") // Replace multiple hyphens with single
//     .trim();
// };

// // Enhanced keyword generation
// export const generateProductKeywords = (product: Product): string[] => {
//   const baseKeywords = [
//     product.name,
//     product.category || "",
//     "sản phẩm",
//     "mua online",
//     "WebCore Inc",
//     "Incom",
//   ];

//   const dynamicKeywords = [
//     product.isGift ? "quà tặng" : "",
//     product.discountPrice ? "giảm giá" : "",
//     product.inStock ? "có sẵn" : "đặt hàng",
//     `${product.category} chất lượng`,
//     `${product.category} giá rẻ`,
//     product.originalPrice && product.discountPrice
//       ? `giảm ${Math.round(
//           (1 - product.discountPrice / product.originalPrice) * 100
//         )}%`
//       : "",
//     "giao hàng nhanh",
//     "bảo hành chính hãng",
//   ].filter(Boolean);

//   return [...baseKeywords, ...dynamicKeywords].filter(Boolean);
// };

// // Enhanced description generation
// export const generateProductDescription = (product: Product): string => {
//   const cleanDesc = product.description ? stripHtml(product.description) : "";
//   const baseDesc = cleanDesc.substring(0, 120);

//   const features = [
//     product.isGift ? "Quà tặng đặc biệt" : "",
//     product.inStock ? "Có sẵn" : "Đặt trước",
//     product.discountPrice && product.originalPrice
//       ? `Giảm ${Math.round(
//           (1 - product.discountPrice / product.originalPrice) * 100
//         )}%`
//       : "",
//     "Giao hàng nhanh toàn quốc",
//     "Bảo hành chính hãng",
//   ].filter(Boolean);

//   const fullDesc = `${baseDesc}. ${features.join(
//     ", "
//   )}. Mua ngay tại WebCore Inc!`;
//   return truncateText(fullDesc, 160);
// };

// // Product metadata generator
// export const generateProductMetadata = (product: Product): Metadata => {
//   const description = generateProductDescription(product);
//   const keywords = generateProductKeywords(product);
//   const canonicalUrl = `${BASE_URL}/san-pham/${product.slug}`;

//   return {
//     title: `${product.name} - WebCore Inc`,
//     description,
//     keywords,
//     alternates: {
//       canonical: canonicalUrl,
//     },
//     openGraph: {
//       title: product.name,
//       description,
//       url: canonicalUrl,
//       siteName: "WebCore Inc",
//       images:
//         product.images.length > 0
//           ? [
//               {
//                 url: product.images[0],
//                 width: 1200,
//                 height: 630,
//                 alt: product.name,
//               },
//             ]
//           : [],
//       type: "website",
//       locale: "vi_VN",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: product.name,
//       description,
//       images: product.images.length > 0 ? [product.images[0]] : [],
//     },
//   };
// };

// // Article metadata generator
// export const generateArticleMetadata = (article: Article): Metadata => {
//   const description = truncateText(
//     stripHtml(article.summarizeContent || article.content),
//     160
//   );
//   const canonicalUrl = `${BASE_URL}/bai-viet/${article.id}`;

//   const keywords = [
//     "bài viết",
//     "tin tức",
//     "blog",
//     "WebCore Inc",
//     "Incom",
//     ...article.title.split(" ").slice(0, 3), // First 3 words from title
//   ];

//   return {
//     title: `${article.title} - WebCore Inc`,
//     description,
//     keywords,
//     alternates: {
//       canonical: canonicalUrl,
//     },
//     openGraph: {
//       title: article.title,
//       description,
//       url: canonicalUrl,
//       siteName: "WebCore Inc",
//       images: article.bannerImage
//         ? [
//             {
//               url: article.bannerImage,
//               width: 1200,
//               height: 630,
//               alt: article.title,
//             },
//           ]
//         : [],
//       type: "article",
//       locale: "vi_VN",
//       publishedTime: article.createdDate,
//       modifiedTime: article.lastModifiedDate,
//       authors: [article.author],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: article.title,
//       description,
//       images: article.bannerImage ? [article.bannerImage] : [],
//     },
//   };
// };

// // Event metadata generator
// export const generateEventMetadata = (event: Event): Metadata => {
//   const description = truncateText(stripHtml(event.content), 160);
//   const canonicalUrl = `${BASE_URL}/su-kien/${event.id}`;

//   const keywords = [
//     "sự kiện",
//     "events",
//     event.title,
//     event.type === 1 ? "online" : "offline",
//     "WebCore Inc",
//     "Incom",
//   ];

//   return {
//     title: `${event.title} - WebCore Inc`,
//     description,
//     keywords,
//     alternates: {
//       canonical: canonicalUrl,
//     },
//     openGraph: {
//       title: event.title,
//       description,
//       url: canonicalUrl,
//       siteName: "WebCore Inc",
//       images: event.banner
//         ? [
//             {
//               url: event.banner,
//               width: 1200,
//               height: 630,
//               alt: event.title,
//             },
//           ]
//         : [],
//       type: "article",
//       locale: "vi_VN",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: event.title,
//       description,
//       images: event.banner ? [event.banner] : [],
//     },
//   };
// };

// // Category page metadata generator
// export const generateCategoryMetadata = (
//   categoryName: string,
//   productCount: number,
//   categorySlug: string
// ): Metadata => {
//   const description = `Khám phá ${productCount}+ sản phẩm ${categoryName} chất lượng cao tại WebCore Inc. Giá tốt nhất, giao hàng nhanh toàn quốc, bảo hành chính hãng. Mua ngay!`;
//   const canonicalUrl = `${BASE_URL}/san-pham?category=${categorySlug}`;

//   const keywords = [
//     categoryName,
//     `sản phẩm ${categoryName}`,
//     `${categoryName} chất lượng`,
//     `${categoryName} giá rẻ`,
//     "mua online",
//     "WebCore Inc",
//     "Incom",
//   ];

//   return {
//     title: `${categoryName} - Sản phẩm chất lượng | WebCore Inc`,
//     description,
//     keywords,
//     alternates: {
//       canonical: canonicalUrl,
//     },
//     openGraph: {
//       title: `${categoryName} - WebCore Inc`,
//       description,
//       url: canonicalUrl,
//       siteName: "WebCore Inc",
//       type: "website",
//       locale: "vi_VN",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: `${categoryName} - WebCore Inc`,
//       description,
//     },
//   };
// };

// // Booking Detail metadata generator
// export const generateBookingDetailMetadata = (bookingId: string): Metadata => {
//   const title = `Chi tiết lịch hẹn #${bookingId.slice(0, 8)} - WebCore Inc`;
//   const description = `Xem chi tiết lịch hẹn #${bookingId.slice(
//     0,
//     8
//   )}. Thông tin đầy đủ về dịch vụ, chi nhánh và thời gian đặt lịch.`;
//   const canonicalUrl = `${BASE_URL}/chi-tiet-dat-lich/${bookingId}`;

//   const keywords = [
//     "chi tiết lịch hẹn",
//     "booking detail",
//     "đặt lịch",
//     "lịch hẹn",
//     "WebCore Inc",
//     "Incom",
//     `booking ${bookingId.slice(0, 8)}`,
//   ];

//   return {
//     title,
//     description,
//     keywords,
//     alternates: {
//       canonical: canonicalUrl,
//     },
//     openGraph: {
//       title,
//       description,
//       url: canonicalUrl,
//       siteName: "WebCore Inc",
//       type: "website",
//       locale: "vi_VN",
//     },
//     twitter: {
//       card: "summary",
//       title,
//       description,
//     },
//   };
// };
