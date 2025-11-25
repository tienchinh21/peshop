# Design Document: Next.js 15.5 Build Performance Optimization

## Overview

This design document outlines the architecture and implementation strategy for optimizing build time and initial page load performance in a Next.js 15.5 e-commerce application. The current application experiences slow first-time page loads due to several factors:

1. **Dynamic Rendering Forced by Cookie Access**: Using `await cookies()` in server components forces all pages to render dynamically, preventing static generation
2. **Large Client-Side Bundles**: Heavy UI libraries (Radix UI, Recharts, React Quill) are loaded synchronously without code splitting
3. **Limited Static Generation**: Only top 100 products are pre-rendered at build time
4. **Client-Side Authentication Overhead**: Authentication guards run on every protected route, causing hydration delays
5. **Inefficient Data Fetching**: Multiple sequential API calls block page rendering

The optimization strategy focuses on:

- Enabling static generation for public pages by eliminating dynamic rendering triggers
- Implementing aggressive code splitting for heavy dependencies
- Optimizing data fetching with parallel requests and streaming
- Improving caching strategies for frequently accessed data
- Reducing bundle sizes through tree-shaking and lazy loading

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 15.5 App Router                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Static     │  │   Dynamic    │  │  Streaming   │      │
│  │   Pages      │  │   Pages      │  │   Pages      │      │
│  │   (SSG)      │  │   (SSR)      │  │   (PPR)      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘               │
│                            │                                  │
│         ┌──────────────────┴──────────────────┐              │
│         │                                      │              │
│  ┌──────▼──────┐                    ┌─────────▼────────┐    │
│  │   Server    │                    │     Client       │    │
│  │  Components │                    │   Components     │    │
│  │             │                    │                  │    │
│  │ - Data      │                    │ - Interactivity  │    │
│  │   Fetching  │                    │ - State Mgmt     │    │
│  │ - Caching   │                    │ - User Actions   │    │
│  └──────┬──────┘                    └─────────┬────────┘    │
│         │                                      │              │
└─────────┼──────────────────────────────────────┼──────────────┘
          │                                      │
          │                                      │
    ┌─────▼──────┐                        ┌─────▼──────┐
    │   API      │                        │  Browser   │
    │  Backend   │                        │   Cache    │
    │  (.NET)    │                        │            │
    └────────────┘                        └────────────┘
```

### Rendering Strategy

The application will use a hybrid rendering approach:

1. **Static Generation (SSG)** for:

   - Homepage
   - Product listing pages (first 3 pages)
   - Top 100 product detail pages
   - Category pages
   - Static content pages

2. **Incremental Static Regeneration (ISR)** for:

   - Product detail pages (revalidate every 60 seconds)
   - Product listings (revalidate every 30 seconds)
   - Shop pages (revalidate every 60 seconds)

3. **Server-Side Rendering (SSR)** for:

   - Search results
   - User-specific pages (cart, orders, account)
   - Shop dashboard and management pages

4. **Streaming with Suspense** for:
   - Product recommendations
   - Related products
   - Reviews section
   - Shop statistics

## Components and Interfaces

### 1. Data Fetching Layer

#### Server-Side Fetcher (Optimized)

```typescript
// src/services/core/fetch/server-fetcher.ts

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
  cache?: "force-cache" | "no-store";
}

/**
 * Optimized server-side fetcher that avoids forcing dynamic rendering
 * Uses Next.js fetch with proper caching configuration
 */
export async function serverFetch<T>(
  url: string,
  options?: FetchOptions & RequestInit
): Promise<T> {
  const { revalidate, tags, cache, ...fetchOptions } = options || {};

  const response = await fetch(url, {
    ...fetchOptions,
    next: {
      revalidate: revalidate ?? 60,
      tags: tags ?? [],
    },
    cache: cache ?? "force-cache",
  });

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status}`);
  }

  return response.json();
}
```

#### Authentication-Aware Fetcher

```typescript
// src/services/core/fetch/auth-fetcher.ts

/**
 * Fetcher that handles authentication without forcing dynamic rendering
 * Uses middleware to inject auth headers instead of reading cookies in components
 */
export async function authFetch<T>(
  url: string,
  options?: FetchOptions & RequestInit
): Promise<T> {
  // Auth token will be injected by middleware
  // This avoids calling cookies() in server components
  return serverFetch<T>(url, {
    ...options,
    credentials: "include", // Let middleware handle auth
  });
}
```

### 2. Code Splitting Components

#### Dynamic Modal Loader

```typescript
// src/components/common/DynamicModals.tsx

import dynamic from "next/dynamic";
import { ComponentType } from "react";

// Lazy load modals with loading states
export const QuickViewModal = dynamic(() => import("./QuickViewModal"), {
  loading: () => <ModalSkeleton />,
  ssr: false, // Modals don't need SSR
});

export const AddressSelectModal = dynamic(
  () => import("./Modal/AddressSelectModal"),
  {
    loading: () => <ModalSkeleton />,
    ssr: false,
  }
);

export const CategorySelectionModal = dynamic(
  () => import("./Modal/CategorySelectionModal"),
  {
    loading: () => <ModalSkeleton />,
    ssr: false,
  }
);
```

#### Dynamic Rich Text Editor

```typescript
// src/components/common/DynamicRichTextEditor.tsx

import dynamic from "next/dynamic";

// React Quill is heavy (~200KB), load only when needed
export const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  loading: () => <EditorSkeleton />,
  ssr: false, // Quill doesn't work with SSR
});
```

#### Dynamic Chart Components

```typescript
// src/components/charts/DynamicCharts.tsx

import dynamic from "next/dynamic";

// Recharts is heavy (~150KB), load only when needed
export const DashboardCharts = dynamic(
  () => import("../views/pages/shop/dashboard/components/DashboardCharts"),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const VoucherDashboardCharts = dynamic(
  () =>
    import(
      "../views/pages/shop/chien-dich/voucher/components/VoucherDashboardCharts"
    ),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);
```

### 3. Optimized Authentication

#### Middleware-Based Auth

```typescript
// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.url;

  // Inject auth header for API requests
  if (token && pathname.startsWith("/api")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Protected routes - redirect if not authenticated
  const protectedPaths = [
    "/gio-hang",
    "/thanh-toan",
    "/don-hang",
    "/tai-khoan",
    "/shop",
  ];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/xac-thuc", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

#### Client-Side Auth Hook (Optimized)

```typescript
// src/hooks/useAuth.ts (optimized)

"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { hydrateAuth } from "@/lib/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  // Hydrate auth state once on mount
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return auth;
};
```

### 4. Streaming Components

#### Product Recommendations (Streamed)

```typescript
// src/components/product/StreamedRecommendations.tsx

import { Suspense } from "react";
import { ProductSkeleton } from "@/components/skeleton";

async function RecommendationsContent({ productId }: { productId: string }) {
  // This will stream after the main page content
  const recommendations = await fetchRecommendations(productId);

  return <ProductGrid products={recommendations} />;
}

export function StreamedRecommendations({ productId }: { productId: string }) {
  return (
    <Suspense fallback={<ProductSkeleton count={4} />}>
      <RecommendationsContent productId={productId} />
    </Suspense>
  );
}
```

### 5. Optimized Image Component

```typescript
// src/components/common/OptimizedImage.tsx

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src || "/placeholder-product.svg"}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        onLoadingComplete={() => setIsLoading(false)}
        className={`
          duration-300 ease-in-out
          ${isLoading ? "blur-sm scale-105" : "blur-0 scale-100"}
        `}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      />
    </div>
  );
}
```

## Data Models

### Cache Configuration

```typescript
// src/services/core/cache/cache.config.ts

export const CACHE_CONFIG = {
  // Static content - cache for 1 hour
  STATIC: {
    revalidate: 3600,
    tags: ["static"],
  },

  // Product listings - cache for 30 seconds
  PRODUCT_LIST: {
    revalidate: 30,
    tags: ["products", "list"],
  },

  // Product details - cache for 1 minute
  PRODUCT_DETAIL: {
    revalidate: 60,
    tags: ["products", "detail"],
  },

  // Categories - cache for 5 minutes
  CATEGORIES: {
    revalidate: 300,
    tags: ["categories"],
  },

  // Shop data - cache for 1 minute
  SHOP: {
    revalidate: 60,
    tags: ["shop"],
  },

  // User-specific data - no cache
  USER_DATA: {
    cache: "no-store" as const,
  },
} as const;
```

### Build Configuration

```typescript
// next.config.ts (optimized)

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable SWC minification (faster than Terser)
  swcMinify: true,

  // Optimize package imports
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-popover",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "@tabler/icons-react",
      "recharts",
      "lodash",
    ],

    // Enable Partial Prerendering (Next.js 15 feature)
    ppr: "incremental",
  },

  // Image optimization
  images: {
    domains: ["salt.tikicdn.com", "xjanua.me", "localhost"],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler options
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Output standalone for smaller Docker images
  output: "standalone",

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Reduce client bundle size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for shared dependencies
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // UI library chunk
            ui: {
              name: "ui",
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|@tabler)[\\/]/,
              chunks: "all",
              priority: 30,
            },
            // Charts chunk (lazy loaded)
            charts: {
              name: "charts",
              test: /[\\/]node_modules[\\/](recharts)[\\/]/,
              chunks: "async",
              priority: 40,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._
# # #   P r o p e r t y   1 :   B u n d l e   S i z e   C o n s t r a i n t  
  
 _ F o r   a n y _   r o u t e   i n   t h e   a p p l i c a t i o n ,   t h e   i n i t i a l   J a v a S c r i p t   b u n d l e   s i z e   S H A L L   b e   l e s s   t h a n   2 0 0 K B   ( g z i p p e d ) .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   1 . 3 * *  
  
 # # #   P r o p e r t y   2 :   I S R   R e v a l i d a t i o n   C o n f i g u r a t i o n  
  
 _ F o r   a n y _   p a g e   u s i n g   s t a t i c   g e n e r a t i o n   w i t h   I S R ,   t h e   f e t c h   c a l l s   o r   r o u t e   s e g m e n t   c o n f i g   S H A L L   i n c l u d e   a   r e v a l i d a t e   v a l u e   m a t c h i n g   t h e   c o n f i g u r e d   c a c h e   i n t e r v a l   ( 3 0 s   f o r   l i s t i n g s ,   6 0 s   f o r   d e t a i l s ,   3 0 0 s   f o r   c a t e g o r i e s ) .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   1 . 5 * *  
  
 # # #   P r o p e r t y   3 :   D y n a m i c   I m p o r t   U s a g e   f o r   H e a v y   D e p e n d e n c i e s  
  
 _ F o r   a n y _   i m p o r t   o f   h e a v y   d e p e n d e n c i e s   ( R e c h a r t s ,   R e a c t   Q u i l l ,   m o d a l s ) ,   t h e   i m p o r t   S H A L L   u s e   d y n a m i c   i m p o r t   s y n t a x   w i t h   a p p r o p r i a t e   l o a d i n g   s t a t e s .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   2 . 2 * *  
  
 # # #   P r o p e r t y   4 :   R o u t e - S p e c i f i c   C o d e   S p l i t t i n g  
  
 _ F o r   a n y _   p a g e   r o u t e   i n   t h e   a p p l i c a t i o n ,   N e x t . j s   S H A L L   g e n e r a t e   a   s e p a r a t e   J a v a S c r i p t   c h u n k   s p e c i f i c   t o   t h a t   r o u t e ,   v e r i f i a b l e   i n   t h e   b u i l d   m a n i f e s t .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   3 . 1 * *  
  
 # # #   P r o p e r t y   5 :   M o d a l   D y n a m i c   L o a d i n g  
  
 _ F o r   a n y _   m o d a l   o r   d i a l o g   c o m p o n e n t ,   t h e   c o m p o n e n t   S H A L L   b e   i m p o r t e d   u s i n g   n e x t / d y n a m i c   w i t h   s s r :   f a l s e   c o n f i g u r a t i o n .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   3 . 2 * *  
  
 # # #   P r o p e r t y   6 :   B e l o w - F o l d   L a z y   L o a d i n g  
  
 _ F o r   a n y _   c o m p l e x   U I   c o m p o n e n t   n o t   v i s i b l e   i n   t h e   i n i t i a l   v i e w p o r t   ( r e c o m m e n d a t i o n s ,   r e v i e w s ,   c h a r t s ) ,   t h e   c o m p o n e n t   S H A L L   u s e   R e a c t . l a z y   o r   n e x t / d y n a m i c   f o r   d e f e r r e d   l o a d i n g .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   3 . 3 * *  
  
 # # #   P r o p e r t y   7 :   S e r v e r - S i d e   R e q u e s t   D e d u p l i c a t i o n  
  
 _ F o r   a n y _   d a t a   f e t c h i n g   f u n c t i o n   u s e d   i n   s e r v e r   c o m p o n e n t s ,   t h e   f u n c t i o n   S H A L L   b e   w r a p p e d   w i t h   R e a c t ' s   c a c h e ( )   t o   e n a b l e   a u t o m a t i c   r e q u e s t   d e d u p l i c a t i o n .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   4 . 1 * *  
  
 # # #   P r o p e r t y   8 :   P a r a l l e l   D a t a   F e t c h i n g  
  
 _ F o r   a n y _   p a g e   c o m p o n e n t   w i t h   m u l t i p l e   i n d e p e n d e n t   d a t a   d e p e n d e n c i e s ,   t h e   d a t a   f e t c h i n g   c a l l s   S H A L L   e x e c u t e   i n   p a r a l l e l   u s i n g   P r o m i s e . a l l   o r   P r o m i s e . a l l S e t t l e d .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   4 . 2 * *  
  
 # # #   P r o p e r t y   9 :   G r a c e f u l   S S G   E r r o r   H a n d l i n g  
  
 _ F o r   a n y _   p a g e   u s i n g   s t a t i c   g e n e r a t i o n ,   d a t a   f e t c h i n g   e r r o r s   S H A L L   b e   c a u g h t   a n d   h a n d l e d   w i t h   f a l l b a c k   v a l u e s   t o   p r e v e n t   b u i l d   f a i l u r e s .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   4 . 3 * *  
  
 # # #   P r o p e r t y   1 0 :   S u s p e n s e   f o r   N o n - C r i t i c a l   C o n t e n t  
  
 _ F o r   a n y _   s e r v e r   c o m p o n e n t   r e n d e r i n g   n o n - c r i t i c a l   c o n t e n t   ( r e c o m m e n d a t i o n s ,   r e l a t e d   p r o d u c t s ,   r e v i e w s ) ,   t h e   c o n t e n t   S H A L L   b e   w r a p p e d   i n   R e a c t   S u s p e n s e   b o u n d a r i e s   w i t h   a p p r o p r i a t e   f a l l b a c k   U I .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   4 . 4 * *  
  
 # # #   P r o p e r t y   1 1 :   C o o k i e   A c c e s s   A v o i d a n c e   i n   P u b l i c   P a g e s  
  
 _ F o r   a n y _   p u b l i c   p a g e   s e r v e r   c o m p o n e n t   ( h o m e p a g e ,   p r o d u c t   l i s t i n g s ,   p r o d u c t   d e t a i l s ) ,   t h e   c o m p o n e n t   S H A L L   N O T   c a l l   c o o k i e s ( )   o r   h e a d e r s ( )   f u n c t i o n s   t h a t   f o r c e   d y n a m i c   r e n d e r i n g .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   4 . 5 * *  
  
 # # #   P r o p e r t y   1 2 :   N e x t . j s   I m a g e   C o m p o n e n t   U s a g e  
  
 _ F o r   a n y _   i m a g e   r e n d e r e d   i n   t h e   a p p l i c a t i o n ,   t h e   i m a g e   S H A L L   u s e   t h e   N e x t . j s   I m a g e   c o m p o n e n t   i n s t e a d   o f   n a t i v e   i m g   t a g s   t o   e n a b l e   a u t o m a t i c   o p t i m i z a t i o n .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   7 . 1 * *  
  
 # # #   P r o p e r t y   1 3 :   L a z y   L o a d i n g   f o r   B e l o w - F o l d   I m a g e s  
  
 _ F o r   a n y _   i m a g e   n o t   i n   t h e   i n i t i a l   v i e w p o r t   ( p r o d u c t   g r i d s ,   r e c o m m e n d a t i o n s ) ,   t h e   I m a g e   c o m p o n e n t   S H A L L   N O T   h a v e   p r i o r i t y = { t r u e }   t o   e n a b l e   l a z y   l o a d i n g .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   7 . 2 * *  
  
 # # #   P r o p e r t y   1 4 :   R e s p o n s i v e   I m a g e   S i z e s  
  
 _ F o r   a n y _   I m a g e   c o m p o n e n t ,   t h e   c o m p o n e n t   S H A L L   i n c l u d e   a   s i z e s   p r o p   t o   g e n e r a t e   a p p r o p r i a t e   r e s p o n s i v e   i m a g e   s i z e s   f o r   d i f f e r e n t   v i e w p o r t s .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   7 . 3 * *  
  
 # # #   P r o p e r t y   1 5 :   I m a g e   D i m e n s i o n s   S p e c i f i e d  
  
 _ F o r   a n y _   I m a g e   c o m p o n e n t ,   t h e   c o m p o n e n t   S H A L L   s p e c i f y   w i d t h   a n d   h e i g h t   p r o p s   ( o r   f i l l   w i t h   p a r e n t   c o n t a i n e r )   t o   p r e v e n t   c u m u l a t i v e   l a y o u t   s h i f t .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   7 . 5 * *  
  
 # # #   P r o p e r t y   1 6 :   S u s p e n s e   F a l l b a c k   S k e l e t o n s  
  
 _ F o r   a n y _   S u s p e n s e   b o u n d a r y   i n   t h e   a p p l i c a t i o n ,   t h e   f a l l b a c k   p r o p   S H A L L   r e n d e r   s k e l e t o n   c o m p o n e n t s   t h a t   m a t c h   t h e   e x p e c t e d   c o n t e n t   l a y o u t .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   9 . 3 * *  
  
 # # #   P r o p e r t y   1 7 :   E r r o r   B o u n d a r i e s   f o r   S t r e a m e d   C o n t e n t  
  
 _ F o r   a n y _   p a g e   c o m p o n e n t   u s i n g   S u s p e n s e   f o r   s t r e a m i n g ,   t h e   p a g e   S H A L L   i n c l u d e   E r r o r   B o u n d a r y   c o m p o n e n t s   t o   c a t c h   a n d   d i s p l a y   e r r o r s   w i t h o u t   c r a s h i n g .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   9 . 4 * *  
  
 # # #   P r o p e r t y   1 8 :   A b o v e - F o l d   C o n t e n t   P r i o r i t y  
  
 _ F o r   a n y _   p a g e   c o m p o n e n t ,   c o n t e n t   v i s i b l e   i n   t h e   i n i t i a l   v i e w p o r t   S H A L L   N O T   b e   w r a p p e d   i n   S u s p e n s e   b o u n d a r i e s   t o   e n s u r e   i m m e d i a t e   r e n d e r i n g .  
  
 * * V a l i d a t e s :   R e q u i r e m e n t s   9 . 5 * *  
 # #   E r r o r   H a n d l i n g  
  
 # # #   B u i l d - T i m e   E r r o r   H a n d l i n g  
  
 1 .   * * S t a t i c   G e n e r a t i o n   F a i l u r e s * *  
  
       -   W r a p   a l l   d a t a   f e t c h i n g   i n   t r y - c a t c h   b l o c k s  
       -   R e t u r n   f a l l b a c k   d a t a   o n   e r r o r s   t o   p r e v e n t   b u i l d   f a i l u r e s  
       -   L o g   e r r o r s   f o r   m o n i t o r i n g   b u t   d o n ' t   b l o c k   t h e   b u i l d  
       -   U s e   ` d y n a m i c P a r a m s   =   t r u e `   t o   a l l o w   r u n t i m e   g e n e r a t i o n   o f   m i s s i n g   p a g e s  
  
 2 .   * * A P I   T i m e o u t   H a n d l i n g * *  
  
       -   I m p l e m e n t   t i m e o u t   l i m i t s   f o r   g e n e r a t e S t a t i c P a r a m s   ( 3 0   s e c o n d s   m a x )  
       -   U s e   P r o m i s e . r a c e   w i t h   t i m e o u t   p r o m i s e s  
       -   F a l l   b a c k   t o   e m p t y   a r r a y s   o n   t i m e o u t  
  
 3 .   * * I m a g e   O p t i m i z a t i o n   E r r o r s * *  
       -   P r o v i d e   f a l l b a c k   p l a c e h o l d e r   i m a g e s  
       -   H a n d l e   m i s s i n g   i m a g e s   g r a c e f u l l y   w i t h   d e f a u l t   S V G  
       -   L o g   i m a g e   o p t i m i z a t i o n   f a i l u r e s   w i t h o u t   b l o c k i n g   r e n d e r  
  
 # # #   R u n t i m e   E r r o r   H a n d l i n g  
  
 1 .   * * D a t a   F e t c h i n g   E r r o r s * *  
  
       -   D i s p l a y   u s e r - f r i e n d l y   e r r o r   m e s s a g e s  
       -   P r o v i d e   r e t r y   m e c h a n i s m s   f o r   f a i l e d   r e q u e s t s  
       -   U s e   E r r o r   B o u n d a r i e s   t o   p r e v e n t   f u l l   p a g e   c r a s h e s  
  
 2 .   * * S t r e a m i n g   E r r o r s * *  
  
       -   W r a p   S u s p e n s e   b o u n d a r i e s   w i t h   E r r o r   B o u n d a r i e s  
       -   D i s p l a y   f a l l b a c k   U I   w h e n   s t r e a m i n g   f a i l s  
       -   L o g   e r r o r s   t o   m o n i t o r i n g   s e r v i c e  
  
 3 .   * * C l i e n t - S i d e   E r r o r s * *  
       -   I m p l e m e n t   g l o b a l   e r r o r   b o u n d a r y   a t   a p p   l e v e l  
       -   C a p t u r e   a n d   r e p o r t   e r r o r s   t o   e r r o r   t r a c k i n g   s e r v i c e  
       -   P r o v i d e   r e c o v e r y   o p t i o n s   f o r   u s e r s  
  
 # #   T e s t i n g   S t r a t e g y  
  
 # # #   U n i t   T e s t i n g  
  
 U n i t   t e s t s   w i l l   v e r i f y   s p e c i f i c   i m p l e m e n t a t i o n   d e t a i l s   a n d   e d g e   c a s e s :  
  
 1 .   * * C o n f i g u r a t i o n   T e s t s * *  
  
       -   V e r i f y   n e x t . c o n f i g . t s   h a s   c o r r e c t   o p t i m i z a t i o n   s e t t i n g s  
       -   C h e c k   c a c h e   c o n f i g u r a t i o n   v a l u e s   m a t c h   r e q u i r e m e n t s  
       -   V a l i d a t e   m i d d l e w a r e   a u t h   l o g i c  
  
 2 .   * * C o m p o n e n t   T e s t s * *  
  
       -   T e s t   d y n a m i c   i m p o r t   w r a p p e r s   r e n d e r   c o r r e c t l y  
       -   V e r i f y   s k e l e t o n   c o m p o n e n t s   m a t c h   e x p e c t e d   l a y o u t s  
       -   T e s t   e r r o r   b o u n d a r y   f a l l b a c k   r e n d e r i n g  
  
 3 .   * * U t i l i t y   F u n c t i o n   T e s t s * *  
       -   T e s t   c a c h e   w r a p p e r   f u n c t i o n s  
       -   V e r i f y   f e t c h   h e l p e r   f u n c t i o n s   h a n d l e   e r r o r s   c o r r e c t l y  
       -   T e s t   i m a g e   o p t i m i z a t i o n   u t i l i t i e s  
  
 # # #   P r o p e r t y - B a s e d   T e s t i n g  
  
 P r o p e r t y - b a s e d   t e s t s   w i l l   v e r i f y   u n i v e r s a l   p r o p e r t i e s   a c r o s s   t h e   c o d e b a s e   u s i n g   * * f a s t - c h e c k * *   l i b r a r y   f o r   T y p e S c r i p t / J a v a S c r i p t :  
  
 1 .   * * B u n d l e   S i z e   P r o p e r t i e s * *  
  
       -   G e n e r a t e   r a n d o m   r o u t e   p a t h s  
       -   V e r i f y   b u n d l e   s i z e s   a r e   u n d e r   2 0 0 K B   t h r e s h o l d  
       -   T e s t   a c r o s s   d i f f e r e n t   p a g e   t y p e s  
  
 2 .   * * I m p o r t   P a t t e r n   P r o p e r t i e s * *  
  
       -   S c a n   c o d e b a s e   f o r   h e a v y   d e p e n d e n c y   i m p o r t s  
       -   V e r i f y   a l l   m a t c h   d y n a m i c   i m p o r t   p a t t e r n  
       -   G e n e r a t e   t e s t   c a s e s   f o r   d i f f e r e n t   i m p o r t   s c e n a r i o s  
  
 3 .   * * I m a g e   C o m p o n e n t   P r o p e r t i e s * *  
  
       -   F i n d   a l l   i m a g e   u s a g e s   i n   c o m p o n e n t s  
       -   V e r i f y   a l l   u s e   N e x t . j s   I m a g e   c o m p o n e n t  
       -   C h e c k   d i m e n s i o n s   a r e   s p e c i f i e d  
  
 4 .   * * S u s p e n s e   B o u n d a r y   P r o p e r t i e s * *  
  
       -   L o c a t e   a l l   S u s p e n s e   c o m p o n e n t s  
       -   V e r i f y   f a l l b a c k   p r o p s   a r e   p r e s e n t  
       -   C h e c k   E r r o r   B o u n d a r i e s   w r a p   S u s p e n s e  
  
 5 .   * * C a c h e   C o n f i g u r a t i o n   P r o p e r t i e s * *  
       -   F i n d   a l l   f e t c h   c a l l s   i n   s e r v e r   c o m p o n e n t s  
       -   V e r i f y   r e v a l i d a t e   v a l u e s   m a t c h   r e q u i r e m e n t s  
       -   T e s t   a c r o s s   d i f f e r e n t   d a t a   t y p e s  
  
 # # #   I n t e g r a t i o n   T e s t i n g  
  
 1 .   * * B u i l d   O u t p u t   V a l i d a t i o n * *  
  
       -   R u n   p r o d u c t i o n   b u i l d  
       -   P a r s e   b u i l d   m a n i f e s t  
       -   V e r i f y   s t a t i c   v s   d y n a m i c   p a g e   c o u n t s  
       -   C h e c k   b u n d l e   s i z e s   i n   b u i l d   o u t p u t  
  
 2 .   * * P e r f o r m a n c e   T e s t i n g * *  
  
       -   U s e   L i g h t h o u s e   C I   f o r   a u t o m a t e d   p e r f o r m a n c e   t e s t i n g  
       -   M e a s u r e   C o r e   W e b   V i t a l s   i n   t e s t   e n v i r o n m e n t  
       -   V e r i f y   L C P ,   F I D ,   C L S   m e e t   t h r e s h o l d s  
  
 3 .   * * E n d - t o - E n d   T e s t i n g * *  
       -   T e s t   c r i t i c a l   u s e r   f l o w s  
       -   V e r i f y   p a g e s   l o a d   c o r r e c t l y  
       -   C h e c k   a u t h e n t i c a t i o n   f l o w s   w o r k  
       -   T e s t   c a r t   a n d   c h e c k o u t   p r o c e s s e s  
  
 # # #   T e s t i n g   T o o l s  
  
 -   * * U n i t   T e s t s * * :   V i t e s t   o r   J e s t  
 -   * * P r o p e r t y - B a s e d   T e s t s * * :   f a s t - c h e c k  
 -   * * C o m p o n e n t   T e s t s * * :   R e a c t   T e s t i n g   L i b r a r y  
 -   * * E 2 E   T e s t s * * :   P l a y w r i g h t  
 -   * * P e r f o r m a n c e   T e s t s * * :   L i g h t h o u s e   C I  
 -   * * B u n d l e   A n a l y s i s * * :   @ n e x t / b u n d l e - a n a l y z e r  
  
 # # #   T e s t   E x e c u t i o n   S t r a t e g y  
  
 1 .   R u n   u n i t   t e s t s   o n   e v e r y   c o m m i t  
 2 .   R u n   p r o p e r t y - b a s e d   t e s t s   i n   C I   p i p e l i n e  
 3 .   R u n   i n t e g r a t i o n   t e s t s   b e f o r e   d e p l o y m e n t  
 4 .   R u n   p e r f o r m a n c e   t e s t s   o n   s t a g i n g   e n v i r o n m e n t  
 5 .   M o n i t o r   p r o d u c t i o n   m e t r i c s   c o n t i n u o u s l y  
  
 # #   I m p l e m e n t a t i o n   P h a s e s  
  
 # # #   P h a s e   1 :   F o u n d a t i o n   ( W e e k   1 )  
  
 * * G o a l * * :   E l i m i n a t e   d y n a m i c   r e n d e r i n g   a n d   e n a b l e   s t a t i c   g e n e r a t i o n  
  
 1 .   R e m o v e   ` a w a i t   c o o k i e s ( ) `   c a l l s   f r o m   p u b l i c   p a g e   s e r v e r   c o m p o n e n t s  
 2 .   I m p l e m e n t   m i d d l e w a r e - b a s e d   a u t h e n t i c a t i o n  
 3 .   U p d a t e   d a t a   f e t c h i n g   t o   u s e   p r o p e r   c a c h e   c o n f i g u r a t i o n  
 4 .   V e r i f y   b u i l d   o u t p u t   s h o w s   s t a t i c   p a g e s  
  
 * * S u c c e s s   C r i t e r i a * * :  
  
 -   H o m e p a g e ,   p r o d u c t   l i s t i n g s ,   a n d   t o p   1 0 0   p r o d u c t s   a r e   s t a t i c  
 -   B u i l d   t i m e   r e d u c e d   b y   3 0 %  
 -   N o   c o o k i e s ( )   c a l l s   i n   p u b l i c   p a g e s  
  
 # # #   P h a s e   2 :   C o d e   S p l i t t i n g   ( W e e k   2 )  
  
 * * G o a l * * :   R e d u c e   i n i t i a l   b u n d l e   s i z e s   t h r o u g h   a g g r e s s i v e   c o d e   s p l i t t i n g  
  
 1 .   I m p l e m e n t   d y n a m i c   i m p o r t s   f o r   a l l   m o d a l s  
 2 .   L a z y   l o a d   R e c h a r t s   l i b r a r y  
 3 .   L a z y   l o a d   R e a c t   Q u i l l   e d i t o r  
 4 .   C o n f i g u r e   p a c k a g e   o p t i m i z a t i o n   i n   n e x t . c o n f i g . t s  
 5 .   A n a l y z e   b u n d l e   s i z e s   a n d   v e r i f y   r e d u c t i o n s  
  
 * * S u c c e s s   C r i t e r i a * * :  
  
 -   I n i t i a l   b u n d l e   s i z e   <   2 0 0 K B   f o r   a l l   r o u t e s  
 -   M o d a l s   l o a d   o n - d e m a n d  
 -   C h a r t s   a n d   e d i t o r   a r e   l a z y   l o a d e d  
  
 # # #   P h a s e   3 :   D a t a   F e t c h i n g   O p t i m i z a t i o n   ( W e e k   3 )  
  
 * * G o a l * * :   O p t i m i z e   d a t a   f e t c h i n g   p a t t e r n s   f o r   f a s t e r   p a g e   l o a d s  
  
 1 .   W r a p   a l l   s e r v e r   f e t c h   f u n c t i o n s   w i t h   R e a c t   c a c h e ( )  
 2 .   I m p l e m e n t   p a r a l l e l   d a t a   f e t c h i n g   w h e r e   p o s s i b l e  
 3 .   A d d   S u s p e n s e   b o u n d a r i e s   f o r   n o n - c r i t i c a l   c o n t e n t  
 4 .   I m p l e m e n t   s t r e a m i n g   f o r   r e c o m m e n d a t i o n s   a n d   r e v i e w s  
 5 .   A d d   p r o p e r   e r r o r   h a n d l i n g   f o r   S S G  
  
 * * S u c c e s s   C r i t e r i a * * :  
  
 -   N o   d u p l i c a t e   r e q u e s t s   d u r i n g   r e n d e r  
 -   N o n - c r i t i c a l   c o n t e n t   s t r e a m s   a f t e r   i n i t i a l   p a g e   l o a d  
 -   B u i l d   s u c c e e d s   e v e n   w i t h   A P I   e r r o r s  
  
 # # #   P h a s e   4 :   I m a g e   a n d   F o n t   O p t i m i z a t i o n   ( W e e k   4 )  
  
 * * G o a l * * :   O p t i m i z e   a s s e t   l o a d i n g   f o r   b e t t e r   p e r f o r m a n c e  
  
 1 .   A u d i t   a l l   i m a g e   u s a g e   a n d   c o n v e r t   t o   N e x t . j s   I m a g e  
 2 .   A d d   p r o p e r   s i z e s   p r o p s   f o r   r e s p o n s i v e   i m a g e s  
 3 .   I m p l e m e n t   l a z y   l o a d i n g   f o r   b e l o w - f o l d   i m a g e s  
 4 .   V e r i f y   f o n t   o p t i m i z a t i o n   i s   w o r k i n g  
 5 .   A d d   p r i o r i t y   l o a d i n g   f o r   h e r o   i m a g e s  
  
 * * S u c c e s s   C r i t e r i a * * :  
  
 -   A l l   i m a g e s   u s e   N e x t . j s   I m a g e   c o m p o n e n t  
 -   N o   l a y o u t   s h i f t s   f r o m   i m a g e s  
 -   F o n t s   l o a d   o p t i m a l l y   w i t h   n o   F O U T  
  
 # # #   P h a s e   5 :   M o n i t o r i n g   a n d   R e f i n e m e n t   ( W e e k   5 )  
  
 * * G o a l * * :   I m p l e m e n t   m o n i t o r i n g   a n d   f i n e - t u n e   p e r f o r m a n c e  
  
 1 .   S e t   u p   p e r f o r m a n c e   m o n i t o r i n g  
 2 .   I m p l e m e n t   C o r e   W e b   V i t a l s   t r a c k i n g  
 3 .   A d d   S e r v e r - T i m i n g   h e a d e r s  
 4 .   A n a l y z e   p r o d u c t i o n   m e t r i c s  
 5 .   F i n e - t u n e   c a c h e   d u r a t i o n s   b a s e d   o n   d a t a  
  
 * * S u c c e s s   C r i t e r i a * * :  
  
 -   P e r f o r m a n c e   m o n i t o r i n g   i n   p l a c e  
 -   L C P   <   2 . 5 s   o n   3 G  
 -   F I D   <   1 0 0 m s  
 -   C L S   <   0 . 1  
  
 # #   P e r f o r m a n c e   T a r g e t s  
  
 # # #   B u i l d   P e r f o r m a n c e  
  
 -   * * B u i l d   T i m e * * :   <   5   m i n u t e s   f o r   f u l l   p r o d u c t i o n   b u i l d  
 -   * * S t a t i c   P a g e s * * :   >   1 0 0   p a g e s   p r e - r e n d e r e d  
 -   * * B u n d l e   S i z e * * :   <   2 0 0 K B   i n i t i a l   J S   ( g z i p p e d )  
 -   * * C o d e   S p l i t t i n g * * :   >   8 0 %   o f   h e a v y   d e p e n d e n c i e s   l a z y   l o a d e d  
  
 # # #   R u n t i m e   P e r f o r m a n c e  
  
 -   * * T T F B * * :   <   6 0 0 m s   ( s e r v e r   r e s p o n s e   t i m e )  
 -   * * F C P * * :   <   1 . 8 s   ( f i r s t   c o n t e n t f u l   p a i n t )  
 -   * * L C P * * :   <   2 . 5 s   ( l a r g e s t   c o n t e n t f u l   p a i n t )  
 -   * * F I D * * :   <   1 0 0 m s   ( f i r s t   i n p u t   d e l a y )  
 -   * * C L S * * :   <   0 . 1   ( c u m u l a t i v e   l a y o u t   s h i f t )  
 -   * * T T I * * :   <   3 . 8 s   ( t i m e   t o   i n t e r a c t i v e )  
  
 # # #   C a c h i n g   P e r f o r m a n c e  
  
 -   * * C a c h e   H i t   R a t e * * :   >   8 0 %   f o r   p r o d u c t   d a t a  
 -   * * I S R   R e v a l i d a t i o n * * :   <   1 s   f o r   s t a l e - w h i l e - r e v a l i d a t e  
 -   * * C D N   C a c h e * * :   >   9 0 %   f o r   s t a t i c   a s s e t s  
  
 # #   M o n i t o r i n g   a n d   M e t r i c s  
  
 # # #   B u i l d   M e t r i c s  
  
 T r a c k   i n   C I / C D   p i p e l i n e :  
  
 -   B u i l d   d u r a t i o n  
 -   N u m b e r   o f   s t a t i c   v s   d y n a m i c   p a g e s  
 -   B u n d l e   s i z e s   p e r   r o u t e  
 -   N u m b e r   o f   c h u n k s   g e n e r a t e d  
 -   T r e e - s h a k i n g   e f f e c t i v e n e s s  
  
 # # #   R u n t i m e   M e t r i c s  
  
 T r a c k   i n   p r o d u c t i o n :  
  
 -   C o r e   W e b   V i t a l s   ( L C P ,   F I D ,   C L S )  
 -   T i m e   t o   F i r s t   B y t e   ( T T F B )  
 -   F i r s t   C o n t e n t f u l   P a i n t   ( F C P )  
 -   T i m e   t o   I n t e r a c t i v e   ( T T I )  
 -   T o t a l   B l o c k i n g   T i m e   ( T B T )  
  
 # # #   U s e r   E x p e r i e n c e   M e t r i c s  
  
 T r a c k   u s e r - f a c i n g   m e t r i c s :  
  
 -   P a g e   l o a d   t i m e   ( p e r c e i v e d )  
 -   T i m e   t o   i n t e r a c t i v e  
 -   E r r o r   r a t e s  
 -   B o u n c e   r a t e s  
 -   C o n v e r s i o n   r a t e s  
  
 # # #   T o o l s  
  
 -   * * B u i l d   A n a l y s i s * * :   @ n e x t / b u n d l e - a n a l y z e r  
 -   * * P e r f o r m a n c e   M o n i t o r i n g * * :   V e r c e l   A n a l y t i c s   o r   G o o g l e   A n a l y t i c s  
 -   * * E r r o r   T r a c k i n g * * :   S e n t r y  
 -   * * R e a l   U s e r   M o n i t o r i n g * * :   V e r c e l   S p e e d   I n s i g h t s  
 -   * * S y n t h e t i c   M o n i t o r i n g * * :   L i g h t h o u s e   C I  
  
 # #   S e c u r i t y   C o n s i d e r a t i o n s  
  
 1 .   * * A u t h e n t i c a t i o n * *  
  
       -   M i d d l e w a r e   h a n d l e s   a u t h   w i t h o u t   e x p o s i n g   t o k e n s  
       -   S e c u r e   c o o k i e   s e t t i n g s   ( H t t p O n l y ,   S e c u r e ,   S a m e S i t e )  
       -   T o k e n   v a l i d a t i o n   o n   e v e r y   p r o t e c t e d   r e q u e s t  
  
 2 .   * * D a t a   F e t c h i n g * *  
  
       -   V a l i d a t e   a n d   s a n i t i z e   a l l   A P I   r e s p o n s e s  
       -   I m p l e m e n t   r a t e   l i m i t i n g   f o r   A P I   c a l l s  
       -   U s e   H T T P S   f o r   a l l   e x t e r n a l   r e q u e s t s  
  
 3 .   * * C l i e n t - S i d e   S e c u r i t y * *  
  
       -   S a n i t i z e   u s e r   i n p u t s  
       -   I m p l e m e n t   C S P   h e a d e r s  
       -   P r e v e n t   X S S   a t t a c k s  
  
 4 .   * * B u i l d   S e c u r i t y * *  
       -   R e m o v e   s e n s i t i v e   d a t a   f r o m   c l i e n t   b u n d l e s  
       -   E x c l u d e   s o u r c e   m a p s   i n   p r o d u c t i o n  
       -   V a l i d a t e   e n v i r o n m e n t   v a r i a b l e s  
  
 # #   D e p l o y m e n t   S t r a t e g y  
  
 # # #   P r e - D e p l o y m e n t  
  
 1 .   R u n   f u l l   t e s t   s u i t e  
 2 .   G e n e r a t e   p r o d u c t i o n   b u i l d  
 3 .   A n a l y z e   b u n d l e   s i z e s  
 4 .   R u n   L i g h t h o u s e   C I  
 5 .   V e r i f y   s t a t i c   p a g e   g e n e r a t i o n  
  
 # # #   D e p l o y m e n t  
  
 1 .   D e p l o y   t o   s t a g i n g   e n v i r o n m e n t  
 2 .   R u n   s m o k e   t e s t s  
 3 .   V e r i f y   p e r f o r m a n c e   m e t r i c s  
 4 .   D e p l o y   t o   p r o d u c t i o n   w i t h   g r a d u a l   r o l l o u t  
 5 .   M o n i t o r   e r r o r   r a t e s   a n d   p e r f o r m a n c e  
  
 # # #   P o s t - D e p l o y m e n t  
  
 1 .   M o n i t o r   C o r e   W e b   V i t a l s  
 2 .   C h e c k   e r r o r   t r a c k i n g   d a s h b o a r d  
 3 .   V e r i f y   c a c h e   h i t   r a t e s  
 4 .   M o n i t o r   A P I   r e s p o n s e   t i m e s  
 5 .   C o l l e c t   u s e r   f e e d b a c k  
  
 # # #   R o l l b a c k   P l a n  
  
 1 .   K e e p   p r e v i o u s   b u i l d   a r t i f a c t s  
 2 .   I m p l e m e n t   f e a t u r e   f l a g s   f o r   n e w   o p t i m i z a t i o n s  
 3 .   M o n i t o r   k e y   m e t r i c s   f o r   r e g r e s s i o n s  
 4 .   A u t o m a t e d   r o l l b a c k   o n   e r r o r   t h r e s h o l d   b r e a c h  
 5 .   M a n u a l   r o l l b a c k   p r o c e d u r e   d o c u m e n t e d  
  
 # #   F u t u r e   O p t i m i z a t i o n s  
  
 # # #   S h o r t   T e r m   ( 1 - 3   m o n t h s )  
  
 1 .   I m p l e m e n t   P a r t i a l   P r e r e n d e r i n g   ( P P R )   f o r   h y b r i d   p a g e s  
 2 .   A d d   s e r v i c e   w o r k e r   f o r   o f f l i n e   s u p p o r t  
 3 .   I m p l e m e n t   p r e f e t c h i n g   f o r   l i k e l y   n a v i g a t i o n   p a t h s  
 4 .   O p t i m i z e   t h i r d - p a r t y   s c r i p t s   l o a d i n g  
  
 # # #   M e d i u m   T e r m   ( 3 - 6   m o n t h s )  
  
 1 .   M i g r a t e   t o   R e a c t   S e r v e r   C o m p o n e n t s   f u l l y  
 2 .   I m p l e m e n t   e d g e   r e n d e r i n g   f o r   d y n a m i c   c o n t e n t  
 3 .   A d d   a d v a n c e d   c a c h i n g   s t r a t e g i e s   ( s t a l e - w h i l e - r e v a l i d a t e )  
 4 .   I m p l e m e n t   p r o g r e s s i v e   i m a g e   l o a d i n g  
  
 # # #   L o n g   T e r m   ( 6 - 1 2   m o n t h s )  
  
 1 .   E x p l o r e   m i c r o - f r o n t e n d s   a r c h i t e c t u r e  
 2 .   I m p l e m e n t   a d v a n c e d   c o d e   s p l i t t i n g   s t r a t e g i e s  
 3 .   A d d   p r e d i c t i v e   p r e f e t c h i n g   b a s e d   o n   u s e r   b e h a v i o r  
 4 .   O p t i m i z e   f o r   e m e r g i n g   w e b   s t a n d a r d s   ( H T T P / 3 ,   W e b A s s e m b l y )  
  
 # #   C o n c l u s i o n  
  
 T h i s   d e s i g n   p r o v i d e s   a   c o m p r e h e n s i v e   a p p r o a c h   t o   o p t i m i z i n g   b u i l d   t i m e   a n d   i n i t i a l   p a g e   l o a d   p e r f o r m a n c e   i n   t h e   N e x t . j s   1 5 . 5   a p p l i c a t i o n .   B y   i m p l e m e n t i n g   s t a t i c   g e n e r a t i o n ,   a g g r e s s i v e   c o d e   s p l i t t i n g ,   o p t i m i z e d   d a t a   f e t c h i n g ,   a n d   p r o p e r   c a c h i n g   s t r a t e g i e s ,   w e   e x p e c t   t o   a c h i e v e :  
  
 -   * * 5 0 - 7 0 %   r e d u c t i o n   i n   i n i t i a l   p a g e   l o a d   t i m e * *  
 -   * * 6 0 - 8 0 %   r e d u c t i o n   i n   J a v a S c r i p t   b u n d l e   s i z e * *  
 -   * * 4 0 - 5 0 %   r e d u c t i o n   i n   b u i l d   t i m e * *  
 -   * * I m p r o v e d   C o r e   W e b   V i t a l s   s c o r e s * *  
 -   * * B e t t e r   u s e r   e x p e r i e n c e   a n d   S E O   p e r f o r m a n c e * *  
  
 T h e   p h a s e d   i m p l e m e n t a t i o n   a p p r o a c h   a l l o w s   f o r   i n c r e m e n t a l   i m p r o v e m e n t s   w h i l e   m a i n t a i n i n g   s y s t e m   s t a b i l i t y .   E a c h   p h a s e   h a s   c l e a r   s u c c e s s   c r i t e r i a   a n d   c a n   b e   v a l i d a t e d   i n d e p e n d e n t l y   b e f o r e   m o v i n g   t o   t h e   n e x t   p h a s e .  
 