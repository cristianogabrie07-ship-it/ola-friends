import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { ShoppingCart, Heart, Truck, RefreshCcw, Package } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
});

interface ColorVariant {
  name: string;
  image: string;
}

function ProductDetail() {
  const { id } = Route.useParams();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [pinnedColor, setPinnedColor] = useState<string | null>(null);
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

  // Mídia do produto: vídeo (se houver) + foto — no máximo 1 de cada.
  // Se uma COR estiver selecionada e tiver foto própria, ela vira a mídia principal.
  const colorVariants: ColorVariant[] = Array.isArray(product?.color_variants)
    ? (product.color_variants as unknown as ColorVariant[]).filter((v) => v?.name)
    : [];
  // Galeria unificada: vídeo + foto principal + a foto de CADA COR.
  // Passar pelas fotos = escolher a cor (a foto da cor é um slide da galeria).
  const mediaItems: { type: "image" | "video"; url: string; colorName?: string }[] = [
    ...(product?.video_url ? [{ type: "video" as const, url: product.video_url }] : []),
    ...(product?.images?.[0] ? [{ type: "image" as const, url: product.images[0] }] : []),
    ...colorVariants
      .filter((v) => v.image)
      .map((v) => ({ type: "image" as const, url: v.image, colorName: v.name })),
  ];
  const activeItem: (typeof mediaItems)[number] | undefined = mediaItems[activeImage];
  const selectedColor = activeItem?.colorName ?? pinnedColor;
  const selectedVariant = colorVariants.find((v) => v.name === selectedColor);

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
      image: selectedVariant?.image || product.images?.[0] || "",
      size: selectedSize,
      color: selectedColor || undefined,
      quantity: 1,
    });
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="min-h-screen bg-[#050505] container mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-[#1A1A1A] overflow-hidden relative rounded-xl border border-[#C9A84C22]">
            {mediaItems[activeImage]?.type === "video" ? (
              <video
                src={mediaItems[activeImage].url}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : mediaItems[activeImage]?.type === "image" ? (
              <img
                src={mediaItems[activeImage].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-20 h-20 text-[#333]" />
              </div>
            )}
            {product.is_sold_out && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-[#C9A84C] text-[#050505] px-6 py-2 font-bold text-lg uppercase tracking-wider rounded">
                  Esgotado
                </span>
              </div>
            )}
            {activeItem?.colorName && (
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#050505]/80 border border-[#C9A84C] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                Cor: {activeItem.colorName}
              </span>
            )}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={() => {
                    setActiveImage((activeImage - 1 + mediaItems.length) % mediaItems.length);
                    setPinnedColor(null);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#050505]/70 border border-[#C9A84C44] text-white flex items-center justify-center hover:bg-[#050505]"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setActiveImage((activeImage + 1) % mediaItems.length);
                    setPinnedColor(null);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#050505]/70 border border-[#C9A84C44] text-white flex items-center justify-center hover:bg-[#050505]"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          {mediaItems.length > 1 && (
            <div className="flex justify-center gap-1.5">
              {mediaItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImage(idx);
                    setPinnedColor(null);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    activeImage === idx ? "w-6 bg-[#C9A84C]" : "w-2 bg-[#C9A84C33]"
                  }`}
                  aria-label={`Ir para mídia ${idx + 1}`}
                />
              ))}
            </div>
          )}
          {mediaItems.length > 1 && (
            <div className="grid grid-cols-2 gap-4 max-w-[240px]">
              {mediaItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square border-2 rounded-lg overflow-hidden transition-colors ${
                    activeImage === idx ? "border-[#C9A84C]" : "border-[#C9A84C22]"
                  }`}
                >
                  {item.type === "video" ? (
                    <>
                      <video src={item.url} muted className="w-full h-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play className="w-6 h-6 text-white" />
                      </span>
                    </>
                  ) : (
                    <span className="relative block w-full h-full">
                      <img src={item.url} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                      {item.colorName && (
                        <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[10px] text-white uppercase text-center py-0.5">
                          {item.colorName}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bungee tracking-tighter mb-4 uppercase text-white">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            {product.promo_price ? (
              <>
                <span className="text-3xl font-bold text-[#C9A84C]">R$ {product.promo_price.toFixed(2)}</span>
                <span className="text-xl text-[#666] line-through">R$ {product.price.toFixed(2)}</span>
                <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase rounded">Oferta</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-[#C9A84C]">R$ {product.price.toFixed(2)}</span>
            )}
          </div>
          <p className="text-sm text-[#888] -mt-4 mb-6">💳 Em até 12x no cartão de crédito — consulte as condições</p>

          <div className="prose prose-sm mb-8 text-[#A0A0A0]">
            <p>{product.description || "Sem descrição disponível."}</p>
          </div>

          {colorVariants.length > 0 && (
            <div className="mb-8">
              <span className="block text-sm font-bold uppercase mb-4 text-white">Cor</span>
              <div className="flex flex-wrap gap-3">
                {colorVariants.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => {
                      const idx = mediaItems.findIndex((m) => m.colorName === variant.name);
                      if (idx >= 0) {
                        setActiveImage(idx);
                        setPinnedColor(null);
                      } else {
                        setPinnedColor(variant.name);
                      }
                    }}
                    className={`flex items-center gap-2 border-2 pl-1 pr-3 py-1 font-bold transition-all rounded-full ${
                      selectedColor === variant.name
                        ? "border-[#C9A84C] bg-[#C9A84C] text-[#050505]"
                        : "border-[#C9A84C33] text-white hover:border-[#C9A84C]"
                    }`}
                  >
                    {variant.image ? (
                      <img src={variant.image} alt={variant.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-[#1A1A1A] inline-block" />
                    )}
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <span className="block text-sm font-bold uppercase mb-4 text-white">Selecione o Tamanho</span>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center border-2 font-bold transition-all rounded-lg ${
                      selectedSize === size
                        ? "border-[#C9A84C] bg-[#C9A84C] text-[#050505]"
                        : "border-[#C9A84C33] text-white hover:border-[#C9A84C]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={handleAddToCart}
              disabled={!!product.is_sold_out}
              className="flex-1 bg-[#C9A84C] text-[#050505] py-4 font-bungee tracking-tighter hover:brightness-110 transition-colors disabled:bg-[#333] rounded-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Adicionar ao Carrinho
            </button>
            <button className="p-4 border border-[#C9A84C33] hover:bg-[#1A1A1A] transition-colors rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-[#C9A84C22]">
            <div className="flex items-center gap-3 text-sm text-[#A0A0A0]">
              <Truck className="w-5 h-5 text-[#C9A84C]" />
              <span>Entrega rápida em todo o Brasil</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#A0A0A0]">
              <RefreshCcw className="w-5 h-5 text-[#C9A84C]" />
              <span>7 dias para trocas e devoluções</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
