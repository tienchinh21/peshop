# Requirements Document

## Introduction

Tài liệu này mô tả yêu cầu chuyển đổi hệ thống lấy địa chỉ (tỉnh/huyện/xã) từ GoShip API sang Backend GHN API. Hiện tại, trang checkout đang sử dụng GoShip sandbox API để lấy danh sách địa chỉ Việt Nam. Cần chuyển sang sử dụng API backend nội bộ đã tích hợp sẵn với GHN (Giao Hàng Nhanh) để đảm bảo tính nhất quán và bảo mật.

## Glossary

- **GHN (Giao Hàng Nhanh)**: Dịch vụ vận chuyển phổ biến tại Việt Nam, cung cấp API địa chỉ
- **GoShip**: Dịch vụ vận chuyển hiện đang được sử dụng (sẽ được thay thế)
- **Province**: Tỉnh/Thành phố
- **District**: Quận/Huyện
- **Ward**: Phường/Xã
- **Address Service**: Service xử lý việc lấy và quản lý địa chỉ
- **Backend API**: API nội bộ của hệ thống (.NET backend)

## Requirements

### Requirement 1

**User Story:** As a customer, I want to select my delivery address from a list of Vietnamese provinces, districts, and wards, so that I can accurately specify my shipping location.

#### Acceptance Criteria

1. WHEN a user opens the address form THEN the Address_Service SHALL fetch and display a list of all Vietnamese provinces from the backend GHN API
2. WHEN a user selects a province THEN the Address_Service SHALL fetch and display the corresponding districts for that province
3. WHEN a user selects a district THEN the Address_Service SHALL fetch and display the corresponding wards for that district
4. WHEN the API returns province data THEN the Address_Service SHALL map the response to display provinceID and provinceName correctly
5. WHEN the API returns district data THEN the Address_Service SHALL map the response to display districtID and districtName correctly
6. WHEN the API returns ward data THEN the Address_Service SHALL map the response to display wardCode and wardName correctly

### Requirement 2

**User Story:** As a developer, I want to use the internal backend API instead of external GoShip API, so that the system is more secure and maintainable.

#### Acceptance Criteria

1. WHEN fetching address data THEN the Address_Service SHALL call the backend endpoints `/ghn/get-list-province`, `/ghn/get-list-district`, and `/ghn/get-list-ward`
2. WHEN making API calls THEN the Address_Service SHALL use the existing axiosDotnet client for consistency
3. WHEN the GoShip service is removed THEN the system SHALL have no remaining dependencies on GoShip API
4. WHEN the migration is complete THEN the system SHALL remove the NEXT_PUBLIC_TOKEN_GOSHIP environment variable dependency

### Requirement 3

**User Story:** As a customer, I want the address selection to work reliably, so that I can complete my checkout without errors.

#### Acceptance Criteria

1. WHEN the province API call fails THEN the Address_Service SHALL display an appropriate error message to the user
2. WHEN the district API call fails THEN the Address_Service SHALL display an appropriate error message and allow retry
3. WHEN the ward API call fails THEN the Address_Service SHALL display an appropriate error message and allow retry
4. WHEN loading address data THEN the Address_Service SHALL display a loading indicator to the user
5. IF the API returns an empty list THEN the Address_Service SHALL handle the empty state gracefully

### Requirement 4

**User Story:** As a developer, I want the address data to be cached appropriately, so that the application performs well and reduces unnecessary API calls.

#### Acceptance Criteria

1. WHEN province data is fetched THEN the Address_Service SHALL cache the data for subsequent requests
2. WHEN district data is fetched for a province THEN the Address_Service SHALL cache the data keyed by provinceId
3. WHEN ward data is fetched for a district THEN the Address_Service SHALL cache the data keyed by districtId
4. WHEN cached data exists THEN the Address_Service SHALL return cached data instead of making new API calls

### Requirement 5

**User Story:** As a customer editing an existing address, I want my previously selected location to be pre-populated, so that I can easily update my address.

#### Acceptance Criteria

1. WHEN editing an existing address THEN the Address_Form SHALL pre-populate the province, district, and ward selections
2. WHEN pre-populating location data THEN the Address_Form SHALL load the corresponding district and ward lists automatically
3. WHEN the address contains GHN IDs THEN the Address_Form SHALL use those IDs to fetch and display the correct location names
