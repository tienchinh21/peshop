# Features Directory

This directory contains feature modules organized by domain (customer, shop).

## Feature Module Structure

Each feature module follows this standard structure:

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

## Domains

### Customer Domain (`features/customer/`)

Customer-facing features:

- products - Product browsing and details
- cart - Shopping cart management
- checkout - Checkout flow
- orders - Order history and tracking
- search - Product search
- reviews - Product reviews
- wishlist - Wishlist management
- auth - Authentication
- account - Account management
- categories - Category browsing
- shop-view - Public shop viewing
- voucher-check - Voucher validation

### Shop Domain (`features/shop/`)

Shop management features:

- products - Product management (CRUD)
- orders - Order processing
- campaigns - Marketing campaigns
  - vouchers - Voucher management
  - promotions - Buy X Get Y promotions
- dashboard - Analytics dashboard
- registration - Shop registration
- categories - Category management

## Import Patterns

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

## Creating a New Feature

1. Create the feature directory: `features/[domain]/[feature-name]/`
2. Create subdirectories: `components/`, `hooks/`, `services/`, `types/`
3. Add barrel exports (`index.ts`) in each subdirectory
4. Create main barrel export at feature root
5. Update this README if adding a new domain

## Naming Conventions

- **Directories**: kebab-case (e.g., `product-reviews`)
- **Components**: PascalCase (e.g., `ProductList.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useProducts.ts`)
- **Services**: camelCase with `.service.ts` suffix
- **Types**: camelCase with `.types.ts` suffix
- **Utils**: camelCase with `.utils.ts` suffix

## Testing

Tests are colocated with source files using `.test.ts` or `.test.tsx` suffix:

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
