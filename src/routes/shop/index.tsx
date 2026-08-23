import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ShopSidebar } from '@/components/shop/ShopSidebar';
import { ProductCard } from '@/components/shop/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/storefront.functions';

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
  const { category, sale, sort } = Route.useSearch();
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["shop-products"],
    queryFn: () => getProducts(),
  });
  
  const filteredProducts = products.filter(p => {
    // Note: p.categories here refers to the joined category object if using getProducts with join
    // The current getProducts returns a flat structure or nested categories depending on the query
    // Adjusting based on common Supabase return patterns
    const categorySlug = (p as any).categories?.slug;
    
    if (category && categorySlug !== category) return false;
    if (sale && !p.promo_price) return false;
    return true;
  });

  // Sort logic
  if (sort === 'az') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'low') {
    filteredProducts.sort((a, b) => (a.promo_price || a.price) - (b.promo_price || b.price));
  } else if (sort === 'high') {
    filteredProducts.sort((a, b) => (b.promo_price || b.price) - (a.promo_price || a.price));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <ShopSidebar currentCategory={category} />
        </aside>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold uppercase">
              {category ? category.replace(/-/g, ' ') : sale ? 'Liquidação' : 'Todos os Produtos'}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{filteredProducts.length} produtos</span>
              <select 
                className="border p-2 text-sm bg-white"
                value={sort || 'az'}
                onChange={(e) => {
                  // This is a simplified sort handling, in a real app this would navigate to update search params
                }}
              >
                <option value="az">A-Z</option>
                <option value="low">Menor preço</option>
                <option value="high">Maior preço</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-lg" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground italic">Nenhum produto cadastrado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
