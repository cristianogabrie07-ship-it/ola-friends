import { useRef, useState } from "react";
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
import { Upload, Loader2, X } from "lucide-react";

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
  images: z.array(z.string()).min(1, "Pelo menos uma imagem é obrigatória").nullable().optional(),
  water_resistance: z.string().nullable().optional(),
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
      water_resistance: initialData?.water_resistance || null,
    },
  });


  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    const current = form.getValues("images") || [];
    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
        uploaded.push(data.publicUrl);
      }
      if (uploaded.length > 0) {
        form.setValue("images", [...current, ...uploaded], { shouldValidate: true });
      }
    } catch (err) {
      console.error(err);
      setUploadError(
        "Falha no upload. Verifique se o bucket 'product-images' existe e se seu usuário tem permissão de admin no banco."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const current = form.getValues("images") || [];
    form.setValue("images", current.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const selectedCategoryId = form.watch("category_id");
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const isWatch = selectedCategory?.slug === "relogios";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="uppercase font-bungee">
            {initialData?.id ? "Editar Produto" : "Adicionar Produto"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
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

            {isWatch && (
              <FormField
                control={form.control}
                name="water_resistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-xs">Resistência à Água</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} className="rounded-none border-neutral-300" placeholder="Ex: 50m, 10 ATM" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-bold text-xs">Imagens do Produto</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {field.value && field.value.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {field.value.map((url, idx) => (
                            <div key={`${url}-${idx}`} className="relative group aspect-square border border-neutral-300 overflow-hidden">
                              <img src={url} alt={`Imagem ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remover imagem"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => uploadImages(e.target.files)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full rounded-none border-neutral-300 uppercase text-xs font-bold tracking-wide"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Enviar Imagens (celular ou computador)
                          </>
                        )}
                      </Button>
                      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

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
