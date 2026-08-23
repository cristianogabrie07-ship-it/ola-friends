import { createFileRoute } from "@tanstack/react-router";
import Banner from "@/components/Banner";
import { Categories } from "@/components/home/Categories";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "@/lib/storefront.functions";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function GarantiaCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl p-6 flex items-center gap-4 hover:border-[#C9A84C44] transition-all duration-200">
      <span className="text-3xl text-[#C9A84C]">{icon}</span>
      <div>
        <h4 className="text-white font-bold text-sm md:text-base uppercase tracking-wider">{title}</h4>
        <p className="text-[#A0A0A0] text-xs md:text-sm">{desc}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => getFeaturedProducts(),
  });

  return (
    <div className="min-h-screen bg-[#050505] w-full">
      {/* Banner — JÁ EXISTE, NÃO MEXER */}
      <Banner />
      
      {/* Categorias — JÁ EXISTE, NÃO MEXER */}
      <Categories />

      {/* Garantias */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GarantiaCard icon="🚚" title="Frete Grátis" desc="Acima de R$ 199" />
          <GarantiaCard icon="💳" title="PIX -10%" desc="Desconto automático" />
          <GarantiaCard icon="🔄" title="Troca Fácil" desc="Até 7 dias" />
        </div>
      </section>

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
                product={{
                  ...product,
                  promo_price: product.promo_price ?? undefined,
                  images: product.images || [],
                }} 
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
