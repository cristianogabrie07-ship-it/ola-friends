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
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-24 w-full">
        <div className="flex flex-col items-center justify-center text-center gap-4 md:gap-6">
          
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
            <div className="flex items-center gap-1.5 md:gap-2 border border-[#C9A84C44] rounded-full px-3 md:px-4 py-1.5 md:py-2 bg-[#050505]/70 backdrop-blur-sm">
              <span className="text-sm md:text-base">🔥</span>
              <span className="text-[10px] md:text-sm text-[#A0A0A0]">Estilo urbano</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 border border-[#C9A84C44] rounded-full px-3 md:px-4 py-1.5 md:py-2 bg-[#050505]/70 backdrop-blur-sm">
              <span className="text-sm md:text-base">🏷️</span>
              <span className="text-[10px] md:text-sm text-[#A0A0A0]">Frete grátis acima de R$199</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 border border-[#C9A84C44] rounded-full px-3 md:px-4 py-1.5 md:py-2 bg-[#050505]/70 backdrop-blur-sm">
              <span className="text-sm md:text-base">💳</span>
              <span className="text-[10px] md:text-sm text-[#A0A0A0]">PIX com 10% OFF</span>
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
            className="mt-2 inline-flex items-center bg-[#C9A84C] text-[#050505] font-bold text-xs md:text-sm uppercase tracking-widest px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:brightness-110 transition-all duration-200"
          >
            Ver Produtos
          </motion.a>
        </div>
      </div>
    </section>
  );
}