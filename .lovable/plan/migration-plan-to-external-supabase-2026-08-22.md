# Migration Plan to External Supabase

This plan outlines the steps and SQL scripts required to migrate the "Martins Multimarcas" database from Lovable Cloud to an external Supabase project.

## 1. Schema Overview
The current database consists of 5 tables, 1 custom type, and 1 security function.

### Tables
- `categories`: Product categories (Camisas, Conjuntos, etc.)
- `products`: Full product catalog with stock and RLS.
- `coupons`: Discount codes with usage limits.
- `orders`: Customer orders (PIX/WhatsApp).
- `user_roles`: Role management (Admin/User).

### Custom Types
- `app_role`: Enum with values `'admin'` and `'user'`.

### Functions
- `has_role`: Security definer function used for role-based RLS policies.

## 2. External Supabase Connection
To switch the application to your own Supabase project:
1. **In Lovable Dashboard**: Go to **Settings > Integrations** or the **Backend** tab.
2. Look for the option to "Connect an existing Supabase project".
3. Provide your `Project URL` and `anon key`.
4. Lovable will automatically update the environment variables in the project.
5. **Important**: You must run the SQL script provided below in your new Supabase project's **SQL Editor** *before* connecting, so the app finds the expected tables and functions.

## 3. SQL Migration Script
Run the following script in the Supabase SQL Editor of your new project.

```sql
-- 1. Create Role Enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- 3. Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    promo_price NUMERIC,
    stock INTEGER DEFAULT 0,
    sizes TEXT[] DEFAULT '{}',
    category_id UUID REFERENCES public.categories(id),
    images TEXT[] DEFAULT '{}',
    water_resistance TEXT,
    is_active BOOLEAN DEFAULT true,
    is_sold_out BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create coupons table
CREATE TABLE public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_percent INTEGER NOT NULL,
    expiry TIMESTAMPTZ,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    payment_method TEXT DEFAULT 'pix' NOT NULL,
    customer_details JSONB NOT NULL,
    items JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Grant Privileges (CRITICAL for Supabase)
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.coupons TO authenticated;
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

GRANT ALL ON public.categories TO service_role;
GRANT ALL ON public.products TO service_role;
GRANT ALL ON public.coupons TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.user_roles TO service_role;

-- 8. Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 9. Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 10. RLS Policies
-- Categories
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Products
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Coupons
CREATE POLICY "Users can select coupons" ON public.coupons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage coupons" ON public.coupons ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view and manage all orders" ON public.orders ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User Roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
```
