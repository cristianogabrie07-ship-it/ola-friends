-- Reformulacao de categorias - Martins Multimarcas
-- 13 novas categorias + movimentacao automatica dos produtos.
-- Idempotente: pode rodar mais de uma vez sem problema.
-- Ja aplicado no banco em production (verificado) - este arquivo e registro.

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
  ('Acessorios',                 'acessorios')
) AS v(name, slug)
ON CONFLICT (slug) DO NOTHING;

-- 2a) Camisas femininas (nome contem FEMININA)
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.slug = 'camisas-femininas'
  AND p.name ILIKE '%feminina%';

-- 2b) Conjuntos para Conjuntos Masculino
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.slug = 'conjuntos-masculino'
  AND p.name ILIKE 'conjunto%';

-- 2c) Camisas de time nacional
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.slug = 'camisas-time-nacional'
  AND p.category_id IN (SELECT id FROM public.categories WHERE slug IN ('camisas-de-time','camisas-time-internacional'))
  AND (
    p.name ILIKE '%flamengo%' OR p.name ILIKE '%corinthians%' OR p.name ILIKE '%vasco%'
    OR p.name ILIKE '%palmeiras%' OR p.name ILIKE '%fluminense%' OR p.name ILIKE '%cruzeiro%'
    OR p.name ILIKE '%santos%' OR p.name ILIKE '%sao paulo%' OR p.name ILIKE '%sa paulo%'
    OR p.name ILIKE '%mineiro%'
  );

-- 2d) Restante das antigas para Camisas Time Internacional
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.slug = 'camisas-time-internacional'
  AND p.category_id IN (SELECT id FROM public.categories WHERE slug IN ('camisas-de-time','camisas-de-time-europeu'));

-- 3) Remover categorias antigas vazias
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

-- 4) Conferencia final: produtos por categoria
SELECT c.name AS categoria, COUNT(p.id) AS produtos
FROM public.categories c
LEFT JOIN public.products p ON p.category_id = c.id
GROUP BY c.name
ORDER BY c.name;
