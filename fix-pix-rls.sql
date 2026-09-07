-- ============================================================
-- CORREÇÃO: Desconto PIX + permissão de UPDATE na tabela stores
-- Rode no SQL Editor do Supabase (projeto Martins)
-- ============================================================

-- 1) Zerar o desconto PIX agora.
--    Com 0, o box verde do carrinho/checkout, o selo do banner e a
--    linha de desconto no WhatsApp desaparecem automaticamente.
UPDATE public.stores SET pix_discount_percent = 0;

-- 2) Permitir que admins autenticados gravem as configurações pelo painel.
--    (Sem esta política, o UPDATE do /admin/settings é bloqueado
--    silenciosamente pelo RLS — 0 linhas alteradas.)
DROP POLICY IF EXISTS "Admins can update store settings" ON public.stores;
CREATE POLICY "Admins can update store settings"
  ON public.stores FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3) (Opcional) Garantir que seu usuário é admin de verdade no banco.
--    O menu /admin usa uma lista de e-mails hardcoded, mas o BANCO usa a
--    tabela user_roles. Se os dois não baterem, o painel abre mas não salva.
--    Substitua o e-mail e rode:
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users WHERE email = 'seu-email@exemplo.com'
-- ON CONFLICT DO NOTHING;

-- Conferir:
-- SELECT name, pix_discount_percent FROM public.stores;
