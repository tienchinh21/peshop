/**
 * SEO Module - Centralized exports
 * 
 * This module provides a single entry point for all SEO-related functionality
 */

// Configuration
export { seoConfig, getBaseUrl, getDefaultOgImage, formatTitle, getLocale } from './config';
export type { SEOConfig } from './config';

// Types
export type {
  MetadataConfig,
  OpenGraphConfig,
  OpenGraphImage,
  TwitterConfig,
  RobotsConfig,
  ProductMetadataInput,
  ShopMetadataInput,
  CategoryMetadataInput,
  SitemapEntry,
  SitemapConfig,
  ProductSchema,
  BrandSchema,
  OfferSchema,
  AggregateOfferSchema,
  AggregateRatingSchema,
  LocalBusinessSchema,
  PostalAddressSchema,
  GeoCoordinatesSchema,
  OrganizationSchema,
  ContactPointSchema,
  WebSiteSchema,
  SearchActionSchema,
  BreadcrumbSchema,
  BreadcrumbItemSchema,
  BreadcrumbItem,
  CoreWebVitals,
  PerformanceConfig,
  MetadataCache,
} from './types';

// Metadata generators
export {
  truncateText,
  normalizeDescription,
  generateSlug,
  generateProductMetadata,
  generateShopMetadata,
  generateCategoryMetadata,
  generateHomeMetadata,
  generateSearchMetadata,
  createMetadataConfig,
} from './metadata';

// Structured data generators
export {
  generateProductSchema,
  generateAggregateRating,
  generateShopSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
  serializeSchema,
} from './structured-data';

// Sitemap generators
export {
  fetchAllProducts,
  fetchAllShops,
  generateProductSitemap,
  generateShopSitemap,
  generateStaticSitemap,
  generateCompleteSitemap,
} from './sitemap.service';
