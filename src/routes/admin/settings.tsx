import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
});

export function AdminSettings() {
  const [name, setName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  async function loadSettings() {
    const { data } = await supabase.from("stores").select("*").limit(1).single();
    if (data) {
      setName(data.name || "");
      setSlogan(data.slogan || "");
      setWhatsapp(data.whatsapp || "");
      setEmail(data.email || "");
      setInstagram(data.instagram || "");
    }
  }

  async function handleSave() {
    setSaving(true);
    const { data } = await supabase.from("stores").select("id").limit(1).single();
    if (data) {
      await supabase.from("stores").update({ name, slogan, whatsapp, email, instagram }).eq("id", data.id);
    } else {
      await supabase.from("stores").insert([{ name, slogan, whatsapp, email, instagram }]);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputClass = "w-full bg-[#1A1A1A] border border-[#C9A84C33] rounded-lg px-4 py-2.5 text-white text-sm focus:border-[#C9A84C] focus:outline-none transition-all";

  return (
    <div className="min-h-screen bg-[#050505] p-6 max-w-2xl text-left">
      <h1 className="text-2xl font-bold text-[#C9A84C] uppercase tracking-wider mb-8">Configurações da Loja</h1>
      <div className="space-y-6">
        <div className="bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Dados Gerais</h2>
          <div><label className="text-[#A0A0A0] text-xs mb-1 block">Nome da Loja</label><input value={name} onChange={e => setName(e.target.value)} className={inputClass} /></div>
          <div><label className="text-[#A0A0A0] text-xs mb-1 block">Slogan</label><input value={slogan} onChange={e => setSlogan(e.target.value)} className={inputClass} /></div>
        </div>
        <div className="bg-[#0D0D0D] border border-[#C9A84C22] rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Contato</h2>
          <div><label className="text-[#A0A0A0] text-xs mb-1 block">WhatsApp</label><input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className={inputClass} /></div>
          <div><label className="text-[#A0A0A0] text-xs mb-1 block">Email</label><input value={email} onChange={e => setEmail(e.target.value)} className={inputClass} /></div>
          <div><label className="text-[#A0A0A0] text-xs mb-1 block">Instagram</label><input value={instagram} onChange={e => setInstagram(e.target.value)} className={inputClass} /></div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="bg-[#C9A84C] text-[#050505] font-bold text-sm uppercase tracking-wider px-8 py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50">
          {saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}
