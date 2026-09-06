import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StoreSettings {
  name: string;
  slogan: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  pix_discount_percent: number;
}

let cached: StoreSettings | null = null;

// Puxa as configurações da loja (nome, WhatsApp, desconto PIX...).
// O desconto PIX é configurável pelo admin em /admin/settings.
export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(cached);

  useEffect(() => {
    if (cached) return;

    (async () => {
      try {
        const { data } = await supabase
          .from("stores" as any)
          .select("*")
          .limit(1)
          .single();
        if (data) {
          const s: StoreSettings = {
            name: (data as any).name || "Martins Multimarcas",
            slogan: (data as any).slogan || null,
            whatsapp: (data as any).whatsapp || null,
            email: (data as any).email || null,
            instagram: (data as any).instagram || null,
            pix_discount_percent: Number((data as any).pix_discount_percent ?? 0),
          };
          cached = s;
          setSettings(s);
        }
      } catch (err) {
        console.error("Erro ao carregar configurações da loja:", err);
      }
    })();
  }, []);

  return { settings };
}