# Project Structure

## Architecture Pattern

<<<<<<< Updated upstream
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
=======
This is a Next.js App Router project following a feature-based architecture with clear separation of concerns.

## Route Organization

Routes use Next.js 15 App Router with route groups:

- `src/app/(public)/` - Public routes (registration, authentication)
- `src/app/(protected)/` - Protected routes requiring authentication (cart, checkout, account, orders, shop management)
- `src/app/san-pham/` - Public product pages
- `src/app/shop-view/` - Public shop viewing pages
- `src/app/api/` - API routes

Route groups use Vietnamese naming (e.g., `/gio-hang` for cart, `/thanh-toan` for checkout, `/san-pham` for products).

## Core Directories

### `/src/app`

Next.js App Router pages and layouts. Uses route groups for access control.

### `/src/components`

Reusable UI components organized by purpose:

- `ui/` - Base shadcn/ui components (buttons, inputs, dialogs, etc.)
- `common/` - Shared components (Header, Footer, ProductList, SearchBar, modals)
- `shop/` - Shop management components (tables, filters, forms)
- `guards/` - Route protection components (AuthGuard, PublicGuard, ShopGuard)
- `skeleton/` - Loading skeleton components
- `chat/` - Chat widget components

### `/src/views/pages`

Page-level view components that compose smaller components. Mirrors the route structure:

- `home/` - Homepage components
- `san-pham/` - Product listing and detail views
- `shop/` - Shop management views (dashboard, products, orders, campaigns)
- `thanh-toan/` - Checkout flow components
- `gio-hang/` - Cart page components

### `/src/services`

API integration layer with clear separation:

- `core/` - Core services (HTTP clients, auth, cache, external APIs)
  - `http/` - Axios client configuration and interceptors
  - `auth/` - Token management
  - `cache/` - Caching utilities
  - `external/` - Third-party API integrations
- `api/shops/` - Shop-related API calls
- `api/users/` - User-related API calls

### `/src/hooks`

Custom React hooks for business logic:

- `shop/` - Shop management hooks (orders, products, promotions, vouchers)
- `user/` - User-facing hooks (cart, checkout, products, search, reviews)
- Root level hooks for shared functionality (auth, categories, modals)

### `/src/lib`

Utility libraries and configurations:

- `config/` - API and Axios configuration
- `store/` - Redux store setup and slices
- `utils/` - Helper functions (cookies, JWT, formatting, SEO)
- `validations/` - Zod schemas for form validation
- `seo/` - SEO utilities (metadata, structured data)

### `/src/types`

TypeScript type definitions organized by domain:

- `shops/` - Shop-related types
- `users/` - User-related types
- `core.types.ts` - Shared core types

### `/src/providers`

React context providers:

- `AppProvider` - Root provider composing Redux, React Query, and Layout providers
- `ReduxProvider` - Redux store provider
- `QueryProvider` - TanStack Query provider
- `LayoutProvider` - Layout-specific context

### `/src/enums`

Enum definitions for orders, payments, etc.

### `/src/helpers`

Helper functions for specific domains (e.g., order helpers)

## Naming Conventions

- **Files**: PascalCase for components (`ProductCard.tsx`), camelCase for utilities (`format.utils.ts`)
- **Folders**: kebab-case for routes, camelCase for feature folders
- **Components**: PascalCase with descriptive names
- **Hooks**: camelCase starting with `use` prefix
- **Types**: PascalCase with descriptive suffixes (`.types.ts`, `.type.ts`)
- **Services**: camelCase with `.service.ts` suffix

## Key Patterns

1. **Server/Client Separation**: Server components for data fetching, client components for interactivity
2. **Guard Components**: Route protection via layout-level guards
3. **Service Layer**: All API calls go through service layer, never direct axios calls in components
4. **Custom Hooks**: Business logic extracted into reusable hooks
5. **Type Safety**: Comprehensive TypeScript types for all API responses and component props
6. **Component Composition**: Large pages composed from smaller, focused components
>>>>>>> Stashed changes
