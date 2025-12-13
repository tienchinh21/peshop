# Implementation Plan

- [x] 1. Create GHN Address Types

  - [x] 1.1 Create GHN type definitions

    - Create file `src/shared/types/ghn-address.types.ts`
    - Define GHNProvince, GHNDistrict, GHNWard interfaces
    - Define GHNApiResponse generic type
    - Export types from `src/shared/types/index.ts`
    - _Requirements: 1.4, 1.5, 1.6_

- [x] 2. Create GHN Address Service

  - [x] 2.1 Implement GHN address service

    - Create file `src/shared/services/external/ghn-address.service.ts`
    - Implement `getGHNProvinces()` calling `/ghn/get-list-province`
    - Implement `getGHNDistricts(provinceId)` calling `/ghn/get-list-district?provinceId=X`
    - Implement `getGHNWards(districtId)` calling `/ghn/get-list-ward?districtId=X`
    - Use axiosDotnet client for API calls
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2_

  - [x] 2.2 Export service from index

    - Update `src/shared/services/external/index.ts` to export GHN service
    - _Requirements: 2.1_

- [x] 3. Create React Query Hooks for GHN Address

  - [x] 3.1 Implement useGHNAddress hooks

    - Create file `src/shared/hooks/useGHNAddress.ts`
    - Define query keys: ghnAddressKeys
    - Implement `useGHNProvinces()` with staleTime: 30 minutes (provinces rarely change)
    - Implement `useGHNDistricts(provinceId, enabled)` with staleTime: 10 minutes
    - Implement `useGHNWards(districtId, enabled)` with staleTime: 10 minutes
    - Add error handling with toast notifications
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3_

  - [x] 3.2 Export hooks from shared hooks index

    - Update `src/shared/hooks/index.ts` to export GHN hooks
    - _Requirements: 4.1_

  - [ ]\* 3.3 Write property test for cache key consistency
    - **Property 2: Cache Key Consistency**
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 4. Update AddressFormModal Component

  - [x] 4.1 Refactor AddressFormModal to use GHN hooks

    - Replace GoShip service imports with useGHNAddress hooks
    - Update province/district/ward state to use GHN types
    - Map GHN response fields to form data (provinceID → oldProviceId, etc.)
    - Handle loading states from hooks
    - _Requirements: 1.1, 1.2, 1.3, 3.4_

  - [x] 4.2 Update location change handlers

    - Update handleProvinceChange to use GHN provinceID
    - Update handleDistrictChange to use GHN districtID
    - Update handleWardChange to use GHN wardCode
    - _Requirements: 1.4, 1.5, 1.6_

  - [x] 4.3 Implement edit mode pre-population

    - Load districts when editAddress has provinceId
    - Load wards when editAddress has districtId
    - Pre-select correct province/district/ward names
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]\* 4.4 Write property test for API response mapping
    - **Property 1: API Response Mapping Preserves Required Fields**
    - **Validates: Requirements 1.4, 1.5, 1.6**

- [ ] 5. Cleanup and Remove GoShip Dependencies

  - [ ] 5.1 Remove GoShip service
    - Delete or deprecate `src/shared/services/external/goship-address.service.ts`
    - Remove GoShip exports from `src/shared/services/external/index.ts`
    - _Requirements: 2.3_
  - [ ] 5.2 Remove GoShip environment variable
    - Remove NEXT_PUBLIC_TOKEN_GOSHIP from .env files
    - Update .env.example if exists
    - _Requirements: 2.4_

- [ ] 6. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.
