# Implementation Plan

- [x] 1. Set up feature structure and types

  - [x] 1.1 Create feature directory structure for shop reviews

    - Create `src/features/shop/reviews/` with subdirectories: components, hooks, services, types, utils
    - Create barrel export file `index.ts`
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Define TypeScript types for reviews

    - Create `review.types.ts` with Review, ReviewUser, ReviewVariant, PageInfo, ReviewResponse, ReviewFilterParams interfaces
    - _Requirements: 1.2_

- [x] 2. Implement service layer

  - [x] 2.1 Create review service with API integration

    - Implement `getReviews` function in `review.service.ts`
    - Build Spring Filter query string from filter params
    - Handle pagination, sorting, and filtering parameters
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

  - [x] 2.2 Create filter building utility

    - Implement `buildReviewFilter` function in `review.utils.ts`
    - Support rating filter with exact match syntax
    - Support search filter with case-insensitive matching on content and user.name
    - _Requirements: 2.1, 3.1_

  - [ ]\* 2.3 Write property test for filter building
    - **Property 6: Filter URL round-trip**
    - **Validates: Requirements 2.2, 2.3, 4.3, 5.4**

- [x] 3. Implement hooks

  - [x] 3.1 Create useShopReviews hook

    - Implement React Query hook for fetching reviews
    - Configure staleTime and gcTime for caching
    - Define query keys for cache invalidation
    - _Requirements: 1.1, 1.4_

  - [x] 3.2 Create useReviewFilters hook

    - Implement filter state management with URL synchronization
    - Support rating, search, sort, and page filters
    - Implement debounced search (300ms)
    - _Requirements: 2.2, 3.2, 4.3, 5.4_

- [ ] 4. Checkpoint - Ensure service and hooks work correctly

  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement table components

  - [x] 5.1 Create ReviewTableRow component

    - Display rating with star icons
    - Show customer name and avatar
    - Display review content and attached image
    - Show variant information (name, price, image)
    - Format and display creation timestamp
    - _Requirements: 1.2_

  - [ ]\* 5.2 Write property test for review data completeness
    - **Property 1: Review data completeness**
    - **Validates: Requirements 1.2**
  - [x] 5.3 Create ReviewTableEmpty component

    - Display appropriate empty state message
    - _Requirements: 1.3_

  - [x] 5.4 Create ReviewTableLoading component

    - Display skeleton rows during loading
    - Accept configurable row count
    - _Requirements: 1.4_

  - [x] 5.5 Create ReviewsTable component

    - Compose table with header, body, empty, and loading states
    - Handle conditional rendering based on loading and data state
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 6. Implement filter and pagination components

  - [x] 6.1 Create ReviewsFilter component

    - Implement rating filter dropdown (All, 1-5 stars)
    - Implement search input with debounce
    - Implement sort dropdown (newest, oldest, highest rating, lowest rating)
    - _Requirements: 2.1, 3.1, 4.1, 4.2_

  - [ ]\* 6.2 Write property test for rating filter
    - **Property 2: Rating filter correctness**
    - **Validates: Requirements 2.1**
  - [ ]\* 6.3 Write property test for search filter
    - **Property 3: Search filter correctness**
    - **Validates: Requirements 3.1**
  - [ ]\* 6.4 Write property test for sort order
    - **Property 4: Sort order correctness**
    - **Validates: Requirements 4.1, 4.2**
  - [x] 6.5 Create ReviewsPagination component

    - Display page numbers and navigation controls
    - Support page size selection
    - _Requirements: 5.1, 5.2_

  - [ ]\* 6.6 Write property test for pagination visibility
    - **Property 8: Pagination visibility**
    - **Validates: Requirements 5.1**
  - [ ]\* 6.7 Write property test for pagination state preservation
    - **Property 5: Pagination state preservation**
    - **Validates: Requirements 5.3**

- [x] 7. Implement header and statistics

  - [x] 7.1 Create ReviewsHeader component

    - Display page title "Đánh giá"
    - Show total review count
    - Show average rating with star visualization
    - Handle loading state
    - _Requirements: 6.1, 6.2_

  - [ ]\* 7.2 Write property test for statistics calculation
    - **Property 7: Statistics calculation correctness**
    - **Validates: Requirements 6.1, 6.2**

- [x] 8. Implement main page

  - [x] 8.1 Create ReviewsPage container component

    - Compose all sub-components (Header, Filter, Table, Pagination)
    - Connect hooks for data fetching and filter management
    - Handle loading and error states
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 3.1, 4.1, 5.1, 6.1_

  - [x] 8.2 Create Next.js page route

    - Create `src/app/(shop)/shop/danh-gia/page.tsx`
    - Import and render ReviewsPage component
    - _Requirements: 1.1_

- [ ] 9. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
