import { createFileRoute, Link } from '@tanstack/react-router';
import { useCart } from '@/hooks/use-cart';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold uppercase mb-4">Seu carrinho está vazio</h2>
        <p className="text-muted-foreground mb-8">Parece que você ainda não adicionou nada ao seu carrinho.</p>
        <Link
          to="/shop"
          className="inline-block bg-primary text-white px-8 py-3 font-bold uppercase hover:opacity-90 transition-opacity"
        >
          Ir para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-12 uppercase text-center md:text-left">Seu Carrinho</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-border pb-6">
              <div className="w-24 h-32 flex-shrink-0 bg-neutral-100">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold uppercase text-sm">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id, item.size ?? undefined)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.size && <p className="text-xs text-muted-foreground mt-1">Tamanho: {item.size}</p>}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => updateQuantity(item.id, item.size ?? undefined, item.quantity - 1)}
                      className="p-2 hover:bg-accent transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-4 text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size ?? undefined, item.quantity + 1)}
                      className="p-2 hover:bg-accent transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold">
                    R$ {((item.promo_price || item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-neutral-50 p-6 space-y-6">
            <h2 className="font-bold uppercase text-lg border-b border-border pb-4">Resumo do Pedido</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frete</span>
                <span className="text-green-600 font-bold uppercase text-[10px] mt-1">Grátis</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary text-xl">R$ {total.toFixed(2)}</span>
            </div>
            
            <div className="space-y-4">
              <Link
                to="/checkout"
                className="w-full bg-primary text-white py-4 font-bold uppercase text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Finalizar Compra <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="w-full text-center block text-sm font-bold uppercase hover:underline"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
