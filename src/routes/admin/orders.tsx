import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Phone, MessageCircle } from "lucide-react";

export const Route = createFileRoute('/admin/orders')({
  component: AdminOrders,
});

interface Order {
  id: string;
  customer_details: any;
  items: any;
  total: number;
  payment_method: string;
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

const statusList = ["pendente", "pago", "preparando", "enviado", "entregue", "cancelado"];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  function formatMoney(value: number) {
    return "R$ " + (Number(value) || 0).toFixed(2).replace(".", ",");
  }

  function itemList(items: any): any[] {
    if (Array.isArray(items)) return items;
    return [];
  }

  return (
    <div className="min-h-screen bg-[#050505] p-6 text-left">
      <h1 className="text-2xl font-bold text-[#C9A84C] uppercase tracking-wider mb-6">Pedidos</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {["todos", ...statusList].map((s) => (
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
          {orders.map((order) => {
            const items = itemList(order.items);
            const customerPhone = order.customer_details?.phone || "";
            const whatsappLink = customerPhone
              ? `https://wa.me/${customerPhone.replace(/\D/g, "")}`
              : null;
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className="bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl overflow-hidden">
                <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="flex-1 min-w-[200px] text-left flex items-center gap-2"
                  >
                    <ChevronDown className={`w-4 h-4 text-[#C9A84C] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    <div>
                      <p className="text-white font-semibold text-sm">{order.customer_details?.fullName || "Cliente não identificado"}</p>
                      <p className="text-[#A0A0A0] text-xs">{order.customer_details?.email || "-"}</p>
                      <p className="text-[#A0A0A0] text-xs">{new Date(order.created_at).toLocaleString("pt-BR")}</p>
                    </div>
                  </button>
                  <p className="text-[#C9A84C] font-bold">{formatMoney(Number((order as any).total_amount ?? order.total))}</p>
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${statusColors[order.status] || "bg-[#1A1A1A] text-[#A0A0A0] border-[#C9A84C22]"}`}>
                    {statusList.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {isOpen && (
                  <div className="border-t border-[#C9A84C22] px-4 py-4 space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-wider mb-2">Dados do Cliente</p>
                        <p className="text-white">Nome: {order.customer_details?.fullName || "-"}</p>
                        <p className="text-[#A0A0A0]">Email: {order.customer_details?.email || "-"}</p>
                        <p className="text-[#A0A0A0]">WhatsApp: {order.customer_details?.phone || "-"}</p>
                        {whatsappLink && (
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:opacity-90"
                          >
                            <Phone className="w-3.5 h-3.5" /> Falar com cliente
                          </a>
                        )}
                      </div>
                      <div>
                        <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-wider mb-2">Endereço de Entrega</p>
                        <p className="text-[#A0A0A0]">{order.customer_details?.address || "-"}</p>
                        <p className="text-[#A0A0A0]">
                          {order.customer_details?.city || "-"} - {order.customer_details?.state || "-"}, CEP: {order.customer_details?.zip || "-"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-wider mb-2">Itens do Pedido</p>
                      {items.length > 0 ? (
                        <div className="space-y-2">
                          {items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center border-b border-[#C9A84C11] pb-2">
                              <span className="text-white">
                                {item.quantity}x {item.name}
                                {item.size ? ` (Tamanho ${item.size})` : ""}
                              </span>
                              <span className="text-[#A0A0A0]">
                                {formatMoney(Number(item.promo_price || item.price) * Number(item.quantity))}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#666]">Sem itens registrados</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[#A0A0A0]">Pagamento combinado no WhatsApp</span>
                      {whatsappLink && (
                        <a
                          href={`${whatsappLink}?text=${encodeURIComponent("Olá! Aqui é da Martins Multimarcas sobre o seu pedido.")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#25D366] font-bold text-xs uppercase hover:underline"
                        >
                          <MessageCircle className="w-4 h-4" /> Chamar no WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {orders.length === 0 && <p className="text-[#A0A0A0] text-center py-8">Nenhum pedido encontrado</p>}
        </div>
      )}
    </div>
  );
}