# Shared Directory

This directory contains code shared across multiple features and domains.

## Directory Structure

```
shared/
├── components/              # Reusable UI components
│   ├── ui/                  # shadcn/ui primitives (Button, Input, etc.)
│   ├── layout/              # Layout components (Header, Footer, etc.)
│   └── skeleton/            # Loading skeleton components
├── hooks/                   # Shared hooks
│   ├── useAuth.ts
│   ├── useCategories.ts
│   └── useQuickViewModal.ts
├── services/                # Core services
│   ├── http/                # Axios clients and interceptors
│   ├── auth/                # Authentication service
│   ├── cache/               # Cache service
│   └── external/            # External API integrations
├── types/                   # Shared types
│   └── core.types.ts
├── utils/                   # Utility functions
│   ├── format.utils.ts
│   ├── validation.utils.ts
│   └── seo.utils.ts
├── lib/                     # Libraries & configs
│   ├── config/              # API, Axios config
│   ├── store/               # Redux store
│   ├── seo/                 # SEO utilities
│   └── validations/         # Zod schemas
├── guards/                  # Route guards
│   ├── AuthGuard.tsx
│   ├── ShopGuard.tsx
│   └── PublicGuard.tsx
└── enums/                   # Global enums
```

## When to Use Shared

Code should be placed in `shared/` when:

1. **Used by multiple features** - If 2+ features need the same component/hook/utility
2. **Domain-agnostic** - Not specific to customer or shop domain
3. **Core infrastructure** - HTTP clients, auth, caching, etc.
4. **UI primitives** - Base components like buttons, inputs, modals
5. **Common utilities** - Formatting, validation, date handling

## When NOT to Use Shared

Keep code in feature modules when:

1. **Feature-specific** - Only used by one feature
2. **Domain-specific** - Specific to customer or shop workflows
3. **Business logic** - Feature-specific business rules

## Import Patterns

```typescript
// Shared component imports
import { Button, Card, Input } from "@/shared/components/ui";
import { Header, Footer } from "@/shared/components/layout";
import {
  ProductSkeleton,
  CheckoutSkeleton,
} from "@/shared/components/skeleton";

// Shared hook imports
import { useAuth } from "@/shared/hooks";

// Shared service imports
import { axiosDotnet, axiosJava } from "@/shared/services/http";

// Shared utility imports
import { formatCurrency, formatDate } from "@/shared/utils";

// Shared type imports
import type { ApiResponse, PaginatedResponse } from "@/shared/types";
```

## Barrel Exports

Each subdirectory should have an `index.ts` barrel export:

```typescript
// shared/components/ui/index.ts
export { Button } from "./button";
export { Input } from "./input";
export { Card } from "./card";
// ... etc
```

This allows clean imports:

```typescript
import { Button, Input, Card } from "@/shared/components/ui";
```

## Testing

Tests are colocated with source files:

```
shared/utils/
├── format.utils.ts
└── format.utils.test.ts
```

## Migration Notes

During the refactoring process, code will be migrated to `shared/` from:

- `src/components/ui/` → `shared/components/ui/`
- `src/components/common/` → `shared/components/layout/`
- `src/components/guards/` → `shared/guards/`
- `src/services/core/` → `shared/services/`
- `src/lib/` → `shared/lib/`
- `src/utils/` → `shared/utils/`
- `src/hooks/` (shared ones) → `shared/hooks/`
