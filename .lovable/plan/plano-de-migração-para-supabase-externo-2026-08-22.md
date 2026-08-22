# Plano de Migração para Supabase Externo

Este plano descreve os passos para migrar o backend da Martins Multimarcas (atualmente no Lovable Cloud) para um projeto Supabase próprio (externo).

## O que será feito

1.  **Levantamento do Schema**: Script SQL completo com todas as tabelas, enums, funções e políticas de RLS.
2.  **Configuração do Novo Supabase**: Instruções para executar o SQL no novo projeto.
3.  **Conexão do Projeto**: Instruções para conectar o Lovable ao novo banco de dados.

## Script SQL Completo

Execute o script abaixo no **SQL Editor** do seu novo projeto Supabase:

```sql
-- 1. ENUMS E TIPOS
CREATE TYPE public.app_role AS enum ('admin', 'moderator', 'user');

-- 2. TABELAS
-- user_roles
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- categories
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    image_url text,
    created_at timestamptz DEFAULT now()
);

-- products
CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    promo_price numeric,
    category_id uuid REFERENCES public.categories(id),
    images text[] DEFAULT '{}',
    sizes text[] DEFAULT '{}',
    stock_quantity integer DEFAULT 0,
    is_active boolean DEFAULT true,
    is_sold_out boolean DEFAULT false,
    water_resistance text, -- Para Relógios
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- coupons
CREATE TABLE public.coupons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value numeric NOT NULL,
    expiry_date timestamptz,
    usage_limit integer,
    used_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- orders
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    address text NOT NULL,
    total_amount numeric NOT NULL,
    status text DEFAULT 'pending',
    pix_code text,
    items jsonb NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 3. PERMISSÕES (GRANTS)
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;

GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;

GRANT SELECT ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;

GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

-- 4. SEGURANÇA (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. FUNÇÕES DE SEGURANÇA
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    from public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 6. POLÍTICAS
-- Categorias e Produtos: Leitura pública, Escrita Admin
CREATE POLICY "Allow public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow admin all" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow public read active" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow admin all" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Cupons: Leitura autenticada, Escrita Admin
CREATE POLICY "Allow authenticated read" ON public.coupons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin all" ON public.coupons FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Pedidos: Usuário vê os próprios, Admin vê todos
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 7. SEEDS INICIAIS
INSERT INTO public.categories (name, slug) VALUES 
('Camisas de Time', 'camisas-de-time'),
('Conjuntos', 'conjuntos'),
('Bermudas', 'bermudas'),
('Acessórios', 'acessorios'),
('Relógios', 'relogios');
```

## Próximos Passos

1.  **Execute o SQL**: Copie o código acima e rode no Editor SQL do seu novo projeto Supabase.
2.  **Conecte no Lovable**:
    *   Vá em **Settings > Integrations** no painel do Lovable.
    *   Encontre a integração do **Supabase**.
    *   Clique em **Connect existing project** (ou similar).
    *   Siga o fluxo de autenticação para selecionar o seu projeto externo `ntvyzfcpajcsmmmdgmlt`.
3.  **Verificação**: Após a conexão, o Lovable atualizará as chaves `SUPABASE_URL` e `SUPABASE_ANON_KEY` automaticamente.
4.  **Admin**: Registre-se no site e use o SQL Editor para se tornar admin:
    ```sql
    INSERT INTO public.user_roles (user_id, role) 
    VALUES ('SEU_USER_ID_AQUI', 'admin');
    ```

## Detalhes Técnicos
*   **Database**: Supabase (PostgreSQL).
*   **Auth**: Supabase Auth (Email, com confirmação desativada se configurado no novo painel).
*   **RLS**: Proteção de dados por papel de usuário (admin).
