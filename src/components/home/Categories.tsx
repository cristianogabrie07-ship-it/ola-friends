import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getStorefrontCategories, getProducts } from "@/lib/storefront.functions";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoriesProps {
  selectedCategory?: string | undefined;
  onSelect?: (slug: string) => void;
}

export function Categories({ selectedCategory, onSelect }: CategoriesProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["home-categories"],
    queryFn: () => getStorefrontCategories(),
  });

  // Contagem de produtos por categoria (mesma query da /shop — compartilhada no cache)
  const { data: products = [] } = useQuery({
    queryKey: ["shop-products"],
    queryFn: () => getProducts(),
  });

  const countBySlug = new Map<string, number>();
  for (const p of products as { categories?: { slug?: string } | null }[]) {
    const slug = (p as any).categories?.slug;
    if (slug) countBySlug.set(slug, (countBySlug.get(slug) || 0) + 1);
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full py-8 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-[#C9A84C] mb-6">Categorias</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {(categories as Category[]).map((cat) => {
            const count = countBySlug.get(cat.slug) || 0;
            const isActive = selectedCategory === cat.slug;
            return (
              <motion.button
                key={cat.slug}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect?.(cat.slug)}
                className={`relative flex items-center justify-center py-6 md:py-8 rounded-2xl border overflow-hidden transition-all ${
                  isActive
                    ? "border-[#C9A84C] text-[#C9A84C]"
                    : "border-[#C9A84C22] text-[#D9D9D9] hover:border-[#C9A84C66] hover:bg-[#C9A84C]/[0.03]"
                }`}
                style={{
                  background: isActive
                    ? "linear-gradient(160deg, #1A1608 0%, #0D0D0D 100%)"
                    : "linear-gradient(160deg, #101010 0%, #0A0A0A 100%)",
                }}
              >
                <div
                  className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl transition-opacity ${
                    isActive ? "opacity-30" : "opacity-0"
                  }`}
                  style={{ background: "#C9A84C" }}
                />
                <span className="text-xs md:text-sm font-semibold uppercase tracking-wide text-center leading-tight px-2">
                  {cat.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#666]">
                  {count === 0 ? "Em breve" : `${count} ${count === 1 ? "produto" : "produtos"}`}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;
