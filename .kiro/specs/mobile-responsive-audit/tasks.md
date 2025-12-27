# Implementation Plan: Mobile Responsive Audit

## Overview

Kế hoạch triển khai sửa lỗi responsive design cho các trang customer của PeShop, tập trung vào Product Detail Page (đã được báo lỗi) và các trang khác.

## Tasks

- [x] 1. Fix Product Detail Page Responsive Issues

  - [x] 1.1 Fix ProductDetailClient grid layout for mobile

    - Update grid classes to `grid-cols-1 lg:grid-cols-12`
    - Ensure single column layout on mobile (< 768px)
    - _Requirements: 1.1_

  - [x] 1.2 Fix ProductImageGallery thumbnails for mobile

    - Change thumbnail container from `grid grid-cols-7` to flex with horizontal scroll on mobile
    - Add `flex gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-7 lg:overflow-visible`
    - Set fixed width for thumbnails on mobile: `flex-shrink-0 w-14 h-14`
    - _Requirements: 1.2, 2.2_

  - [x] 1.3 Fix ProductInfoSection action buttons for mobile

    - Change button container from `flex gap-3` to `flex flex-col gap-3 sm:flex-row`
    - Add `min-h-[44px]` to all action buttons for touch targets
    - Ensure heart button has `h-11 w-11` minimum size
    - _Requirements: 1.5, 1.4_

  - [x] 1.4 Fix ProductInfoSection quantity controls for mobile

    - Update quantity buttons from `h-10 w-10` to `h-11 w-11 min-h-[44px] min-w-[44px]`
    - _Requirements: 1.4_

  - [x] 1.5 Fix ProductInfoSection variant buttons for mobile

    - Add `min-h-[44px] min-w-[44px]` to variant selection buttons
    - Ensure flex-wrap is applied for multiple rows
    - _Requirements: 1.3_

  - [x] 1.6 Fix ProductInfoSection ratings display for mobile

    - Add `flex-wrap` to ratings container
    - Ensure items wrap properly on narrow screens
    - _Requirements: 1.6_

  - [ ]\* 1.7 Write unit tests for ProductDetailClient responsive layout
    - Test grid classes are correct
    - Test single column on mobile viewport
    - _Requirements: 1.1_

- [ ] 2. Checkpoint - Verify Product Detail Page

  - Ensure all Product Detail Page changes work correctly
  - Test on mobile viewport (375px, 414px)
  - Ask user if questions arise

- [x] 3. Fix ProductTabs Responsive

  - [x] 3.1 Update ProductTabs for horizontal scroll on mobile
    - Add `overflow-x-auto` to tabs container
    - Ensure tabs don't wrap but scroll horizontally
    - _Requirements: 1.7_

- [x] 4. Audit and Fix Cart Page Responsive

  - [x] 4.1 Verify CartPage single column layout on mobile

    - Check existing responsive classes
    - Fix if needed to ensure single column on mobile
    - _Requirements: 3.1_

  - [x] 4.2 Fix CartPage quantity controls touch targets

    - Update quantity buttons to minimum 44x44px
    - _Requirements: 3.3_

  - [x] 4.3 Fix CartPage checkout button for mobile
    - Ensure full width on mobile
    - Add sticky positioning if not present
    - _Requirements: 3.5_

- [x] 5. Audit and Fix Checkout Page Responsive

  - [x] 5.1 Verify CheckoutPage single column layout on mobile

    - Check existing responsive classes
    - Fix if needed
    - _Requirements: 4.1_

  - [x] 5.2 Fix CheckoutPage form inputs for mobile

    - Ensure full width inputs
    - Verify correct input types (tel, email, number)
    - _Requirements: 4.2, 9.5_

  - [x] 5.3 Fix CheckoutPage payment options spacing
    - Ensure adequate spacing between radio buttons
    - Minimum 8px gap
    - _Requirements: 4.3_

- [ ] 6. Checkpoint - Verify Cart and Checkout Pages

  - Test Cart and Checkout pages on mobile
  - Ensure all touch targets are adequate
  - Ask user if questions arise

- [x] 7. Audit and Fix Orders Page Responsive

  - [x] 7.1 Verify OrdersPage single column layout on mobile

    - Check existing responsive classes
    - _Requirements: 5.1_

  - [x] 7.2 Fix OrdersPage status tabs for mobile

    - Add horizontal scroll if many tabs
    - _Requirements: 5.2_

  - [x] 7.3 Fix OrdersPage action buttons for mobile
    - Ensure adequate touch targets
    - _Requirements: 5.5_

- [ ] 8. Audit and Fix Wishlist Page Responsive

  - [ ] 8.1 Verify WishlistPage 2-column grid on mobile

    - Check existing responsive classes
    - Should be `grid-cols-2` on mobile
    - _Requirements: 6.1_

  - [ ] 8.2 Fix WishlistPage action buttons for mobile
    - Ensure remove button has adequate touch target
    - Ensure add to cart button is full width
    - _Requirements: 6.3, 6.4_

- [x] 9. Audit and Fix Search Results Page Responsive

  - [x] 9.1 Verify SearchResultsPage 2-column grid on mobile

    - Check existing responsive classes
    - _Requirements: 7.1_

  - [x] 9.2 Verify SearchResultsPage filter drawer on mobile

    - Ensure filter is accessible via drawer/modal
    - _Requirements: 7.2_

  - [x] 9.3 Fix SearchResultsPage pagination for mobile
    - Ensure touch-friendly pagination controls
    - _Requirements: 7.4_

- [ ] 10. Checkpoint - Verify Orders, Wishlist, Search Pages

  - Test all three pages on mobile
  - Ask user if questions arise

- [x] 11. Fix QuickView Modal Responsive

  - [x] 11.1 Update QuickViewModal for full screen on mobile

    - Set width to 90%+ of viewport on mobile
    - _Requirements: 8.1_

  - [x] 11.2 Fix QuickViewModal variant buttons for mobile

    - Add flex-wrap and minimum touch targets
    - _Requirements: 8.3_

  - [x] 11.3 Fix QuickViewModal action buttons for mobile

    - Stack vertically and full width on mobile
    - _Requirements: 8.4_

  - [x] 11.4 Fix QuickViewModal close button for mobile
    - Ensure minimum 44x44px touch target
    - _Requirements: 8.5_

- [ ] 12. General Mobile UX Audit

  - [ ] 12.1 Audit all interactive elements for touch targets

    - Scan all buttons, links, inputs
    - Fix any elements smaller than 44x44px
    - _Requirements: 9.1_

  - [ ] 12.2 Audit element spacing

    - Check spacing between interactive elements
    - Ensure minimum 8px gap
    - _Requirements: 9.2_

  - [ ] 12.3 Audit text sizes

    - Check body text is minimum 16px
    - _Requirements: 9.3_

  - [ ] 12.4 Audit for horizontal scroll issues
    - Check all pages for unintended horizontal scroll
    - Fix any overflow issues
    - _Requirements: 9.4_

- [ ] 13. Final Checkpoint - Complete Mobile Audit

  - Test all pages on multiple mobile viewports
  - Verify all touch targets are adequate
  - Verify no horizontal scroll issues
  - Ask user if questions arise

- [ ]\* 14. Write Property-Based Tests (Optional)

  - [ ]\* 14.1 Write property test for touch target minimum size

    - **Property 1: Touch Target Minimum Size**
    - **Validates: Requirements 1.3, 1.4, 3.3, 5.5, 6.3, 7.4, 8.5, 9.1**

  - [ ]\* 14.2 Write property test for single column layout

    - **Property 2: Single Column Layout on Mobile**
    - **Validates: Requirements 1.1, 3.1, 4.1, 5.1**

  - [ ]\* 14.3 Write property test for two column product grid

    - **Property 3: Two Column Product Grid on Mobile**
    - **Validates: Requirements 6.1, 7.1**

  - [ ]\* 14.4 Write property test for full width elements
    - **Property 4: Full Width Elements on Mobile**
    - **Validates: Requirements 1.5, 3.5, 4.2, 6.4, 7.5, 8.4**

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Focus on Product Detail Page first as it was reported as broken
