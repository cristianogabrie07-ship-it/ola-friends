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
  is_sold_out?: boolean;
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

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group relative bg-white border border-border overflow-hidden"
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <Package className="w-12 h-12 text-neutral-300" />
          </div>
        )}
        {product.is_sold_out && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-black px-4 py-1 font-bold text-sm uppercase">Esgotado</span>
          </div>
        )}
        {discount > 0 && !product.is_sold_out && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold uppercase text-sm mb-2 truncate">{product.name}</h3>
        <div className="flex items-center gap-2">
          {product.promo_price ? (
            <>
              <span className="text-primary font-bold">R$ {product.promo_price.toFixed(2)}</span>
              <span className="text-muted-foreground text-xs line-through">R$ {product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-primary font-bold">R$ {product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={product.is_sold_out}
        className="absolute bottom-20 right-4 bg-primary text-white p-2 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-0"
      >
        <ShoppingCart className="w-5 h-5" />
      </button>
    </Link>
  );
}
