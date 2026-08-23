import { createFileRoute } from "@tanstack/react-router";
import Banner from "@/components/Banner";
import { Categories } from "@/components/home/Categories";
import { TickerBar } from "@/components/TickerBar";
import { QuickNav } from "@/components/QuickNav";
import { Garantias } from "@/components/Garantias";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "@/lib/storefront.functions";

export const Route = createFileRoute("/")({
  component: HomePage,
});

export default function HomePage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => getFeaturedProducts(),
  });

  return (
    <div className="min-h-screen bg-[#050505] w-full">
      <Banner />
      <TickerBar />
      <QuickNav />
      <Categories />
      <Garantias />
      
      {/* Produtos em Destaque */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-[#C9A84C] mb-8">
          Destaques
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      </section>
    </div>
  );
}
