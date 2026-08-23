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
      # IMPLEMENTAR PENDENCIAS DO ADMIN

      Cole este prompt no Lovable:

      ---

      IMPORTANTE: Implementar as mudanças, não adicionar como comentário.

      Fazer as seguintes 3 coisas AGORA:

      ## 1. Criar página de pedidos

      Criar arquivo `src/routes/admin/orders.tsx` com tabela de pedidos, filtros por status (pendente, pago, preparando, enviado, entregue, cancelado), e possibilidade de alterar status. Buscar dados da tabela `orders` no Supabase. Manter paleta preto+dourado.

      ## 2. Criar página de configurações

      Criar arquivo `src/routes/admin/settings.tsx` com formulário para: nome da loja, slogan, WhatsApp, email, Instagram, política de troca. Botão "Salvar" que grava no Supabase tabela `stores`. Manter paleta preto+dourado.

      ## 3. Adicionar botão de Logout

      No componente da sidebar do admin, adicionar um botão "Sair" no final com ícone de logout que faz `supabase.auth.signOut()` e redireciona para `/login`.

      ## 4. Atualizar index.tsx

      Remover TODOS os comentários que foram adicionados ao final do arquivo `src/routes/index.tsx`. O arquivo deve ter APENAS o código TypeScript/React, sem nenhum comentário de prompt.

      ## 5. Limpar

      Deletar os arquivos de prompt que foram criados: `PROMPT-*.md` se existirem no projeto.
      */}
    </div>
  );
}

