# Tài liệu tham khảo dự án PeShop (Client)

## 1. Tổng quan

- Nền tảng: Next.js App Router (SSR/CSR), React + TypeScript
- State: Redux (auth) và TanStack Query (server state)
- HTTP: Axios với 2 client `axiosDotnet` và `axiosJava`
- UI: shadcn/ui, bố cục theo `MainLayout`/`SimpleLayout`
- Thông báo: `sonner` toast
- Ngôn ngữ mặc định: `vi` cấu hình tại `src/app/layout.tsx:32`

## 2. Tổ chức tài liệu (định hướng theo Django docs)

- Tutorials: Hướng dẫn chạy, luồng đăng nhập, luồng mua hàng
- Topic guides: Kiến trúc App Router, Providers, State management
- Reference: Cấu hình API, Axios clients, Interceptors, Query keys
- How-to: Thêm service, tạo hook query, xử lý form/validation

## 3. Kiến trúc lớp (Model/View/Template – quy chiếu cho React)

- Model (Types/Services):
  - Định nghĩa endpoint và config tại `src/lib/config/api.config.ts:1`
  - Tạo Axios client tại `src/shared/services/http/axios.client.ts:1`
  - Xuất axios và gắn interceptors tại `src/shared/services/http/index.ts:1`
  - Service tính năng ví dụ: sản phẩm `src/features/customer/products/services/product.service.ts:1`
- View (Pages/Containers):
  - App Router trong `src/app/**` (các page theo khu vực khách hàng/shop)
  - Providers bọc toàn cục `src/providers/AppProvider.tsx:14`
- Template (Components):
  - Component UI tái sử dụng nằm ở `src/shared/components/**` và `src/components/**`
  - Bố cục theo layout quyết định tại `src/providers/LayoutProvider.tsx:26`

## 4. Routing (Next.js App Router)

- Cấu trúc thư mục `src/app/(customer|shop|auth|...)/**`
- Layout tổng `src/app/layout.tsx:27`, khởi tạo `AppProvider` và `Toaster`
- Phân layout động theo route tại `src/providers/LayoutProvider.tsx:21`

## 5. Providers (khởi tạo ứng dụng)

- `ReduxProvider`: nạp lại trạng thái auth `src/providers/ReduxProvider.tsx:13`
- `QueryProvider`: cấu hình QueryClient mặc định `src/providers/QueryProvider.tsx:5`
- `AppProvider`: ghép Redux + Query + Layout + tiện ích `src/providers/AppProvider.tsx:14`

## 6. State Management

- Auth: Redux slice `src/lib/store/slices/authSlice.ts:1`
  - Lưu token cookie, hydrate từ localStorage `src/lib/store/slices/authSlice.ts:69`
  - Tiện ích token `src/shared/services/auth/token.service.ts:1`
- Server state: TanStack Query
  - Provider `src/providers/QueryProvider.tsx:5`
  - Ví dụ hook: sản phẩm `src/features/customer/products/hooks/useProducts.ts:1`

## 7. HTTP & Services (theo RESTful)

- Cấu hình API:
  - `.NET` `API_CONFIG.BASE_URL` và endpoints `src/lib/config/api.config.ts:1`
  - Java `API_CONFIG_JAVA` và endpoints `src/lib/config/api.config.ts:15`
- Axios clients:
  - Tạo client .NET `src/shared/services/http/axios.client.ts:4`
  - Tạo client Java `src/shared/services/http/axios.client.ts:38`
  - Interceptors gán `Authorization` từ cookie `src/shared/services/http/interceptors.ts:5`
- Mẫu service RESTful:
  - GET/POST/PUT/DELETE theo chuẩn REST (idempotent khi GET/PUT)
  - Ví dụ sản phẩm GET với query params `src/features/customer/products/services/product.service.ts:4`

## 8. Query Keys & Caching (TanStack Query)

- Quy tắc: tạo không gian tên cố định và tham số hóa keys
- Ví dụ keys sản phẩm `src/features/customer/products/hooks/useProducts.ts:8`
- `staleTime/gcTime` cấu hình theo hook hoặc mặc định provider `src/providers/QueryProvider.tsx:6`

## 9. Forms & Validation

- Validation tuỳ biến qua `useFormValidation` `src/shared/hooks/useFormValidation.ts:66`
- Mẫu form đăng nhập `src/features/customer/auth/components/LoginPage.tsx:30`
- Mẫu form dài Voucher `src/features/shop/campaigns/vouchers/components/VoucherForm.tsx:103`

## 10. Tích hợp Auth

- Hook `useAuth` bao quát login/register/logout `src/shared/hooks/useAuth.ts:18`
- Token lưu bằng cookie `src/lib/utils/cookies.utils.ts:1` và interceptor tự đính kèm `src/shared/services/http/interceptors.ts:5`

## 11. UI & Layout

- `MainLayout` vs `SimpleLayout` quyết định theo route `src/providers/LayoutProvider.tsx:29`
- Toaster hiển thị thông báo `src/app/layout.tsx:35`

## 12. Hướng dẫn RESTful API (tham chiếu restfulapi.net)

- Uniform Interface:
  - Tài nguyên xác định bằng URI (`/Product`, `/Shop`, `/Order`)
  - Dùng representation JSON, rõ ràng metadata
- Stateless:
  - Mỗi request tự chứa thông tin (Bearer token qua header)
- Cacheable:
  - Sử dụng `staleTime`/`gcTime` để tối ưu client caching
- Layered System:
  - Tách rõ tầng UI, hooks, services, http client

## 13. OpenAPI/Swagger (tham chiếu swagger.io/specification)

- Khuyến nghị backend công bố OAS 3.1 cho endpoints dotnet/java
- Client có thể sinh types/service từ OpenAPI (codegen) để giảm sai khác hợp đồng
- Quy ước media type `application/json`; status codes theo IANA registry

## 14. MySQL (tham chiếu dev.mysql.com/doc)

- Backend (được giả định) lưu trữ dữ liệu MySQL; client chỉ tương tác qua API
- Khuyến nghị chuẩn hoá index và truy vấn để đảm bảo tốc độ API
- Theo dõi phân trang và lọc trên server để giảm tải client

## 15. React + TypeScript (tham chiếu Cheatsheets)

- Kiểu hoá props, hooks, payloads trả về từ service
- Tránh `any`; định nghĩa `types` cho module `src/features/**/types`
- Sử dụng `as const` cho query keys và endpoint map `src/lib/config/api.config.ts:21`

## 16. Quy ước dịch vụ

- Mọi service import axios qua alias `@/lib/config/axios.config`
- Endpoint ghép param bằng `URLSearchParams` để an toàn
- Luồng upload form-data có helper `src/shared/services/http/axios.client.ts:50`

## 17. Bảo mật

- Token lưu trong cookie với `SameSite=Lax` và `Secure` khi HTTPS `src/lib/utils/cookies.utils.ts:3`
- Refresh token endpoint `.NET` `src/shared/services/auth/token.service.ts:20`
- Dọn dẹp token và localStorage khi logout/hết hạn `src/lib/store/slices/authSlice.ts:77`

## 18. Quy trình phát triển

- Cấu hình môi trường: `NEXT_PUBLIC_API_URL_DOTNET`, `NEXT_PUBLIC_API_URL_JAVA`
- Luồng thêm tính năng:
  - Tạo types → service → hooks → components
  - Định nghĩa query keys → invalidation trên mutation
  - Thông báo lỗi/thành công bằng toast

## 19. Cách thêm một Service mới (How-to)

- Bước 1: Khai báo endpoint trong `src/lib/config/api.config.ts`
- Bước 2: Viết service sử dụng `axiosDotnet`/`axiosJava`
- Bước 3: Tạo hooks `useQuery`/`useMutation` với query keys riêng
- Bước 4: Gắn vào container component (không gọi hooks trong component con)

## 20. Tham chiếu mã nguồn nhanh

- `API_CONFIG` và endpoints: `src/lib/config/api.config.ts:1`
- Axios clients: `src/shared/services/http/axios.client.ts:4`
- Interceptors: `src/shared/services/http/interceptors.ts:5`
- Query Provider: `src/providers/QueryProvider.tsx:5`
- App Provider: `src/providers/AppProvider.tsx:14`
- Auth slice: `src/lib/store/slices/authSlice.ts:1`
- Auth hooks: `src/shared/hooks/useAuth.ts:18`
- Cookies utils: `src/lib/utils/cookies.utils.ts:1`
- Sản phẩm service: `src/features/customer/products/services/product.service.ts:1`

---

## 21. Nguồn tham khảo theo hạng mục

- Frameworks:
  - Next.js: https://nextjs.org/docs
  - React: https://react.dev
  - TypeScript: https://www.typescriptlang.org/docs/
  - Django (tổ chức tài liệu tham chiếu): https://docs.djangoproject.com
- State & Data:
  - TanStack Query: https://tanstack.com/query/latest/docs/react/overview
  - Redux Toolkit: https://redux-toolkit.js.org/
  - React Redux: https://react-redux.js.org/
- HTTP & API:
  - Axios: https://axios-http.com/docs/intro
  - RESTful Guidelines: https://restfulapi.net
  - Swagger/OpenAPI 3.1: https://swagger.io/specification
- Database:
  - MySQL Documentation: https://dev.mysql.com/doc
- UI & Styling:
  - Tailwind CSS: https://tailwindcss.com/docs
  - shadcn/ui: https://ui.shadcn.com/
  - Radix UI Primitives: https://www.radix-ui.com/docs/primitives/overview/introduction
  - Sonner (toast): https://sonner.emilkowal.ski/
  - Lucide React (icons): https://lucide.dev/docs/lucide-react/
- Utilities:
  - Lodash: https://lodash.com/docs

Tài liệu này mô phỏng cấu trúc và tinh thần tổng quan của Django docs, kết hợp chuẩn RESTful, OpenAPI, React TypeScript và các khuyến nghị MySQL ở mức định hướng cho client. Nội dung bám sát thực tế mã nguồn hiện có và cung cấp đường dẫn nhanh tới các khu vực quan trọng.
