# Feature Module Template

This is a template for creating new feature modules. Copy this structure when creating a new feature.

## Usage

1. Copy this `_template` directory to your target location:

   - For customer features: `features/customer/[feature-name]/`
   - For shop features: `features/shop/[feature-name]/`

2. Rename files and update content to match your feature

3. Delete this README.md file

## Structure

```
[feature-name]/
├── components/              # Feature-specific React components
│   ├── FeatureList.tsx     # List view component
│   ├── FeatureDetail.tsx   # Detail view component
│   ├── FeatureForm.tsx     # Form component
│   └── index.ts            # Barrel export
├── hooks/                   # Feature-specific custom hooks
│   ├── useFeature.ts       # Main hook for data fetching
│   ├── useFeatureDetail.ts # Hook for detail view
│   └── index.ts            # Barrel export
├── services/                # API service layer
│   ├── feature.service.ts  # API calls
│   └── index.ts            # Barrel export
├── types/                   # TypeScript type definitions
│   ├── feature.types.ts    # Types and interfaces
│   └── index.ts            # Barrel export
├── utils/                   # Feature-specific utilities (optional)
│   ├── feature.utils.ts    # Helper functions
│   └── index.ts            # Barrel export
└── index.ts                 # Main barrel export
```

## Example Feature: Products

If creating a `products` feature:

```
features/customer/products/
├── components/
│   ├── ProductList.tsx
│   ├── ProductDetail.tsx
│   ├── ProductCard.tsx
│   └── index.ts
├── hooks/
│   ├── useProducts.ts
│   ├── useProductDetail.ts
│   └── index.ts
├── services/
│   ├── product.service.ts
│   └── index.ts
├── types/
│   ├── product.types.ts
│   └── index.ts
├── utils/
│   ├── product.utils.ts
│   └── index.ts
└── index.ts
```

## Checklist

- [ ] Create feature directory in appropriate domain (customer/shop)
- [ ] Create subdirectories (components, hooks, services, types, utils if needed)
- [ ] Implement components
- [ ] Implement hooks using TanStack Query
- [ ] Implement service layer with API calls
- [ ] Define TypeScript types
- [ ] Create barrel exports in each subdirectory
- [ ] Create main barrel export at feature root
- [ ] Update route files to import from new feature module
- [ ] Write tests (colocated with source files)
- [ ] Verify build succeeds
