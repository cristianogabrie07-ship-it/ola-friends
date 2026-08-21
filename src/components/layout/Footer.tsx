export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bungee mb-4 tracking-tighter">MARTINS MULTIMARCAS</h3>
            <p className="text-sm opacity-80">
              A melhor loja de roupas esportivas e acessórios. Qualidade e estilo para você.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm">Links Úteis</h4>
            <ul className="text-sm space-y-2 opacity-80">
              <li><a href="/" className="hover:underline">Início</a></li>
              <li><a href="/shop" className="hover:underline">Categorias</a></li>
              <li><a href="/shop?sale=true" className="hover:underline">Promoções</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm">Contato</h4>
            <ul className="text-sm space-y-2 opacity-80">
              <li>Email: contato@martinsmultimarcas.com</li>
              <li>WhatsApp: (11) 99999-9999</li>
              <li>Endereço: São Paulo, SP</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm">Pagamento</h4>
            <div className="flex gap-2">
              <span className="bg-white/10 px-3 py-1 rounded text-xs">PIX</span>
              <span className="bg-white/10 px-3 py-1 rounded text-xs">Cartão</span>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-xs opacity-60">
          © {new Date().getFullYear()} Martins Multimarcas Store. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
