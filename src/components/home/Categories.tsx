import { useState } from "react";
import { motion } from "framer-motion";
import { Shirt, Package, Watch, ShoppingBag, Gem } from "lucide-react";

const categories = [
  { name: "Camisas", icon: Shirt, slug: "camisas" },
  { name: "Calças", icon: Package, slug: "calcas" },
  { name: "Acessórios", icon: Watch, slug: "acessorios" },
  { name: "Bolsas", icon: ShoppingBag, slug: "bolsas" },
  { name: "Premium", icon: Gem, slug: "premium" },
];

interface CategoriesProps {
  selectedCategory?: string;
  onSelect?: (slug: string) => void;
}

export function Categories({ selectedCategory, onSelect }: CategoriesProps) {
  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-[#C9A84C] mb-6">
          Categorias
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.slug;
            return (
              <motion.button
                key={cat.slug}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect?.(cat.slug)}
                className={`flex flex-col items-center gap-2 min-w-[80px] px-4 py-3 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? "bg-[#1A1A1A] border-[#C9A84C] text-[#C9A84C]"
                    : "bg-[#0D0D0D] border-[#C9A84C22] text-[#A0A0A0] hover:border-[#C9A84C55]"
                }`}
              >
                <Icon size={22} />
                <span className="text-xs font-medium whitespace-nowrap">
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
