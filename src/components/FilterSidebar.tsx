import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sizes = ["P", "M", "G", "GG", "XGG"];
const priceRanges = [
  { label: "Até R$ 50", min: 0, max: 50 },
  { label: "R$ 50 - R$ 100", min: 50, max: 100 },
  { label: "R$ 100 - R$ 200", min: 100, max: 200 },
  { label: "Acima de R$ 200", min: 200, max: 9999 },
];

interface FilterSidebarProps {
  onFilterChange?: (filters: { sizes: string[]; priceRange: { min: number; max: number } | null }) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSize = (size: string) => {
    const newSizes = selectedSizes.includes(size) ? selectedSizes.filter((s) => s !== size) : [...selectedSizes, size];
    setSelectedSizes(newSizes);
    onFilterChange?.({ sizes: newSizes, priceRange: selectedPrice });
  };

  const selectPrice = (range: { min: number; max: number }) => {
    const newPrice = selectedPrice?.min === range.min ? null : range;
    setSelectedPrice(newPrice);
    onFilterChange?.({ sizes: selectedSizes, priceRange: newPrice });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Tamanho</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button key={size} onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                selectedSizes.includes(size)
                  ? "bg-[#C9A84C] text-[#050505] border-[#C9A84C]"
                  : "bg-[#1A1A1A] text-[#A0A0A0] border-[#C9A84C22] hover:border-[#C9A84C55]"
              }`}>
              {size}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Preço</h3>
        <div className="flex flex-col gap-2">
          {priceRanges.map((range) => (
            <button key={range.label} onClick={() => selectPrice(range)}
              className={`text-left px-3 py-2 rounded-lg text-xs border transition-all ${
                selectedPrice?.min === range.min
                  ? "bg-[#C9A84C] text-[#050505] border-[#C9A84C]"
                  : "bg-[#1A1A1A] text-[#A0A0A0] border-[#C9A84C22] hover:border-[#C9A84C55]"
              }`}>
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-40 bg-[#C9A84C] text-[#050505] p-3 rounded-full shadow-lg">
        <SlidersHorizontal size={20} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#0D0D0D] border-r border-[#C9A84C22] z-50 p-6 overflow-y-auto lg:hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#C9A84C] font-bold uppercase">Filtros</h2>
                <button onClick={() => setIsOpen(false)} className="text-[#A0A0A0]"><X size={20} /></button>
              </div>
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl p-5">
          <h2 className="text-[#C9A84C] font-bold uppercase text-sm mb-5 flex items-center gap-2">
            <SlidersHorizontal size={16} /> Filtros
          </h2>
          <FilterContent />
        </div>
      </aside>
    </>
  );
}
