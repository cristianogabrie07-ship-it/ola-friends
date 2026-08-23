interface Product {
  id: string;
  name: string;
  price: number;
  promo_price?: number | null;
  images: string[] | null;
  category?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl overflow-hidden hover:border-[#C9A84C] hover:shadow-[0_0_20px_rgba(201,168,76,0.1)] transition-all duration-200 group">
      <div className="aspect-[3/4] overflow-hidden rounded-t-xl bg-[#1A1A1A]">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#333]">
            <span className="text-4xl">👕</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-white font-semibold text-sm truncate">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-[#C9A84C] font-bold text-lg">
            R$ {(product.promo_price || product.price).toFixed(2).replace(".", ",")}
          </span>
          {product.promo_price && (
            <span className="text-[#666] line-through text-sm">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
        <button className="w-full bg-[#C9A84C] text-[#050505] font-bold text-sm rounded-lg py-2.5 hover:brightness-110 transition-all duration-200 mt-1">
          Comprar
        </button>
      </div>
    </div>
  );
}
