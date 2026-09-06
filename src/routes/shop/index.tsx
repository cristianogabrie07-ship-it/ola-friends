import { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ShopSidebar } from '@/components/shop/ShopSidebar';
import { ProductCard } from '@/components/shop/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getStorefrontCategories } from '@/lib/storefront.functions';

const shopSearchSchema = z.object({
  category: z.string().optional(),
  sale: z.boolean().optional(),
  sort: z.string().optional(),
});

export const Route = createFileRoute('/shop/')({
  validateSearch: (search) => shopSearchSchema.parse(search),
  component: ShopPage,
});

function ShopPage() {
  const { category, sale } = Route.useSearch();
  const [sort, setSort] = useState('az');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(category ? [category] : []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: () => getProducts(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['shop-categories'],
    queryFn: () => getStorefrontCategories(),
  });

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  };

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const categorySlug = (p as any).categories?.slug;
      if (selectedCategories.length > 0 && !selectedCategories.includes(categorySlug)) return false;
      if (selectedSizes.length > 0 && !(p.sizes || []).some((s) => selectedSizes.includes(s))) return false;
      if (sale && !p.promo_price) return false;
      return true;
    });

    if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'low') list.sort((a, b) => (a.promo_price || a.price) - (b.promo_price || b.price));
    else if (sort === 'high') list.sort((a, b) => (b.promo_price || b.price) - (a.promo_price || a.price));

    return list;
  }, [products, selectedCategories, selectedSizes, sale, sort]);

  const pageTitle = sale ? 'Liquidação' : selectedCategories.length === 1
    ? categories.find((c) => c.slug === selectedCategories[0])?.name || 'Produtos'
    : 'Todos os Produtos';

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-72 flex-shrink-0">
            <ShopSidebar
              categories={categories}
              products={products as any}
              selectedCategories={selectedCategories}
              selectedSizes={selectedSizes}
              onToggleCategory={toggleCategory}
              onToggleSize={toggleSize}
            />
          </aside>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <h1 className="text-lg font-bold uppercase tracking-wider text-[#C9A84C]">{pageTitle}</h1>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#A0A0A0]">{filteredProducts.length} produtos</span>
                <select
                  className="bg-[#0D0D0D] border border-[#C9A84C33] text-[#D9D9D9] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A84C]"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="az">A-Z</option>
                  <option value="low">Menor preço</option>
                  <option value="high">Maior preço</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[4/5] bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            ) : (
              <div className="py-16 md:py-24 text-center border border-dashed border-[#C9A84C33] rounded-2xl">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-[#C9A84C44] flex items-center justify-center text-[#C9A84C] text-xl">
                  🛍️
                </div>
                <p className="text-[#D9D9D9] font-semibold">Nenhum produto encontrado</p>
                <p className="text-[#A0A0A0] text-sm mt-1">Tente ajustar os filtros selecionados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
