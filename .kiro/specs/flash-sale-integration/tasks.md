# Implementation Plan

- [x] 1. Create Flash Sale types and interfaces

  - [x] 1.1 Create type definitions file at `src/features/customer/home/types/flash-sale.types.ts`

    - Define FlashSaleToday interface with flashSaleId, startTime, endTime, status, statusText
    - Define FlashSaleStatus enum (NotStarted=0, Active=1, Ended=2)
    - Define FlashSaleProduct interface matching API response
    - Define FlashSaleProductsResponse interface
    - Define TimeRemaining interface
    - _Requirements: 5.1_

  - [x] 1.2 Update index.ts barrel export for types

    - _Requirements: 5.1_

- [-] 2. Create Flash Sale utility functions

  - [x] 2.1 Create utility file at `src/features/customer/home/utils/flash-sale.utils.ts`

    - Implement findActiveFlashSale function
    - Implement calculateTimeRemaining function
    - Implement formatTimeValue function
    - Implement calculateSoldPercentage function
    - Implement isProductSoldOut function
    - _Requirements: 1.2, 2.1, 2.4, 3.3, 3.4_

  - [ ]\* 2.2 Write property test for findActiveFlashSale
    - **Property 1: Active Flash Sale Filtering**
    - **Validates: Requirements 1.2**
  - [ ]\* 2.3 Write property test for calculateTimeRemaining
    - **Property 2: Countdown Time Calculation**
    - **Validates: Requirements 2.1**
  - [ ]\* 2.4 Write property test for formatTimeValue
    - **Property 3: Time Value Padding**
    - **Validates: Requirements 2.4**
  - [ ]\* 2.5 Write property test for calculateSoldPercentage
    - **Property 4: Progress Bar Calculation**
    - **Validates: Requirements 3.3**
  - [ ]\* 2.6 Write property test for isProductSoldOut
    - **Property 5: Sold Out Detection**
    - **Validates: Requirements 3.4**

- [x] 3. Create Flash Sale API service

  - [x] 3.1 Create service file at `src/features/customer/home/services/flash-sale.service.ts`

    - Implement getFlashSaleToday function calling `/FlashSale/today`
    - Implement getFlashSaleProducts function calling `/FlashSale/get-page`
    - Use axiosDotnet client from shared services
    - _Requirements: 1.1, 1.3, 5.2, 5.4_

  - [x] 3.2 Update index.ts barrel export for services

    - _Requirements: 5.2_

- [x] 4. Create Flash Sale React Query hooks

  - [x] 4.1 Create hooks file at `src/features/customer/home/hooks/useFlashSale.ts`

    - Define flashSaleKeys for cache management
    - Implement useFlashSaleToday hook with staleTime and error handling
    - Implement useFlashSaleProducts hook with enabled flag
    - _Requirements: 4.2, 4.3, 5.3, 5.5_

  - [x] 4.2 Update index.ts barrel export for hooks

    - _Requirements: 5.3_

- [x] 5. Update ProductSaleCard component

  - [x] 5.1 Update ProductSaleCard props interface to match API data structure

    - Change currentPrice/originalPrice to price/priceDiscount
    - Add percentDecrease prop
    - Update quantity props to match API (quantity, usedQuantity)
    - Remove store/storeColor, add shopName
    - Add slug prop for navigation
    - _Requirements: 3.1, 3.2_

  - [x] 5.2 Update ProductSaleCard rendering logic

    - Use priceDiscount and percentDecrease from API
    - Update progress bar to use quantity/usedQuantity
    - Add sold-out indicator when usedQuantity >= quantity
    - Add Link wrapper for navigation using slug
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Update FlashSale component

  - [x] 6.1 Replace mock data with API integration

    - Import and use useFlashSaleToday hook
    - Import and use useFlashSaleProducts hook
    - Use findActiveFlashSale to get active Flash Sale
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 6.2 Update countdown timer logic

    - Use calculateTimeRemaining with endTime from API
    - Use formatTimeValue for display
    - Trigger refetch when countdown reaches zero
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 6.3 Add loading and error states

    - Show FlashSaleSkeleton during loading
    - Hide section when no active Flash Sale or on error
    - _Requirements: 1.4, 1.5, 4.1_

  - [x] 6.4 Update product mapping to use new ProductSaleCard props

    - Map API FlashSaleProduct to ProductSaleCard props
    - _Requirements: 3.1, 3.2_

- [x] 7. Create FlashSaleSkeleton component

  - [x] 7.1 Create skeleton component at `src/features/customer/home/components/FlashSaleSkeleton.tsx`

    - Match FlashSale layout with skeleton placeholders
    - _Requirements: 4.1_

- [x] 8. Cleanup and finalization

- [ ] 8. Cleanup and finalization

  - [ ] 8.1 Remove mock-products.ts file
    - Delete `src/features/customer/home/components/mock-products.ts`
    - _Requirements: 1.1_
  - [ ] 8.2 Update home feature index.ts exports
    - Export new types, services, hooks, and components
    - _Requirements: 5.1, 5.2, 5.3_

-

- [x] 9. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.
