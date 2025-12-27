# Design Document: Mobile Responsive Audit

## Overview

Tài liệu này mô tả thiết kế kỹ thuật để kiểm tra và sửa lỗi responsive design cho các trang customer của PeShop. Dự án sử dụng Tailwind CSS với các breakpoints chuẩn và shadcn/ui components.

### Tailwind CSS Breakpoints

```
sm: 640px   - Small devices (landscape phones)
md: 768px   - Medium devices (tablets)
lg: 1024px  - Large devices (desktops)
xl: 1280px  - Extra large devices
2xl: 1536px - 2X Extra large devices
```

### Mobile-First Approach

Tailwind CSS sử dụng mobile-first approach, nghĩa là:

- Styles không có prefix áp dụng cho tất cả kích thước (bắt đầu từ mobile)
- `md:` prefix áp dụng từ 768px trở lên
- `lg:` prefix áp dụng từ 1024px trở lên

## Architecture

### Component Structure

```
src/features/customer/
├── products/components/detail/
│   ├── ProductDetailPage.tsx      # Main page wrapper
│   ├── ProductDetailClient.tsx    # Client component with state
│   ├── ProductImageGallery.tsx    # Image carousel + thumbnails
│   ├── ProductInfoSection.tsx     # Product info + variants + actions
│   ├── ProductTabs.tsx            # Description/Reviews tabs
│   └── ShopInfoCard.tsx           # Shop information
├── cart/components/
│   └── CartPage.tsx               # Cart page
├── checkout/components/
│   └── CheckoutPage.tsx           # Checkout page
├── orders/components/
│   └── OrdersPage.tsx             # Orders list page
├── wishlist/components/
│   └── WishlistPage.tsx           # Wishlist page
└── search/components/
    └── SearchResultsPage.tsx      # Search results
```

### Responsive Design Patterns

#### 1. Grid Layout Pattern

```tsx
// Desktop: 2 columns, Mobile: 1 column
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <div className="lg:col-span-5">Image Gallery</div>
  <div className="lg:col-span-7">Product Info</div>
</div>
```

#### 2. Flex Wrap Pattern

```tsx
// Buttons wrap on mobile
<div className="flex flex-col sm:flex-row gap-3">
  <Button className="flex-1">Add to Cart</Button>
  <Button className="flex-1">Buy Now</Button>
</div>
```

#### 3. Touch Target Pattern

```tsx
// Minimum 44x44px touch targets
<Button size="icon" className="h-11 w-11 min-h-[44px] min-w-[44px]">
  <Icon />
</Button>
```

## Components and Interfaces

### ProductDetailClient Changes

```tsx
interface ProductDetailClientProps {
  slug: string;
  initialData: ProductDetail;
}

// Current layout (problematic on mobile):
<div className="grid gap-6 lg:grid-cols-12">
  <div className="lg:col-span-5">...</div>
  <div className="lg:col-span-7">...</div>
</div>

// Fixed layout:
<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
  <div className="lg:col-span-5 space-y-6">
    <ProductImageGallery />
    <PromotionGiftSection />
    <PromotionRequirementSection />
  </div>
  <div className="lg:col-span-7">
    <ProductInfoSection />
    <ShopInfoCard />
  </div>
</div>
```

### ProductImageGallery Changes

```tsx
// Current thumbnail grid (7 columns - too many for mobile):
<div className="grid grid-cols-7 gap-2">

// Fixed thumbnail grid:
<div className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-7 lg:overflow-visible">
  {images.map((image, index) => (
    <button className="flex-shrink-0 w-14 h-14 lg:w-auto lg:h-auto lg:aspect-square">
      ...
    </button>
  ))}
</div>
```

### ProductInfoSection Changes

```tsx
// Current action buttons (horizontal):
<div className="flex gap-3">
  <Button className="flex-1">Add to Cart</Button>
  <Button className="flex-1">Buy Now</Button>
  <Button size="icon">Heart</Button>
</div>

// Fixed action buttons (stack on mobile):
<div className="flex flex-col gap-3 sm:flex-row">
  <Button className="flex-1 min-h-[44px]">Add to Cart</Button>
  <Button className="flex-1 min-h-[44px]">Buy Now</Button>
  <Button size="icon" className="h-11 w-11 sm:h-12 sm:w-12">Heart</Button>
</div>

// Current quantity controls:
<Button size="icon" className="h-10 w-10">

// Fixed quantity controls (larger touch targets):
<Button size="icon" className="h-11 w-11 min-h-[44px] min-w-[44px]">
```

### Variant Selection Changes

```tsx
// Current variant buttons:
<div className="flex flex-wrap gap-2">
  <button className="px-4 py-2">...</button>
</div>

// Fixed variant buttons (larger touch targets):
<div className="flex flex-wrap gap-2">
  <button className="min-h-[44px] min-w-[44px] px-4 py-2">...</button>
</div>
```

## Data Models

Không có thay đổi về data models. Các thay đổi chỉ liên quan đến CSS và layout.

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Touch Target Minimum Size

_For any_ interactive element (button, link, input) on mobile viewport, the element's computed width and height SHALL be at least 44 pixels.

**Validates: Requirements 1.3, 1.4, 3.3, 5.5, 6.3, 7.4, 8.5, 9.1**

### Property 2: Single Column Layout on Mobile

_For any_ page with multi-column layout (Product Detail, Cart, Checkout, Orders), when viewport width is less than 768px, the main content grid SHALL have only 1 column.

**Validates: Requirements 1.1, 3.1, 4.1, 5.1**

### Property 3: Two Column Product Grid on Mobile

_For any_ product listing page (Wishlist, Search Results), when viewport width is less than 768px, the product grid SHALL have exactly 2 columns.

**Validates: Requirements 6.1, 7.1**

### Property 4: Full Width Elements on Mobile

_For any_ primary action button or form input on mobile viewport, the element's width SHALL equal its container's width (100%).

**Validates: Requirements 1.5, 3.5, 4.2, 6.4, 7.5, 8.4**

### Property 5: Horizontal Scroll for Thumbnails on Mobile

_For any_ thumbnail gallery on mobile viewport, when there are more than 5 thumbnails, the container SHALL have horizontal scroll enabled (overflow-x: auto).

**Validates: Requirements 1.2, 2.2**

### Property 6: No Unintended Horizontal Scroll

_For any_ page on mobile viewport, the body element SHALL NOT have horizontal overflow except for intentional carousel/slider components.

**Validates: Requirements 9.4**

### Property 7: Minimum Text Size

_For any_ body text element on mobile viewport, the computed font-size SHALL be at least 16 pixels.

**Validates: Requirements 9.3**

### Property 8: Adequate Element Spacing

_For any_ pair of adjacent interactive elements, the gap between them SHALL be at least 8 pixels.

**Validates: Requirements 9.2**

### Property 9: Mobile Input Types

_For any_ form input field that accepts phone numbers, emails, or numbers, the input element SHALL have the appropriate type attribute (tel, email, number).

**Validates: Requirements 4.2, 9.5**

### Property 10: QuickView Modal Full Screen on Mobile

_For any_ QuickView modal on mobile viewport, the modal's width SHALL be at least 90% of viewport width.

**Validates: Requirements 8.1**

## Error Handling

### Graceful Degradation

- Nếu CSS không load được, layout vẫn hiển thị được (single column default)
- Nếu JavaScript không load được, các interactive elements vẫn accessible
- Images có fallback placeholder

### Edge Cases

- Rất nhiều variants: Sử dụng flex-wrap để tự động xuống dòng
- Rất nhiều thumbnails: Sử dụng horizontal scroll
- Text quá dài: Sử dụng text-truncate hoặc line-clamp
- Màn hình rất nhỏ (< 320px): Đảm bảo minimum padding

## Testing Strategy

### Unit Tests

Unit tests sẽ verify các specific examples và edge cases:

1. **Component Rendering Tests**: Verify components render correctly với different props
2. **Responsive Class Tests**: Verify correct Tailwind classes được apply
3. **Touch Target Tests**: Verify button/link sizes meet minimum requirements

### Property-Based Tests

Property-based tests sẽ verify universal properties across all inputs:

1. **Touch Target Property Test**: Generate random interactive elements, verify all have min 44x44px
2. **Layout Property Test**: Generate random viewport widths, verify correct column count
3. **Spacing Property Test**: Generate random element pairs, verify adequate spacing

### Visual Regression Tests

- Screenshot comparison ở các breakpoints: 320px, 375px, 414px, 768px, 1024px
- Sử dụng Playwright hoặc Cypress cho visual testing

### Manual Testing Checklist

- [ ] Test trên iPhone SE (320px width)
- [ ] Test trên iPhone 12/13 (390px width)
- [ ] Test trên iPhone 12/13 Pro Max (428px width)
- [ ] Test trên iPad (768px width)
- [ ] Test landscape orientation
- [ ] Test với zoom 200%

### Testing Framework

- **Unit/Integration**: Jest + React Testing Library
- **E2E/Visual**: Playwright
- **Property-Based**: fast-check (nếu cần)

Mỗi property test sẽ chạy minimum 100 iterations để đảm bảo coverage.
