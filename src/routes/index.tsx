import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Banner from "@/components/Banner";
import { TickerBar } from "@/components/TickerBar";
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

  return (
    <div className="min-h-screen bg-[#050505]">
      <Banner />
      <TickerBar />
      <Categories
        selectedCategory={selectedCategory}
        onSelect={(slug) => setSelectedCategory(slug === selectedCategory ? undefined : slug)}
      />
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar onFilterChange={setFilters} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-[#E00000]">
                {selectedCategory || "Todos os Produtos"}
              </h2>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-[#0D0D0D] border border-[#E0000022] rounded-xl" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-[#A0A0A0] italic">Em breve novidades.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

