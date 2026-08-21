# Implementation Plan - Martins Multimarcas E-commerce

Build a complete sports apparel e-commerce site with integrated PIX payments and a management panel.

## User Review Required

> [!IMPORTANT]
> The site will include an admin panel at `/admin`. Please specify if you have a preferred email for the initial admin user, or I will set up the structure for you to register yourself.

## Proposed Changes

### 1. Database & Auth (Lovable Cloud)
- Create `products` table: `id`, `name`, `description`, `price`, `promo_price`, `stock`, `sizes` (array), `category`, `images` (array), `water_resistance` (for watches), `is_active`, `is_sold_out`.
- Create `categories` table: `id`, `name`, `slug`, `image`.
- Create `orders` table: `id`, `user_id`, `total`, `status`, `payment_method`, `customer_details` (JSON), `items` (JSON).
- Create `coupons` table: `id`, `code`, `discount_percent`, `expiry`, `usage_limit`.
- Set up `user_roles` for Admin access.
- Enable RLS and set grants for `authenticated` and `anon` roles.

### 2. Styling & Layout (`src/styles.css`, `src/routes/__root.tsx`)
- Configure Tailwind v4 with the gold/mustard (#C9A227) theme.
- Import "Bungee" Google Font in `__root.tsx`.
- Implement the two-line gold header and footer.
- Add floating WhatsApp button.

### 3. Core Features & Routes
- **Index (`/`)**: Hero banner with Bungee font, category carousel (circles with gold borders), featured products.
- **Shop (`/shop`)**: Product listing with sidebar filters (category, size, price, sorting).
- **Product (`/product/$id`)**: Image gallery, size selection, WhatsApp/PIX purchase buttons.
- **Cart & Checkout**: Persistent cart using local storage, coupon application, customer data form, PIX integration placeholder.

### 4. Admin Panel (`/admin`)
- Protected route using Supabase Auth and `has_role` check.
- Dashboard with sales metrics.
- CRUD interfaces for Products, Categories, and Coupons.
- Order management with status updates.

## Technical Details
- **Framework**: TanStack Start v1 (React 19).
- **Styling**: Tailwind CSS v4.
- **Backend**: Lovable Cloud (PostgreSQL + Auth).
- **Icons**: Lucide React.
- **State Management**: TanStack Query for data, simple hook for Cart.

```text
/
├── __root.tsx (Layout, Font, Global Header)
├── index.tsx (Hero, Categories, Highlights)
├── shop/index.tsx (Product Grid, Filters)
├── product/$id.tsx (Details, Purchase)
├── cart.tsx (Shopping Cart)
├── checkout.tsx (Customer Info, Payment)
├── admin/
│   ├── index.tsx (Dashboard)
│   ├── products.tsx (Inventory)
│   ├── orders.tsx (Sales)
│   └── coupons.tsx (Promotions)
```
