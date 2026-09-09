import { useQuery } from "@tanstack/react-query";
import { Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/shop/ProductCard";

interface OrderItem {
  id: string;
  quantity: number;
}

interface BestSellerProduct {
  id: string;
  name: string;
  price: number;
  promo_price: number | null;
  images: string[] | null;
  is_sold_out: boolean | null;
  categories: { slug?: string; name?: string } | null;
}

const SECTION_SIZE = 4;

export function BestSellers() {
  // 1) Conta as vendas reais por produto a partir dos pedidos
  const { data: salesCount } = useQuery({
    queryKey: ["best-sellers-count"],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("items");
      if (error) throw error;

      const counts: Record<string, number> = {};
      for (const order of orders || []) {
        const items = (order.items as OrderItem[] | null) || [];
        for (const item of items) {
          if (item?.id) counts[item.id] = (counts[item.id] || 0) + (item.quantity || 1);
        }
      }
      return counts;
    },
  });

  const hasSales = salesCount && Object.keys(salesCount).length > 0;

  // 2) Busca os produtos do topo do ranking (ou os recentes, se ainda não há vendas)
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["best-sellers-products", hasSales ? Object.keys(salesCount!).length : 0],
    enabled: salesCount !== undefined,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, promo_price, images, is_sold_out, categories(slug, name)")
        .eq("is_active", true);

      if (error) throw error;
      let list = (data as BestSellerProduct[]) || [];

      if (hasSales) {
        list = list
          .filter((p) => (salesCount![p.id] || 0) > 0)
          .sort((a, b) => (salesCount![b.id] || 0) - (salesCount![a.id] || 0));
      } else {
        // Sem vendas suficientes ainda: mostra os produtos mais recentes
        list = list.reverse().slice(0, SECTION_SIZE);
      }

      return list.slice(0, SECTION_SIZE);
    },
  });

  if (isLoading || products.length === 0) return null;

  return (
    <section className="w-full py-8 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-[#C9A84C] mb-6">
          <Flame className="w-5 h-5" />
          Mais Vendidas
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </section>
  );
}
