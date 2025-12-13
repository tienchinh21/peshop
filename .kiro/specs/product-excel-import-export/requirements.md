# Requirements Document

## Introduction

Tính năng "Import/Export Sản phẩm Excel" cho phép chủ shop xuất danh sách sản phẩm ra file Excel và import lại để cập nhật nhanh thông tin sản phẩm (tên, giá, số lượng). Tính năng này giúp shop quản lý hàng loạt sản phẩm một cách hiệu quả mà không cần chỉnh sửa từng sản phẩm riêng lẻ.

## Glossary

- **Product_Excel_System**: Hệ thống import/export sản phẩm qua file Excel trong PeShop
- **Product**: Sản phẩm của shop bao gồm tên, giá, mô tả, hình ảnh
- **Variant**: Biến thể sản phẩm (ví dụ: màu sắc, kích thước) với giá và số lượng riêng
- **Excel File**: File định dạng .xlsx hoặc .xls chứa dữ liệu sản phẩm
- **Export**: Xuất dữ liệu sản phẩm từ hệ thống ra file Excel
- **Import**: Nhập dữ liệu từ file Excel vào hệ thống để cập nhật sản phẩm

## Requirements

### Requirement 1

**User Story:** As a shop owner, I want to export all my products to an Excel file, so that I can view and edit product information offline.

#### Acceptance Criteria

1. WHEN a shop owner clicks the export button THEN the Product_Excel_System SHALL download an Excel file containing all active products of the shop
2. WHEN exporting products THEN the Product_Excel_System SHALL include columns: Product ID, Name, Phân loại hàng (variant properties), Price, Quantity, Variant ID
3. WHEN a product has multiple variants THEN the Product_Excel_System SHALL create one row per variant in the Excel file
4. WHEN a product has no variants THEN the Product_Excel_System SHALL create one row with Price and Quantity as 0
5. WHILE the export is in progress THEN the Product_Excel_System SHALL display a loading indicator to the user

### Requirement 2

**User Story:** As a shop owner, I want to import an Excel file to update my products, so that I can quickly update prices and quantities for multiple products at once.

#### Acceptance Criteria

1. WHEN a shop owner selects an Excel file for import THEN the Product_Excel_System SHALL validate the file format is .xlsx or .xls
2. WHEN the file format is invalid THEN the Product_Excel_System SHALL display an error message "Chỉ chấp nhận file Excel (.xlsx, .xls)"
3. WHEN the import is successful THEN the Product_Excel_System SHALL display a success message with the number of updated records
4. WHEN some rows fail validation THEN the Product_Excel_System SHALL display a summary showing successful and failed counts with error details
5. WHILE the import is in progress THEN the Product_Excel_System SHALL display a loading indicator to the user

### Requirement 3

**User Story:** As a shop owner, I want the system to validate imported data, so that I can ensure data integrity and avoid errors.

#### Acceptance Criteria

1. WHEN a row has missing Product ID THEN the Product_Excel_System SHALL skip that row and report "Product ID is required"
2. WHEN a row has missing Variant ID THEN the Product_Excel_System SHALL skip that row and report "Variant ID is required"
3. WHEN a row has invalid Price format THEN the Product_Excel_System SHALL skip that row and report "Invalid Price format"
4. WHEN a row has Price less than 0 THEN the Product_Excel_System SHALL skip that row and report "Price must be >= 0"
5. WHEN a row has Quantity less than 0 THEN the Product_Excel_System SHALL skip that row and report "Quantity must be >= 0"
6. WHEN a Variant ID does not belong to the specified Product ID THEN the Product_Excel_System SHALL skip that row and report "Variant does not belong to this product"

### Requirement 4

**User Story:** As a shop owner, I want the import/export UI to be intuitive, so that I can easily manage my products without technical knowledge.

#### Acceptance Criteria

1. WHEN viewing the product list page THEN the Product_Excel_System SHALL display Export and Import buttons in the toolbar
2. WHEN clicking the Import button THEN the Product_Excel_System SHALL open a modal dialog with import instructions and file picker
3. WHEN hovering over the Export button THEN the Product_Excel_System SHALL display a tooltip explaining the export functionality
4. WHEN hovering over the Import button THEN the Product_Excel_System SHALL display a tooltip explaining the import functionality

### Requirement 5

**User Story:** As a shop owner, I want clear instructions on how to import products, so that I can correctly prepare and upload my Excel file.

#### Acceptance Criteria

1. WHEN the import modal is opened THEN the Product_Excel_System SHALL display step-by-step instructions for the import process
2. WHEN displaying import instructions THEN the Product_Excel_System SHALL include: (1) Export sản phẩm trước để có file mẫu đúng format, (2) Chỉnh sửa Name, Price, Quantity trong file, (3) KHÔNG sửa Product ID, Variant ID, Phân loại hàng, (4) Import file đã chỉnh sửa
3. WHEN displaying import instructions THEN the Product_Excel_System SHALL show a table explaining each column and whether it can be edited
4. WHEN displaying import instructions THEN the Product_Excel_System SHALL highlight important notes: Price và Quantity phải >= 0, chỉ cập nhật được sản phẩm của shop mình
5. WHEN the import modal is opened THEN the Product_Excel_System SHALL provide a drag-and-drop area for file upload in addition to the file picker button

### Requirement 6

**User Story:** As a shop owner, I want the system to automatically update product prices after import, so that the product listing shows correct minimum prices.

#### Acceptance Criteria

1. WHEN variant prices are updated via import THEN the Product_Excel_System SHALL automatically update the parent product price to the minimum variant price
2. WHEN product name is updated via import THEN the Product_Excel_System SHALL automatically update the product slug based on the new name
