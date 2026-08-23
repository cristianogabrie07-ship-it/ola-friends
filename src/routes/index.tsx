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
      # CRIAR CONFIGURAÇÕES DA LOJA NO ADMIN

      As configurações da loja não possuem interface visual.

      Cole este prompt no Lovable:

      ---

      Criar a página de configurações da loja em `/admin/settings` ou similar.

      ### Criar `src/routes/admin/settings.tsx`:

      Formulário com as seguintes seções:

      **1. Dados Gerais:**
      - Nome da loja (input text)
      - Slogan (input text)
      - Logo (upload de imagem)
      - Banner (upload de imagem)

      **2. Contato:**
      - WhatsApp (input tel)
      - Email (input email)
      - Instagram (input text com @)

      **3. Textos:**
      - Texto de boas-vindas (textarea)
      - Política de troca (textarea)

      **4. Pagamento:**
      - Gateway: radio buttons (Asaas, Mercado Pago, Nenhum)
      - API Key (input password, mascarado)
      - Sandbox: toggle sim/não

      **Botão:** "Salvar Alterações" (bg #C9A84C, text #050505)

      Manter paleta preto+dourado. Fundo #050505, cards #0D0D0D, inputs #1A1A1A com border #C9A84C33.
      */}
    </div>
  );
}

