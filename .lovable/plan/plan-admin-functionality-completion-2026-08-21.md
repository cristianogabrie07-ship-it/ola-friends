# Plan: Admin Functionality Completion

Complete the admin panel for "Martins Multimarcas" by implementing full product management, stock controls, and coupon management.

## Database (Supabase)
- The schema is already in place (`products`, `coupons`, `orders`, `user_roles`).
- RLS policies and `has_role` function are already implemented.

## Admin Features

### 1. Product Management (`/admin/products`)
- Implement a data table listing all products.
- Fields: Image, Name, Category, Price, Stock, Status.
- Add/Edit Form (Dialog):
  - Fields: Name, Description, Category (Select), Price, Promo Price, Sizes (Multi-select), Stock, Images (Multi-upload simulation), Status (Active/Sold Out).
  - Conditional field: "Water Resistance" only shown for "Relógios" category.
- Actions: Delete (with confirmation), Toggle active status.
- Logic: Automatically mark as "Esgotado" when stock reaches 0.

### 2. Stock Management
- Inline editing for stock quantity in the products table.
- Low stock visual indicator (Red/Icon) for quantities < 5.

### 3. Coupon Management (`/admin/coupons`)
- Data table listing all coupons.
- Fields: Code, Discount Type, Expiry, Usage, Status.
- Create/Edit Form (Dialog):
  - Fields: Code, Type (Fixed/Percent), Value, Expiry Date, Usage Limit.
- Actions: Delete, Toggle active status.

## Technical Details
- Use `@tanstack/react-query` for data fetching and mutations.
- Use `shadcn/ui` components: `Table`, `Dialog`, `Input`, `Select`, `Badge`, `Checkbox`.
- Ensure strict type safety using generated Supabase types.
- Maintain the "Gold/Mustard" theme and urban aesthetic.

## Implementation Steps
1. Create `ProductForm` and `ProductTable` components.
2. Update `/admin/products` route with full CRUD logic.
3. Create `CouponForm` and `CouponTable` components.
4. Update `/admin/coupons` route with full CRUD logic.
5. Verify auto-sold-out logic in product updates.
6. Verify access controls in the `/admin` layout.
