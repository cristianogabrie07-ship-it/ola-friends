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
      # VERIFICAR PAINEL ADMINISTRATIVO

      Cole este prompt no Lovable:

      ---

      Por favor, verificar o painel administrativo da loja. Ler todos os arquivos relacionados ao admin e reportar o que está funcionando e o que está quebrado.

      Verificar se existem e estão funcionando:

      ### 1. Login Admin
      - Rota de login (`/admin` ou `/login`)
      - Autenticação com Supabase Auth
      - Proteção de rotas (redireciona se não logado)

      ### 2. Dashboard
      - Rota do dashboard (`/admin/dashboard` ou similar)
      - Cards de métricas (total de vendas, pedidos, etc)
      - Gráficos ou resumo visual

      ### 3. Gestão de Produtos
      - Listagem de produtos (tabela com imagem, nome, preço, estoque, status)
      - Criar novo produto (modal ou página com formulário)
      - Editar produto
      - Deletar produto (com confirmação)
      - Ativar/desativar produto (toggle)
      - Upload de imagens

      ### 4. Gestão de Cupons
      - Listagem de cupons
      - Criar cupom (código, tipo % ou fixo, valor, validade)
      - Editar cupom
      - Deletar cupom

      ### 5. Lista de Pedidos
      - Listagem de pedidos (tabela com ID, cliente, data, total, status)
      - Filtrar por status
      - Detalhe do pedido (modal ou página)
      - Alterar status do pedido

      ### 6. Configurações da Loja
      - Dados da loja (nome, slogan, logo, banner)
      - Contato (WhatsApp, email, Instagram)
      - Configuração de pagamento (gateway)

      ### 7. Layout e Navegação
      - Sidebar com menus (Dashboard, Produtos, Cupons, Pedidos, Config)
      - Header com breadcrumb e perfil do admin
      - Responsivo (mobile: drawer ao invés de sidebar)
      - Logout funcional

      ### 8. Segurança
      - Middleware protegendo rotas admin
      - Apenas usuários admin podem acessar
      - RLS (Row Level Security) no Supabase

      ## Reportar:
      - ✅ O que está funcionando
      - ❌ O que está quebrado ou faltando
      - ⚠️ O que precisa de ajuste
      - Arquivos criados e suas rotas
      */}
    </div>
  );
}

