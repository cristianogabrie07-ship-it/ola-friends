import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  promo_price?: number | null;
  images: string[] | null;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}
      className="bg-[#0D0D0D] border border-[#E0000022] rounded-xl overflow-hidden hover:border-[#E00000] hover:shadow-[0_0_20px_rgba(224,0,0,0.1)] transition-all duration-200 group">
      <div className="aspect-[3/4] overflow-hidden bg-[#1A1A1A]">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#333] text-4xl">👕</div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        <h3 className="text-white font-semibold text-sm truncate">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-[#E00000] font-bold text-base">
            R$ {(product.promo_price || product.price).toFixed(2).replace(".", ",")}
          </span>
          {product.promo_price && (
            <span className="text-[#666] line-through text-xs">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
        <button className="w-full bg-[#E00000] text-[#050505] font-bold text-xs rounded-lg py-2.5 hover:brightness-110 transition-all">
          Comprar
        </button>
      </div>
    </motion.div>
  );
}
