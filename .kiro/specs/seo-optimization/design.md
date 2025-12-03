# Design Document - SEO Optimization for PeShop

## Overview

This design document outlines a comprehensive SEO optimization strategy for PeShop e-commerce platform built with Next.js 15.5. The solution leverages Next.js 15.5's latest features including the Metadata API, automatic sitemap generation, optimized image handling, and advanced caching strategies to achieve superior search engine rankings and performance.

The design follows Next.js 15.5 best practices and official documentation, implementing:

- Dynamic metadata generation with type-safe Metadata API
- Automatic sitemap and robots.txt generation
- Structured data (JSON-LD) for rich snippets
- Optimized rendering strategies (ISR, SSR, SSG)
- Core Web Vitals optimization
- Mobile-first responsive design

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 15.5 App Router                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Metadata   │  │   Sitemap    │  │  Robots.txt  │      │
│  │   Generator  │  │   Generator  │  │   Generator  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Structured  │  │    Image     │  │  Performance │      │
│  │     Data     │  │ Optimization │  │   Monitor    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    Rendering Strategies                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   ISR    │  │   SSR    │  │   SSG    │  │  Client  │   │
│  │ Products │  │ Category │  │  Static  │  │ Protected│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
src/
├── app/
│   ├── sitemap.ts                    # Dynamic sitemap generation
│   ├── robots.ts                     # Robots.txt configuration
│   ├── layout.tsx                    # Root metadata
│   ├── page.tsx                      # Homepage with ISR
│   ├── san-pham/
│   │   ├── [slug]/
│   │   │   └── page.tsx             # Product detail with ISR
│   │   └── page.tsx                 # Product listing with SSR
│   ├── shop-view/
│   │   └── [shopId]/page.tsx        # Shop page with ISR
│   └── tim-kiem/page.tsx            # Search with SSR
├── lib/
│   ├── seo/
│   │   ├── metadata.ts              # Metadata generators
│   │   ├── structured-data.ts       # Schema.org generators
│   │   ├── sitemap.service.ts       # Sitemap utilities
│   │   └── performance.ts           # Performance monitoring
│   └── utils/
│       └── seo.utils.ts             # SEO helper functions
└── components/
    └── seo/
        ├── StructuredData.tsx       # JSON-LD component
        └── Breadcrumbs.tsx          # SEO breadcrumbs
```

## Components and Interfaces

### 1. Metadata Generation System

#### MetadataGenerator Interface

```typescript
interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: OpenGraphConfig;
  twitter?: TwitterConfig;
  robots?: RobotsConfig;
}

interface OpenGraphConfig {
  title: string;
  description: string;
  images: OpenGraphImage[];
  url: string;
  type: "website" | "article" | "product";
  locale: string;
}

interface ProductMetadataInput {
  product: ProductDetail;
  url: string;
}

interface ShopMetadataInput {
  shop: ShopDetail;
  url: string;
}

// Metadata generator functions
function generateProductMetadata(input: ProductMetadataInput): Metadata;
function generateShopMetadata(input: ShopMetadataInput): Metadata;
function generateCategoryMetadata(category: string, count: number): Metadata;
```

### 2. Sitemap Generation System

#### Sitemap Service Interface

```typescript
interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

interface SitemapConfig {
  baseUrl: string;
  defaultChangeFreq: string;
  defaultPriority: number;
}

// Sitemap generator functions
async function generateProductSitemap(): Promise<SitemapEntry[]>;
async function generateShopSitemap(): Promise<SitemapEntry[]>;
async function generateStaticSitemap(): Promise<SitemapEntry[]>;
```

### 3. Structured Data System

#### Schema.org Generators

```typescript
interface ProductSchema {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  image: string[];
  description: string;
  sku: string;
  brand: BrandSchema;
  offers: OfferSchema | AggregateOfferSchema;
  aggregateRating?: AggregateRatingSchema;
}

interface LocalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  image: string;
  address: PostalAddressSchema;
  geo: GeoCoordinatesSchema;
  url: string;
  telephone: string;
  priceRange: string;
}

interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: BreadcrumbItemSchema[];
}

// Schema generator functions
function generateProductSchema(
  product: ProductDetail,
  url: string
): ProductSchema;
function generateShopSchema(shop: ShopDetail): LocalBusinessSchema;
function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbSchema;
function generateOrganizationSchema(): OrganizationSchema;
function generateWebSiteSchema(): WebSiteSchema;
```

### 4. Performance Monitoring System

#### Performance Metrics Interface

```typescript
interface CoreWebVitals {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  FCP: number; // First Contentful Paint
  TTFB: number; // Time to First Byte
}

interface PerformanceConfig {
  enableMonitoring: boolean;
  reportToAnalytics: boolean;
  thresholds: {
    LCP: number;
    FID: number;
    CLS: number;
  };
}

// Performance monitoring functions
function reportWebVitals(metric: Metric): void;
function trackPageLoad(url: string, duration: number): void;
```

## Data Models

### SEO Configuration Model

```typescript
interface SEOConfig {
  site: {
    name: string;
    description: string;
    url: string;
    locale: string;
    defaultImage: string;
  };
  organization: {
    name: string;
    logo: string;
    address: Address;
    contactPoint: ContactPoint;
    socialLinks: string[];
  };
  defaults: {
    titleTemplate: string;
    descriptionLength: number;
    keywordsLimit: number;
    ogImageSize: { width: number; height: number };
  };
  sitemap: {
    changeFrequency: Record<string, string>;
    priority: Record<string, number>;
  };
}
```

### Metadata Cache Model

```typescript
interface MetadataCache {
  key: string;
  metadata: Metadata;
  structuredData: object;
  generatedAt: Date;
  expiresAt: Date;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Metadata completeness

_For any_ public page (product, shop, category, homepage), the generated metadata should include all required fields: title, description, canonical URL, Open Graph tags (title, description, image, url, type, locale), and Twitter Card tags (card, title, description, image).

**Validates: Requirements 1.1, 4.1, 4.2, 4.5**

### Property 2: Structured data validity

_For any_ product page, the generated JSON-LD structured data should be valid according to Schema.org Product specification and include all required properties: @context, @type, name, image, description, offers (with price, priceCurrency, availability).

**Validates: Requirements 1.2, 8.5**

### Property 3: Sitemap URL uniqueness

_For any_ generated sitemap, all URLs should be unique (no duplicates), absolute (starting with https://), and properly formatted according to XML sitemap protocol.

**Validates: Requirements 3.1, 3.2**

### Property 4: Image optimization consistency

_For any_ image rendered through Next.js Image component, the component should specify width, height, alt text, and use automatic format optimization (AVIF/WebP).

**Validates: Requirements 5.2, 6.3**

### Property 5: Canonical URL consistency

_For any_ page with metadata, if a canonical URL is specified, it should match the actual page URL (excluding query parameters) and be an absolute URL.

**Validates: Requirements 7.5, 10.3**

### Property 6: Mobile viewport configuration

_For any_ page, the viewport meta tag should be present with content "width=device-width, initial-scale=1" to ensure proper mobile rendering.

**Validates: Requirements 6.4**

### Property 7: Structured data schema validation

_For any_ generated structured data, when validated against Google's Rich Results Test or Schema.org validator, it should pass without critical errors.

**Validates: Requirements 8.4**

### Property 8: Robots.txt accessibility

_For any_ public content page URL, the robots.txt file should allow crawling (not disallowed) for major search engine bots (Googlebot, Bingbot).

**Validates: Requirements 3.4**

### Property 9: Open Graph image dimensions

_For any_ Open Graph image specified in metadata, the image dimensions should be at least 1200x630 pixels to meet social media platform requirements.

**Validates: Requirements 4.4**

### Property 10: ISR revalidation timing

_For any_ product detail page using ISR, when product data changes, the page should be revalidated and regenerated within the specified revalidation period (1 hour).

**Validates: Requirements 1.4**

### Property 11: Breadcrumb schema completeness

_For any_ page with breadcrumb navigation, the BreadcrumbList structured data should include all breadcrumb items in correct order with position, name, and item URL.

**Validates: Requirements 8.3, 11.3**

### Property 12: Locale consistency

_For any_ page metadata, the locale specified in Open Graph tags, HTML lang attribute, and structured data should all be consistent (vi_VN for Vietnamese content).

**Validates: Requirements 4.5, 12.1, 12.5**

### Property 13: Sitemap priority ordering

_For any_ sitemap, homepage should have priority 1.0, category pages 0.8, product pages 0.6, and other pages 0.4 or lower, reflecting content importance.

**Validates: Requirements 3.3**

### Property 14: Meta description length

_For any_ generated meta description, the length should be between 120-160 characters to optimize display in search results without truncation.

**Validates: Requirements 1.1**

### Property 15: Internal link validity

_For any_ internal link on a page, the href attribute should point to a valid route within the application and use relative or absolute URLs consistently.

**Validates: Requirements 11.5**

## Error Handling

### Metadata Generation Errors

```typescript
class MetadataGenerationError extends Error {
  constructor(
    message: string,
    public readonly context: {
      page: string;
      input: unknown;
      reason: string;
    }
  ) {
    super(message);
    this.name = "MetadataGenerationError";
  }
}

// Error handling strategy
try {
  const metadata = await generateProductMetadata(product);
} catch (error) {
  // Log error for monitoring
  console.error("Metadata generation failed:", error);

  // Return fallback metadata
  return {
    title: "PeShop - Nền tảng mua sắm trực tuyến",
    description: "Sản phẩm chất lượng, giá tốt",
  };
}
```

### Sitemap Generation Errors

- If product API fails, generate sitemap with cached product list
- If shop API fails, exclude shop section from sitemap
- Log all sitemap generation errors for monitoring
- Implement retry logic with exponential backoff for API calls

### Structured Data Errors

- Validate structured data before rendering
- If validation fails, log error but don't block page render
- Provide fallback structured data for critical pages
- Monitor structured data errors in production

### Performance Monitoring Errors

- Gracefully handle Web Vitals API unavailability
- Don't block page render if monitoring fails
- Queue metrics for later reporting if analytics is unavailable

## Testing Strategy

### Unit Testing

Unit tests will verify individual SEO utility functions and generators:

- Metadata generation functions with various input combinations
- Structured data generators produce valid Schema.org JSON-LD
- URL slug generation and sanitization
- Meta description truncation and formatting
- Keyword extraction from product data
- Image URL validation and fallback logic

### Property-Based Testing

Property-based tests will verify universal correctness properties across all inputs using a PBT library (fast-check for TypeScript):

- **Library**: fast-check (https://github.com/dubzzz/fast-check)
- **Configuration**: Minimum 100 iterations per property test
- **Tagging**: Each PBT test tagged with format: `**Feature: seo-optimization, Property {number}: {property_text}**`

Property tests will generate random valid inputs (products, shops, categories) and verify:

1. All generated metadata includes required fields
2. All structured data validates against Schema.org
3. All sitemap URLs are unique and properly formatted
4. All canonical URLs are consistent with page URLs
5. All Open Graph images meet dimension requirements
6. All breadcrumb schemas are complete and ordered
7. All locale values are consistent across metadata
8. All meta descriptions are within length limits
9. All internal links point to valid routes

### Integration Testing

Integration tests will verify SEO features work correctly in the Next.js environment:

- Metadata API integration in page components
- Sitemap generation with real API data
- Robots.txt serving and configuration
- Structured data rendering in HTML
- Image optimization with Next.js Image component
- ISR revalidation behavior
- Performance monitoring integration

### SEO Validation Testing

- Google Rich Results Test validation for structured data
- Schema.org validator for JSON-LD markup
- Lighthouse SEO audits (target score: 100)
- Mobile-friendly test
- PageSpeed Insights for Core Web Vitals
- Search Console validation for sitemap and robots.txt

### Performance Testing

- Core Web Vitals measurement across different pages
- Load time testing for various network conditions
- Image optimization verification
- Bundle size analysis
- Rendering strategy effectiveness (ISR vs SSR vs SSG)

## Implementation Notes

### Next.js 15.5 Specific Features

1. **Metadata API**: Use type-safe `generateMetadata` function in page components
2. **Sitemap Generation**: Implement `app/sitemap.ts` with MetadataRoute.Sitemap type
3. **Robots.txt**: Implement `app/robots.ts` with MetadataRoute.Robots type
4. **Image Optimization**: Use `next/image` with automatic format detection
5. **Font Optimization**: Use `next/font` with automatic subsetting
6. **Script Optimization**: Use `next/script` with strategy prop for third-party scripts

### Rendering Strategy Guidelines

- **ISR (Incremental Static Regeneration)**: Product pages, shop pages, homepage
  - Revalidate: 3600s (1 hour) for products, 180s (3 minutes) for homepage
  - Use `export const revalidate = 3600` in page components
- **SSR (Server-Side Rendering)**: Category pages, search results
  - Dynamic data that changes frequently
  - Use async Server Components without revalidate export
- **SSG (Static Site Generation)**: Static pages (about, contact, policies)
  - Content that rarely changes
  - Pre-rendered at build time
- **Client-Side Rendering**: Protected pages (cart, checkout, account)
  - User-specific data
  - Use 'use client' directive with proper meta tags in layout

### Caching Strategy

```typescript
// Product metadata caching
const metadataCache = new Map<string, { data: Metadata; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

function getCachedMetadata(key: string): Metadata | null {
  const cached = metadataCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}
```

### SEO Best Practices Implementation

1. **Title Tags**: 50-60 characters, include primary keyword
2. **Meta Descriptions**: 120-160 characters, compelling and descriptive
3. **Headings**: Proper H1-H6 hierarchy, one H1 per page
4. **Alt Text**: Descriptive alt text for all images
5. **Internal Linking**: Contextual links with descriptive anchor text
6. **URL Structure**: Clean, descriptive, keyword-rich URLs
7. **Mobile Optimization**: Responsive design, fast loading
8. **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
9. **Structured Data**: JSON-LD format, valid Schema.org markup
10. **Canonical URLs**: Prevent duplicate content issues

### Performance Optimization Techniques

1. **Code Splitting**: Automatic with Next.js App Router
2. **Lazy Loading**: Use dynamic imports for heavy components
3. **Image Optimization**: Next.js Image with priority for above-fold images
4. **Font Optimization**: Preload critical fonts, use font-display: swap
5. **CSS Optimization**: Tailwind CSS with purging unused styles
6. **JavaScript Optimization**: Minimize bundle size, tree shaking
7. **Caching**: Implement stale-while-revalidate strategy
8. **CDN**: Serve static assets from CDN
9. **Compression**: Enable gzip/brotli compression
10. **Prefetching**: Use Next.js Link with prefetch for critical pages
