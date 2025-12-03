# Project Structure

## Architecture Pattern

**Feature-based architecture** with clear separation between presentation, business logic, and data layers.

## Directory Organization

```
src/
├── app/                    # Next.js App Router (routes)
│   ├── (auth)/            # Authentication routes (login, register)
│   │   ├── dang-ky/       # Registration
│   │   └── xac-thuc/      # Login
│   ├── (customer)/        # Customer auth-required routes
│   │   ├── gio-hang/      # Cart
│   │   ├── thanh-toan/    # Checkout
│   │   ├── don-hang/      # Orders
│   │   ├── tai-khoan/     # Account
│   │   └── yeu-thich/     # Wishlist
│   ├── (shop)/            # Shop management routes
│   │   └── shop/          # Shop management
│   │       ├── dang-ky/   # Shop registration
│   │       ├── dashboard/ # Shop dashboard
│   │       ├── san-pham/  # Product management
│   │       ├── don-hang/  # Order management
│   │       └── chien-dich/# Campaigns (vouchers, promotions)
│   ├── san-pham/          # Public products listing & detail
│   ├── tim-kiem/          # Public search
│   ├── shop-view/         # Public shop viewing
│   └── api/               # API routes
├── features/              # Feature modules (domain-driven)
│   ├── customer/          # Customer domain features
│   │   ├── products/      # Product browsing
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Checkout flow
│   │   ├── orders/        # Order history
│   │   ├── wishlist/      # Wishlist
│   │   ├── search/        # Search functionality
│   │   ├── reviews/       # Product reviews
│   │   ├── auth/          # Authentication
│   │   ├── account/       # Account management
│   │   ├── home/          # Homepage
│   │   ├── categories/    # Categories
│   │   ├── shop-view/     # Shop viewing
│   │   └── voucher-check/ # Voucher validation
│   └── shop/              # Shop management features
│       ├── products/      # Product management
│       ├── orders/        # Order management
│       ├── dashboard/     # Dashboard analytics
│       ├── registration/  # Shop registration
│       ├── categories/    # Category management
│       └── campaigns/     # Marketing campaigns
│           ├── vouchers/  # Voucher management
│           └── promotions/# Promotion management
├── shared/                # Shared across all features
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui primitives
│   │   ├── layout/       # Layout components (Header, Footer, etc.)
│   │   └── skeleton/     # Loading skeletons
│   ├── hooks/            # Shared hooks (useAuth, useCategories, etc.)
│   ├── services/         # Core services
│   │   ├── http/         # Axios clients & interceptors
│   │   ├── auth/         # Token management
│   │   ├── cache/        # Cache service
│   │   └── external/     # External APIs (GoShip)
│   ├── guards/           # Route guards (AuthGuard, ShopGuard, PublicGuard)
│   ├── types/            # Shared types
│   ├── utils/            # Utility functions
│   ├── enums/            # Shared enums
│   └── lib/              # Libraries & configs
│       ├── config/       # API configuration
│       ├── store/        # Redux store
│       ├── seo/          # SEO utilities
│       └── validations/  # Zod schemas
├── providers/            # React context providers
├── components/           # Legacy components (being migrated)
│   └── shop/             # Shop-specific components
├── lib/                  # Legacy lib (being migrated)
└── services/             # Legacy services (being migrated)
```

## Key Conventions

### Routing

- **Route Groups**:
  - `(auth)` for authentication pages (login, register) - redirects to home if logged in
  - `(customer)` for customer auth-required routes (cart, checkout, orders, etc.)
  - `(shop)` for shop management routes - requires shop owner role
- **Dynamic Routes**: `[slug]` for product details, `[id]` for shop resources
- **Vietnamese Paths**: `/san-pham` (products), `/gio-hang` (cart), `/thanh-toan` (checkout)

### Feature Module Structure

Each feature module follows this structure:

```
features/[domain]/[feature]/
├── components/           # Feature-specific components
├── hooks/               # Feature-specific hooks
├── services/            # API services
├── types/               # Type definitions
├── utils/               # Feature utilities (optional)
└── index.ts             # Barrel export
```

### Import Patterns

```typescript
// Feature imports (preferred)
import { ProductList, useProducts } from "@/features/customer/products";

// Shared imports
import { Button, Card } from "@/shared/components/ui";
import { useAuth } from "@/shared/hooks";
import { formatCurrency } from "@/shared/utils";
```

### Data Layer

- **Services**: API calls in `features/[domain]/[feature]/services/`
- **Hooks**: React Query hooks in `features/[domain]/[feature]/hooks/`
- **Types**: TypeScript interfaces in `features/[domain]/[feature]/types/`
- **Pattern**: Service → Hook → Component

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Components**: Descriptive names (e.g., `ProductDetailPage`, `VoucherForm`)
- **Hooks**: Prefix with `use` (e.g., `useProducts`, `useAuth`)
- **Services**: Suffix with `.service.ts`
- **Types**: Suffix with `.types.ts`

### State Management

- **Server State**: TanStack Query (products, orders, etc.)
- **Global State**: Redux (auth only)
- **Local State**: React useState/useReducer
- **Form State**: Controlled components with Zod validation

### API Integration

- **Dual Clients**: `axiosDotnet` and `axiosJava` from `shared/services/http/`
- **Interceptors**: Token injection, error handling in `shared/services/http/`
- **Endpoints**: Centralized in `shared/lib/config/`

### Authentication

- **Middleware**: Token-based auth check in `middleware.ts`
- **Guards**: `AuthGuard`, `ShopGuard`, `PublicGuard` in `shared/guards/`
- **Token Storage**: HTTP-only cookies via `shared/services/auth/`

### Styling

- **Utility-First**: Tailwind CSS with `cn()` helper for class merging
- **Theme**: CSS variables for colors, dark mode support
- **Components**: shadcn/ui with customization via `components.json`

### Performance

- **Server Components**: Default for pages, use `"use client"` only when needed
- **ISR**: `revalidate` export for static regeneration
- **Caching**: React Query with staleTime/gcTime configuration
- **Prefetching**: `usePrefetchProduct` for optimistic loading
