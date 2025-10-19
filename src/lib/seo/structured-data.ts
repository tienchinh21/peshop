// import { Product } from "@/lib/store/slices/productsSlice";
// import { Article } from "@/lib/api/articles";
// import { Event } from "@/types/events";
// import { stripHtml } from "./metadata";

// const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webcoreinc.com";

// // Organization Schema (for all pages)
// export const organizationSchema = {
//   "@context": "https://schema.org",
//   "@type": "Organization",
//   name: "Incom",
//   alternateName: "Incom",
//   url: BASE_URL,
//   logo: `${BASE_URL}/logo.png`,
//   description:
//     "Demo platform showcasing e-commerce, booking system, and blog functionality",
//   address: {
//     "@type": "PostalAddress",
//     streetAddress: "Your Street Address",
//     addressLocality: "Ho Chi Minh City",
//     addressRegion: "Ho Chi Minh",
//     postalCode: "700000",
//     addressCountry: "VN",
//   },
//   contactPoint: {
//     "@type": "ContactPoint",
//     telephone: "+84-xxx-xxx-xxx",
//     contactType: "customer service",
//     availableLanguage: ["Vietnamese", "English"],
//   },
//   sameAs: [
//     "https://facebook.com/webcoreinc",
//     "https://linkedin.com/company/webcoreinc",
//     "https://twitter.com/webcoreinc",
//   ],
// };

// // Website Schema
// export const websiteSchema = {
//   "@context": "https://schema.org",
//   "@type": "WebSite",
//   name: "WebCore Inc",
//   alternateName: "Incom Demo Platform",
//   url: BASE_URL,
//   description:
//     "Demo platform showcasing e-commerce, booking system, and blog functionality",
//   publisher: {
//     "@type": "Organization",
//     name: "WebCore Inc",
//   },
//   potentialAction: {
//     "@type": "SearchAction",
//     target: {
//       "@type": "EntryPoint",
//       urlTemplate: `${BASE_URL}/san-pham?search={search_term_string}`,
//     },
//     "query-input": "required name=search_term_string",
//   },
// };

// // Product Schema Generator
// export const generateProductSchema = (product: Product) => {
//   const schema = {
//     "@context": "https://schema.org",
//     "@type": "Product",
//     name: product.name,
//     description: product.description
//       ? stripHtml(product.description)
//       : `Khám phá ${product.name} với chất lượng vượt trội`,
//     image: product.images,
//     sku: product.id,
//     mpn: product.id,
//     brand: {
//       "@type": "Brand",
//       name: "WebCore Inc",
//     },
//     manufacturer: {
//       "@type": "Organization",
//       name: "WebCore Inc",
//     },
//     offers: {
//       "@type": "Offer",
//       price: product.discountPrice || product.price,
//       priceCurrency: "VND",
//       availability: product.inStock
//         ? "https://schema.org/InStock"
//         : "https://schema.org/OutOfStock",
//       seller: {
//         "@type": "Organization",
//         name: "WebCore Inc",
//       },
//       url: `${BASE_URL}/san-pham/${product.slug}`,
//       priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
//         .toISOString()
//         .split("T")[0], // 30 days from now
//       ...(product.originalPrice &&
//         product.discountPrice && {
//           priceSpecification: {
//             "@type": "UnitPriceSpecification",
//             price: product.originalPrice,
//             priceCurrency: "VND",
//           },
//         }),
//     },
//     category: product.category,
//     ...(product.rating && {
//       aggregateRating: {
//         "@type": "AggregateRating",
//         ratingValue: product.rating,
//         reviewCount: product.reviewCount || 1,
//         bestRating: 5,
//         worstRating: 1,
//       },
//     }),
//   };

//   return schema;
// };

// // Article Schema Generator
// export const generateArticleSchema = (article: Article) => {
//   const schema = {
//     "@context": "https://schema.org",
//     "@type": "Article",
//     headline: article.title,
//     description: stripHtml(
//       article.summarizeContent || article.content
//     ).substring(0, 160),
//     image: article.bannerImage ? [article.bannerImage] : [],
//     author: {
//       "@type": "Person",
//       name: article.author || "WebCore Inc",
//     },
//     publisher: {
//       "@type": "Organization",
//       name: "WebCore Inc",
//       logo: {
//         "@type": "ImageObject",
//         url: `${BASE_URL}/logo.png`,
//         width: 200,
//         height: 60,
//       },
//     },
//     datePublished: article.createdDate,
//     dateModified: article.lastModifiedDate || article.createdDate,
//     mainEntityOfPage: {
//       "@type": "WebPage",
//       "@id": `${BASE_URL}/bai-viet/${article.id}`,
//     },
//     articleSection: "Technology",
//     wordCount: stripHtml(article.content).split(" ").length,
//     articleBody: stripHtml(article.content).substring(0, 500),
//   };

//   return schema;
// };

// // Event Schema Generator
// export const generateEventSchema = (event: Event) => {
//   const schema = {
//     "@context": "https://schema.org",
//     "@type": "Event",
//     name: event.title,
//     description: stripHtml(event.content).substring(0, 160),
//     image: event.banner ? [event.banner] : [],
//     startDate: event.startTime,
//     endDate: event.endTime,
//     eventStatus: event.isActive
//       ? "https://schema.org/EventScheduled"
//       : "https://schema.org/EventCancelled",
//     eventAttendanceMode:
//       event.type === 1
//         ? "https://schema.org/OnlineEventAttendanceMode"
//         : "https://schema.org/OfflineEventAttendanceMode",
//     organizer: {
//       "@type": "Organization",
//       name: "WebCore Inc",
//       url: BASE_URL,
//     },
//     ...(event.type === 1 &&
//       event.meetingLink && {
//         location: {
//           "@type": "VirtualLocation",
//           url: event.meetingLink,
//         },
//       }),
//     ...(event.type === 2 &&
//       event.address && {
//         location: {
//           "@type": "Place",
//           name: "WebCore Inc Office",
//           address: {
//             "@type": "PostalAddress",
//             streetAddress: event.address,
//             addressLocality: "Ho Chi Minh City",
//             addressCountry: "VN",
//           },
//           ...(event.googleMapURL && {
//             url: event.googleMapURL,
//           }),
//         },
//       }),
//     offers: {
//       "@type": "Offer",
//       price: "0",
//       priceCurrency: "VND",
//       availability: "https://schema.org/InStock",
//       url: `${BASE_URL}/su-kien/${event.id}`,
//     },
//   };

//   return schema;
// };

// // Breadcrumb Schema Generator
// export const generateBreadcrumbSchema = (
//   breadcrumbs: Array<{ name: string; url: string }>
// ) => {
//   const schema = {
//     "@context": "https://schema.org",
//     "@type": "BreadcrumbList",
//     itemListElement: breadcrumbs.map((crumb, index) => ({
//       "@type": "ListItem",
//       position: index + 1,
//       name: crumb.name,
//       item: crumb.url.startsWith("http")
//         ? crumb.url
//         : `${BASE_URL}${crumb.url}`,
//     })),
//   };

//   return schema;
// };

// // FAQ Schema Generator (for product pages)
// export const generateFAQSchema = (
//   faqs: Array<{ question: string; answer: string }>
// ) => {
//   const schema = {
//     "@context": "https://schema.org",
//     "@type": "FAQPage",
//     mainEntity: faqs.map((faq) => ({
//       "@type": "Question",
//       name: faq.question,
//       acceptedAnswer: {
//         "@type": "Answer",
//         text: faq.answer,
//       },
//     })),
//   };

//   return schema;
// };

// // Local Business Schema (for contact/about pages)
// export const localBusinessSchema = {
//   "@context": "https://schema.org",
//   "@type": "LocalBusiness",
//   name: "WebCore Inc",
//   description:
//     "Demo platform showcasing e-commerce, booking system, and blog functionality",
//   url: BASE_URL,
//   telephone: "+84-xxx-xxx-xxx",
//   email: "contact@webcoreinc.com",
//   address: {
//     "@type": "PostalAddress",
//     streetAddress: "Your Street Address",
//     addressLocality: "Ho Chi Minh City",
//     addressRegion: "Ho Chi Minh",
//     postalCode: "700000",
//     addressCountry: "VN",
//   },
//   geo: {
//     "@type": "GeoCoordinates",
//     latitude: "10.8231",
//     longitude: "106.6297",
//   },
//   openingHours: ["Mo-Fr 08:00-18:00", "Sa 08:00-12:00"],
//   priceRange: "$$",
//   paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
//   currenciesAccepted: "VND",
// };

// // Booking Detail Schema Generator
// export const generateBookingDetailSchema = (booking: any) => {
//   const schema = {
//     "@context": "https://schema.org",
//     "@type": "Reservation",
//     reservationId: booking.id,
//     reservationStatus:
//       booking.status === 0
//         ? "ReservationPending"
//         : booking.status === 1
//         ? "ReservationConfirmed"
//         : booking.status === 2
//         ? "ReservationConfirmed"
//         : booking.status === 4
//         ? "ReservationConfirmed"
//         : "ReservationCancelled",
//     bookingTime: booking.bookingDate,
//     customer: {
//       "@type": "Person",
//       name: booking.userZaloName,
//       telephone: booking.phoneNumber,
//     },
//     provider: {
//       "@type": "LocalBusiness",
//       name: booking.branch.name,
//       address: {
//         "@type": "PostalAddress",
//         streetAddress: booking.branch.address,
//         addressLocality: "Ho Chi Minh City",
//         addressCountry: "VN",
//       },
//       telephone: booking.branch.phone,
//     },
//     reservationFor: {
//       "@type": "Service",
//       name: booking.bookingItems.map((item: any) => item.name).join(", "),
//       description: booking.bookingItems
//         .map((item: any) => item.description)
//         .join("; "),
//     },
//     ...(booking.note && {
//       additionalProperty: {
//         "@type": "PropertyValue",
//         name: "Consultation Notes",
//         value: booking.note,
//       },
//     }),
//   };

//   return schema;
// };

// // Helper function to inject structured data
// export const injectStructuredData = (schema: object): string => {
//   return JSON.stringify(schema, null, 2);
// };
