import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CouponTable } from "@/components/admin/CouponTable";
import { CouponForm } from "@/components/admin/CouponForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/coupons")({
  component: CouponsPage,
});

function CouponsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Tables<"coupons"> | null>(null);

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase.from("coupons").insert([values]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Cupom criado com sucesso!");
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast.error(`Erro ao criar cupom: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...values }: any) => {
      const { error } = await supabase
        .from("coupons")
        .update(values)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Cupom atualizado com sucesso!");
      setIsFormOpen(false);
      setEditingCoupon(null);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar cupom: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Cupom excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir cupom: ${error.message}`);
    },
  });

  const handleEdit = (coupon: Tables<"coupons">) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  if (isLoading) return <div className="p-8">Carregando cupons...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bungee uppercase">Cupons</h1>
        <Button
          onClick={() => {
            setEditingCoupon(null);
            setIsFormOpen(true);
          }}
          className="bg-primary text-primary-foreground font-bungee tracking-tighter rounded-none py-6 px-8"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Cupom
        </Button>
      </div>

      <CouponTable
        coupons={coupons || []}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <CouponForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingCoupon(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingCoupon ?? undefined}
      />

    </div>
  );
}

