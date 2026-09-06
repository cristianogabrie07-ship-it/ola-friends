import { useMemo, useState } from "react";

interface CategoryOption {
  slug: string;
  name: string;
}

interface ProductLike {
  price: number;
  promo_price?: number | null;
  sizes?: string[] | null;
  categories?: { slug?: string; name?: string } | null;
}

interface ShopSidebarProps {
  categories: CategoryOption[];
  products: ProductLike[];
  selectedCategories: string[];
  selectedSizes: string[];
  onToggleCategory: (slug: string) => void;
  onToggleSize: (size: string) => void;
}

const VISIBLE_CATEGORIES = 6;

export function ShopSidebar({
  categories,
  products,
  selectedCategories,
  selectedSizes,
  onToggleCategory,
  onToggleSize,
}: ShopSidebarProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      const slug = p.categories?.slug;
      if (!slug) continue;
      counts[slug] = (counts[slug] || 0) + 1;
    }
    return counts;
  }, [products]);

  const sizeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      for (const s of p.sizes || []) {
        counts[s] = (counts[s] || 0) + 1;
      }
    }
    return counts;
  }, [products]);

  const sortedSizes = useMemo(
    () => Object.keys(sizeCounts).sort((a, b) => (sizeCounts[b] ?? 0) - (sizeCounts[a] ?? 0)),
    [sizeCounts]
  );

  const visibleCategories = showAllCategories ? categories : categories.slice(0, VISIBLE_CATEGORIES);

  return (
    <aside className="w-full bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl p-5 space-y-7">
      <h2 className="text-white font-bold text-lg">
        Filtrar <span className="block">por</span>
      </h2>

      <div>
        <h3 className="text-[#C9A84C] font-bold text-sm uppercase tracking-wider mb-3">Categorias</h3>
        <ul className="space-y-2.5">
          {visibleCategories.map((cat) => (
            <li key={cat.slug}>
              <label className="flex items-center justify-between gap-2 cursor-pointer group">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => onToggleCategory(cat.slug)}
                    className="w-4 h-4 rounded border-[#C9A84C55] bg-[#1A1A1A] accent-[#C9A84C]"
                  />
                  <span className="text-sm text-[#D9D9D9] group-hover:text-[#C9A84C] transition-colors">
                    {cat.name}
                  </span>
                </span>
                {categoryCounts[cat.slug] ? (
                  <span className="text-xs text-[#666]">({categoryCounts[cat.slug]})</span>
                ) : null}
              </label>
            </li>
          ))}
        </ul>
        {categories.length > VISIBLE_CATEGORIES && (
          <button
            onClick={() => setShowAllCategories((v) => !v)}
            className="text-xs text-[#C9A84C] underline mt-3"
          >
            {showAllCategories ? "Ver menos" : "Ver mais"}
          </button>
        )}
      </div>

      <div className="border-t border-[#C9A84C22] pt-5">
        <h3 className="text-[#C9A84C] font-bold text-sm uppercase tracking-wider mb-3">Tamanho</h3>
        <ul className="space-y-2.5">
          {sortedSizes.map((size) => (
            <li key={size}>
              <label className="flex items-center justify-between gap-2 cursor-pointer group">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => onToggleSize(size)}
                    className="w-4 h-4 rounded border-[#C9A84C55] bg-[#1A1A1A] accent-[#C9A84C]"
                  />
                  <span className="text-sm text-[#D9D9D9] group-hover:text-[#C9A84C] transition-colors">
                    {size}
                  </span>
                </span>
                <span className="text-xs text-[#666]">({sizeCounts[size]})</span>
              </label>
            </li>
          ))}
          {sortedSizes.length === 0 && (
            <li className="text-xs text-[#666]">Nenhum tamanho cadastrado ainda.</li>
          )}
        </ul>
      </div>
    </aside>
  );
}
