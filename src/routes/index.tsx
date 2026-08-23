import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { ProductCard } from "@/components/shop/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "@/lib/storefront.functions";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => getFeaturedProducts(),
  });

  return (
    <div className="w-full">
      <Hero />
      <Categories />
      
      {isLoading ? (
        <section className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-neutral-100 rounded-lg" />
            ))}
          </div>
        </section>
      ) : products && products.length > 0 ? (
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 uppercase">Destaques</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="py-20 text-center">
          <p className="text-muted-foreground italic">Em breve novidades.</p>
        </section>
      )}
    </div>
  );
}
