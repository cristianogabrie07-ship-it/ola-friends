import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin')({
  component: AdminRouteGuard,
});

function AdminRouteGuard() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    let retryCount = 0;
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 500;

    const checkAuth = async (session: any) => {
      if (cancelled) return;

      if (!session) {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(() => tryGetSession(), RETRY_DELAY);
          return;
        }
        toast.error("Faça login para acessar o admin.");
        navigate({ to: '/auth' });
        setChecking(false);
        return;
      }

      try {
        const { data: hasRole } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });

        if (cancelled) return;

        if (!hasRole) {
          toast.error("Acesso negado: Somente administradores.");
          navigate({ to: '/' });
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        if (!cancelled) {
          toast.error("Erro ao verificar autenticação.");
          navigate({ to: '/auth' });
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    const tryGetSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      checkAuth(session);
    };

    // Also listen for auth state changes as a backup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          checkAuth(session);
        }
      }
    );

    tryGetSession();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[#C9A84C] text-lg font-bold animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (!authorized) return null;

  return <AdminLayout />;
}

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[#0D0D0D] border-r border-[#C9A84C22] text-white p-6 flex flex-col">
        <h2 className="text-xl font-bungee tracking-tighter text-[#C9A84C] mb-8">MARTINS ADMIN</h2>
        <nav className="flex flex-col gap-4 font-bold uppercase text-sm">
          <Link to="/admin" className="hover:text-[#C9A84C] transition-colors [&.active]:text-[#C9A84C]">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-[#C9A84C] transition-colors [&.active]:text-[#C9A84C]">Produtos</Link>
          <Link to="/admin/orders" className="hover:text-[#C9A84C] transition-colors [&.active]:text-[#C9A84C]">Pedidos</Link>
          <Link to="/admin/coupons" className="hover:text-[#C9A84C] transition-colors [&.active]:text-[#C9A84C]">Cupons</Link>
          <Link to="/admin/settings" className="hover:text-[#C9A84C] transition-colors [&.active]:text-[#C9A84C]">Configurações</Link>
          <hr className="border-[#C9A84C22]" />
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
