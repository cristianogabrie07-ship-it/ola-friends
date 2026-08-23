import { motion } from "framer-motion";
import { Shirt, Pants, Watch, ShoppingBag, Gem, Footprints } from "lucide-react";

const navItems = [
  { name: "Camisas", icon: Shirt },
  { name: "Calças", icon: Pants },
  { name: "Moletom", icon: Gem },
  { name: "Jaqueta", icon: ShoppingBag },
  { name: "Bonés", icon: Watch },
  { name: "Tênis", icon: Footprints },
  { name: "Acessórios", icon: Watch },
];

export function QuickNav() {
  return (
    <div className="w-full bg-[#0a0a0a] border-b border-[#C9A84C22] py-4">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-[#C9A84C] font-bold text-xs uppercase tracking-wider mb-3">
          Navegação Rápida ⚡
        </p>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 min-w-[70px] md:min-w-[80px] p-3 rounded-xl bg-[#0D0D0D] border border-[#C9A84C22] hover:border-[#C9A84C55] transition-all"
              >
                <Icon size={20} className="text-[#C9A84C]" />
                <span className="text-[10px] md:text-xs text-[#A0A0A0] whitespace-nowrap">{item.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
