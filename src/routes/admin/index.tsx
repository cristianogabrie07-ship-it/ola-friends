import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});


function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data: orders } = await supabase.from('orders').select('total');
      const totalSales = orders?.reduce((acc, o) => acc + Number(o.total), 0) || 0;
      return {
        totalOrders: orders?.length || 0,
        totalSales,
      };
    }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold uppercase">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-border shadow-sm">
          <p className="text-sm text-muted-foreground uppercase font-bold mb-2">Total de Vendas</p>
          <p className="text-4xl font-bold text-primary">R$ {stats?.totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 border border-border shadow-sm">
          <p className="text-sm text-muted-foreground uppercase font-bold mb-2">Pedidos Realizados</p>
          <p className="text-4xl font-bold">{stats?.totalOrders}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 border border-border shadow-sm">
        <h2 className="font-bold uppercase mb-4">Ações Rápidas</h2>
        <div className="flex gap-4">
          <Link to="/admin/products" className="bg-primary text-primary-foreground px-4 py-2 font-bold uppercase text-xs">Gerenciar Produtos</Link>
          <Link to="/admin/coupons" className="border border-primary text-primary px-4 py-2 font-bold uppercase text-xs">Gerenciar Cupons</Link>
        </div>

      </div>
    </div>
  );
}
