import { motion } from "framer-motion";
import { useStoreSettings } from "@/hooks/use-store-settings";

export default function Banner() {
  const { settings } = useStoreSettings();
  const pixDiscount = settings?.pix_discount_percent ?? 0;
  return (
    <section className="relative w-full overflow-hidden min-h-[380px] md:min-h-[440px] flex items-center justify-center">
      {/* Fundo gerado: gradiente radial dourado + textura de grade sutil, sem depender de foto */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.22), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #C9A84C, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: "radial-gradient(circle, #C9A84C, transparent 70%)" }}
      />

      {/* Vinheta pra dar profundidade nas bordas */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-24 w-full">
        <div className="flex flex-col items-center justify-center text-center gap-4 md:gap-6">

          {/* Título de impacto */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bungee text-3xl sm:text-4xl md:text-6xl text-white leading-tight tracking-tight"
          >
            MARTINS <span className="text-[#C9A84C]">MULTIMARCAS</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs md:text-base tracking-widest md:tracking-[0.3em] uppercase text-[#A0A0A0] font-light px-2"
          >
            Estilo, atitude e confiança
          </motion.p>

          {/* Linha decorativa */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-12 h-px bg-[#C9A84C]"
          />

          {/* Selos — wrap no mobile, sem scroll bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-2 md:gap-3 justify-center px-2"
          >
            {pixDiscount > 0 && (
              <div className="flex items-center gap-1.5 md:gap-2 border border-[#C9A84C44] rounded-full px-3 md:px-4 py-1.5 md:py-2 bg-[#050505]/70 backdrop-blur-sm">
                <span className="text-sm md:text-base">💳</span>
                <span className="text-[10px] md:text-sm text-[#A0A0A0]">PIX com {pixDiscount}% OFF</span>
              </div>
            )}
          </motion.div>

          {/* Botão CTA */}
          <motion.a
            href="#produtos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mt-2 inline-flex items-center bg-[#C9A84C] text-[#050505] font-bold text-xs md:text-sm uppercase tracking-widest px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:brightness-110 transition-all duration-200"
          >
            Ver Produtos
          </motion.a>
        </div>
      </div>
    </section>
  );
}