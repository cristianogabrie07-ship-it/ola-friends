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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";

const couponSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  discount_percent: z.coerce.number().min(0).max(100),
  expiry: z.string().nullable().optional(),
  usage_limit: z.coerce.number().nullable().optional(),
  used_count: z.coerce.number().nullable().optional(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CouponFormValues) => void;
  initialData?: Partial<CouponFormValues> & { id?: string };
}

export function CouponForm({ open, onOpenChange, onSubmit, initialData }: CouponFormProps) {
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: initialData?.code || "",
      discount_percent: initialData?.discount_percent || 0,
      expiry: initialData?.expiry ? new Date(initialData.expiry).toISOString().split('T')[0] : null,
      usage_limit: initialData?.usage_limit || null,
      used_count: initialData?.used_count || 0,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="uppercase font-bungee">
            {initialData?.id ? "Editar Cupom" : "Criar Cupom"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-bold text-xs">Código</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-none border-neutral-300 uppercase" placeholder="EX: NATAL10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-bold text-xs">Desconto (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="rounded-none border-neutral-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-bold text-xs">Data de Validade (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} className="rounded-none border-neutral-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usage_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-bold text-xs">Limite de Usos (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ""} className="rounded-none border-neutral-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="w-full bg-primary text-primary-foreground font-bungee uppercase tracking-tighter rounded-none py-6">
                {initialData?.id ? "Salvar Alterações" : "Criar Cupom"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
