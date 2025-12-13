# Implementation Plan

- [x] 1. Create Flash Sale types and interfaces

  - [x] 1.1 Create feature directory structure at `src/features/shop/flash-sale/`

    - Create folders: types, services, hooks, components, utils
    - Create index.ts barrel exports
    - _Requirements: 5.1_

  - [x] 1.2 Create type definitions file at `src/features/shop/flash-sale/types/flash-sale.types.ts`

    - Define FlashSaleStatus enum (NotStarted=0, Active=1, Ended=2)
    - Define ShopFlashSale interface with id, startTime, endTime, status
    - Define FlashSaleProduct interface with id, name, imgMain
    - Define ParticipatedFlashSale interface with flashSale and products
    - Define API response types with error handling
    - _Requirements: 5.1_

- [-] 2. Create Flash Sale utility functions

  - [x] 2.1 Create utility file at `src/features/shop/flash-sale/utils/flash-sale.utils.ts`

    - Implement formatFlashSaleDateTime function (Vietnamese locale dd/MM/yyyy HH:mm)
    - Implement getStatusColor function (gray/green/red based on status)
    - Implement getStatusText function (Chưa bắt đầu/Đang diễn ra/Đã kết thúc)
    - Implement isFlashSaleActive function
    - _Requirements: 1.4, 3.1, 3.2, 3.3_

  - [ ]\* 2.2 Write property test for formatFlashSaleDateTime

    - **Property 1: Date Time Formatting**
    - **Validates: Requirements 3.1**

  - [ ]\* 2.3 Write property test for getStatusColor and getStatusText

    - **Property 2: Status Display Consistency**
    - **Validates: Requirements 1.4, 3.2**

  - [ ]\* 2.4 Write property test for isFlashSaleActive
    - **Property 3: Active Flash Sale Detection**
    - **Validates: Requirements 3.3**

- [x] 3. Create Flash Sale API service

  - [x] 3.1 Create service file at `src/features/shop/flash-sale/services/flash-sale.service.ts`

    - Implement getShopFlashSales function calling `GET /shop/flash-sale` with startDate, endDate params
    - Implement getParticipatedFlashSales function calling `GET /shop/flash-sale/participated`
    - Use axiosJava client from `@/shared/services/http`
    - Handle API response with error field
    - _Requirements: 1.2, 2.1, 5.2, 5.4_

- [x] 4. Create Flash Sale React Query hooks

  - [x] 4.1 Create hooks file at `src/features/shop/flash-sale/hooks/useShopFlashSale.ts`

    - Define shopFlashSaleKeys for cache management
    - Implement useShopFlashSales hook with startDate, endDate params
    - Implement useParticipatedFlashSales hook
    - Configure staleTime and error handling
    - _Requirements: 4.2, 4.3, 5.3, 5.5_

- [ ] 5. Checkpoint - Ensure types, utils, service, and hooks are working

  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Create Flash Sale UI components

  - [x] 6.1 Create FlashSaleCard component at `src/features/shop/flash-sale/components/FlashSaleCard.tsx`

    - Display id, formatted startTime, formatted endTime
    - Show status badge with color coding
    - Highlight active Flash Sales
    - _Requirements: 1.3, 1.4, 3.1, 3.2, 3.3_

  - [x] 6.2 Create FlashSaleProductCard component at `src/features/shop/flash-sale/components/FlashSaleProductCard.tsx`

    - Display product image, name, and id
    - _Requirements: 2.3, 3.4_

  - [x] 6.3 Create DateRangeFilter component at `src/features/shop/flash-sale/components/DateRangeFilter.tsx`

    - Two date inputs for startDate and endDate
    - Submit button to trigger filter
    - Validation for date range
    - _Requirements: 1.1_

  - [x] 6.4 Create FlashSaleSkeleton component at `src/features/shop/flash-sale/components/FlashSaleSkeleton.tsx`

    - Loading skeleton matching Flash Sale list layout
    - _Requirements: 4.1_

  - [x] 6.5 Create FlashSaleEmptyState component at `src/features/shop/flash-sale/components/FlashSaleEmptyState.tsx`

    - Empty state message for no Flash Sales
    - _Requirements: 2.4_

- [x] 7. Create Flash Sale list components

  - [x] 7.1 Create FlashSaleList component at `src/features/shop/flash-sale/components/FlashSaleList.tsx`

    - Use useShopFlashSales hook with date range
    - Display list of FlashSaleCard components
    - Handle loading, error, and empty states
    - _Requirements: 1.2, 1.3, 1.5, 4.1_

  - [x] 7.2 Create ParticipatedFlashSaleList component at `src/features/shop/flash-sale/components/ParticipatedFlashSaleList.tsx`

    - Use useParticipatedFlashSales hook
    - Display Flash Sales with their products
    - Handle loading, error, and empty states
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1_

- [x] 8. Create Flash Sale page

  - [x] 8.1 Create Flash Sale page at `src/app/(shop)/shop/flash-sale/page.tsx`

    - Import and use FlashSaleList and ParticipatedFlashSaleList
    - Add DateRangeFilter for filtering Flash Sales
    - Add tabs or sections for different views
    - _Requirements: 1.1, 2.1_

- [x] 9. Update exports and navigation

  - [x] 9.1 Update feature index.ts exports at `src/features/shop/flash-sale/index.ts`

    - Export all types, services, hooks, and components
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 9.2 Add Flash Sale link to shop sidebar navigation in `src/components/shop/ShopSidebar.tsx`

    - Add "Flash Sale" menu item under "Chiến dịch" section with Zap icon
    - Link to `/shop/flash-sale`
    - _Requirements: 1.1_

- [ ] 10. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
