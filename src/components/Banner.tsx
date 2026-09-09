import { motion } from "framer-motion";
import { useStoreSettings } from "@/hooks/use-store-settings";

export default function Banner() {
  const { settings } = useStoreSettings();
  const pixDiscount = settings?.pix_discount_percent ?? 0;
  return (
    <section className="relative w-full overflow-hidden bg-[#050505] py-4 md:py-6">
      <div className="mx-auto max-w-6xl px-4">
        <motion.img
          src="/banner.webp"
          alt="Martins Multimarcas — Parcele em até 12x, compra 100% segura e envio para todo o Brasil"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-auto block rounded-xl"
          fetchPriority="high"
        />
      </div>

      {/* Selo opcional de desconto PIX sobreposto ao banner */}
      {pixDiscount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 border border-[#C9A84C44] rounded-full px-4 py-2 bg-[#050505]/80 backdrop-blur-sm"
        >
          <span>💳</span>
          <span className="text-xs md:text-sm text-[#C9A84C] font-bold uppercase tracking-wider">
            PIX com {pixDiscount}% OFF
          </span>
        </motion.div>
      )}
    </section>
  );
}