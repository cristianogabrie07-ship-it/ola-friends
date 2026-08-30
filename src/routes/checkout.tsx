import { createFileRoute, Link } from '@tanstack/react-router';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';
import { Check, QrCode, Phone, ArrowLeft, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { total, items, clearCart } = useCart();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const saveOrder = async (paymentMethod: string) => {
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
      payment_method: paymentMethod,
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

  const handleFinishWithWhatsApp = () => {
    const phoneNumber = "5511999999999";
    const itemsText = items.map(i => `- ${i.name} (${i.size || 'N/A'}) x${i.quantity}`).join('\n');
    const message = encodeURIComponent(
      `Olá! Novo Pedido:\n\n*Cliente:* ${formData.name}\n*Telefone:* ${formData.phone}\n*Endereço:* ${formData.address}, ${formData.city}-${formData.state}\n\n*Itens:*\n${itemsText}\n\n*Total:* R$ ${total.toFixed(2)}\n\nGostaria de finalizar meu pedido.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText("00020101021226820014br.gov.bcb.pix0114000000000000005204000053039865802BR5913MARTINS STORE6009SAO PAULO62070503***6304ABCD");
    toast.success("Código PIX copiado!");
  };

  if (step === 'success') {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-green-900/30 text-green-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold uppercase text-white">Pedido Recebido!</h1>
        <p className="text-[#A0A0A0] max-w-md mx-auto">
          Obrigado pela sua compra. Assim que o pagamento for confirmado, iniciaremos o processo de envio.
        </p>
        <Link to="/" className="inline-block bg-[#C9A84C] text-[#050505] px-8 py-3 font-bold uppercase hover:brightness-110">
          Voltar para o Início
        </Link>
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
              <button onClick={() => setStep('info')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4" /> Voltar para dados
              </button>
              <h2 className="font-bold uppercase text-lg border-b border-[#C9A84C22] pb-2 text-white">Pagamento via PIX</h2>
              <div className="bg-[#0D0D0D] p-6 rounded-lg text-center space-y-4 border-2 border-[#C9A84C22]">
                <QrCode className="w-48 h-48 mx-auto" />
                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase text-primary">Escaneie o QR Code acima</p>
                  <p className="text-xs text-muted-foreground">ou copie o código abaixo:</p>
                  <button 
                    onClick={handleCopyPix}
                    className="flex items-center justify-center gap-2 w-full border border-dashed border-primary p-2 text-xs font-mono break-all"
                  >
                    <Copy className="w-3 h-3" /> Clique para copiar o código PIX
                  </button>
                </div>
                <button 
                  onClick={async () => {
                    await saveOrder('pix');
                    clearCart();
                    setStep('success');
                  }}
                  className="w-full bg-primary text-white py-3 font-bold uppercase text-sm"
                >
                  Já realizei o pagamento
                </button>
              </div>
              <div className="relative text-center">
                <span className="bg-[#050505] px-2 text-xs uppercase text-[#A0A0A0] relative z-10">ou</span>
                <hr className="absolute top-1/2 w-full border-t border-border -z-0" />
              </div>
              <button
                onClick={async () => {
                  await saveOrder('whatsapp');
                  handleFinishWithWhatsApp();
                  clearCart();
                  setStep('success');
                }}
                className="w-full bg-[#25D366] text-white py-4 font-bold uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Phone className="w-5 h-5" /> Finalizar via WhatsApp
              </button>
            </div>
          )}

          <div className="bg-[#0D0D0D] p-6 rounded-lg h-fit border border-[#C9A84C22]">
            <h2 className="font-bold uppercase text-lg border-b border-[#C9A84C22] pb-2 mb-4 text-white">Seu Pedido</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-bold">R$ {((item.promo_price || item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
