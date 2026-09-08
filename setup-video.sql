-- ============================================================
-- FEATURE: Vídeo do produto (1 vídeo + 1 foto por produto)
-- Rode no Supabase Dashboard → SQL Editor
-- ============================================================

-- 1) Coluna para a URL do vídeo do produto
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS video_url text;

-- 2) O bucket 'product-images' já aceita vídeos (qualquer tipo de arquivo).
--    Aumentar o limite de tamanho do upload para 50MB (limite do plano):
UPDATE storage.buckets
SET file_size_limit = 52428800
WHERE id = 'product-images';

-- 3) Conferir o resultado:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'video_url';
