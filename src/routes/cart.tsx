import { createFileRoute, Link } from '@tanstack/react-router';
import { useCart, getCartTotal } from '@/hooks/use-cart';
import { useStoreSettings } from '@/hooks/use-store-settings';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const total = getCartTotal(items);
  const { settings } = useStoreSettings();
  const pixDiscount = settings?.pix_discount_percent ?? 0;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold uppercase mb-4 text-white">Seu carrinho está vazio</h2>
          <p className="text-[#888] mb-8">Parece que você ainda não adicionou nada ao seu carrinho.</p>
          <Link
            to="/shop"
            className="inline-block bg-[#C9A84C] text-[#050505] px-8 py-3 font-bold uppercase hover:brightness-110 transition-opacity rounded-lg"
          >
            Ir para a loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-12 uppercase text-center md:text-left text-white">Seu Carrinho</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-[#C9A84C22] pb-6">
                <div className="w-24 h-32 flex-shrink-0 bg-[#1A1A1A] rounded-lg overflow-hidden">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold uppercase text-sm text-white">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id, item.size ?? undefined)}
                        className="text-[#666] hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.size && <p className="text-xs text-[#888] mt-1">Tamanho: {item.size}</p>}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-[#C9A84C33] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.size ?? undefined, item.quantity - 1)}
                        className="p-2 text-[#C9A84C] hover:bg-[#1A1A1A] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 text-sm font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size ?? undefined, item.quantity + 1)}
                        className="p-2 text-[#C9A84C] hover:bg-[#1A1A1A] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-white">
                      R$ {((item.promo_price || item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-[#0D0D0D] p-6 space-y-6 rounded-xl border border-[#C9A84C22]">
              <h2 className="font-bold uppercase text-lg border-b border-[#C9A84C22] pb-4 text-white">Resumo do Pedido</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-[#A0A0A0]">
                  <span>Subtotal</span>
                  <span className="text-white">R$ {total.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-[#C9A84C22] pt-4 flex justify-between font-bold text-lg">
                <span className="text-white">Total</span>
                <span className="text-[#C9A84C] text-xl">R$ {total.toFixed(2)}</span>
              </div>
              {pixDiscount > 0 && (
                <div className="bg-green-500/10 border border-[#22C55E]/30 rounded-lg p-3 text-center">
                  <p className="text-[#22C55E] font-bold text-sm">💳 PIX com {pixDiscount}% OFF</p>
                  <p className="text-white font-bold text-lg mt-1">R$ {(total * (1 - pixDiscount / 100)).toFixed(2)}</p>
                  <p className="text-[#A0A0A0] text-xs mt-1">no checkout via WhatsApp</p>
                </div>
              )}
              
              <div className="space-y-4">
                <Link
                  to="/checkout"
                  className="w-full bg-[#C9A84C] text-[#050505] py-4 font-bold uppercase text-center flex items-center justify-center gap-2 hover:brightness-110 transition-opacity rounded-lg"
                >
                  Finalizar Compra <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop"
                  className="w-full text-center block text-sm font-bold uppercase hover:text-[#C9A84C] text-[#888]"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}