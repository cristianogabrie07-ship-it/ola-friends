# Implementation Plan - Martins Multimarcas E-commerce

Build a complete sports apparel e-commerce site with integrated PIX payments and a management panel.

## User Review Required

> [!IMPORTANT]
> The admin panel at `/admin` will be protected by a role check. As requested, no admin user will be seeded. After you register your account through the site's login page, you will need to manually grant yourself the `admin` role in the `user_roles` table.

## Proposed Changes

### 1. Database & Auth (Lovable Cloud)
- Create `products` table: `id`, `name`, `description`, `price`, `promo_price`, `stock`, `sizes` (array), `category_id`, `images` (array), `water_resistance` (for watches), `is_active`, `is_sold_out`.
- Create `categories` table: `id`, `name`, `slug`, `image_url`.
- Create `orders` table: `id`, `user_id`, `total`, `status`, `payment_method`, `customer_details` (JSON), `items` (JSON).
- Create `coupons` table: `id`, `code`, `discount_percent`, `expiry`, `usage_limit`.
- Set up `app_role` enum and `user_roles` table for Admin access.
- Enable RLS and set grants for `authenticated` and `anon` roles.
- Create `has_role` security definer function.

### 2. Styling & Layout (`src/styles.css`, `src/routes/__root.tsx`)
- Configure Tailwind v4 with the gold/mustard (#C9A227) theme.
- Import "Bungee" Google Font via `<link>` in `__root.tsx`.
- Implement the two-line gold header and footer.
- Add floating WhatsApp button.

### 3. Core Features & Routes
- **Index (`/`)**: Hero banner (Bungee font), category carousel, featured products.
- **Shop (`/shop`)**: Product listing with filters (category, size, price, sorting).
- **Product (`/product/$id`)**: Image gallery, size selection, WhatsApp/PIX buttons.
- **Cart & Checkout**: Persistent cart, coupon logic, customer form.

### 4. Admin Panel (`/admin`)
- Protected route using `has_role(auth.uid(), 'admin')`.
- Dashboard and CRUDs for Products, Categories, and Coupons.
- Order management.

## Technical Details
- **Framework**: TanStack Start v1.
- **Styling**: Tailwind CSS v4.
- **Backend**: Lovable Cloud (Supabase).
- **Icons**: Lucide React.
- **Database**: PostgreSQL with RLS.

```text
/
├── __root.tsx (Global Layout)
├── index.tsx (Home)
├── shop/index.tsx (Product Grid)
├── product/$id.tsx (Details)
├── cart.tsx (Cart)
├── checkout.tsx (Checkout)
├── admin/
│   ├── route.tsx (Auth Guard)
│   ├── index.tsx (Dashboard)
│   ├── products.tsx (Inventory)
│   └── ...
```
