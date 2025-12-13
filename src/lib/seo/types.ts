import { Metadata } from 'next';
export interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: OpenGraphConfig;
  twitter?: TwitterConfig;
  robots?: RobotsConfig;
}
export interface OpenGraphConfig {
  title: string;
  description: string;
  images: OpenGraphImage[];
  url: string;
  type: 'website' | 'article' | 'product';
  locale: string;
  siteName?: string;
}
export interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}
export interface TwitterConfig {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  images?: string[];
  creator?: string;
  site?: string;
}
export interface RobotsConfig {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
}
export interface ProductMetadataInput {
  productId: string;
  productName: string;
  description: string;
  price: number;
  imgMain: string;
  imgList: string[];
  shopName: string;
  reviewPoint?: number;
  reviewCount?: number;
  variants: Array<{
    price: number;
    quantity: number;
  }>;
  url: string;
}
export interface ShopMetadataInput {
  shopId: string;
  shopName: string;
  description: string;
  logo: string;
  address?: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  url: string;
}
export interface CategoryMetadataInput {
  categoryName: string;
  categorySlug: string;
  productCount: number;
  description?: string;
  url: string;
}
export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}
export interface SitemapConfig {
  baseUrl: string;
  defaultChangeFreq: string;
  defaultPriority: number;
}
export interface ProductSchema {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  image: string[];
  description: string;
  sku: string;
  brand: BrandSchema;
  offers: OfferSchema | AggregateOfferSchema;
  aggregateRating?: AggregateRatingSchema;
}
export interface BrandSchema {
  '@type': 'Brand';
  name: string;
}
export interface OfferSchema {
  '@type': 'Offer';
  url: string;
  priceCurrency: string;
  price: number;
  availability: string;
  seller: OrganizationSchema;
}
export interface AggregateOfferSchema {
  '@type': 'AggregateOffer';
  url: string;
  priceCurrency: string;
  lowPrice: number;
  highPrice: number;
  availability: string;
  seller: OrganizationSchema;
}
export interface AggregateRatingSchema {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}
export interface LocalBusinessSchema {
  '@context': 'https://schema.org';
  '@type': 'LocalBusiness';
  name: string;
  image: string;
  address: PostalAddressSchema;
  geo?: GeoCoordinatesSchema;
  url: string;
  telephone?: string;
  priceRange?: string;
  aggregateRating?: AggregateRatingSchema;
}
export interface PostalAddressSchema {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}
export interface GeoCoordinatesSchema {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}
export interface OrganizationSchema {
  '@type': 'Organization';
  name: string;
  logo?: string;
  url?: string;
  contactPoint?: ContactPointSchema;
  address?: PostalAddressSchema;
  sameAs?: string[];
}
export interface ContactPointSchema {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: string;
  email?: string;
}
export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction?: SearchActionSchema;
}
export interface SearchActionSchema {
  '@type': 'SearchAction';
  target: {
    '@type': 'EntryPoint';
    urlTemplate: string;
  };
  'query-input': string;
}
export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItemSchema[];
}
export interface BreadcrumbItemSchema {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}
export interface BreadcrumbItem {
  name: string;
  url?: string;
}
export interface CoreWebVitals {
  LCP: number;
  FID: number;
  CLS: number;
  FCP: number;
  TTFB: number;
}
export interface PerformanceConfig {
  enableMonitoring: boolean;
  reportToAnalytics: boolean;
  thresholds: {
    LCP: number;
    FID: number;
    CLS: number;
  };
}
export interface MetadataCache {
  key: string;
  metadata: Metadata;
  structuredData: object;
  generatedAt: Date;
  expiresAt: Date;
}