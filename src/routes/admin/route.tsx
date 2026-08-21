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
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-neutral-900 text-white p-6 space-y-8">
        <h2 className="text-xl font-bungee tracking-tighter">MARTINS ADMIN</h2>
        <nav className="flex flex-col gap-4 font-bold uppercase text-sm">
          <Link to="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-primary transition-colors">Produtos</Link>
          <Link to="/admin/orders" className="hover:text-primary transition-colors">Pedidos</Link>
          <Link to="/admin/coupons" className="hover:text-primary transition-colors">Cupons</Link>
          <hr className="border-neutral-800" />
          <Link to="/" className="text-xs opacity-60">Voltar para Loja</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
