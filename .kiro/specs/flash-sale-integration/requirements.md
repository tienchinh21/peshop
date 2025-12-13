# Requirements Document

## Introduction

Tính năng Flash Sale Integration cho phép hiển thị các chương trình Flash Sale đang diễn ra trên trang chủ PeShop. Thay vì sử dụng dữ liệu mock cứng, hệ thống sẽ tích hợp với API backend để lấy danh sách Flash Sale trong ngày và sản phẩm tham gia Flash Sale theo thời gian thực.

## Glossary

- **Flash Sale**: Chương trình khuyến mãi giới hạn thời gian với số lượng sản phẩm có hạn
- **FlashSale Component**: Component React hiển thị Flash Sale trên trang chủ
- **Flash Sale Status**: Trạng thái của Flash Sale (0: Chưa bắt đầu, 1: Đang diễn ra, 2: Đã kết thúc)
- **Countdown Timer**: Bộ đếm ngược thời gian còn lại của Flash Sale
- **Progress Bar**: Thanh tiến trình hiển thị số lượng đã bán/tổng số lượng
- **axiosDotnet**: Axios client được cấu hình cho .NET API

## Requirements

### Requirement 1

**User Story:** As a customer, I want to see active Flash Sale products on the homepage, so that I can discover time-limited deals.

#### Acceptance Criteria

1. WHEN the homepage loads THEN the FlashSale Component SHALL fetch Flash Sale data from the `/FlashSale/today` API endpoint
2. WHEN Flash Sale data is fetched successfully THEN the FlashSale Component SHALL display only the Flash Sale with status equal to 1 (Đang diễn ra)
3. WHEN an active Flash Sale exists THEN the FlashSale Component SHALL fetch products from `/FlashSale/get-page` API with the active flashSaleId
4. WHEN no active Flash Sale exists THEN the FlashSale Component SHALL hide the entire Flash Sale section
5. IF the API request fails THEN the FlashSale Component SHALL hide the Flash Sale section gracefully without showing error messages to users

### Requirement 2

**User Story:** As a customer, I want to see accurate countdown timer for Flash Sale, so that I know how much time is left to make a purchase.

#### Acceptance Criteria

1. WHEN an active Flash Sale is displayed THEN the Countdown Timer SHALL calculate remaining time based on the endTime from API response
2. WHILE the Flash Sale is active THEN the Countdown Timer SHALL update every second showing hours, minutes, and seconds
3. WHEN the countdown reaches zero THEN the FlashSale Component SHALL refetch Flash Sale data to check for next active Flash Sale
4. WHEN displaying time values THEN the Countdown Timer SHALL pad single-digit values with leading zeros

### Requirement 3

**User Story:** As a customer, I want to see Flash Sale product information, so that I can evaluate the deals before purchasing.

#### Acceptance Criteria

1. WHEN displaying Flash Sale products THEN the ProductSaleCard SHALL show product name, image, original price, discounted price, and discount percentage from API data
2. WHEN displaying Flash Sale products THEN the ProductSaleCard SHALL show shop name and product rating with review count
3. WHEN displaying Flash Sale products THEN the Progress Bar SHALL show sold quantity out of total quantity
4. WHEN a product is sold out (usedQuantity equals quantity) THEN the ProductSaleCard SHALL display a sold-out indicator
5. WHEN user clicks on a product THEN the FlashSale Component SHALL navigate to the product detail page using the slug from API

### Requirement 4

**User Story:** As a customer, I want the Flash Sale section to load quickly, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. WHILE Flash Sale data is loading THEN the FlashSale Component SHALL display a loading skeleton
2. WHEN Flash Sale data is cached THEN the FlashSale Component SHALL use stale data while revalidating in background
3. WHEN the component unmounts THEN the FlashSale Component SHALL cancel any pending API requests

### Requirement 5

**User Story:** As a developer, I want Flash Sale feature to follow existing codebase patterns, so that the code is maintainable and consistent.

#### Acceptance Criteria

1. WHEN implementing Flash Sale types THEN the system SHALL create type definitions in `src/features/customer/home/types/flash-sale.types.ts`
2. WHEN implementing Flash Sale API calls THEN the system SHALL create service functions in `src/features/customer/home/services/flash-sale.service.ts`
3. WHEN implementing Flash Sale data fetching THEN the system SHALL create React Query hooks in `src/features/customer/home/hooks/useFlashSale.ts`
4. WHEN making API calls THEN the service SHALL use axiosDotnet client from shared services
5. WHEN implementing hooks THEN the system SHALL follow the existing query key pattern for cache management
