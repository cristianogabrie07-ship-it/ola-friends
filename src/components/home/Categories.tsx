import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getStorefrontCategories } from "@/lib/storefront.functions";
import { Package } from "lucide-react";

export function Categories() {
  const { data: categories } = useSuspenseQuery({
    queryKey: ["storefront-categories"],
    queryFn: () => getStorefrontCategories(),
  });

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12 uppercase">Acesse nossas categorias</h2>
      <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide justify-start md:justify-center">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to="/shop"
            search={{ category: cat.slug }}
            className="flex-shrink-0 flex flex-col items-center group"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary overflow-hidden mb-3 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-neutral-100">
              {cat.image_url ? (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-10 h-10 text-neutral-400" />
              )}
            </div>
            <span className="text-sm font-bold uppercase text-center">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
