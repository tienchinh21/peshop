# Requirements Document

## Introduction

PeShop hiện đang gặp vấn đề về cấu trúc thư mục không nhất quán. Các file và chức năng được tổ chức không theo một pattern rõ ràng, dẫn đến việc khó tìm kiếm, bảo trì và mở rộng code. Dự án cần được refactor để có cấu trúc thư mục rõ ràng, logic và dễ bảo trì hơn.

## Glossary

- **System**: Hệ thống tổ chức file và thư mục của PeShop
- **Feature Module**: Một nhóm các file liên quan đến một chức năng cụ thể (ví dụ: products, cart, orders)
- **Colocation**: Việc đặt các file liên quan gần nhau trong cùng một thư mục
- **Service Layer**: Lớp xử lý API calls và business logic
- **View Layer**: Lớp hiển thị UI components
- **Type Definitions**: Các file TypeScript interface và type definitions
- **Route Group**: Nhóm routes trong Next.js App Router (ví dụ: (protected), (public))

## Requirements

### Requirement 1

**User Story:** Là một developer, tôi muốn tất cả các file liên quan đến một feature được đặt cùng nhau, để tôi có thể dễ dàng tìm và chỉnh sửa code.

#### Acceptance Criteria

1. WHEN a developer works on a feature THEN the System SHALL organize all related files (components, hooks, services, types) within the same feature directory
2. WHEN a feature has multiple sub-features THEN the System SHALL use nested directories to maintain clear hierarchy
3. WHEN a file is shared across multiple features THEN the System SHALL place it in a shared directory with clear naming
4. WHEN viewing a feature directory THEN the System SHALL include subdirectories for components, hooks, services, types, and utils where applicable
5. WHERE a feature has tests THEN the System SHALL colocate test files with their corresponding source files using `.test.ts` or `.test.tsx` suffix

### Requirement 2

**User Story:** Là một developer, tôi muốn cấu trúc thư mục tuân theo một pattern nhất quán, để tôi có thể dự đoán được vị trí của các file.

#### Acceptance Criteria

1. WHEN organizing feature directories THEN the System SHALL follow a consistent structure pattern across all features
2. WHEN naming directories THEN the System SHALL use kebab-case for feature folders and camelCase for utility folders
3. WHEN organizing components THEN the System SHALL separate page-level components from reusable components
4. WHEN organizing API services THEN the System SHALL group them by feature rather than by API backend (dotnet/java)
5. WHEN organizing types THEN the System SHALL colocate type definitions with their corresponding features

### Requirement 3

**User Story:** Là một developer, tôi muốn phân biệt rõ ràng giữa customer features và shop features, để tôi có thể làm việc với đúng domain.

#### Acceptance Criteria

1. WHEN organizing routes THEN the System SHALL maintain clear separation between customer routes and shop management routes
2. WHEN organizing services THEN the System SHALL separate customer-facing services from shop management services
3. WHEN organizing components THEN the System SHALL distinguish between customer UI components and shop management UI components
4. WHEN organizing hooks THEN the System SHALL separate customer hooks from shop management hooks
5. WHEN organizing types THEN the System SHALL separate customer types from shop types

### Requirement 4

**User Story:** Là một developer, tôi muốn giảm thiểu sự trùng lặp và tăng khả năng tái sử dụng code, để dự án dễ bảo trì hơn.

#### Acceptance Criteria

1. WHEN identifying shared components THEN the System SHALL extract them to a common components directory
2. WHEN identifying shared utilities THEN the System SHALL consolidate them in a centralized utils directory
3. WHEN identifying shared types THEN the System SHALL extract common types to a shared types directory
4. WHEN identifying shared hooks THEN the System SHALL extract reusable hooks to a shared hooks directory
5. WHEN multiple features use similar logic THEN the System SHALL create abstracted utilities or hooks

### Requirement 5

**User Story:** Là một developer, tôi muốn cấu trúc thư mục hỗ trợ tốt cho Next.js App Router, để tận dụng được các tính năng của framework.

#### Acceptance Criteria

1. WHEN organizing app directory THEN the System SHALL maintain Next.js App Router conventions for routing
2. WHEN organizing page components THEN the System SHALL separate route handlers from view components
3. WHEN organizing layouts THEN the System SHALL place shared layouts in appropriate route groups
4. WHEN organizing API routes THEN the System SHALL group them by feature in the api directory
5. WHEN organizing server components THEN the System SHALL clearly distinguish them from client components

### Requirement 6

**User Story:** Là một developer, tôi muốn có một migration plan rõ ràng, để việc refactor không làm gián đoạn development.

#### Acceptance Criteria

1. WHEN planning the refactor THEN the System SHALL provide a step-by-step migration guide
2. WHEN moving files THEN the System SHALL update all import statements to reflect new paths
3. WHEN refactoring THEN the System SHALL maintain backward compatibility during transition
4. WHEN completing each migration step THEN the System SHALL verify that the application still builds and runs correctly
5. WHEN documenting changes THEN the System SHALL update path aliases and configuration files accordingly

### Requirement 7

**User Story:** Là một developer, tôi muốn cấu trúc mới được document rõ ràng, để team có thể follow conventions.

#### Acceptance Criteria

1. WHEN completing the refactor THEN the System SHALL provide updated architecture documentation
2. WHEN adding new features THEN the System SHALL include guidelines on where to place new files
3. WHEN documenting structure THEN the System SHALL include examples for common scenarios
4. WHEN explaining conventions THEN the System SHALL provide rationale for structural decisions
5. WHEN onboarding new developers THEN the System SHALL provide a clear directory structure overview
