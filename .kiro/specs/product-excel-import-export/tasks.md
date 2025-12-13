# Implementation Plan

## Phase 1: Service Layer và Types

- [x] 1. Tạo types cho Import/Export

  - [x] 1.1 Tạo `src/features/shop/products/types/excel.types.ts`

    - Định nghĩa `ImportResult` interface
    - Định nghĩa `ImportApiResponse` interface
    - _Requirements: 2.3, 2.4_

  - [ ]\* 1.2 Write property test cho parseImportResponse
    - **Property 4: Import error parsing**
    - **Validates: Requirements 2.4**

- [x] 2. Tạo service functions cho Import/Export

  - [x] 2.1 Tạo `src/features/shop/products/services/excel.service.ts`

    - Implement `exportProducts()` - gọi GET /shop/product/export, trả về Blob
    - Implement `importProducts(file: File)` - gọi POST /shop/product/import với FormData
    - Implement `parseImportResponse()` - parse error message thành ImportResult
    - Implement `downloadBlob()` - helper để download file
    - _Requirements: 1.1, 2.1, 2.3, 2.4_

  - [ ]\* 2.2 Write unit tests cho excel.service
    - Test parseImportResponse với các cases: success, partial failure, complete failure
    - _Requirements: 2.4_

- [x] 3. Tạo React Query hooks

  - [x] 3.1 Tạo `src/features/shop/products/hooks/useExportProducts.ts`

    - useMutation cho export
    - Handle loading state
    - Handle error với toast
    - _Requirements: 1.1, 1.5_

  - [x] 3.2 Tạo `src/features/shop/products/hooks/useImportProducts.ts`

    - useMutation cho import
    - Handle loading state
    - Return parsed ImportResult
    - _Requirements: 2.1, 2.3, 2.5_

- [x] 4. Update exports trong index files

  - [x] 4.1 Update `src/features/shop/products/types/index.ts`

    - Export types từ excel.types.ts

  - [x] 4.2 Update `src/features/shop/products/services/index.ts`

    - Export functions từ excel.service.ts

  - [x] 4.3 Update `src/features/shop/products/hooks/index.ts`

    - Export hooks mới

## Phase 2: UI Components

- [-] 5. Tạo utility function validate file

  - [x] 5.1 Tạo `src/features/shop/products/utils/excel.utils.ts`

    - Implement `isValidExcelFile(file: File)` - check extension .xlsx/.xls
    - Implement `formatFileSize(bytes: number)` - format file size
    - _Requirements: 2.1, 2.2_

  - [ ]\* 5.2 Write property test cho isValidExcelFile
    - **Property 1: File format validation**
    - **Validates: Requirements 2.1, 2.2**

- [x] 6. Tạo ImportInstructions component

  - [x] 6.1 Tạo `src/features/shop/products/components/excel/ImportInstructions.tsx`

    - Hiển thị 4 bước hướng dẫn
    - Bảng giải thích columns (Product ID, Name, Phân loại hàng, Price, Quantity, Variant ID)
    - Highlight lưu ý quan trọng
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 7. Tạo FileDropzone component

  - [x] 7.1 Tạo `src/features/shop/products/components/excel/FileDropzone.tsx`

    - Drag-and-drop area
    - File picker button
    - Hiển thị selected file info
    - Validate file type và show error
    - _Requirements: 2.1, 2.2, 5.5_

- [x] 8. Tạo ImportResultDisplay component

  - [x] 8.1 Tạo `src/features/shop/products/components/excel/ImportResultDisplay.tsx`

    - Hiển thị success message với count
    - Hiển thị error summary với details
    - _Requirements: 2.3, 2.4_

- [x] 9. Tạo ImportModal component

  - [x] 9.1 Tạo `src/features/shop/products/components/excel/ImportModal.tsx`

    - Dialog với ImportInstructions
    - FileDropzone
    - ImportResultDisplay
    - Loading state
    - Import button
    - _Requirements: 4.2, 5.1, 5.5_

- [x] 10. Tạo ExportButton component

  - [x] 10.1 Tạo `src/features/shop/products/components/excel/ExportButton.tsx`

    - Button với icon Download
    - Tooltip "Xuất danh sách sản phẩm ra file Excel"
    - Loading state khi đang export
    - _Requirements: 4.1, 4.3, 1.5_

  - [ ]\* 10.2 Write property test cho loading state
    - **Property 2: Loading state during export**
    - **Validates: Requirements 1.5**

- [x] 11. Tạo ImportButton component

  - [x] 11.1 Tạo `src/features/shop/products/components/excel/ImportButton.tsx`

    - Button với icon Upload
    - Tooltip "Nhập file Excel để cập nhật sản phẩm"
    - _Requirements: 4.1, 4.4_

- [x] 12. Update component exports

  - [-] 12.1 Tạo `src/features/shop/products/components/excel/index.ts`

    - Export tất cả excel components

  - [x] 12.2 Update `src/features/shop/products/components/index.ts`

    - Export từ excel folder

## Phase 3: Integration

- [x] 13. Tích hợp vào ProductListPageClient

  - [x] 13.1 Update `src/features/shop/products/components/ProductListPageClient.tsx`

    - Import ExportButton, ImportButton, ImportModal
    - Thêm state cho modal open/close
    - Thêm buttons vào toolbar (cạnh các filter buttons)
    - Wire up hooks với components
    - _Requirements: 4.1_

- [ ] 14. Checkpoint - Verify functionality
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Polish và Testing

- [ ]\* 15. Write integration tests

  - [ ]\* 15.1 Test export flow
    - Test button click triggers export
    - Test loading state appears
    - Test file downloads on success
  - [ ]\* 15.2 Test import flow
    - Test modal opens on button click
    - Test file validation
    - Test success/error display
  - [ ]\* 15.3 Write property test cho import loading state
    - **Property 3: Loading state during import**
    - **Validates: Requirements 2.5**

- [ ] 16. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.
