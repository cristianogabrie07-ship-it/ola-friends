import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: '/auth' });
    }

    const { data: hasRole } = await supabase.rpc('has_role', {
      _user_id: session.user.id,
      _role: 'admin'
    });

    if (!hasRole) {
      toast.error("Acesso negado: Somente administradores.");
      throw redirect({ to: '/' });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[#0D0D0D] border-r border-[#E0000022] text-white p-6 flex flex-col">
        <h2 className="text-xl font-bungee tracking-tighter text-[#E00000] mb-8">MARTINS ADMIN</h2>
        <nav className="flex flex-col gap-4 font-bold uppercase text-sm">
          <Link to="/admin" className="hover:text-[#E00000] transition-colors [&.active]:text-[#E00000]">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-[#E00000] transition-colors [&.active]:text-[#E00000]">Produtos</Link>
          <Link to="/admin/orders" className="hover:text-[#E00000] transition-colors [&.active]:text-[#E00000]">Pedidos</Link>
          <Link to="/admin/coupons" className="hover:text-[#E00000] transition-colors [&.active]:text-[#E00000]">Cupons</Link>
          <Link to="/admin/settings" className="hover:text-[#E00000] transition-colors [&.active]:text-[#E00000]">Configurações</Link>
          <hr className="border-[#E0000022]" />
          <Link to="/" className="text-xs opacity-60">Voltar para Loja</Link>
        </nav>
        
        <button 
          onClick={async () => { 
            await supabase.auth.signOut(); 
            window.location.href = "/auth"; 
          }}
          className="flex items-center gap-3 w-full px-4 py-3 text-[#A0A0A0] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span className="text-sm font-medium">Sair</span>
        </button>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
