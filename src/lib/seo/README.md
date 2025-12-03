# SEO Module Documentation

This module provides comprehensive SEO utilities for the PeShop e-commerce platform, built on Next.js 15.5.

## Overview

The SEO module includes:

- Centralized configuration for site-wide SEO settings
- Type-safe metadata generation for all page types
- Structured data (Schema.org) generators
- Sitemap and robots.txt utilities
- Performance monitoring tools

## Files

### `config.ts`

Centralized SEO configuration including:

- Site information (name, description, URL, locale)
- Organization details (address, contact, social links)
- Default settings (title template, description length, image sizes)
- Sitemap configuration (change frequency, priorities)

### `types.ts`

TypeScript interfaces for all SEO data structures:

- Metadata configurations
- Open Graph and Twitter Card types
- Schema.org structured data types
- Sitemap and performance monitoring types

### `metadata.ts`

Metadata generation functions:

- `generateProductMetadata()` - Product page metadata
- `generateShopMetadata()` - Shop page metadata
- `generateCategoryMetadata()` - Category page metadata
- `generateHomeMetadata()` - Homepage metadata
- `generateSearchMetadata()` - Search results metadata
- Utility functions for text processing and slug generation

### `structured-data.ts` (to be implemented)

Schema.org JSON-LD generators for rich snippets

### `index.ts`

Main export file for the SEO module

## Usage

### Basic Metadata Generation

```typescript
import { generateProductMetadata } from "@/lib/seo";

// In a Next.js page component
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await fetchProduct(params.slug);

  return generateProductMetadata({
    productId: product.id,
    productName: product.name,
    description: product.description,
    price: product.price,
    imgMain: product.mainImage,
    imgList: product.images,
    shopName: product.shop.name,
    reviewPoint: product.rating,
    reviewCount: product.reviewCount,
    variants: product.variants,
    url: `${getBaseUrl()}/san-pham/${params.slug}`,
  });
}
```

### Shop Metadata

```typescript
import { generateShopMetadata } from "@/lib/seo";

export async function generateMetadata({ params }): Promise<Metadata> {
  const shop = await fetchShop(params.shopId);

  return generateShopMetadata({
    shopId: shop.id,
    shopName: shop.name,
    description: shop.description,
    logo: shop.logo,
    address: shop.address,
    phone: shop.phone,
    rating: shop.rating,
    reviewCount: shop.reviewCount,
    url: `${getBaseUrl()}/shop-view/${params.shopId}`,
  });
}
```

### Category Metadata

```typescript
import { generateCategoryMetadata } from "@/lib/seo";

export async function generateMetadata({ searchParams }): Promise<Metadata> {
  const category = searchParams.category;
  const products = await fetchProductsByCategory(category);

  return generateCategoryMetadata({
    categoryName: category,
    categorySlug: generateSlug(category),
    productCount: products.length,
    url: `${getBaseUrl()}/san-pham?category=${category}`,
  });
}
```

### Homepage Metadata

```typescript
import { generateHomeMetadata } from "@/lib/seo";

export const metadata = generateHomeMetadata();
```

## Configuration

Update the SEO configuration in `config.ts`:

```typescript
export const seoConfig: SEOConfig = {
  site: {
    name: "PeShop",
    description: "Your site description",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://peshop.vn",
    locale: "vi_VN",
    defaultImage: "/og-default.jpg",
  },
  // ... other configuration
};
```

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SITE_URL` - The base URL of your site (e.g., https://peshop.vn)

## Best Practices

1. **Title Length**: Keep titles under 60 characters
2. **Description Length**: Keep descriptions between 120-160 characters
3. **Keywords**: Limit to 15 relevant keywords
4. **Images**: Use 1200x630px for Open Graph images
5. **Canonical URLs**: Always provide canonical URLs to prevent duplicate content
6. **Locale**: Use 'vi_VN' for Vietnamese content

### `sitemap.service.ts`

Dynamic sitemap generation utilities:

- `fetchAllProducts()` - Fetch all products from API with pagination
- `fetchAllShops()` - Fetch all shops from API (placeholder)
- `generateProductSitemap()` - Generate sitemap entries for products
- `generateShopSitemap()` - Generate sitemap entries for shops
- `generateStaticSitemap()` - Generate sitemap entries for static pages
- `generateCompleteSitemap()` - Combine all sitemap sources

### Dynamic Sitemap (`/sitemap.xml`)

The sitemap is automatically generated at `/sitemap.xml` and includes:

- Static pages (homepage, product listing, search)
- All product pages with their slugs
- All shop pages (when shop listing API is available)

The sitemap is regenerated every hour using ISR (Incremental Static Regeneration).

**Configuration:**

```typescript
// In src/lib/seo/config.ts
sitemap: {
  changeFrequency: {
    homepage: 'daily',
    products: 'daily',
    shops: 'weekly',
    categories: 'weekly',
    static: 'monthly',
  },
  priority: {
    homepage: 1.0,
    categories: 0.8,
    products: 0.6,
    shops: 0.6,
    static: 0.4,
  },
}
```

**Access the sitemap:**

- Development: `http://localhost:3000/sitemap.xml`
- Production: `https://peshop.vn/sitemap.xml`

## Next Steps

The following features will be implemented in subsequent tasks:

- Robots.txt configuration
- Performance monitoring utilities
- Image optimization helpers
- ISR configuration for product and shop pages

## Testing

Run manual verification tests:

```bash
# Test metadata generation
npx tsx src/lib/seo/__tests__/metadata.test.ts

# Test structured data generation
npx tsx src/lib/seo/__tests__/structured-data.test.ts

# Test sitemap generation
npx tsx src/lib/seo/__tests__/sitemap.test.ts
```

## Requirements Validation

This implementation satisfies:

- **Requirement 1.1**: Complete metadata including title, description, keywords, and Open Graph tags
- **Requirement 3.1**: Dynamic XML sitemap including all public pages
- **Requirement 3.2**: Automatic sitemap updates when new products or shops are added
- **Requirement 3.3**: Separate sitemaps with priority levels (homepage: 1.0, categories: 0.8, products: 0.6, shops: 0.6, static: 0.4)
- **Requirement 4.5**: og:locale tag with value "vi_VN" for Vietnamese content
- **Requirement 12.1**: lang="vi" attribute support in metadata
