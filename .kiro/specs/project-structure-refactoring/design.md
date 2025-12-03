# Design Document

## Overview

This document outlines the refactoring plan to reorganize PeShop's codebase from a layer-based architecture to a feature-based architecture with clear domain separation. The new structure will improve code discoverability, maintainability, and scalability by colocating related files and following consistent patterns.

### Current Problems

1. **Scattered Feature Files**: Files for a single feature (e.g., products) are spread across multiple directories:

   - Routes in `src/app/`
   - Views in `src/views/pages/`
   - Hooks in `src/hooks/user/` or `src/hooks/shop/`
   - Services in `src/services/api/users/` or `src/services/api/shops/`
   - Types in `src/types/users/` or `src/types/shops/`

2. **Inconsistent Organization**: Some features have components colocated (e.g., `src/views/pages/home/components/`) while others don't

3. **Unclear Domain Boundaries**: Customer and shop features are mixed in various directories

4. **Duplicate Service Files**: Multiple product services (`product.service.ts`, `product-list.service.ts`, `product-detail.service.ts`) with overlapping responsibilities

5. **Deep Nesting**: Excessive directory depth makes navigation difficult

### Goals

1. Colocate all files related to a feature in one place
2. Establish clear separation between customer and shop domains
3. Maintain Next.js App Router conventions
4. Reduce directory depth where possible
5. Create a predictable, scalable structure

## Architecture

### New Structure Pattern

```
src/
├── app/                          # Next.js App Router (routes only)
│   ├── (customer)/              # Customer-facing routes
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Homepage
│   │   ├── san-pham/            # Products
│   │   ├── gio-hang/            # Cart
│   │   ├── thanh-toan/          # Checkout
│   │   ├── don-hang/            # Orders
│   │   ├── tai-khoan/           # Account
│   │   ├── yeu-thich/           # Wishlist
│   │   └── tim-kiem/            # Search
│   ├── (shop)/                  # Shop management routes
│   │   ├── layout.tsx
│   │   ├── shop/
│   │   │   ├── dashboard/
│   │   │   ├── san-pham/        # Product management
│   │   │   ├── don-hang/        # Order management
│   │   │   └── chien-dich/      # Campaigns
│   ├── (auth)/                  # Auth routes
│   │   ├── dang-ky/
│   │   └── xac-thuc/
│   ├── api/                     # API routes
│   └── shop-view/               # Public shop viewing
├── features/                    # Feature modules (NEW)
│   ├── customer/                # Customer domain
│   │   ├── products/
│   │   │   ├── components/      # Product-specific components
│   │   │   ├── hooks/           # useProducts, useProductDetail
│   │   │   ├── services/        # product.service.ts
│   │   │   ├── types/           # product.types.ts
│   │   │   └── utils/           # product.utils.ts
│   │   ├── cart/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── search/
│   │   ├── reviews/
│   │   └── wishlist/
│   └── shop/                    # Shop domain
│       ├── products/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── services/
│       │   └── types/
│       ├── orders/
│       ├── campaigns/
│       │   ├── vouchers/
│       │   └── promotions/
│       └── dashboard/
├── shared/                      # Shared across domains (NEW)
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── layout/              # Header, Footer, etc.
│   │   ├── forms/               # Form components
│   │   └── feedback/            # Modals, toasts, loading
│   ├── hooks/                   # Shared hooks
│   │   ├── useAuth.ts
│   │   ├── useCategories.ts
│   │   └── useQuickViewModal.ts
│   ├── services/                # Core services
│   │   ├── http/                # Axios clients
│   │   ├── auth/                # Auth service
│   │   ├── cache/               # Cache service
│   │   └── external/            # External APIs
│   ├── types/                   # Shared types
│   │   └── core.types.ts
│   ├── utils/                   # Utility functions
│   │   ├── format.utils.ts
│   │   ├── validation.utils.ts
│   │   └── seo.utils.ts
│   ├── lib/                     # Libraries & configs
│   │   ├── config/              # API, Axios config
│   │   ├── store/               # Redux store
│   │   ├── seo/                 # SEO utilities
│   │   └── validations/         # Zod schemas
│   └── guards/                  # Route guards
│       ├── AuthGuard.tsx
│       ├── ShopGuard.tsx
│       └── PublicGuard.tsx
├── providers/                   # React providers
└── enums/                       # Global enums
```

### Key Principles

1. **Feature-First Organization**: Group by feature, then by type (components, hooks, services)
2. **Domain Separation**: Clear boundaries between customer and shop features
3. **Colocation**: Keep related files together
4. **Shallow Hierarchy**: Minimize directory depth
5. **Explicit Sharing**: Shared code lives in `shared/` directory

## Components and Interfaces

### Feature Module Structure

Each feature module follows this structure:

```
features/[domain]/[feature]/
├── components/              # Feature-specific components
│   ├── FeatureList.tsx
│   ├── FeatureDetail.tsx
│   ├── FeatureForm.tsx
│   └── index.ts            # Barrel export
├── hooks/                   # Feature-specific hooks
│   ├── useFeature.ts
│   ├── useFeatureDetail.ts
│   └── index.ts
├── services/                # API services
│   ├── feature.service.ts
│   └── index.ts
├── types/                   # Type definitions
│   ├── feature.types.ts
│   └── index.ts
├── utils/                   # Feature utilities (optional)
│   └── feature.utils.ts
└── index.ts                 # Main barrel export
```

### Route Organization

Routes in `src/app/` remain thin and only handle:

- Route definitions
- Metadata
- Server-side data fetching
- Rendering feature components

Example:

```typescript
// src/app/(customer)/san-pham/page.tsx
import { ProductList } from "@/features/customer/products";

export default function ProductsPage() {
  return <ProductList />;
}
```

### Import Patterns

```typescript
// Feature imports (preferred)
import { ProductList, useProducts } from "@/features/customer/products";

// Shared imports
import { Button, Card } from "@/shared/components/ui";
import { useAuth } from "@/shared/hooks";
import { formatCurrency } from "@/shared/utils";

// Cross-feature imports (use sparingly)
import { CartButton } from "@/features/customer/cart";
```

## Data Models

### Path Aliases

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/app/*": ["./src/app/*"]
    }
  }
}
```

### Feature Module Exports

Each feature module exports through barrel files:

```typescript
// features/customer/products/index.ts
export * from "./components";
export * from "./hooks";
export * from "./services";
export * from "./types";
export * from "./utils";
```

### Service Layer Organization

Consolidate related services:

**Before:**

- `services/api/users/product.service.ts`
- `services/api/users/product.server.ts`
- `services/api/users/product.server.cached.ts`

**After:**

- `features/customer/products/services/product.service.ts` (all product API calls)
- `features/customer/products/services/product.server.ts` (server-only functions)

## Error Handling

### Migration Error Prevention

1. **Incremental Migration**: Move one feature at a time
2. **Dual Imports**: Temporarily support both old and new paths
3. **Type Checking**: Run TypeScript compiler after each migration step
4. **Build Verification**: Ensure `npm run build` succeeds after each step

### Import Resolution

Use barrel exports to prevent broken imports:

```typescript
// features/customer/products/index.ts
export { ProductList } from "./components/ProductList";
export { useProducts } from "./hooks/useProducts";
```

## Testing Strategy

### Test Colocation

Tests live next to their source files:

```
features/customer/products/
├── components/
│   ├── ProductList.tsx
│   └── ProductList.test.tsx
├── hooks/
│   ├── useProducts.ts
│   └── useProducts.test.ts
└── services/
    ├── product.service.ts
    └── product.service.test.ts
```

### Test Coverage

- Unit tests for services and utilities
- Component tests for UI components
- Integration tests for feature workflows
- Existing tests in `src/lib/seo/__tests__/` remain in place

## Migration Strategy

### Phase 1: Setup New Structure

1. Create `features/` and `shared/` directories
2. Update `tsconfig.json` with new path aliases
3. Create feature module templates

### Phase 2: Migrate Shared Code

1. Move `src/components/ui/` → `shared/components/ui/`
2. Move `src/components/common/` → `shared/components/layout/`
3. Move `src/components/guards/` → `shared/guards/`
4. Move `src/services/core/` → `shared/services/`
5. Move `src/lib/` → `shared/lib/`
6. Move shared hooks → `shared/hooks/`
7. Move `src/utils/` → `shared/utils/`

### Phase 3: Migrate Customer Features

For each feature (products, cart, checkout, orders, search, reviews, wishlist):

1. Create feature directory: `features/customer/[feature]/`
2. Move components from `src/views/pages/[feature]/` → `features/customer/[feature]/components/`
3. Move hooks from `src/hooks/user/` → `features/customer/[feature]/hooks/`
4. Move services from `src/services/api/users/` → `features/customer/[feature]/services/`
5. Move types from `src/types/users/` → `features/customer/[feature]/types/`
6. Create barrel exports (`index.ts`)
7. Update imports in route files
8. Run build and verify

### Phase 4: Migrate Shop Features

For each feature (products, orders, campaigns, dashboard):

1. Create feature directory: `features/shop/[feature]/`
2. Move components from `src/views/pages/shop/` and `src/components/shop/`
3. Move hooks from `src/hooks/shop/`
4. Move services from `src/services/api/shops/`
5. Move types from `src/types/shops/`
6. Create barrel exports
7. Update imports
8. Run build and verify

### Phase 5: Cleanup

1. Remove empty directories
2. Update documentation
3. Remove old path aliases
4. Final build verification

### Migration Order

Recommended order (least to most complex):

1. **Shared code** (no dependencies)
2. **Search** (simple, isolated)
3. **Reviews** (simple, isolated)
4. **Wishlist** (simple, isolated)
5. **Products** (core feature, many dependencies)
6. **Cart** (depends on products)
7. **Checkout** (depends on cart, products)
8. **Orders** (depends on products)
9. **Shop Dashboard** (isolated)
10. **Shop Products** (depends on customer products types)
11. **Shop Orders** (depends on shop products)
12. **Shop Campaigns** (depends on shop products)

## Documentation Updates

### Files to Update

1. `.kiro/steering/structure.md` - New structure documentation
2. `.kiro/steering/tech.md` - Update path aliases
3. `README.md` - Update project structure section
4. Create `MIGRATION.md` - Detailed migration guide

### Developer Guidelines

Create `docs/CONTRIBUTING.md` with:

- Where to place new features
- Naming conventions
- Import patterns
- Testing requirements
- Examples for common scenarios

## Rollback Plan

If migration causes issues:

1. **Git Branches**: Each phase in separate branch
2. **Incremental Commits**: Commit after each feature migration
3. **Revert Strategy**: Can revert individual feature migrations
4. **Dual Support**: Temporarily support both old and new imports using barrel exports

## Benefits

### Before vs After

**Before:**

```
Finding product-related code:
- src/app/san-pham/
- src/views/pages/san-pham/
- src/hooks/user/useProducts.ts
- src/services/api/users/product.service.ts
- src/types/users/product.types.ts
```

**After:**

```
Finding product-related code:
- src/app/(customer)/san-pham/  (route only)
- src/features/customer/products/  (everything else)
```

### Metrics

- **Reduced Navigation**: 50% fewer directory traversals
- **Faster Onboarding**: Clear feature boundaries
- **Better Scalability**: Easy to add new features
- **Improved Maintainability**: Related code together
- **Clearer Dependencies**: Explicit imports between features
