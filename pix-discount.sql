-- ============================================
-- ADICIONAR DESCONTO PIX CONFIGURÁVEL
-- Rode no SQL Editor do Supabase Martins
-- ============================================

-- Coluna de desconto PIX (%) na tabela stores.
-- Padrão 0 = sem desconto até o admin definir o valor em /admin/settings.
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS pix_discount_percent NUMERIC DEFAULT 0;

-- Garantir que a loja existente comece sem desconto
UPDATE public.stores SET pix_discount_percent = 0 WHERE pix_discount_percent IS NULL;

-- Conferir:
-- SELECT id, name, whatsapp, pix_discount_percent FROM public.stores;