# Project Structure

## Architecture Pattern

**Feature-based architecture** with clear separation between presentation, business logic, and data layers.

## Directory Organization

```
src/
├── app/                    # Next.js App Router (routes)
│   ├── (protected)/       # Auth-required routes
│   │   ├── gio-hang/      # Cart
│   │   ├── thanh-toan/    # Checkout
│   │   ├── don-hang/      # Orders
│   │   ├── tai-khoan/     # Account
│   │   ├── yeu-thich/     # Wishlist
│   │   └── shop/          # Shop management
│   ├── (public)/          # Public routes
│   │   ├── dang-ky/       # Registration
│   │   └── xac-thuc/      # Authentication
│   ├── san-pham/          # Products listing & detail
│   ├── tim-kiem/          # Search
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── common/           # Shared components
│   ├── shop/             # Shop-specific components
│   ├── skeleton/         # Loading skeletons
│   ├── guards/           # Route guards (AuthGuard, ShopGuard)
│   └── chat/             # Chat widget
├── views/                # Page-level components
│   └── pages/            # Feature pages (HomePage, ProductDetailPage, etc.)
├── hooks/                # Custom React hooks
│   ├── user/             # Customer hooks
│   └── shop/             # Shop management hooks
├── services/             # API & core services
│   ├── api/              # API service layer
│   │   ├── users/        # Customer APIs
│   │   └── shops/        # Shop APIs
│   └── core/             # Core services
│       ├── http/         # Axios clients & interceptors
│       ├── auth/         # Token management
│       ├── cache/        # Cache service
│       └── external/     # External APIs (GoShip)
├── types/                # TypeScript types
│   ├── users/            # Customer types
│   └── shops/            # Shop types
├── lib/                  # Utilities & configuration
│   ├── config/           # API & Axios config
│   ├── store/            # Redux store & slices
│   ├── utils/            # Utility functions
│   ├── validations/      # Zod schemas
│   └── seo/              # SEO utilities
├── providers/            # React context providers
├── enums/                # Enums (order, payment)
├── helpers/              # Helper functions
└── utils/                # Additional utilities
```

## Key Conventions

### Routing

- **Route Groups**: `(protected)` for auth-required, `(public)` for public routes
- **Dynamic Routes**: `[slug]` for product details, `[id]` for shop resources
- **Vietnamese Paths**: `/san-pham` (products), `/gio-hang` (cart), `/thanh-toan` (checkout)

### Component Organization

- **Page Components**: Located in `views/pages/[feature]/`
- **Reusable Components**: Located in `components/common/`
- **UI Primitives**: Located in `components/ui/` (shadcn/ui)
- **Feature Components**: Co-located with pages in `views/pages/[feature]/components/`

### Data Layer

- **Services**: API calls in `services/api/[users|shops]/`
- **Hooks**: React Query hooks in `hooks/[user|shop]/`
- **Types**: TypeScript interfaces in `types/[users|shops]/`
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

- **Dual Clients**: `axiosDotnet` and `axiosJava` from `lib/config/axios.config.ts`
- **Interceptors**: Token injection, error handling in `services/core/http/`
- **Endpoints**: Centralized in `lib/config/api.config.ts`

### Authentication

- **Middleware**: Token-based auth check in `middleware.ts`
- **Guards**: `AuthGuard`, `ShopGuard` components for route protection
- **Token Storage**: HTTP-only cookies via `cookies.utils.ts`

### Styling

- **Utility-First**: Tailwind CSS with `cn()` helper for class merging
- **Theme**: CSS variables for colors, dark mode support
- **Components**: shadcn/ui with customization via `components.json`

### Performance

- **Server Components**: Default for pages, use `"use client"` only when needed
- **ISR**: `revalidate` export for static regeneration
- **Caching**: React Query with staleTime/gcTime configuration
- **Prefetching**: `usePrefetchProduct` for optimistic loading
