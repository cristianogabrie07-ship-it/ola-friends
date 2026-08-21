import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const shopSearchSchema = z.object({
  category: z.string().optional(),
  sale: z.boolean().optional(),
  sort: z.string().optional(),
});

export const Route = createFileRoute('/shop/')({
  validateSearch: (search) => shopSearchSchema.parse(search),
  component: ShopPage,
});

function ShopPage() {
  const { category, sale } = Route.useSearch();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 uppercase">
        {category ? category.replace('-', ' ') : sale ? 'Liquidação' : 'Produtos'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          {/* Filters sidebar would go here */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-4 uppercase text-sm">Ordenar por</h3>
              <select className="w-full border p-2 text-sm">
                <option>A-Z</option>
                <option>Menor preço</option>
                <option>Maior preço</option>
              </select>
            </div>
            {/* Additional filters */}
          </div>
        </aside>
        <div className="md:col-span-3">
          <p className="text-muted-foreground italic">Em breve você verá todos os nossos produtos aqui...</p>
        </div>
      </div>
    </div>
  );
}
