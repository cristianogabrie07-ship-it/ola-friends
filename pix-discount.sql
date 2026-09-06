-- ============================================
-- ADICIONAR DESCONTO PIX CONFIGURÁVEL
-- Rode no SQL Editor do Supabase Martins
-- ============================================

-- Coluna de desconto PIX (%) na tabela stores
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS pix_discount_percent NUMERIC DEFAULT 10;

-- Garantir que a loja existente fique com 10% (valor padrão)
UPDATE public.stores SET pix_discount_percent = 10 WHERE pix_discount_percent IS NULL;

-- Conferir:
-- SELECT id, name, whatsapp, pix_discount_percent FROM public.stores;