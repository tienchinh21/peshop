# Shop Product Table Components

Clean, modular table components for displaying shop products with filtering, sorting, and pagination.

## 📁 File Structure

```
src/components/shop/table/
├── ProductTable.tsx              # Main table component
├── ProductTableHeader.tsx        # Table header with column definitions
├── ProductTableRow.tsx           # Individual product row
├── ProductTableEmpty.tsx         # Empty state
├── ProductTableLoading.tsx       # Loading skeleton
├── ProductTablePagination.tsx    # Pagination controls
├── ProductTableExample.tsx       # Usage example
└── index.ts                      # Exports
```

## 🎯 Features

- ✅ **Product listing** with image, name, category, price, status
- ✅ **Action menu** for each product (view, edit, duplicate, delete)
- ✅ **Pagination** with page size selector
- ✅ **Loading state** with skeleton
- ✅ **Empty state** when no products
- ✅ **Type-safe** with TypeScript
- ✅ **Responsive** design
- ✅ **Extensible** architecture

## 🚀 Quick Start

### Basic Usage

```tsx
import { ProductTable } from "@/components/shop/table";

export default function ProductListPage() {
  const products = [...]; // Your products data
  const pagination = {...}; // Your pagination info
  
  return (
    <ProductTable
      products={products}
      pagination={pagination}
      isLoading={false}
      onEdit={(product) => console.log("Edit", product)}
      onDelete={(product) => console.log("Delete", product)}
      onView={(product) => console.log("View", product)}
      onDuplicate={(product) => console.log("Duplicate", product)}
      onPageChange={(page) => console.log("Page", page)}
      onPageSizeChange={(size) => console.log("Size", size)}
    />
  );
}
```

### With React Query (Recommended)

```tsx
import { ProductTable } from "@/components/shop/table";
import { useShopProducts } from "@/hooks/shop/useShopProducts";

export default function ProductListPage() {
  const [filters, setFilters] = useState({ page: 1, size: 10 });
  
  const { data, isLoading } = useShopProducts(filters);
  
  return (
    <ProductTable
      products={data?.content.response || []}
      pagination={data?.content.info}
      isLoading={isLoading}
      onPageChange={(page) => setFilters({ ...filters, page })}
      onPageSizeChange={(size) => setFilters({ ...filters, size, page: 1 })}
    />
  );
}
```

## 📊 API Response Format

The table expects data in this format:

```typescript
{
  "error": null,
  "content": {
    "info": {
      "page": 1,      // Current page (1-based)
      "size": 10,     // Items per page
      "pages": 5,     // Total pages
      "total": 50     // Total items
    },
    "response": [
      {
        "id": "uuid",
        "name": "Product name",
        "imgMain": "image-url",
        "price": 1000000,
        "status": 1,
        "boughtCount": 100,
        "reviewPoint": 4.5,
        "slug": "product-slug",
        "category": {
          "id": "uuid",
          "name": "Category name",
          "type": "MAIN"
        },
        "categoryChild": {
          "id": "uuid",
          "name": "Sub-category name",
          "description": "Description"
        }
      }
    ]
  }
}
```

## 🎨 Product Status

Product status is defined in `src/lib/utils/enums/eProducts.ts`:

```typescript
export enum ProductStatus {
  LOCKED = 0,    // Sản phẩm bị khoá
  ACTIVE = 1,    // Sản phẩm đang hoạt động
  DELETED = 2,   // Sản phẩm đã xóa
  HIDDEN = 3,    // Ẩn sản phẩm khỏi người mua
}
```

Each status has a corresponding label and color:
- **LOCKED** (0): Red badge - "Bị khoá"
- **ACTIVE** (1): Green badge - "Đang hoạt động"
- **DELETED** (2): Gray badge - "Đã xóa"
- **HIDDEN** (3): Yellow badge - "Đã ẩn"

## 🔧 Customization

### Adding New Columns

1. Edit `ProductTableHeader.tsx` - Add new `<TableHead>`
2. Edit `ProductTableRow.tsx` - Add new `<TableCell>`

Example:

```tsx
// ProductTableHeader.tsx
<TableHead className="w-[100px]">Stock</TableHead>

// ProductTableRow.tsx
<TableCell>
  <span>{product.stock}</span>
</TableCell>
```

### Adding New Actions

Edit `ProductTableRow.tsx` dropdown menu:

```tsx
<DropdownMenuItem onClick={() => onCustomAction?.(product)}>
  <CustomIcon className="mr-2 h-4 w-4" />
  Custom Action
</DropdownMenuItem>
```

### Customizing Empty State

```tsx
<ProductTableEmpty 
  colSpan={7} 
  message="Custom empty message"
/>
```

### Customizing Loading Rows

```tsx
<ProductTableLoading rows={10} />
```

## 📦 Dependencies

- `@/components/ui/table` - Shadcn/ui Table component
- `@/components/ui/badge` - Badge component for status
- `@/components/ui/button` - Button component
- `@/components/ui/dropdown-menu` - Dropdown for actions
- `@/components/ui/select` - Select for page size
- `@/components/ui/skeleton` - Loading skeleton
- `lucide-react` - Icons

## 🔗 Related Files

- **Types**: `src/types/shops/product-list.type.ts`
- **Service**: `src/services/api/shops/product-list.service.ts`
- **Hook**: `src/hooks/shop/useShopProducts.ts`
- **Filter**: `src/components/shop/ProductListFilter.tsx`
- **Enums**: `src/lib/utils/enums/eProducts.ts`
- **Page**: `src/app/(protected)/shop/san-pham/page.tsx`
- **View**: `src/views/pages/shop/san-pham/ProductListPage.tsx`

## 💡 Tips

1. **Always use the hook** - `useShopProducts` handles caching and refetching
2. **Handle errors** - Show error messages when API fails
3. **Confirm deletes** - Use a dialog to confirm destructive actions
4. **Invalidate cache** - After mutations, invalidate the query cache
5. **Debounce search** - Use debouncing for search inputs (500ms recommended)

## 🐛 Troubleshooting

### Products not loading
- Check if API endpoint is correct (`/shop/product`)
- Verify authentication token is present
- Check network tab for errors

### Pagination not working
- Ensure `onPageChange` updates the filters state
- Remember: API uses 0-based page index, UI uses 1-based

### Images not showing
- Verify image URLs are accessible
- Check CORS settings if images are from different domain
- Use placeholder image for missing images

## 📝 Example: Complete Product List Page

See `src/views/pages/shop/san-pham/ProductListPage.tsx` for a complete implementation with:
- Filtering
- Sorting
- Pagination
- Delete confirmation
- Error handling
- Loading states

