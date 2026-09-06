import { createFileRoute, Link } from '@tanstack/react-router';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';
import { Check, Phone, ArrowLeft, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Número do WhatsApp da loja (formato internacional sem +)
const STORE_WHATSAPP = "559870118577";

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { total, items, clearCart } = useCart();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const saveOrder = async () => {
    const { error } = await supabase.from('orders').insert({
      customer_details: {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        promo_price: i.promo_price,
        size: i.size,
        quantity: i.quantity,
      })),
      total,
      payment_method: 'whatsapp',
      status: 'pendente',
    });
    if (error) {
      console.error('Erro ao salvar pedido:', error);
      toast.error('Erro ao registrar pedido. Tente novamente.');
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleFinishWithWhatsApp = async () => {
    setSending(true);

    const itemsText = items.map(i => `- ${i.name}${i.size ? ` (Tamanho ${i.size})` : ''} x${i.quantity} = R$ ${((i.promo_price || i.price) * i.quantity).toFixed(2)}`).join('\n');
    const message = encodeURIComponent(
      `Olá! Gostaria de finalizar um pedido na Martins Multimarcas 🛍️\n\n*Dados do Cliente:*\nNome: ${formData.name}\nWhatsApp: ${formData.phone}\nEmail: ${formData.email}\n\n*Endereço de Entrega:*\n${formData.address}\n${formData.city} - ${formData.state}, CEP: ${formData.zip}\n\n*Itens do Pedido:*\n${itemsText}\n\n*Total: R$ ${total.toFixed(2)}*\n\nQuais são as formas de pagamento disponíveis?`
    );
    const url = `https://wa.me/${STORE_WHATSAPP}?text=${message}`;

    // Abrir o WhatsApp PRIMEIRO (antes de qualquer await) pra não ser
    // bloqueado pelo popup blocker do navegador mobile
    const win = window.open(url, '_blank');
    if (!win) {
      // Fallback: se o popup foi bloqueado, navega direto
      window.location.href = url;
    }

    // Salvar pedido em background (não bloqueia o fluxo do WhatsApp)
    await saveOrder();
    clearCart();
    setSending(false);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-green-900/30 text-green-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold uppercase text-white">Pedido Enviado!</h1>
        <p className="text-[#A0A0A0] max-w-md mx-auto">
          Seu pedido foi registrado e o WhatsApp abriu com os detalhes. Finalize a conversa com a loja para combinar a forma de pagamento (PIX, crédito/débito ou espécie).
        </p>
        <a
          href={`https://wa.me/${STORE_WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 font-bold uppercase hover:opacity-90 rounded-lg"
        >
          <MessageCircle className="w-5 h-5" /> Abrir WhatsApp
        </a>
        <div>
          <Link to="/" className="inline-block text-sm font-bold uppercase text-[#C9A84C] hover:underline">
            Voltar para o Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 uppercase text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {step === 'info' ? (
            <form onSubmit={handleNextStep} className="space-y-4">
              <h2 className="font-bold uppercase text-lg border-b border-[#C9A84C22] pb-2 mb-4 text-white">Dados de Entrega</h2>
              <input
                required
                type="text"
                placeholder="Nome Completo"
                className="w-full bg-[#1A1A1A] border border-[#C9A84C22] text-white p-3 rounded-lg focus:border-[#C9A84C] focus:outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="w-full bg-[#1A1A1A] border border-[#C9A84C22] text-white p-3 rounded-lg focus:border-[#C9A84C] focus:outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
                <input
                  required
                  type="tel"
                  placeholder="WhatsApp"
                  className="w-full bg-[#1A1A1A] border border-[#C9A84C22] text-white p-3 rounded-lg focus:border-[#C9A84C] focus:outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <input
                required
                type="text"
                placeholder="Endereço Completo"
                className="w-full bg-[#1A1A1A] border border-[#C9A84C22] text-white p-3 rounded-lg focus:border-[#C9A84C] focus:outline-none"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Cidade"
                  className="w-full bg-[#1A1A1A] border border-[#C9A84C22] text-white p-3 rounded-lg focus:border-[#C9A84C] focus:outline-none"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
                <input
                  required
                  type="text"
                  placeholder="Estado"
                  className="w-full bg-[#1A1A1A] border border-[#C9A84C22] text-white p-3 rounded-lg focus:border-[#C9A84C] focus:outline-none"
                  value={formData.state}
                  onChange={e => setFormData({...formData, state: e.target.value})}
                />
                <input
                  required
                  type="text"
                  placeholder="CEP"
                  className="w-full bg-[#1A1A1A] border border-[#C9A84C22] text-white p-3 rounded-lg focus:border-[#C9A84C] focus:outline-none"
                  value={formData.zip}
                  onChange={e => setFormData({...formData, zip: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-[#C9A84C] text-[#050505] py-4 font-bold uppercase hover:brightness-110 rounded-lg">
                Ir para o Pagamento
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <button onClick={() => setStep('info')} className="flex items-center gap-2 text-sm text-[#888] hover:text-[#C9A84C]">
                <ArrowLeft className="w-4 h-4" /> Voltar para dados
              </button>
              
              <h2 className="font-bold uppercase text-lg border-b border-[#C9A84C22] pb-2 text-white">Finalizar Pedido</h2>
              
              <div className="bg-[#0D0D0D] p-6 rounded-lg text-center space-y-5 border border-[#C9A84C22]">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#25D366]/15 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-[#25D366]" />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold text-lg">Pedido via WhatsApp</p>
                  <p className="text-[#A0A0A0] text-sm">
                    Ao finalizar, seu pedido é enviado pro nosso WhatsApp e a forma de pagamento é combinada com a loja:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    <span className="bg-[#1A1A1A] border border-[#C9A84C33] px-3 py-1 rounded-full text-xs text-[#C9A84C] font-bold">PIX</span>
                    <span className="bg-[#1A1A1A] border border-[#C9A84C33] px-3 py-1 rounded-full text-xs text-white font-bold">Crédito/Débito</span>
                    <span className="bg-[#1A1A1A] border border-[#C9A84C33] px-3 py-1 rounded-full text-xs text-white font-bold">Espécie</span>
                  </div>
                </div>
                <button
                  onClick={handleFinishWithWhatsApp}
                  disabled={sending}
                  className="w-full bg-[#25D366] text-white py-4 font-bold uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity rounded-lg disabled:opacity-50"
                >
                  <Phone className="w-5 h-5" /> {sending ? 'Enviando...' : 'Finalizar via WhatsApp'}
                </button>
              </div>
            </div>
          )}

          <div className="bg-[#0D0D0D] p-6 rounded-lg h-fit border border-[#C9A84C22]">
            <h2 className="font-bold uppercase text-lg border-b border-[#C9A84C22] pb-2 mb-4 text-white">Seu Pedido</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}{item.size ? ` (${item.size})` : ''}</span>
                  <span className="font-bold">R$ {((item.promo_price || item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#C9A84C]">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}