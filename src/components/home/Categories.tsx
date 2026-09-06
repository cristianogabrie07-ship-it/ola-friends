import { motion } from "framer-motion";
import { Shirt, Package, Users, Watch } from "lucide-react";

const categories = [
  { name: "Camisas", icon: Shirt, slug: "camisas" },
  { name: "Calças", icon: Package, slug: "calcas" },
  { name: "Conjuntos", icon: Users, slug: "conjuntos" },
  { name: "Acessórios", icon: Watch, slug: "acessorios" },
];

interface CategoriesProps {
  selectedCategory?: string | undefined;
  onSelect?: (slug: string) => void;
}

export function Categories({ selectedCategory, onSelect }: CategoriesProps) {
  return (
    <section className="w-full py-8 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-[#C9A84C] mb-6">Categorias</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.slug;
            return (
              <motion.button
                key={cat.slug}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect?.(cat.slug)}
                className={`relative flex flex-col items-center justify-center gap-3 py-6 md:py-8 rounded-2xl border overflow-hidden transition-all ${
                  isActive
                    ? "border-[#C9A84C] text-[#C9A84C]"
                    : "border-[#C9A84C22] text-[#D9D9D9] hover:border-[#C9A84C66]"
                }`}
                style={{
                  background: isActive
                    ? "linear-gradient(160deg, #1A1608 0%, #0D0D0D 100%)"
                    : "linear-gradient(160deg, #101010 0%, #0A0A0A 100%)",
                }}
              >
                <div
                  className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl transition-opacity ${
                    isActive ? "opacity-30" : "opacity-0 group-hover:opacity-10"
                  }`}
                  style={{ background: "#C9A84C" }}
                />
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border ${
                    isActive ? "border-[#C9A84C] bg-[#C9A84C]/10" : "border-[#C9A84C33] bg-[#C9A84C]/5"
                  }`}
                >
                  <Icon size={22} />
                </div>
                <span className="text-xs md:text-sm font-semibold uppercase tracking-wide whitespace-nowrap">
                  {cat.name}
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
