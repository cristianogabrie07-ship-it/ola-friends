import { ShoppingCart, Package } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  price: number;
  promo_price?: number | null;
  images: string[] | null;
  is_sold_out?: boolean | null;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = product.promo_price
    ? Math.round(((product.price - product.promo_price) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const finalPrice = product.promo_price || product.price;
  const installments = finalPrice / 12;

  return (
    <div className="group relative bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl overflow-hidden hover:border-[#C9A84C] hover:shadow-[0_0_20px_rgba(201,168,76,0.1)] transition-all duration-200">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="aspect-[4/5] overflow-hidden relative bg-[#1A1A1A]">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-[#333]" />
            </div>
          )}
          {product.is_sold_out && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="bg-[#C9A84C] text-[#050505] px-4 py-1 font-bold text-sm uppercase rounded">Esgotado</span>
            </div>
          )}
          {discount > 0 && !product.is_sold_out && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
              -{discount}%
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold uppercase text-xs text-white mb-2 truncate">{product.name}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {product.promo_price ? (
              <>
                <span className="text-[#C9A84C] font-bold text-base">R$ {product.promo_price.toFixed(2).replace(".", ",")}</span>
                <span className="text-[#666] text-xs line-through">R$ {product.price.toFixed(2).replace(".", ",")}</span>
              </>
            ) : (
              <span className="text-[#C9A84C] font-bold text-base">R$ {product.price.toFixed(2).replace(".", ",")}</span>
            )}
          </div>
          <p className="text-[#666] text-[11px] mt-0.5">12x de R$ {installments.toFixed(2).replace(".", ",")}</p>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <button
          onClick={handleAddToCart}
          disabled={!!product.is_sold_out}
          className="w-full bg-[#C9A84C] text-[#050505] font-bold text-xs rounded-lg py-2.5 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Comprar
        </button>
      </div>
    </div>
  );
}
