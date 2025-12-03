# Implementation Plan

- [x] 1. Setup new directory structure and configuration

  - Create `src/features/` and `src/shared/` directories
  - Update `tsconfig.json` with new path aliases for `@/features/*` and `@/shared/*`
  - Create feature module templates with standard structure (components, hooks, services, types, utils)
  - _Requirements: 1.1, 1.4, 2.1, 5.5_

- [x] 2. Migrate shared UI components

  - Move `src/components/ui/` to `src/shared/components/ui/`
  - Move `src/components/common/` to `src/shared/components/layout/`
  - Move `src/components/skeleton/` to `src/shared/components/skeleton/`
  - Create barrel exports (`index.ts`) for each shared component directory
  - Update all imports across the codebase to use new paths
  - _Requirements: 1.3, 2.1, 4.1_

- [x] 3. Migrate shared services and utilities

  - Move `src/services/core/` to `src/shared/services/`
  - Move `src/lib/` to `src/shared/lib/`
  - Move `src/utils/` to `src/shared/utils/`
  - Move `src/components/guards/` to `src/shared/guards/`
  - Update imports in all files that reference these services
  - _Requirements: 1.3, 2.1, 4.2_

- [x] 4. Migrate shared hooks and types

  - Move shared hooks (`useAuth`, `useCategories`, `useQuickViewModal`, etc.) to `src/shared/hooks/`
  - Move `src/types/core.types.ts` to `src/shared/types/`
  - Move `src/enums/` to `src/shared/enums/`
  - Create barrel exports for shared hooks
  - Update all imports
  - _Requirements: 1.3, 4.1, 4.4_

- [x] 5. Migrate customer search feature

  - Create `src/features/customer/search/` directory structure
  - Move search components from `src/views/pages/tim-kiem/` to `features/customer/search/components/`
  - Move `src/hooks/user/useSearch.ts` to `features/customer/search/hooks/`
  - Move `src/services/api/users/search.service.ts` to `features/customer/search/services/`
  - Move `src/types/users/search.types.ts` to `features/customer/search/types/`
  - Create barrel exports (`index.ts`)
  - Update route file `src/app/tim-kiem/page.tsx` to import from new location
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.2, 6.4_

- [x] 6. Migrate customer reviews feature

  - Create `src/features/customer/reviews/` directory structure
  - Move `src/hooks/user/useProductReviews.ts` to `features/customer/reviews/hooks/`
  - Move `src/services/api/users/review.service.ts` to `features/customer/reviews/services/`
  - Move `src/types/users/review.types.ts` to `features/customer/reviews/types/`
  - Create barrel exports
  - Update all imports
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.2, 6.4_

- [x] 7. Migrate customer wishlist feature

  - Create `src/features/customer/wishlist/` directory structure
  - Move wishlist components from `src/views/pages/yeu-thich/` to `features/customer/wishlist/components/`
  - Move wishlist-related hooks to `features/customer/wishlist/hooks/`
  - Move wishlist services to `features/customer/wishlist/services/`
  - Move wishlist types to `features/customer/wishlist/types/`
  - Create barrel exports
  - Update route file `src/app/(protected)/yeu-thich/page.tsx`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.2, 6.4_

- [x] 8. Migrate customer products feature

  - Create `src/features/customer/products/` directory structure
  - Move product components from `src/views/pages/san-pham/` to `features/customer/products/components/`
  - Move `src/hooks/user/useProducts.ts` and `src/hooks/user/useSimilarProducts.ts` to `features/customer/products/hooks/`
  - Consolidate product services: merge `product.service.ts`, `product.server.ts`, `product.server.cached.ts` into `features/customer/products/services/`
  - Move `src/types/users/product.types.ts` to `features/customer/products/types/`
  - Move `src/lib/utils/product.utils.ts` to `features/customer/products/utils/`
  - Create barrel exports
  - Update route files in `src/app/san-pham/`
  - Update home page imports
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 4.2, 6.2, 6.4_

- [x] 9. Migrate customer cart feature

  - Create `src/features/customer/cart/` directory structure
  - Move cart components from `src/views/pages/gio-hang/` to `features/customer/cart/components/`
  - Move `src/hooks/user/useCart.ts` to `features/customer/cart/hooks/`
  - Move `src/services/api/users/cart.service.ts` to `features/customer/cart/services/`
  - Move `src/types/users/cart.types.ts` to `features/customer/cart/types/`
  - Create barrel exports
  - Update route file `src/app/(protected)/gio-hang/page.tsx`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.2, 6.4_

- [x] 10. Migrate customer checkout feature

  - Create `src/features/customer/checkout/` directory structure
  - Move checkout components from `src/views/pages/thanh-toan/` to `features/customer/checkout/components/`
  - Move `src/hooks/user/useCheckout.ts` and `src/hooks/user/useAddress.ts` to `features/customer/checkout/hooks/`
  - Move address services from `src/services/api/users/address.service.ts` to `features/customer/checkout/services/`
  - Move `src/types/users/address.types.ts` to `features/customer/checkout/types/`
  - Create barrel exports
  - Update route file `src/app/(protected)/thanh-toan/page.tsx`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.2, 6.4_

- [x] 11. Migrate customer orders feature

  - Create `src/features/customer/orders/` directory structure
  - Move order components from `src/views/pages/` to `features/customer/orders/components/`
  - Move order hooks to `features/customer/orders/hooks/`
  - Move `src/services/api/users/order.service.ts` to `features/customer/orders/services/`
  - Move `src/types/users/order.types.ts` to `features/customer/orders/types/`
  - Move `src/helpers/order.helpers.ts` to `features/customer/orders/utils/`
  - Create barrel exports
  - Update route file `src/app/(protected)/don-hang/page.tsx`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 4.2, 6.2, 6.4_

- [x] 12. Migrate customer home feature

  - Create `src/features/customer/home/` directory structure
  - Move home components from `src/views/pages/home/` to `features/customer/home/components/`
  - Move home-specific hooks to `features/customer/home/hooks/` if any
  - Create barrel exports
  - Update route file `src/app/page.tsx`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.2, 6.4_

- [x] 13. Migrate customer account feature

  - Create `src/features/customer/account/` directory structure
  - Move account components to `features/customer/account/components/`
  - Move account hooks to `features/customer/account/hooks/`
  - Move account services to `features/customer/account/services/`
  - Move account types to `features/customer/account/types/`
  - Create barrel exports
  - Update route file `src/app/(protected)/tai-khoan/page.tsx`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.2, 6.4_

- [x] 14. Migrate customer auth feature

  - Create `src/features/customer/auth/` directory structure
  - Move auth components from `src/components/auth/` and `src/views/pages/xac-thuc/` to `features/customer/auth/components/`
  - Move `src/services/api/users/auth.service.ts` to `features/customer/auth/services/`
  - Move `src/types/users/auth.types.ts` to `features/customer/auth/types/`
  - Move `src/lib/validations/auth.schemas.ts` to `features/customer/auth/utils/`
  - Create barrel exports
  - Update route files in `src/app/(public)/`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.2, 6.4_

- [x] 15. Migrate shop dashboard feature

  - Create `src/features/shop/dashboard/` directory structure
  - Move dashboard components from `src/views/pages/shop/dashboard/` to `features/shop/dashboard/components/`
  - Move dashboard hooks to `features/shop/dashboard/hooks/`
  - Move `src/services/api/shops/dashboard.service.ts` to `features/shop/dashboard/services/`
  - Move `src/types/shops/dashboard.type.ts` to `features/shop/dashboard/types/`
  - Create barrel exports
  - Update route file `src/app/(protected)/shop/dashboard/page.tsx`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.2, 6.2, 6.4_

- [x] 16. Migrate shop products feature

  - Create `src/features/shop/products/` directory structure
  - Move shop product components from `src/views/pages/shop/san-pham/` and `src/components/shop/` to `features/shop/products/components/`
  - Move `src/hooks/shop/useShopProducts.ts` and `src/hooks/shop/useShopProductDetail.ts` to `features/shop/products/hooks/`
  - Consolidate shop product services: merge `product.service.ts`, `product-list.service.ts`, `product-detail.service.ts` into `features/shop/products/services/`
  - Move shop product types from `src/types/shops/` to `features/shop/products/types/`
  - Create barrel exports
  - Update route files in `src/app/(protected)/shop/san-pham/`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.2, 4.2, 6.2, 6.4_

- [x] 17. Migrate shop orders feature

  - Create `src/features/shop/orders/` directory structure
  - Move shop order components from `src/views/pages/shop/orders/` and `src/components/shop/table/orderTable/` to `features/shop/orders/components/`
  - Move `src/hooks/shop/useShopOrders.ts` to `features/shop/orders/hooks/`
  - Move `src/services/api/shops/order.service.ts` to `features/shop/orders/services/`
  - Move `src/types/shops/order.type.ts` to `features/shop/orders/types/`
  - Create barrel exports
  - Update route files in `src/app/(protected)/shop/don-hang/`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.2, 6.2, 6.4_

- [x] 18. Migrate shop campaigns - vouchers

  - Create `src/features/shop/campaigns/vouchers/` directory structure
  - Move voucher components from `src/views/pages/shop/chien-dich/voucher/` and `src/components/shop/` to `features/shop/campaigns/vouchers/components/`
  - Move `src/hooks/shop/useShopVouchers.ts` and `src/hooks/shop/useVoucherDashboard.ts` to `features/shop/campaigns/vouchers/hooks/`
  - Move voucher services from `src/services/api/shops/` to `features/shop/campaigns/vouchers/services/`
  - Move voucher types from `src/types/shops/` to `features/shop/campaigns/vouchers/types/`
  - Create barrel exports
  - Update route files in `src/app/(protected)/shop/chien-dich/ma-giam-gia/`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.2, 6.2, 6.4_

-

- [x] 19. Migrate shop campaigns - promotions

  - Create `src/features/shop/campaigns/promotions/` directory structure
  - Move promotion components from `src/views/pages/shop/chien-dich/muaXtangY/` and `src/components/shop/` to `features/shop/campaigns/promotions/components/`
  - Move `src/hooks/shop/useShopPromotions.ts` to `features/shop/campaigns/promotions/hooks/`
  - Move `src/services/api/shops/promotion.service.ts` to `features/shop/campaigns/promotions/services/`
  - Move `src/types/shops/promotion.type.ts` to `features/shop/campaigns/promotions/types/`
  - Create barrel exports
  - Update route files in `src/app/(protected)/shop/chien-dich/muaXtangY/`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.2, 6.2, 6.4_

- [x] 20. Migrate shop registration feature

  - Create `src/features/shop/registration/` directory structure
  - Move registration components from `src/views/pages/shop/dang-ky/` to `features/shop/registration/components/`
  - Move registration hooks to `features/shop/registration/hooks/`
  - Move `src/services/api/shops/shop.service.ts` to `features/shop/registration/services/`
  - Move `src/types/shops/shop.types.ts` to `features/shop/registration/types/`
  - Create barrel exports
  - Update route file `src/app/(protected)/shop/dang-ky/page.tsx`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.2, 6.2, 6.4_

- [x] 21. Migrate shop categories feature

  - Create `src/features/shop/categories/` directory structure
  - Move category services from `src/services/api/shops/category.service.ts` to `features/shop/categories/services/`
  - Move `src/types/shops/category.type.ts` to `features/shop/categories/types/`
  - Move category hooks to `features/shop/categories/hooks/`
  - Create barrel exports
  - Update all imports
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.2, 6.2, 6.4_

- [x] 22. Migrate customer categories feature

  - Create `src/features/customer/categories/` directory structure
  - Move `src/hooks/user/useCategories.ts` to `features/customer/categories/hooks/`
  - Move `src/services/api/users/category.service.ts` to `features/customer/categories/services/`
  - Move category types to `features/customer/categories/types/`
  - Create barrel exports
  - Update all imports
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.2, 6.4_

- [x] 23. Migrate shop view feature

  - Create `src/features/customer/shop-view/` directory structure
  - Move shop view components to `features/customer/shop-view/components/`
  - Move `src/services/api/users/get-shop.service.ts` and `src/services/api/users/get-shop.server.ts` to `features/customer/shop-view/services/`
  - Move `src/types/users/get-shop.types.ts` to `features/customer/shop-view/types/`
  - Create barrel exports
  - Update route files in `src/app/shop-view/`
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.2, 6.4_

- [x] 24. Migrate voucher check feature

  - Create `src/features/customer/voucher-check/` directory structure
  - Move `src/services/api/users/voucher-check.service.ts` to `features/customer/voucher-check/services/`
  - Move `src/types/users/voucher-check.types.ts` to `features/customer/voucher-check/types/`
  - Create barrel exports
  - Update all imports
  - Verify build succeeds
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.2, 6.4_

- [x] 25. Update route groups for better organization

  - Rename `src/app/(protected)/` to `src/app/(customer)/` for customer routes
  - Create `src/app/(shop)/` for shop management routes
  - Move shop routes from `src/app/(protected)/shop/` to `src/app/(shop)/shop/`
  - Create `src/app/(auth)/` for authentication routes
  - Move auth routes from `src/app/(public)/` to `src/app/(auth)/`
  - Update layouts for each route group
  - Verify all routes work correctly
  - _Requirements: 2.1, 3.1, 3.2, 5.1, 6.2, 6.4_

- [x] 26. Cleanup and remove old directories

  - Remove empty `src/views/` directory
  - Remove empty `src/components/auth/`, `src/components/shop/`, `src/components/common/` directories
  - Remove empty `src/hooks/user/` and `src/hooks/shop/` directories
  - Remove empty `src/services/api/users/` and `src/services/api/shops/` directories
  - Remove empty `src/types/users/` and `src/types/shops/` directories
  - Remove old `src/lib/`, `src/utils/`, `src/helpers/` directories
  - Verify no broken imports remain
  - _Requirements: 6.3, 6.4_

- [ ] 27. Update documentation

  - Update `.kiro/steering/structure.md` with new directory structure
  - Update `.kiro/steering/tech.md` with new path aliases
  - Create `docs/ARCHITECTURE.md` explaining feature-based architecture
  - Create `docs/CONTRIBUTING.md` with guidelines for adding new features
  - Update `README.md` with new project structure overview
  - Add examples for common development scenarios
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 28. Final verification and testing
  - Run `npm run build` to ensure production build succeeds
  - Run `npm run dev` to verify development server starts
  - Test key user flows: browse products, add to cart, checkout
  - Test key shop flows: create product, manage orders, create campaigns
  - Verify all routes are accessible
  - Check for any console errors or warnings
  - Ensure all tests pass
  - _Requirements: 6.4_
