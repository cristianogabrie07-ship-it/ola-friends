import { motion } from "framer-motion";
import { Truck, CreditCard, RotateCcw, Shield } from "lucide-react";

const garantias = [
  { icon: Truck, title: "Frete Grátis", desc: "Acima de R$ 199" },
  { icon: CreditCard, title: "PIX -10%", desc: "Desconto automático" },
  { icon: RotateCcw, title: "Troca Fácil", desc: "Até 7 dias" },
  { icon: Shield, title: "Compra Segura", desc: "Seus dados protegidos" },
];

export function Garantias() {
  return (
    <section className="py-8 md:py-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {garantias.map((g, i) => {
          const Icon = g.icon;
          return (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-4 md:p-6 bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl hover:border-[#C9A84C55] transition-all"
            >
              <Icon size={28} className="text-[#C9A84C] mb-3" />
              <h3 className="text-white font-semibold text-sm">{g.title}</h3>
              <p className="text-[#A0A0A0] text-xs mt-1">{g.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
