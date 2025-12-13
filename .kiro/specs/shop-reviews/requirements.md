# Requirements Document

## Introduction

Tính năng "Đánh giá của Shop" cho phép chủ shop xem và quản lý các đánh giá (reviews) từ khách hàng về sản phẩm của shop. Tính năng này giúp shop theo dõi phản hồi khách hàng, lọc đánh giá theo nhiều tiêu chí, và cải thiện chất lượng dịch vụ dựa trên feedback.

## Glossary

- **Shop_Reviews_System**: Hệ thống quản lý đánh giá của shop trong PeShop
- **Review**: Đánh giá của khách hàng bao gồm rating (1-5 sao), nội dung, hình ảnh đính kèm
- **Rating**: Điểm đánh giá từ 1 đến 5 sao
- **Variant**: Biến thể sản phẩm (ví dụ: màu sắc, kích thước)
- **Spring Filter**: Cú pháp lọc dữ liệu được sử dụng bởi backend API
- **Pagination**: Phân trang dữ liệu

## Requirements

### Requirement 1

**User Story:** As a shop owner, I want to view all reviews for my shop's products, so that I can monitor customer feedback and satisfaction.

#### Acceptance Criteria

1. WHEN a shop owner navigates to the reviews page THEN the Shop_Reviews_System SHALL display a paginated list of reviews with default sorting by creation date (newest first)
2. WHEN reviews are displayed THEN the Shop_Reviews_System SHALL show review rating, content, customer name, customer avatar, product variant information, attached image (if any), and creation timestamp for each review
3. WHEN the reviews list is empty THEN the Shop_Reviews_System SHALL display an appropriate empty state message
4. WHEN the reviews are loading THEN the Shop_Reviews_System SHALL display a loading skeleton

### Requirement 2

**User Story:** As a shop owner, I want to filter reviews by rating, so that I can quickly identify positive or negative feedback.

#### Acceptance Criteria

1. WHEN a shop owner selects a rating filter (1-5 stars or "All") THEN the Shop_Reviews_System SHALL display only reviews matching the selected rating
2. WHEN a rating filter is applied THEN the Shop_Reviews_System SHALL update the URL query parameters to reflect the current filter state
3. WHEN the page is loaded with rating filter in URL THEN the Shop_Reviews_System SHALL apply the filter and display filtered results

### Requirement 3

**User Story:** As a shop owner, I want to search reviews by content or customer name, so that I can find specific feedback quickly.

#### Acceptance Criteria

1. WHEN a shop owner enters a search term in the search input THEN the Shop_Reviews_System SHALL filter reviews containing the search term in content or customer name (case-insensitive)
2. WHEN a search is performed THEN the Shop_Reviews_System SHALL debounce the search input by 300ms to avoid excessive API calls
3. WHEN the search input is cleared THEN the Shop_Reviews_System SHALL display all reviews (respecting other active filters)

### Requirement 4

**User Story:** As a shop owner, I want to sort reviews by different criteria, so that I can organize the feedback view according to my needs.

#### Acceptance Criteria

1. WHEN a shop owner selects a sort option THEN the Shop_Reviews_System SHALL sort reviews by the selected criteria (creation date or rating)
2. WHEN sorting is applied THEN the Shop_Reviews_System SHALL support both ascending and descending order
3. WHEN the page is loaded with sort parameters in URL THEN the Shop_Reviews_System SHALL apply the sorting and display sorted results

### Requirement 5

**User Story:** As a shop owner, I want to navigate through paginated reviews, so that I can browse all feedback without performance issues.

#### Acceptance Criteria

1. WHEN reviews exceed the page size limit THEN the Shop_Reviews_System SHALL display pagination controls
2. WHEN a shop owner clicks on a page number THEN the Shop_Reviews_System SHALL load and display reviews for the selected page
3. WHEN pagination is used THEN the Shop_Reviews_System SHALL maintain current filter and sort settings
4. WHEN the page is loaded with page parameter in URL THEN the Shop_Reviews_System SHALL display the specified page

### Requirement 6

**User Story:** As a shop owner, I want to see review statistics summary, so that I can quickly understand overall customer satisfaction.

#### Acceptance Criteria

1. WHEN the reviews page loads THEN the Shop_Reviews_System SHALL display total review count and average rating
2. WHEN filters are applied THEN the Shop_Reviews_System SHALL update statistics to reflect filtered results
