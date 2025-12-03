/**
 * TypeScript interfaces for SEO data structures
 * 
 * These types ensure type safety across all SEO-related functionality
 */

import { Metadata } from 'next';

/**
 * Metadata configuration for generating page metadata
 */
export interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: OpenGraphConfig;
  twitter?: TwitterConfig;
  robots?: RobotsConfig;
}

/**
 * Open Graph metadata configuration
 */
export interface OpenGraphConfig {
  title: string;
  description: string;
  images: OpenGraphImage[];
  url: string;
  type: 'website' | 'article' | 'product';
  locale: string;
  siteName?: string;
}

/**
 * Open Graph image configuration
 */
export interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Twitter Card metadata configuration
 */
export interface TwitterConfig {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  images?: string[];
  creator?: string;
  site?: string;
}

/**
 * Robots meta tag configuration
 */
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

/**
 * Input for generating product metadata
 */
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

/**
 * Input for generating shop metadata
 */
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

/**
 * Input for generating category metadata
 */
export interface CategoryMetadataInput {
  categoryName: string;
  categorySlug: string;
  productCount: number;
  description?: string;
  url: string;
}

/**
 * Sitemap entry configuration
 */
export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Sitemap configuration
 */
export interface SitemapConfig {
  baseUrl: string;
  defaultChangeFreq: string;
  defaultPriority: number;
}

/**
 * Schema.org Product structured data
 */
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

/**
 * Schema.org Brand
 */
export interface BrandSchema {
  '@type': 'Brand';
  name: string;
}

/**
 * Schema.org Offer
 */
export interface OfferSchema {
  '@type': 'Offer';
  url: string;
  priceCurrency: string;
  price: number;
  availability: string;
  seller: OrganizationSchema;
}

/**
 * Schema.org AggregateOffer
 */
export interface AggregateOfferSchema {
  '@type': 'AggregateOffer';
  url: string;
  priceCurrency: string;
  lowPrice: number;
  highPrice: number;
  availability: string;
  seller: OrganizationSchema;
}

/**
 * Schema.org AggregateRating
 */
export interface AggregateRatingSchema {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}

/**
 * Schema.org LocalBusiness
 */
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

/**
 * Schema.org PostalAddress
 */
export interface PostalAddressSchema {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

/**
 * Schema.org GeoCoordinates
 */
export interface GeoCoordinatesSchema {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

/**
 * Schema.org Organization
 */
export interface OrganizationSchema {
  '@type': 'Organization';
  name: string;
  logo?: string;
  url?: string;
  contactPoint?: ContactPointSchema;
  address?: PostalAddressSchema;
  sameAs?: string[];
}

/**
 * Schema.org ContactPoint
 */
export interface ContactPointSchema {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: string;
  email?: string;
}

/**
 * Schema.org WebSite
 */
export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction?: SearchActionSchema;
}

/**
 * Schema.org SearchAction
 */
export interface SearchActionSchema {
  '@type': 'SearchAction';
  target: {
    '@type': 'EntryPoint';
    urlTemplate: string;
  };
  'query-input': string;
}

/**
 * Schema.org BreadcrumbList
 */
export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItemSchema[];
}

/**
 * Schema.org ListItem for breadcrumbs
 */
export interface BreadcrumbItemSchema {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

/**
 * Breadcrumb item for generating schema
 */
export interface BreadcrumbItem {
  name: string;
  url?: string;
}

/**
 * Core Web Vitals metrics
 */
export interface CoreWebVitals {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  FCP: number; // First Contentful Paint
  TTFB: number; // Time to First Byte
}

/**
 * Performance monitoring configuration
 */
export interface PerformanceConfig {
  enableMonitoring: boolean;
  reportToAnalytics: boolean;
  thresholds: {
    LCP: number;
    FID: number;
    CLS: number;
  };
}

/**
 * Metadata cache entry
 */
export interface MetadataCache {
  key: string;
  metadata: Metadata;
  structuredData: object;
  generatedAt: Date;
  expiresAt: Date;
}
