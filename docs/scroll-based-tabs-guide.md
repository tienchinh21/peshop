# Scroll-Based Tabs Implementation Guide

## Overview

The product creation page (`/shop/san-pham/them`) implements a scroll-based tab navigation system where:

1. **Scroll Detection**: When you scroll through the page, the active tab automatically updates based on which section is currently visible
2. **Click Navigation**: Clicking on a tab smoothly scrolls to the corresponding section
3. **Sticky Header**: The tab navigation remains fixed at the top while scrolling

## Implementation Details

### 1. Main Component Structure

```typescript
// CreateProductPage.tsx
const tabs = [
  { id: "basic-info", label: "Thông tin cơ bản" },
  { id: "product-info", label: "Thông tin bán hàng" },
  { id: "shipping", label: "Vận chuyển" },
  { id: "other-info", label: "Thông tin khác" },
];
```

### 2. Scroll Detection Logic

```typescript
useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 100; // Offset for header

    for (const tab of tabs) {
      const section = sectionsRef.current[tab.id];
      if (section) {
        const { offsetTop, offsetHeight } = section;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveTab(tab.id);
          break;
        }
      }
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

### 3. Smooth Scroll Navigation

```typescript
const scrollToSection = (tabId: string) => {
  const section = sectionsRef.current[tabId];
  if (section) {
    const headerOffset = 80; // Account for sticky header
    const elementPosition = section.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};
```

### 4. Section Registration

```typescript
const registerSection = (id: string, element: HTMLElement | null) => {
  sectionsRef.current[id] = element;
};

// Usage in JSX
<Card
  ref={(el) => registerSection("basic-info", el)}
  className="scroll-mt-20"
>
```

## Key Features

### 1. Sticky Tab Navigation
- Uses `sticky top-0 z-40` classes
- Remains visible while scrolling
- Orange accent color for active tab

### 2. Smooth Scrolling
- `scroll-behavior: smooth` for natural transitions
- Accounts for sticky header offset
- Proper scroll positioning

### 3. Visual Feedback
- Active tab highlighted with orange color
- Bottom border indicator for active state
- Hover effects for better UX

### 4. Responsive Design
- Works on all screen sizes
- Mobile-friendly touch interactions
- Proper spacing and typography

## Components Structure

```
src/views/pages/shop/san-pham/them/
├── CreateProductPage.tsx           # Main page component
├── components/
│   ├── ScrollBasedTabs.tsx        # Tab navigation component
│   ├── BasicInfoSection.tsx       # First tab content (implemented)
│   ├── ProductInfoSection.tsx     # Second tab content (placeholder)
│   ├── ShippingSection.tsx        # Third tab content (placeholder)
│   └── OtherInfoSection.tsx       # Fourth tab content (placeholder)
```

## Current Implementation Status

### ✅ Completed
- [x] Scroll-based tab navigation system
- [x] Smooth scroll to section on tab click
- [x] Sticky tab header
- [x] Basic Info Section with full form implementation
- [x] Image upload functionality (product images, cover image)
- [x] Video upload functionality
- [x] Product name input with character counter
- [x] Category selection dropdown

### 🚧 In Progress
- [ ] Product Info Section (pricing, inventory, variants)
- [ ] Shipping Section (weight, dimensions, shipping costs)
- [ ] Other Info Section (description, warranty, SEO)

### 📋 Next Steps
1. Implement remaining tab sections
2. Add form validation
3. Connect to backend APIs
4. Add save/draft functionality
5. Add preview functionality

## Usage Example

```typescript
// Access the page
// Navigate to: /shop/san-pham/them

// The page will automatically:
// 1. Show "Thông tin cơ bản" tab as active initially
// 2. Update active tab as you scroll through sections
// 3. Allow clicking tabs to jump to sections
// 4. Maintain sticky navigation at top
```

## Styling Notes

- Uses Tailwind CSS for styling
- Orange theme color (#f97316) for active states
- Card-based layout for each section
- Consistent spacing and typography
- Responsive grid layouts for form elements

## Browser Compatibility

- Modern browsers with CSS scroll-behavior support
- Fallback to instant scroll for older browsers
- Touch-friendly for mobile devices
- Keyboard navigation support
