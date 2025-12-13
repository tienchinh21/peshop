# Requirements Document

## Introduction

Tính năng Shop Flash Sale Management cho phép shop owner xem và quản lý các chương trình Flash Sale mà shop đã tham gia hoặc có thể tham gia. Shop owner có thể xem danh sách Flash Sale theo khoảng thời gian, xem chi tiết các sản phẩm đã đăng ký tham gia Flash Sale, và theo dõi trạng thái của từng chương trình.

## Glossary

- **Flash Sale**: Chương trình khuyến mãi giới hạn thời gian với số lượng sản phẩm có hạn
- **Shop Flash Sale**: Flash Sale mà shop đã đăng ký tham gia với các sản phẩm của mình
- **Flash Sale Status**: Trạng thái của Flash Sale (0: Chưa bắt đầu, 1: Đang diễn ra, 2: Đã kết thúc)
- **Participated Flash Sale**: Flash Sale mà shop đã đăng ký sản phẩm tham gia
- **axiosJava**: Axios client được cấu hình cho Java API

## Requirements

### Requirement 1

**User Story:** As a shop owner, I want to view available Flash Sale campaigns by date range, so that I can plan which campaigns to participate in.

#### Acceptance Criteria

1. WHEN a shop owner navigates to the Flash Sale management page THEN the system SHALL display a date range filter with startDate and endDate inputs
2. WHEN a shop owner selects a date range and submits THEN the system SHALL fetch Flash Sale data from the `GET /shop/flash-sale` API endpoint with startDate and endDate parameters
3. WHEN Flash Sale data is fetched successfully THEN the system SHALL display a list of Flash Sales with id, startTime, endTime, and status
4. WHEN displaying Flash Sales THEN the system SHALL show status indicators (Chưa bắt đầu, Đang diễn ra, Đã kết thúc) based on status value
5. IF the API request fails THEN the system SHALL display an error message and allow retry

### Requirement 2

**User Story:** As a shop owner, I want to view Flash Sales that my shop has participated in, so that I can track my promotional activities.

#### Acceptance Criteria

1. WHEN a shop owner navigates to the participated Flash Sales section THEN the system SHALL fetch data from the `GET /shop/flash-sale/participated` API endpoint
2. WHEN participated Flash Sale data is fetched successfully THEN the system SHALL display a list of Flash Sales with their associated products
3. WHEN displaying participated Flash Sales THEN the system SHALL show flashSale details (id, startTime, endTime, status) and products list (id, name, imgMain)
4. WHEN no participated Flash Sales exist THEN the system SHALL display an empty state message
5. IF the API request fails THEN the system SHALL display an error message and allow retry

### Requirement 3

**User Story:** As a shop owner, I want to see Flash Sale details clearly, so that I can understand the timing and status of each campaign.

#### Acceptance Criteria

1. WHEN displaying Flash Sale time THEN the system SHALL format startTime and endTime in Vietnamese locale (dd/MM/yyyy HH:mm)
2. WHEN displaying Flash Sale status THEN the system SHALL use color-coded badges (gray for Chưa bắt đầu, green for Đang diễn ra, red for Đã kết thúc)
3. WHEN a Flash Sale is currently active (status = 1) THEN the system SHALL highlight the Flash Sale row
4. WHEN displaying product information THEN the system SHALL show product image, name, and id

### Requirement 4

**User Story:** As a shop owner, I want the Flash Sale page to load quickly and show loading states, so that I have a smooth user experience.

#### Acceptance Criteria

1. WHILE Flash Sale data is loading THEN the system SHALL display a loading skeleton
2. WHEN Flash Sale data is cached THEN the system SHALL use stale data while revalidating in background
3. WHEN the component unmounts THEN the system SHALL cancel any pending API requests

### Requirement 5

**User Story:** As a developer, I want Flash Sale feature to follow existing codebase patterns, so that the code is maintainable and consistent.

#### Acceptance Criteria

1. WHEN implementing Flash Sale types THEN the system SHALL create type definitions in `src/features/shop/flash-sale/types/flash-sale.types.ts`
2. WHEN implementing Flash Sale API calls THEN the system SHALL create service functions in `src/features/shop/flash-sale/services/flash-sale.service.ts`
3. WHEN implementing Flash Sale data fetching THEN the system SHALL create React Query hooks in `src/features/shop/flash-sale/hooks/useShopFlashSale.ts`
4. WHEN making API calls THEN the service SHALL use axiosJava client from shared services
5. WHEN implementing hooks THEN the system SHALL follow the existing query key pattern for cache management
