import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";
import { Edit, Trash2, Eye, EyeOff, AlertCircle } from "lucide-react";

interface ProductTableProps {
  products: (Tables<"products"> & { categories: { name: string } | null })[];
  onEdit: (product: Tables<"products">) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, current: boolean) => void;
  onUpdateStock: (id: string, stock: number) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleActive,
  onUpdateStock,
}: ProductTableProps) {
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<string>("");

  return (
    <div className="bg-white border border-border shadow-sm">
      <Table>
        <TableHeader className="bg-neutral-50">
          <TableRow>
            <TableHead className="uppercase font-bold text-[10px] w-[80px]">Foto</TableHead>
            <TableHead className="uppercase font-bold text-[10px]">Nome</TableHead>
            <TableHead className="uppercase font-bold text-[10px]">Categoria</TableHead>
            <TableHead className="uppercase font-bold text-[10px]">Preço</TableHead>
            <TableHead className="uppercase font-bold text-[10px]">Estoque</TableHead>
            <TableHead className="uppercase font-bold text-[10px]">Status</TableHead>
            <TableHead className="uppercase font-bold text-[10px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover border border-neutral-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center border border-neutral-200">
                    <AlertCircle className="w-4 h-4 text-neutral-400" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="rounded-none uppercase text-[9px]">
                  {product.categories?.name || "Sem categoria"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className={product.promo_price ? "text-xs line-through text-muted-foreground" : "font-bold"}>
                    R$ {product.price.toFixed(2)}
                  </span>
                  {product.promo_price && (
                    <span className="font-bold text-primary">
                      R$ {product.promo_price.toFixed(2)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {editingStock === product.id ? (
                    <Input
                      type="number"
                      className="w-20 h-8 rounded-none text-xs"
                      value={tempStock}
                      onChange={(e) => setTempStock(e.target.value)}
                      onBlur={() => {
                        const val = parseInt(tempStock);
                        if (!isNaN(val)) onUpdateStock(product.id, val);
                        setEditingStock(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = parseInt(tempStock);
                          if (!isNaN(val)) onUpdateStock(product.id, val);
                          setEditingStock(null);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-neutral-50 px-2 py-1 flex items-center gap-2"
                      onClick={() => {
                        setEditingStock(product.id);
                        setTempStock(product.stock?.toString() || "0");
                      }}
                    >
                      <span className={`font-bold ${(product.stock || 0) < 5 ? "text-destructive" : ""}`}>
                        {product.stock || 0}
                      </span>
                      {(product.stock || 0) < 5 && (
                        <AlertCircle className="w-3 h-3 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {product.is_active ? (
                    <Badge variant="default" className="bg-green-600 rounded-none uppercase text-[9px] w-fit">Ativo</Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded-none uppercase text-[9px] w-fit">Inativo</Badge>
                  )}
                  {product.is_sold_out && (
                    <Badge variant="destructive" className="rounded-none uppercase text-[9px] w-fit">Esgotado</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleActive(product.id, !!product.is_active)}
                    title={product.is_active ? "Desativar" : "Ativar"}
                  >
                    {product.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Tem certeza que deseja excluir este produto?")) {
                        onDelete(product.id);
                      }
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                Nenhum produto encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
