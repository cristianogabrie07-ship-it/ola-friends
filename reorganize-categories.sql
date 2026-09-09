-- ============================================================
-- REORGANIZAÇÃO DE CATEGORIAS — Martins Multimarcas
-- Foco: camisa Dry Fit Nike/Adidas, camisa de time europeu,
-- bermuda Dry Fit e bermuda jeans.
-- Remove: Relógios e Acessórios (sem produtos cadastrados).
-- Rode no Supabase Dashboard → SQL Editor
-- ============================================================

-- 1) Novas categorias (só cria se não existir)
INSERT INTO public.categories (name, slug)
SELECT v.name, v.slug FROM (VALUES
  ('Camisa Dry Fit', 'camisa-dry-fit'),
  ('Camisas de Time Europeu', 'camisas-de-time-europeu'),
  ('Bermuda Dry Fit', 'bermuda-dry-fit'),
  ('Bermuda Jeans', 'bermuda-jeans')
) AS v(name, slug)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.slug = v.slug);

-- 2) Mover camisas de times EUROPEUS para a nova categoria
--    (lista por nome — se um time novo não cair na lista, fica em Camisas de Time)
UPDATE public.products p
SET category_id = (SELECT id FROM public.categories WHERE slug = 'camisas-de-time-europeu')
WHERE p.category_id = (SELECT id FROM public.categories WHERE slug = 'camisas-de-time')
AND p.name ~* '(chelsea|borussia|arsenal|manchester|barcelona|psg|real madrid|milan|liverpool|juventus|inter|al-nassr|bayern|dortmund|atletico madrid|benfica|porto|ajax|napoli|roma|tottenham|newcastle|sevilla)';

-- 3) Remover Relógios e Acessórios (sem produtos — verificado antes)
DELETE FROM public.categories WHERE slug IN ('relogios', 'acessorios');

-- 4) Conferir o resultado
SELECT c.name AS categoria, COUNT(p.id) AS produtos
FROM public.categories c
LEFT JOIN public.products p ON p.category_id = c.id
GROUP BY c.name
ORDER BY c.name;
