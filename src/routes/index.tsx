import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Banner from "@/components/Banner";
import { BestSellers } from "@/components/home/BestSellers";
import { Categories } from "@/components/home/Categories";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "@/lib/storefront.functions";

export const Route = createFileRoute("/")({
  component: HomePage,
});

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [filters, setFilters] = useState<{ sizes: string[]; priceRange: { min: number; max: number } | null }>({
    sizes: [],
    priceRange: null,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => getFeaturedProducts(),
  });

  // Filtros de tamanho e preço aplicados de verdade à lista
  const filteredProducts = useMemo(() => {
    let list = products || [];
    if (filters.sizes.length > 0) {
      list = list.filter((p) => (p.sizes || []).some((s) => filters.sizes.includes(s)));
    }
    if (filters.priceRange) {
      list = list.filter((p) => {
        const price = p.promo_price || p.price;
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
      });
    }
    return list;
  }, [products, filters]);

  return (
    <div className="min-h-screen bg-[#050505]">
      <Banner />
      <BestSellers />
      <Categories
        selectedCategory={selectedCategory}
        onSelect={(slug) => {
          window.location.href = `/shop?category=${encodeURIComponent(slug)}`;
        }}
      />
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar onFilterChange={setFilters} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-[#C9A84C]">
                {selectedCategory || "Todos os Produtos"}
              </h2>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 md:py-24 text-center border border-dashed border-[#C9A84C33] rounded-2xl">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-[#C9A84C44] flex items-center justify-center text-[#C9A84C] text-xl">
                  🛍️
                </div>
                <p className="text-[#D9D9D9] font-semibold">Novidades chegando em breve</p>
                <p className="text-[#A0A0A0] text-sm mt-1">Estamos preparando a coleção. Volte em instantes.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

