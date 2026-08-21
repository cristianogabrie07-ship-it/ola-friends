import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

// Workaround for exactOptionalPropertyTypes
type ProductUpdate = Partial<Tables<"products">> & { id: string };


export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Tables<"products"> | null>(null);

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase.from("products").insert([values]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produto criado com sucesso!");
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast.error(`Erro ao criar produto: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...values }: ProductUpdate) => {
      // Auto-sold-out logic
      const isSoldOut = (values.stock !== undefined && values.stock !== null && values.stock <= 0) ? true : values.is_sold_out;
      const { error } = await supabase
        .from("products")
        .update({ ...values, is_sold_out: isSoldOut } as any)
        .eq("id", id);
      if (error) throw error;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produto atualizado com sucesso!");
      setIsFormOpen(false);
      setEditingProduct(null);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar produto: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produto excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir produto: ${error.message}`);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("products")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const handleEdit = (product: Tables<"products">) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  if (isLoadingProducts) return <div className="p-8">Carregando produtos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bungee uppercase">Produtos</h1>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="bg-primary text-primary-foreground font-bungee tracking-tighter rounded-none py-6 px-8"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Produto
        </Button>
      </div>

      <ProductTable
        products={products || []}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
        onToggleActive={(id, current) => toggleActiveMutation.mutate({ id, is_active: !current })}
        onUpdateStock={(id, stock) => updateMutation.mutate({ id, stock })}
      />

      <ProductForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
        initialData={(editingProduct as any) ?? undefined}
        categories={categories || []}
      />


    </div>
  );
}

