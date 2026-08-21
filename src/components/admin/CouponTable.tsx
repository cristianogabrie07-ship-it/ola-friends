import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";
import { Edit, Trash2, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CouponTableProps {
  coupons: Tables<"coupons">[];
  onEdit: (coupon: Tables<"coupons">) => void;
  onDelete: (id: string) => void;
}

export function CouponTable({ coupons, onEdit, onDelete }: CouponTableProps) {
  return (
    <div className="bg-white border border-border shadow-sm">
      <Table>
        <TableHeader className="bg-neutral-50">
          <TableRow>
            <TableHead className="uppercase font-bold text-[10px]">Código</TableHead>
            <TableHead className="uppercase font-bold text-[10px]">Desconto</TableHead>
            <TableHead className="uppercase font-bold text-[10px]">Validade</TableHead>
            <TableHead className="uppercase font-bold text-[10px]">Usos</TableHead>
            <TableHead className="uppercase font-bold text-[10px]">Status</TableHead>
            <TableHead className="uppercase font-bold text-[10px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => {
            const isExpired = coupon.expiry ? new Date(coupon.expiry) < new Date() : false;
            const isLimitReached = coupon.usage_limit ? (coupon.used_count || 0) >= coupon.usage_limit : false;
            const isActive = !isExpired && !isLimitReached;

            return (
              <TableRow key={coupon.id}>
                <TableCell className="font-bold uppercase text-primary">{coupon.code}</TableCell>
                <TableCell className="font-medium">{coupon.discount_percent}%</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    {coupon.expiry ? format(new Date(coupon.expiry), "dd/MM/yyyy", { locale: ptBR }) : "Sem expiração"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    {coupon.used_count || 0} / {coupon.usage_limit || "∞"}
                  </div>
                </TableCell>
                <TableCell>
                  {isActive ? (
                    <Badge variant="default" className="bg-green-600 rounded-none uppercase text-[9px]">Ativo</Badge>
                  ) : (
                    <Badge variant="destructive" className="rounded-none uppercase text-[9px]">
                      {isExpired ? "Expirado" : "Limite Atingido"}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(coupon)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja excluir este cupom?")) {
                          onDelete(coupon.id);
                        }
                      }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {coupons.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                Nenhum cupom encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
