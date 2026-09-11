import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Upload, Loader2, X, Plus } from "lucide-react";

export interface ColorVariant {
  name: string;
  image: string;
}

export interface ProductFormValuesWithVariants {
  name: string;
  description: string | null | undefined;
  price: number;
  promo_price: number | null | undefined;
  category_id: string;
  stock: number;
  is_active: boolean | null | undefined;
  is_sold_out: boolean | null | undefined;
  sizes: string[] | null | undefined;
  images: string[] | null | undefined;
  video_url: string | null | undefined;
  water_resistance: string | null | undefined;
  color_variants: ColorVariant[];
}

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().nullable().optional(),
  price: z.coerce.number().min(0.01, "Preço deve ser maior que zero"),
  promo_price: z.coerce.number().nullable().optional(),
  category_id: z.string().min(1, "Categoria é obrigatória"),
  stock: z.coerce.number().min(0, "Estoque não pode ser negativo"),
  is_active: z.boolean().nullable().optional(),
  is_sold_out: z.boolean().nullable().optional(),
  sizes: z.array(z.string()).nullable().optional(),
  images: z.array(z.string()).min(1, "Pelo menos uma imagem é obrigatória").max(1, "Apenas 1 imagem por produto").nullable().optional(),
  video_url: z.string().nullable().optional(),
  water_resistance: z.string().nullable().optional(),
  color_variants: z.array(z.object({ name: z.string(), image: z.string() })).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;


interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProductFormValues) => void;
  initialData?: Partial<ProductFormValues> & { id?: string };
  categories: Tables<"categories">[];
}

const AVAILABLE_SIZES = ["P", "M", "G", "GG", "XG", "38", "39", "40", "41", "42", "43", "44"];

export function ProductForm({ open, onOpenChange, onSubmit, initialData, categories }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || null,
      price: initialData?.price || 0,
      promo_price: initialData?.promo_price || null,
      category_id: initialData?.category_id || "",
      stock: initialData?.stock || 0,
      is_active: initialData?.is_active ?? true,
      is_sold_out: initialData?.is_sold_out ?? false,
      sizes: initialData?.sizes || [],
      images: initialData?.images || [],
      video_url: initialData?.video_url || null,
      water_resistance: initialData?.water_resistance || null,
      color_variants: initialData?.color_variants || [],
    },  });

  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(initialData?.color_variants || []);

  // Re-sincroniza o formulário SEMPRE que o diálogo abre: preenche tudo quando é
  // "Editar" (nome, preço, foto, vídeo, tamanhos e cores já cadastradas) e limpa
  // tudo quando é "Novo Produto". Sem isso, o formulário nascia em branco ao editar.
  useEffect(() => {
    if (!open) return;
    form.reset({
      name: initialData?.name || "",
      description: initialData?.description || null,
      price: initialData?.price || 0,
      promo_price: initialData?.promo_price || null,
      category_id: initialData?.category_id || "",
      stock: initialData?.stock || 0,
      is_active: initialData?.is_active ?? true,
      is_sold_out: initialData?.is_sold_out ?? false,
      sizes: initialData?.sizes || [],
      images: initialData?.images || [],
      video_url: initialData?.video_url || null,
      water_resistance: initialData?.water_resistance || null,
      color_variants: initialData?.color_variants || [],
    });
    setColorVariants(initialData?.color_variants || []);
    setUploadError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData]);

  const [uploading, setUploading] = useState<"image" | "video" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File, kind: "image" | "video") => {
    setUploading(kind);
    setUploadError(null);

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || (kind === "video" ? "mp4" : "jpg");
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);

      if (kind === "image") {
        form.setValue("images", [data.publicUrl], { shouldValidate: true });
      } else {
        form.setValue("video_url", data.publicUrl, { shouldValidate: true });
      }
    } catch (err) {
      console.error(err);
      setUploadError(
        kind === "video"
          ? "Falha no upload do vídeo. Verifique o tamanho (máx. 50MB) e se rode o SQL setup-video.sql no Supabase."
          : "Falha no upload. Verifique se o bucket 'product-images' existe e se seu usuário tem permissão de admin no banco."
      );
    } finally {
      setUploading(null);
      if (kind === "image" && imageInputRef.current) imageInputRef.current.value = "";
      if (kind === "video" && videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    form.setValue("images", [], { shouldValidate: true });
  };

  const removeVideo = () => {
    form.setValue("video_url", null, { shouldValidate: false });
  };

  // ---- Variações de cor ----
  const colorInputRef = useRef<HTMLInputElement>(null);
  const uploadingColorIndex = useRef<number | null>(null);
  const [uploadingColor, setUploadingColor] = useState(false);

  const uploadColorImage = async (file: File, index: number) => {
    setUploadingColor(true);
    setUploadError(null);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setColorVariants((prev) => prev.map((v, i) => (i === index ? { ...v, image: data.publicUrl } : v)));
    } catch (err) {
      console.error(err);
      setUploadError("Falha no upload da foto da cor. Tente novamente.");
    } finally {
      setUploadingColor(false);
      uploadingColorIndex.current = null;
      if (colorInputRef.current) colorInputRef.current.value = "";
    }
  };

  const addColorVariant = () => {
    setColorVariants((prev) => [...prev, { name: "", image: "" }]);
  };

  const removeColorVariant = (index: number) => {
    setColorVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateColorName = (index: number, name: string) => {
    setColorVariants((prev) => prev.map((v, i) => (i === index ? { ...v, name } : v)));
  };

  const selectedCategoryId = form.watch("category_id");

  const handleFormSubmit = (values: ProductFormValues) => {
    // Inclui as variações de cor no payload enviado ao banco
    onSubmit({ ...values, color_variants: colorVariants.filter(v => v.name.trim()) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="uppercase font-bungee">
            {initialData?.id ? "Editar Produto" : "Adicionar Produto"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-xs">Nome</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-none border-neutral-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-xs">Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none border-neutral-300">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-bold text-xs">Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ""} className="rounded-none border-neutral-300 min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-xs">Preço</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="rounded-none border-neutral-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="promo_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-xs">Preço Promo (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} value={field.value || ""} className="rounded-none border-neutral-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-xs">Estoque</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-none border-neutral-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <p className="uppercase font-bold text-xs">Tamanhos Disponíveis</p>
              <div className="flex flex-wrap gap-4">
                {AVAILABLE_SIZES.map((size) => (
                  <FormField
                    key={size}
                    control={form.control}
                    name="sizes"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(size) ?? false}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              return checked
                                ? field.onChange([...current, size])
                                : field.onChange(current.filter((v) => v !== size));
                            }}
                          />
                        </FormControl>

                        <FormLabel className="text-sm font-normal">{size}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="uppercase font-bold text-xs">Cores Disponíveis (variações)</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addColorVariant}
                  className="rounded-none border-neutral-300 uppercase text-xs font-bold"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar Cor
                </Button>
              </div>
              {colorVariants.length === 0 && (
                <p className="text-xs text-neutral-500">
                  Opcional: adicione variações de cor (ex: Preto, Branco). Cada cor pode ter sua própria foto —
                  o cliente seleciona a cor na página do produto e a foto troca.
                </p>
              )}
              <div className="space-y-3">
                {colorVariants.map((variant, index) => (
                  <div key={index} className="flex items-end gap-3 border border-neutral-200 p-3">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Nome da cor (ex: Preto)"
                        value={variant.name}
                        onChange={(e) => updateColorName(index, e.target.value)}
                        className="rounded-none border-neutral-300"
                      />
                      {variant.image ? (
                        <div className="relative w-16 h-16 border border-neutral-300 overflow-hidden">
                          <img src={variant.image} alt={variant.name || "Cor"} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setColorVariants(prev => prev.map((v, i) => i === index ? { ...v, image: "" } : v))}
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
                          disabled={uploadingColor}
                          onClick={() => {
                            uploadingColorIndex.current = index;
                            colorInputRef.current?.click();
                          }}
                          className="w-full rounded-none border-neutral-300 uppercase text-xs"
                        >
                          {uploadingColor && uploadingColorIndex.current === index ? (
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
                      onClick={() => removeColorVariant(index)}
                      className="text-neutral-400 hover:text-red-500 pb-2"
                      aria-label="Remover cor"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <input
                ref={colorInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && uploadingColorIndex.current !== null) uploadColorImage(f, uploadingColorIndex.current);
                }}
              />
              {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-xs">Foto do Produto (1)</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {field.value && field.value.length > 0 ? (
                          <div className="relative aspect-square w-32 border border-neutral-300 overflow-hidden">
                            <img src={field.value[0]} alt="Foto do produto" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
                              aria-label="Remover foto"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : null}
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadFile(f, "image");
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploading !== null}
                          onClick={() => imageInputRef.current?.click()}
                          className="w-full rounded-none border-neutral-300 uppercase text-xs font-bold tracking-wide"
                        >
                          {uploading === "image" ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Enviar Foto
                            </>
                          )}
                        </Button>
                        <FormMessage />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-xs">Vídeo do Produto (1, opcional)</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {field.value ? (
                          <div className="relative">
                            <video src={field.value} controls className="w-full max-w-[220px] aspect-square object-cover border border-neutral-300" />
                            <button
                              type="button"
                              onClick={removeVideo}
                              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
                              aria-label="Remover vídeo"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : null}
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadFile(f, "video");
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploading !== null}
                          onClick={() => videoInputRef.current?.click()}
                          className="w-full rounded-none border-neutral-300 uppercase text-xs font-bold tracking-wide"
                        >
                          {uploading === "video" ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enviando vídeo...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Enviar Vídeo (máx. 50MB)
                            </>
                          )}
                        </Button>
                        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value ?? true} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-sm font-bold uppercase">Ativo</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_sold_out"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-sm font-bold uppercase">Esgotado</FormLabel>
                  </FormItem>
                )}
              />

            </div>

            <DialogFooter>
              <Button type="submit" className="w-full md:w-auto bg-primary text-primary-foreground font-bungee uppercase tracking-tighter rounded-none py-6">
                {initialData?.id ? "Salvar Alterações" : "Criar Produto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
