-- ============================================================
-- SETUP: Storage de imagens de produtos (Martins Multimarcas)
-- Rode no Supabase Dashboard → SQL Editor
-- ============================================================

-- 1) Criar bucket público "product-images" (idempotente)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2) Remover políticas antigas (se existirem) para recriar limpas
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;

-- 3) Upload: apenas admins autenticados
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.has_role(auth.uid(), 'admin')
  );

-- 4) Leitura: público (a loja inteira precisa exibir as imagens)
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- 5) Atualizar/excluir: apenas admins (para gerenciar fotos de produtos)
CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Conferir o bucket criado:
SELECT id, name, public FROM storage.buckets WHERE id = 'product-images';
