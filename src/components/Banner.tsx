import { motion } from "framer-motion";
import bannerBg from "@/assets/banner-bg.png.asset.json";

export default function Banner() {
  return (
    <section className="relative w-full overflow-hidden min-h-[350px] md:min-h-[400px] flex items-center justify-center">
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bannerBg.url}')` }}
      />
      
      {/* Overlay escuro — mais forte nas laterais */}
      <div className="absolute inset-0 bg-[#050505]/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80" />

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto max-w-7xl px-8 md:px-6 py-14 md:py-24 w-full">
        <div className="flex flex-col items-center justify-center text-center gap-5 md:gap-6">
          
          {/* Tagline — sem letter-spacing largo no mobile */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs md:text-base tracking-widest md:tracking-[0.3em] uppercase text-[#A0A0A0] font-light px-4"
          >
            Estilo, atitude e confiança
          </motion.p>

          {/* Linha decorativa */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-12 h-px bg-[#E00000]"
          />

          {/* Selos — scroll horizontal no mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-3 overflow-x-auto max-w-full pb-1 px-2 md:px-0 md:flex-wrap md:justify-center no-scrollbar"
          >
            <div className="flex items-center gap-2 border border-[#E0000044] rounded-full px-4 py-2 bg-[#050505]/70 backdrop-blur-sm shrink-0">
              <span className="text-base">🔥</span>
              <span className="text-xs md:text-sm text-[#A0A0A0] whitespace-nowrap">Rua exclusiva com estilo urbano</span>
            </div>
            <div className="flex items-center gap-2 border border-[#E0000044] rounded-full px-4 py-2 bg-[#050505]/70 backdrop-blur-sm shrink-0">
              <span className="text-base">🏷️</span>
              <span className="text-xs md:text-sm text-[#A0A0A0] whitespace-nowrap">Frete grátis acima de R$ 199</span>
            </div>
            <div className="flex items-center gap-2 border border-[#E0000044] rounded-full px-4 py-2 bg-[#050505]/70 backdrop-blur-sm shrink-0">
              <span className="text-base">💳</span>
              <span className="text-xs md:text-sm text-[#A0A0A0] whitespace-nowrap">PIX com 10% de desconto</span>
            </div>
          </motion.div>

          {/* Botão CTA */}
          <motion.a
            href="#produtos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mt-2 inline-flex items-center bg-[#E00000] text-[#050505] font-bold text-sm uppercase tracking-widest px-8 py-3 rounded-lg hover:brightness-110 transition-all duration-200"
          >
            Ver Produtos
          </motion.a>
        </div>
      </div>
    </section>
  );
}