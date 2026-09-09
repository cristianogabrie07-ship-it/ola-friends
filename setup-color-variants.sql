-- ============================================================
-- FEATURE: Variações de cor por produto
-- Rode no Supabase Dashboard → SQL Editor
-- ============================================================

-- Coluna que guarda as variações de cor do produto.
-- Formato: array de objetos [{"name": "Preto", "image": "https://..."}, ...]
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS color_variants jsonb DEFAULT '[]'::jsonb;

-- Conferir:
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'color_variants';
