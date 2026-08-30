import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/admin/orders')({
  component: AdminOrders,
});

interface Order {
  id: string;
  customer_details: any;
  total: number;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-500/20 text-yellow-400",
  pago: "bg-green-500/20 text-green-400",
  preparando: "bg-blue-500/20 text-blue-400",
  enviado: "bg-purple-500/20 text-purple-400",
  entregue: "bg-emerald-500/20 text-emerald-400",
  cancelado: "bg-red-500/20 text-red-400",
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  async function fetchOrders() {
    setLoading(true);
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filter !== "todos") query = query.eq("status", filter);
    const { data } = await query;
    setOrders((data as any) || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("orders").update({ status: status } as any).eq("id", id);
    fetchOrders();
  }

  return (
    <div className="min-h-screen bg-[#050505] p-6 text-left">
      <h1 className="text-2xl font-bold text-[#C9A84C] uppercase tracking-wider mb-6">Pedidos</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {["todos", "pendente", "pago", "preparando", "enviado", "entregue", "cancelado"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${filter === s ? "bg-[#C9A84C] text-[#050505] border-[#C9A84C]" : "bg-[#0D0D0D] text-[#A0A0A0] border-[#C9A84C22] hover:border-[#C9A84C55]"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-[#0D0D0D] rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{order.customer_details?.fullName || "Cliente não identificado"}</p>
                <p className="text-[#A0A0A0] text-xs">{order.customer_details?.email || "-"}</p>
                <p className="text-[#A0A0A0] text-xs">{new Date(order.created_at).toLocaleDateString("pt-BR")}</p>
              </div>
              <p className="text-[#C9A84C] font-bold mr-4">R$ {order.total.toFixed(2).replace(".", ",")}</p>
              <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${statusColors[order.status] || "bg-[#1A1A1A] text-[#A0A0A0] border-[#C9A84C22]"}`}>
                {["pendente", "pago", "preparando", "enviado", "entregue", "cancelado"].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          ))}
          {orders.length === 0 && <p className="text-[#A0A0A0] text-center py-8">Nenhum pedido encontrado</p>}
        </div>
      )}
    </div>
  );
}
