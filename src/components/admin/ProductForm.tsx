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
import { Tables } from "@/integrations/supabase/types";

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
              <FormLabel className="uppercase font-bold text-xs">Tamanhos Disponíveis</FormLabel>
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
                            checked={field.value?.includes(size)}
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
                  <FormLabel className="uppercase font-bold text-xs">URLs das Imagens (uma por linha)</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value?.join("\n")}
                      onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))}
                      placeholder="https://exemplo.com/imagem1.jpg"
                      className="rounded-none border-neutral-300 min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
