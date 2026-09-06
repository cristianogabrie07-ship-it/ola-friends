import { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";
import { getStorefrontCategories } from "@/lib/storefront.functions";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { itemsCount } = useCart();
  const { data: categories = [] } = useQuery({
    queryKey: ["header-categories"],
    queryFn: () => getStorefrontCategories(),
  });

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <header className="w-full bg-[#050505] text-white sticky top-0 z-50">
      {/* Main header row */}
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: hamburger mobile */}
          <button
            className="md:hidden hover:text-[#C9A84C] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Center: Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/images/logo-martins.png"
              alt="Martins Multimarcas"
              className="h-10 md:h-14 w-auto object-contain mix-blend-screen"
            />
          </Link>

          {/* Right: icons */}
          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:text-[#C9A84C] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link to="/admin" className="hover:text-[#C9A84C] transition-colors hidden md:block">
              <User className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="relative hover:text-[#C9A84C] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C9A84C] text-[#050505] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Nav bar - Desktop */}
      <nav className="hidden md:block border-t border-[#C9A84C11]">
        <div className="container mx-auto px-4 md:px-6 py-2.5 flex items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em]">
          <div
            className="relative"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-[#C9A84C] transition-colors py-1">
              Categorias <ChevronDown className="w-3 h-3" />
            </button>
            {isMegaMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-[480px]">
                <div className="bg-[#0D0D0D] border border-[#C9A84C22] rounded-lg shadow-2xl p-5 grid grid-cols-2 gap-3">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to="/shop"
                        search={{ category: cat.slug }}
                        className="text-[#A0A0A0] text-sm hover:text-[#C9A84C] transition-colors"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-[#555] text-sm col-span-2">Nenhuma categoria.</span>
                  )}
                </div>
              </div>
            )}
          </div>
          <Link to="/" className="hover:text-[#C9A84C] transition-colors">Início</Link>
          <Link to="/shop" className="hover:text-[#C9A84C] transition-colors">Produtos</Link>
          <Link to="/shop" search={{ sale: true }} className="hover:text-[#C9A84C] transition-colors">Liquidação</Link>
        </div>
      </nav>

      {/* Search bar - expandable */}
      {isSearchOpen && (
        <div className="border-t border-[#C9A84C11] animate-in slide-in-from-top duration-200">
          <div className="container mx-auto px-4 md:px-6 py-3">
            <div className="relative max-w-xl mx-auto">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full bg-[#0D0D0D] border border-[#C9A84C33] text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-[#555]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
              />
              <Search className="absolute right-3 top-3 text-[#555] w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-[#C9A84C11] bg-[#050505] animate-in slide-in-from-top duration-200">
          <div className="container mx-auto px-4 py-5 flex flex-col gap-4 text-sm font-bold uppercase tracking-[0.15em]">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-[#C9A84C]">Início</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="hover:text-[#C9A84C]">Produtos</Link>
            <Link to="/shop" search={{ sale: true }} onClick={() => setIsMenuOpen(false)} className="hover:text-[#C9A84C]">Liquidação</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="hover:text-[#C9A84C]">Admin</Link>
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full bg-[#0D0D0D] border border-[#C9A84C33] text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#C9A84C] placeholder:text-[#555]"
              />
              <Search className="absolute right-3 top-3 text-[#555] w-4 h-4" />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
