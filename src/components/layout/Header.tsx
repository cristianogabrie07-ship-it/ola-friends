import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { itemsCount } = useCart();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        const { data: hasRole } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });
        setIsAdmin(!!hasRole);
      }
    };
    checkAuth();
  }, []);

  return (
    <header className="w-full bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      {/* Line 1 */}
      <div className="container mx-auto px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between gap-2 md:gap-4">
        <Link to="/" className="text-base md:text-2xl font-bungee tracking-tighter flex-shrink-0 truncate">
          MARTINS MULTIMARCAS
        </Link>

        <div className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-white text-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Search className="absolute right-3 top-2.5 text-muted-foreground w-5 h-5" />
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Link to={isLoggedIn ? (isAdmin ? "/admin" : "/") : "/auth"} className="hover:opacity-80">
            <User className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <Link to="/cart" className="relative hover:opacity-80">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden hover:opacity-80"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Line 2 */}
      <nav className="hidden md:block border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-8 font-bold text-sm uppercase">
          <Link to="/" className="hover:underline">Início</Link>
          <Link to="/shop" className="hover:underline">Categorias</Link>
          <Link to="/shop" search={{ sale: true }} className="hover:underline text-red-100">Liquidação</Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-primary border-t border-primary-foreground/20 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4 font-bold uppercase text-sm">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Início</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)}>Categorias</Link>
            <Link to="/shop" search={{ sale: true }} onClick={() => setIsMenuOpen(false)} className="hover:underline text-red-100">Liquidação</Link>
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full bg-white text-foreground px-4 py-2 rounded-md focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 text-muted-foreground w-5 h-5" />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
