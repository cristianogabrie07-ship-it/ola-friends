import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, X, Loader2, Palette } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface ColorVariant {
  name: string;
  image: string;
}

interface ColorVariantsDialogProps {
  product: Tables<"products"> | null;
  onClose: () => void;
}

export function ColorVariantsDialog({ product, onClose }: ColorVariantsDialogProps) {
  const queryClient = useQueryClient();
  const [variants, setVariants] = useState<ColorVariant[]>([]);
  const [uploadingColor, setUploadingColor] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingIndexRef = useRef<number>(-1);
  const lastOpenIdRef = useRef<string | null>(null);

  // Carrega as cores do produto SEMPRE que o diálogo abre (null -> produto).
  // Assim, se o dono salvar, fechar e reabrir, vê sempre os dados atualizados do banco.
  if (product && lastOpenIdRef.current === null) {
    setVariants(Array.isArray(product.color_variants) ? (product.color_variants as unknown as ColorVariant[]) : []);
  }
  lastOpenIdRef.current = product?.id ?? null;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const clean = variants.filter((v) => v.name.trim());
      const { error } = await supabase
        .from("products")
        .update({ color_variants: clean as any })
        .eq("id", product!.id);
      if (error) throw error;
      return clean;
    },
    onSuccess: (clean) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["shop-products"] });
      if (clean.some((v) => !v.image)) {
        toast.warning("Cores salvas! Dica: cores sem foto não aparecem na galeria — adicione a foto de cada cor.");
      } else {
        toast.success("Cores salvas! Já aparecem na página do produto.");
      }
      onClose();
    },
    onError: (error) => {
      toast.error(`Erro ao salvar cores: ${error.message}`);
    },
  });

  const handleSave = () => {
    const named = variants.filter((v) => v.name.trim());
    if (variants.length > 0 && named.length === 0) {
      toast.error("Digite o nome da cor antes de salvar (ex: Preto).");
      return;
    }
    saveMutation.mutate();
  };

  const uploadColorImage = async (file: File, index: number) => {
    setUploadingColor(index);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, image: data.publicUrl } : v)));
    } catch (err) {
      console.error(err);
      toast.error("Falha no upload da foto da cor.");
    } finally {
      setUploadingColor(null);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background border-border max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bungee uppercase text-lg flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Cores — {product.name}
          </DialogTitle>
          <DialogDescription>
            Adicione uma cor por linha com a foto dela. O cliente desliza as fotos do produto e escolhe a cor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {variants.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Nenhuma cor ainda. Clique em "Adicionar Cor" para criar a primeira (ex: Preto, Branco, Verde).
            </p>
          )}
          {variants.map((variant, index) => (
            <div key={index} className="flex items-end gap-3 border border-border p-3">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Nome da cor (ex: Preto)"
                  value={variant.name}
                  onChange={(e) =>
                    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, name: e.target.value } : v)))
                  }
                  className="rounded-none border-neutral-300"
                />
                {variant.image ? (
                  <div className="relative w-16 h-16 border border-neutral-300 overflow-hidden">
                    <img src={variant.image} alt={variant.name || "Cor"} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, image: "" } : v)))}
                      className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                      aria-label="Remover foto da cor"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingColor !== null}
                    onClick={() => {
                      pendingIndexRef.current = index;
                      fileInputRef.current?.click();
                    }}
                    className="w-full rounded-none border-neutral-300 uppercase text-xs"
                  >
                    {uploadingColor === index ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-3 w-3" />
                        Foto da Cor
                      </>
                    )}
                  </Button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setVariants((prev) => prev.filter((_, i) => i !== index))}
                className="text-neutral-400 hover:text-red-500 pb-2"
                aria-label="Remover cor"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => setVariants((prev) => [...prev, { name: "", image: "" }])}
            className="w-full rounded-none border-neutral-300 uppercase text-xs font-bold"
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar Cor
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              const idx = pendingIndexRef.current;
              if (file && idx >= 0) uploadColorImage(file, idx);
              pendingIndexRef.current = -1;
              e.target.value = "";
            }}
          />

          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="w-full bg-primary text-primary-foreground font-bungee tracking-tighter rounded-none"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Cores"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
