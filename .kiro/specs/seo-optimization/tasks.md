# Implementation Plan - SEO Optimization

- [x] 1. Setup SEO configuration and utilities

  - Create centralized SEO configuration file with site defaults
  - Implement base utility functions for metadata generation
  - Setup TypeScript interfaces for SEO data structures
  - _Requirements: 1.1, 4.5, 12.1_

- [ ]\* 1.1 Write property test for metadata completeness

  - **Property 1: Metadata completeness**
  - **Validates: Requirements 1.1, 4.1, 4.2, 4.5**

- [ ] 2. Implement metadata generation system

  - Create metadata generator functions for products, shops, categories
  - Implement Open Graph metadata generation
  - Implement Twitter Card metadata generation
  - Add canonical URL generation logic
  - _Requirements: 1.1, 2.1, 4.1, 4.2, 4.3, 10.3_

- [ ]\* 2.1 Write property test for Open Graph metadata

  - **Property 1: Metadata completeness (Open Graph section)**
  - **Validates: Requirements 4.1, 4.2, 4.5**

- [ ]\* 2.2 Write property test for canonical URL consistency

  - **Property 5: Canonical URL consistency**
  - **Validates: Requirements 7.5, 10.3**

- [x] 3. Implement structured data (Schema.org) generators

  - Create Product schema generator with price, availability, ratings
  - Create LocalBusiness schema generator for shops
  - Create BreadcrumbList schema generator
  - Create Organization and WebSite schema for root layout
  - Implement AggregateRating schema for products with reviews
  - _Requirements: 1.2, 2.1, 2.5, 8.1, 8.3, 8.5_

- [ ]\* 3.1 Write property test for structured data validity

  - **Property 2: Structured data validity**
  - **Validates: Requirements 1.2, 8.5**

- [ ]\* 3.2 Write property test for breadcrumb schema completeness

  - **Property 11: Breadcrumb schema completeness**
  - **Validates: Requirements 8.3, 11.3**

- [ ]\* 3.3 Write property test for structured data schema validation

  - **Property 7: Structured data schema validation**
  - **Validates: Requirements 8.4**

- [x] 4. Implement dynamic sitemap generation

  - Create sitemap.ts in app directory using MetadataRoute.Sitemap
  - Implement product sitemap generator fetching from API
  - Implement shop sitemap generator
  - Implement static pages sitemap
  - Add priority and changeFrequency configuration
  - _Requirements: 3.1, 3.2, 3.3_

- [ ]\* 4.1 Write property test for sitemap URL uniqueness

  - **Property 3: Sitemap URL uniqueness**
  - **Validates: Requirements 3.1, 3.2**

- [ ]\* 4.2 Write property test for sitemap priority ordering

  - **Property 13: Sitemap priority ordering**
  - **Validates: Requirements 3.3**

-

- [ ] 5. Implement robots.txt generation

  - Create robots.ts in app directory using MetadataRoute.Robots
  - Configure allow/disallow rules for public and protected routes
  - Add sitemap reference to robots.txt
  - _Requirements: 3.4, 3.5_

- [ ]\* 5.1 Write property test for robots.txt accessibility

  - **Property 8: Robots.txt accessibility**
  - **Validates: Requirements 3.4**

- [ ] 6. Update product detail pages with SEO optimization

  - Implement generateMetadata function for product pages
  - Add Product structured data (JSON-LD) to page
  - Add breadcrumb structured data
  - Configure ISR with 1-hour revalidation
  - Implement generateStaticParams for top products
  - _Requirements: 1.1, 1.2, 1.4, 9.1_

- [ ]\* 6.1 Write property test for product metadata generation

  - **Property 1: Metadata completeness (Product pages)**
  - **Validates: Requirements 1.1**

- [ ]\* 6.2 Write property test for product stock availability

  - **Property 10: ISR revalidation timing**
  - **Validates: Requirements 1.4, 1.5**

- [ ] 7. Update shop pages with SEO optimization

  - Implement generateMetadata function for shop pages
  - Add LocalBusiness structured data (JSON-LD)
  - Add breadcrumb structured data
  - Configure ISR with 30-minute revalidation
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ]\* 7.1 Write property test for shop metadata generation

  - **Property 1: Metadata completeness (Shop pages)**
  - **Validates: Requirements 2.1**

- [ ]\* 7.2 Write property test for shop aggregate rating

  - **Property 2: Structured data validity (AggregateRating)**
  - **Validates: Requirements 2.5**

- [ ] 8. Update homepage with SEO optimization

  - Enhance homepage metadata with comprehensive description
  - Add Organization and WebSite structured data
  - Configure ISR with 3-minute revalidation
  - Optimize hero images with Next.js Image component
  - _Requirements: 1.1, 5.2, 9.2_

- [ ]\* 8.1 Write property test for image optimization

  - **Property 4: Image optimization consistency**
  - **Validates: Requirements 5.2, 6.3**

- [ ] 9. Update category and search pages with SEO optimization

  - Implement generateMetadata for category pages
  - Implement generateMetadata for search results pages
  - Add pagination metadata (rel="next", rel="prev")
  - Configure SSR rendering strategy
  - _Requirements: 1.1, 9.3, 10.4_

- [ ]\* 9.1 Write property test for pagination metadata

  - **Property 14: Meta description length**
  - **Validates: Requirements 1.1, 10.4**

- [ ] 10. Implement performance monitoring

  - Setup Web Vitals reporting using next/web-vitals
  - Create performance monitoring utility
  - Integrate with Google Analytics 4
  - Add error logging for SEO-related issues
  - _Requirements: 7.1, 7.3, 7.4_

- [ ] 11. Optimize images across the application

  - Audit all image usages and convert to Next.js Image component
  - Add priority prop for above-the-fold images
  - Configure responsive image sizes
  - Add proper alt text for all images
  - _Requirements: 5.2, 6.3_

- [ ]\* 11.1 Write property test for image component props

  - **Property 4: Image optimization consistency**
  - **Validates: Requirements 5.2**

- [ ] 12. Implement internal linking optimization

  - Add related products section to product pages
  - Add category links to homepage and footer
  - Implement breadcrumb navigation component
  - Ensure descriptive anchor text for all links
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ]\* 12.1 Write property test for internal link validity

  - **Property 15: Internal link validity**
  - **Validates: Requirements 11.5**

- [ ] 13. Implement URL optimization

  - Create slug generation utility for SEO-friendly URLs
  - Implement canonical URL logic for all pages
  - Setup 301 redirects for changed URLs in middleware
  - Ensure clean URLs without query parameters
  - _Requirements: 10.1, 10.2, 10.3, 10.5_

- [ ]\* 13.1 Write property test for slug generation

  - **Property 10: ISR revalidation timing (URL format)**
  - **Validates: Requirements 10.2**

- [ ] 14. Implement internationalization (i18n) foundation

  - Verify lang="vi" attribute in root layout
  - Add locale to all Open Graph tags
  - Add locale to all structured data
  - Structure URLs for future language expansion
  - Ensure UTF-8 encoding
  - _Requirements: 12.1, 12.3, 12.4, 12.5_

- [ ]\* 14.1 Write property test for locale consistency

  - **Property 12: Locale consistency**
  - **Validates: Requirements 4.5, 12.1, 12.5**

- [ ] 15. Update root layout with global SEO elements

  - Add comprehensive default metadata
  - Add viewport configuration
  - Add Google Analytics 4 script
  - Add Google Search Console verification meta tag
  - Optimize font loading with next/font
  - _Requirements: 6.4, 7.1, 7.2_

- [ ] 16. Create SEO documentation

  - Document SEO configuration and usage
  - Create guide for adding new pages with proper SEO
  - Document structured data patterns
  - Create SEO checklist for developers
  - _Requirements: All_

- [ ] 17. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. SEO validation and testing

  - Run Google Rich Results Test on all structured data
  - Run Lighthouse SEO audit (target score: 100)
  - Test mobile-friendliness
  - Validate sitemap in Google Search Console
  - Check Core Web Vitals in PageSpeed Insights
  - _Requirements: 5.1, 6.2, 8.4_

- [ ] 19. Final optimization and deployment preparation
  - Review and optimize bundle sizes
  - Verify all ISR/SSR/SSG configurations
  - Test all metadata in production build
  - Verify robots.txt and sitemap accessibility
  - Final performance audit
  - _Requirements: All_
