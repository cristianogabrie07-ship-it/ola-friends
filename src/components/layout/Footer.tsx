import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bungee mb-4 tracking-tight">
              <span className="text-[#C9A84C]">MARTINS</span>{" "}
              <span className="text-white">MULTIMARCAS</span>
            </h3>
            <p className="text-sm text-[#888]">
              A melhor loja de roupas esportivas e acessórios. Qualidade e estilo para você.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-[#C9A84C]">Links Úteis</h4>
            <ul className="text-sm space-y-2 text-[#888]">
              <li><Link to="/" className="hover:text-[#C9A84C] transition-colors">Início</Link></li>
              <li><Link to="/shop" className="hover:text-[#C9A84C] transition-colors">Produtos</Link></li>
              <li><Link to="/shop" search={{ sale: true }} className="hover:text-[#C9A84C] transition-colors">Liquidação</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-[#C9A84C]">Contato</h4>
            <ul className="text-sm space-y-2 text-[#888]">
              <li>contato@martinsmultimarcas.com.br</li>
              <li>(98) 7011-8577</li>
              <li>São Luís, MA</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-[#C9A84C]">Pagamento</h4>
            <div className="flex gap-2">
              <span className="bg-[#1A1A1A] border border-[#C9A84C33] px-3 py-1 rounded text-xs text-[#C9A84C]">PIX</span>
              <span className="bg-[#1A1A1A] border border-[#C9A84C33] px-3 py-1 rounded text-xs text-[#888]">Cartão</span>
            </div>
          </div>
        </div>
        <div className="border-t border-[#C9A84C22] mt-12 pt-8 text-center text-xs text-[#555]">
          © {new Date().getFullYear()} Martins Multimarcas. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
