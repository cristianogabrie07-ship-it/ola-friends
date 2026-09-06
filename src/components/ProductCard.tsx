import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  promo_price?: number | null;
  images: string[] | null;
  sizes?: string[] | null;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      promo_price: product.promo_price || undefined,
      image: product.images?.[0] || "",
      quantity: 1,
    });
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }}
      className="bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl overflow-hidden hover:border-[#C9A84C] hover:shadow-[0_0_20px_rgba(201,168,76,0.1)] transition-all duration-200 group">
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
          <span className="text-[#C9A84C] font-bold text-base">
            R$ {(product.promo_price || product.price).toFixed(2).replace(".", ",")}
          </span>
          {product.promo_price && (
            <span className="text-[#666] line-through text-xs">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#C9A84C] text-[#050505] font-bold text-xs rounded-lg py-2.5 hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Comprar
          </button>
          <button
            onClick={handleAddToCart}
            title="Adicionar ao carrinho"
            aria-label="Adicionar ao carrinho"
            className="w-10 h-10 flex-shrink-0 border border-[#C9A84C44] text-[#C9A84C] rounded-lg flex items-center justify-center hover:bg-[#C9A84C] hover:text-[#050505] transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}