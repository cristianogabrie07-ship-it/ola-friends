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
      
      {/* 
      # ADICIONAR BOTÃO DE LOGOUT NO ADMIN

      Falta um botão de Logout explícito na sidebar do admin.

      Cole este prompt no Lovable:

      ---

      Adicionar um botão de Logout na sidebar do painel administrativo. Ler o componente da sidebar (provavelmente em `src/components/admin/Sidebar.tsx` ou similar) e adicionar no final:

      ```tsx
      import { LogOut } from "lucide-react";
      import { useNavigate } from "@tanstack/react-router";
      import { supabase } from "@/integrations/supabase/client";

      // Adicionar dentro da sidebar, antes do fechamento:
      const navigate = useNavigate();
      const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate({ to: "/auth" });
      };

      // Botão no final da sidebar:
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 text-[#A0A0A0] hover:text-[#E00000] hover:bg-[#E0000011] rounded-lg transition-all mt-auto"
      >
        <LogOut size={18} />
        <span className="text-sm font-medium">Sair</span>
      </button>
      ```

      O botão deve:
      - Ficar no final da sidebar (usando mt-auto ou flex-grow)
      - Ícone de logout (LogOut do Lucide)
      - Texto "Sair"
      - Hover vermelho sutil
      - Fazer signOut do Supabase e redirecionar pra /auth
      */}
    </div>
  );
}

