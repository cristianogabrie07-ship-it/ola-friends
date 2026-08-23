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
      # CRIAR PÁGINA DE PEDIDOS NO ADMIN

      A rota /admin/orders está em placeholder. Criar a funcionalidade completa.

      Cole este prompt no Lovable:

      ---

      A rota `/admin/orders` está em placeholder. Criar a página completa de gestão de pedidos.

      ### Criar ou atualizar `src/routes/admin/orders.tsx`:

      A página deve ter:

      1. **Tabela de pedidos** com colunas: ID (curto), Cliente, Data, Total, Status
      2. **Filtros por status**: Todos, Pendente, Pago, Preparando, Enviado, Entregue, Cancelado
      3. **Detalhe do pedido** ao clicar (modal ou painel lateral) mostrando:
         - Dados do cliente (nome, email, telefone, CPF)
         - Endereço de entrega
         - Itens do pedido (imagem, nome, quantidade, preço)
         - Resumo (subtotal, desconto, frete, total)
         - Método de pagamento
         - Status atual
      4. **Alterar status** com botões ou dropdown
      5. **Skeleton loading** enquanto busca dados

      Cores: manter paleta preto+dourado (#050505 fundo, #0D0D0D cards, #C9A84C accent)

      Status possíveis com cores:
      - pendente: amarelo
      - pago: verde
      - preparando: azul
      - enviado: roxo
      - entregue: verde forte
      - cancelado: vermelho
      */}
    </div>
  );
}

