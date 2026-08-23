import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart, Heart, Shield, Truck, RefreshCcw, Package } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-pulse">
        Carregando produto...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        Produto não encontrado.
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Por favor, selecione um tamanho");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      promo_price: product.promo_price || undefined,
      image: product.images?.[0] || "",
      size: selectedSize,
      quantity: 1,
    });
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative border border-border">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-20 h-20 text-neutral-300" />
              </div>
            )}
            {product.is_sold_out && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-white text-black px-6 py-2 font-bold text-lg uppercase tracking-wider">
                  Esgotado
                </span>
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square border-2 transition-colors ${
                    activeImage === idx ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bungee tracking-tighter mb-4 uppercase">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-8">
            {product.promo_price ? (
              <>
                <span className="text-3xl font-bold text-primary">R$ {product.promo_price.toFixed(2)}</span>
                <span className="text-xl text-muted-foreground line-through">R$ {product.price.toFixed(2)}</span>
                <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase">Oferta</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary">R$ {product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="prose prose-sm mb-8 text-muted-foreground">
            <p>{product.description || "Sem descrição disponível."}</p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <span className="block text-sm font-bold uppercase mb-4">Selecione o Tamanho</span>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center border-2 font-bold transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-white"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.water_resistance && (
            <div className="mb-8 p-4 bg-neutral-100 border border-border flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <span className="block text-xs font-bold uppercase text-muted-foreground">Resistência à Água</span>
                <span className="font-bold">{product.water_resistance}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={handleAddToCart}
              disabled={!!product.is_sold_out}
              className="flex-1 bg-primary text-white py-4 font-bungee tracking-tighter hover:bg-primary/90 transition-colors disabled:bg-neutral-400 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Adicionar ao Carrinho
            </button>
            <button className="p-4 border border-border hover:bg-neutral-50 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-border">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-5 h-5 text-primary" />
              <span>Entrega rápida em todo o Brasil</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RefreshCcw className="w-5 h-5 text-primary" />
              <span>7 dias para trocas e devoluções</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
