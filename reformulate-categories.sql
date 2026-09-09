-- ============================================================
-- REFORMULAÇÃO DE CATEGORIAS — Martins Multimarcas
-- 13 novas categorias pedidas pelo dono.
-- Produtos são movidos automaticamente:
--   * "... FEMININA"  -> Camisas Femininas
--   * "CONJUNTO ..."  -> Conjuntos Masculino
--   * Brasileiras     -> Camisas Time Nacional
--   * Europa/Inter Miami/Al-Nassr -> Camisas Time Internacional
-- Categorias antigas vazias são removidas.
-- Rode no Supabase Dashboard → SQL Editor (idempotente)
-- ============================================================

-- 1) Criar as 13 categorias novas
INSERT INTO public.categories (name, slug)
SELECT v.name, v.slug FROM (VALUES
  ('Shorts Masculinos',          'shorts-masculinos'),
  ('Shorts Femininos',           'shorts-femininos'),
  ('Conjuntos Masculino',        'conjuntos-masculino'),
  ('Conjuntos Feminino',         'conjuntos-feminino'),
  ('Camisas Masculinas',         'camisas-masculinas'),
  ('Camisas Femininas',          'camisas-femininas'),
  ('Infantil',                   'infantil'),
  ('Camisas Manga Longa',        'camisas-manga-longa'),
  ('Camisas Regatas',            'camisas-regatas'),
  ('Camisas Time Internacional', 'camisas-time-internacional'),
  ('Camisas Time Nacional',      'camisas-time-nacional'),
  ('Meias',                      'meias'),
  ('Acessórios',                 'acessorios')
) AS v(name, slug)
ON CONFLICT (slug) DO NOTHING;

-- 2) Mover produtos para as categorias novas

-- 2a) Camisas femininas (nome contém FEMININA)
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.slug = 'camisas-femininas'
  AND p.name ILIKE '%feminina%';

-- 2b) Conjuntos -> Conjuntos Masculino
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.slug = 'conjuntos-masculino'
  AND p.name ILIKE 'conjunto%';

-- 2c) Camisas de time nacional (Flamengo, Corinthians, Vasco, Palmeiras,
--     Fluminense, Cruzeiro, Santos, São Paulo, Atlético Mineiro)
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.slug = 'camisas-time-nacional'
  AND p.category_id = (SELECT id FROM public.categories WHERE slug = 'camisas-de-time')
  AND (p.name ILIKE '%flamengo%' OR p.name ILIKE '%corinthians%' OR p.name ILIKE '%vasco%'
       OR p.name ILIKE '%palmeiras%' OR p.name ILIKE '%fluminense%' OR p.name ILIKE '%cruzeiro%'
       OR p.name ILIKE '%santos%' OR p.name ILIKE '%são paulo%' OR p.name ILIKE '%sao paulo%'
       OR p.name ILIKE '%atletico mineiro%' OR p.name ILIKE '%atlético mineiro%');

-- 2d) Camisas de time internacional (tudo que sobrou em "Camisas de Time"
--     e "Camisas de Time Europeu": Real Madrid, Barcelona, Chelsea, PSG,
--     Milan, Liverpool, Juventus, Arsenal, Man City/United, Borussia,
--     Inter Miami, Al-Nassr etc.)
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.slug = 'camisas-time-internacional'
  AND p.category_id IN (
    (SELECT id FROM public.categories WHERE slug = 'camisas-de-time'),
    (SELECT id FROM public.categories WHERE slug = 'camisas-de-time-europeu')
  );

-- 3) Remover categorias antigas (só se estiverem vazias — verificação antes de apagar)
DELETE FROM public.categories c
WHERE c.slug IN (
  'camisas-de-time',
  'camisas-de-time-europeu',
  'conjuntos',
  'camisa-dry-fit',
  'bermuda-dry-fit',
  'bermuda-jeans'
)
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE p.category_id = c.id);

-- 4) Conferência final: produtos por categoria
SELECT c.name AS categoria, COUNT(p.id) AS produtos
FROM public.categories c
LEFT JOIN public.products p ON p.category_id = c.id
GROUP BY c.name
ORDER BY c.name;
