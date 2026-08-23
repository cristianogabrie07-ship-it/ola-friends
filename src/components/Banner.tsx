import { motion } from "framer-motion";
import bannerBg from "@/assets/banner-bg.png.asset.json";

export default function Banner() {
  return (
    <section className="relative w-full overflow-hidden min-h-[300px] md:min-h-[400px] flex items-center">
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bannerBg.url}')` }}
      />
      
      {/* Overlay escuro com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/60 to-[#050505]/90" />
      
      {/* Overlay lateral escuro para legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-[#050505]/70" />

      {/* Conteúdo — MANTER EXATAMENTE COMO ESTÁ */}
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24 w-full">
        <div className="flex flex-col items-center justify-center text-center gap-6 md:gap-8">
          
          {/* Logo M */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 85V15L30 50L50 15L70 50L90 15V85"
                  stroke="#C9A84C"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M35 60L50 35L65 60"
                  stroke="#D4B85A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                />
              </svg>
            </div>
          </motion.div>

          {/* Texto de boas-vindas */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base tracking-[0.3em] uppercase text-[#A0A0A0] font-light"
          >
            Bem-vindo à
          </motion.p>

          {/* Título principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider uppercase text-[#C9A84C]"
          >
            Martins Multimarcas
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base md:text-lg text-[#A0A0A0] font-light tracking-wide max-w-xl"
          >
            Estilo, atitude e confiança
          </motion.p>

          {/* Linha divisória */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent"
          />

          {/* Selos de benefícios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4 md:gap-6 mt-2"
          >
            <div className="flex items-center gap-2 border border-[#C9A84C33] rounded-full px-4 py-2 bg-[#0D0D0D]/80 backdrop-blur-sm">
              <span className="text-lg">🔥</span>
              <span className="text-xs md:text-sm text-[#A0A0A0] tracking-wide">
                Rua exclusiva com estilo urbano
              </span>
            </div>
            <div className="flex items-center gap-2 border border-[#C9A84C33] rounded-full px-4 py-2 bg-[#0D0D0D]/80 backdrop-blur-sm">
              <span className="text-lg">🏷️</span>
              <span className="text-xs md:text-sm text-[#A0A0A0] tracking-wide">
                Frete grátis acima de R$ 199
              </span>
            </div>
            <div className="flex items-center gap-2 border border-[#C9A84C33] rounded-full px-4 py-2 bg-[#0D0D0D]/80 backdrop-blur-sm">
              <span className="text-lg">💳</span>
              <span className="text-xs md:text-sm text-[#A0A0A0] tracking-wide">
                PIX com 10% de desconto
              </span>
            </div>
          </motion.div>

          {/* Botão CTA */}
          <motion.a
            href="#produtos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4 inline-flex items-center gap-2 bg-[#C9A84C] text-[#050505] font-bold text-sm md:text-base uppercase tracking-widest px-8 py-3.5 rounded-lg hover:brightness-110 transition-all duration-200"
          >
            Ver Produtos
          </motion.a>
        </div>
      </div>

      {/* Borda inferior decorativa */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C44] to-transparent" />
    </section>
  );
}
