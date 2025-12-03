# Implementation Plan

## Phase 1: Loại bỏ Dynamic Rendering và Enable Static Generation

- [x] 1. Xóa cookies() calls trong public pages

  - Xóa `getAuthTokenFromServerCookies()` trong `src/services/api/users/product.server.cached.ts`
  - Xóa `getAuthTokenFromServerCookies()` trong các server components khác
  - Chỉ dùng cookies trong middleware, không dùng trong server components
  - _Requirements: 4.5_

- [x] 2. Implement middleware-based authentication

  - Tạo file `middleware.ts` ở root để handle auth
  - Inject Authorization header từ cookie vào requests
  - Redirect protected routes nếu chưa login
  - _Requirements: 4.5_

- [x] 3. Update cache configuration cho data fetching

  - Verify `product.server.cached.ts` có revalidate: 60
  - Verify product list có revalidate: 30
  - Verify categories có revalidate: 300
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 4. Verify build output

  - Chạy `npm run build`
  - Check build output xem homepage, product pages có static không
  - Verify không có warning về dynamic rendering
  - _Requirements: 1.1, 1.2_

## Phase 2: Code Splitting - Giảm Bundle Size

- [x] 5. Dynamic import cho modals

  - Tạo `src/components/common/DynamicModals.tsx`
  - Convert QuickViewModal sang dynamic import với ssr: false
  - Convert AddressSelectModal sang dynamic import
  - Convert CategorySelectionModal sang dynamic import
  - Update các components sử dụng modals để dùng dynamic version
  - _Requirements: 3.2_

- [x] 6. Dynamic import cho Rich Text Editor

  - Tạo `src/components/common/DynamicRichTextEditor.tsx`
  - Convert RichTextEditor sang dynamic import với ssr: false
  - Update các pages sử dụng editor (create/edit product, voucher)
  - _Requirements: 3.4_

- [x] 7. Dynamic import cho Charts

  - Tạo `src/components/charts/DynamicCharts.tsx`
  - Convert DashboardCharts sang dynamic import
  - Convert VoucherDashboardCharts sang dynamic import
  - Update dashboard pages để dùng dynamic charts
  - _Requirements: 3.5_

- [x] 8. Update next.config.ts với package optimization

  - Thêm `experimental.optimizePackageImports` cho Radix UI
  - Thêm optimization cho lucide-react, @tabler/icons-react
  - Thêm optimization cho recharts, lodash
  - _Requirements: 2.3_

- [x] 9. Verify bundle size reduction

  - Chạy `npm run build`
  - Check bundle sizes trong build output
  - Verify initial bundle < 200KB cho mỗi route
  - _Requirements: 1.3_

## Phase 3: Optimize Data Fetching

- [ ] 10. Wrap fetch functions với React cache()

  - Verify `createCachedFetcher` đang dùng React cache
  - Check tất cả server fetch functions đã wrapped
  - _Requirements: 4.1_

- [ ] 11. Implement parallel data fetching

  - Tìm pages có multiple API calls
  - Convert sang Promise.all hoặc Promise.allSettled
  - Ví dụ: product detail page (product + recommendations + reviews)
  - _Requirements: 4.2_

- [ ] 12. Add error handling cho SSG

  - Wrap data fetching trong try-catch
  - Return fallback data khi error
  - Verify build không fail khi API error
  - _Requirements: 4.3_

- [ ] 13. Add Suspense boundaries cho non-critical content

  - Wrap product recommendations trong Suspense
  - Wrap reviews section trong Suspense
  - Wrap similar products trong Suspense
  - Add skeleton fallbacks
  - _Requirements: 4.4, 9.1, 9.2_

- [ ] 14. Verify data fetching improvements
  - Chạy `npm run build`
  - Test pages load nhanh hơn
  - Check không có duplicate requests
  - _Requirements: 4.1, 4.2_

## Phase 4: Image Optimization

- [ ] 15. Audit và fix image usage

  - Scan codebase tìm `<img>` tags
  - Convert tất cả sang Next.js `<Image>` component
  - Add width/height hoặc fill prop
  - _Requirements: 7.1, 7.5_

- [ ] 16. Add lazy loading cho below-fold images

  - Remove `priority` prop từ product grid images
  - Remove `priority` từ images trong lists
  - Chỉ giữ `priority` cho hero images
  - _Requirements: 7.2, 7.4_

- [x] 17. Add responsive sizes prop

  - Add `sizes` prop cho tất cả Image components
  - Ví dụ: `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"`
  - _Requirements: 7.3_

- [x] 18. Verify image optimization

  - Chạy `npm run build`
  - Check không có layout shift warnings
  - Test images load properly
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

## Phase 5: Final Optimizations

- [x] 19. Update font loading

  - Verify fonts trong `src/app/layout.tsx` dùng next/font
  - Check font-display: swap được set
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 20. Configure webpack optimization

  - Update next.config.ts với webpack splitChunks config
  - Separate vendor, common, ui, charts chunks
  - _Requirements: 2.1_

- [x] 21. Add Error Boundaries

  - Tạo Error Boundary component
  - Wrap Suspense boundaries với Error Boundaries
  - Add error fallback UI
  - _Requirements: 9.4_

- [x] 22. Verify above-fold content không wrapped trong Suspense

  - Check homepage hero section
  - Check product detail main content
  - Ensure critical content renders immediately
  - _Requirements: 9.5_

- [x] 23. Update generateStaticParams limits

  - Limit product pages to top 100 trong `generateStaticParams`
  - Add timeout handling (30s max)
  - Set `dynamicParams = true`
  - _Requirements: 8.1, 8.2, 8.4_

- [x] 24. Final build verification

  - Chạy `npm run build`

  - Check build time < 5 minutes
  - Verify > 100 static pages
  - Check bundle sizes < 200KB
  - Test pages load nhanh
  - _Requirements: 1.1, 1.2, 1.3_

## Checkpoint

- [ ] 25. Final testing và verification
  - Test homepage loads nhanh
  - Test product listing pages
  - Test product detail pages
  - Test shop dashboard (với dynamic imports)
  - Verify không có errors trong console
  - Check build output cho performance metrics
