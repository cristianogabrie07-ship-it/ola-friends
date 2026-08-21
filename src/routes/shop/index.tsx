import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ShopSidebar } from '@/components/shop/ShopSidebar';
import { ProductCard } from '@/components/shop/ProductCard';

const shopSearchSchema = z.object({
  category: z.string().optional(),
  sale: z.boolean().optional(),
  sort: z.string().optional(),
});

export const Route = createFileRoute('/shop/')({
  validateSearch: (search) => shopSearchSchema.parse(search),
  component: ShopPage,
});

const mockProducts = [
  {
    id: "1",
    name: "Camisa Brasil Titular 2024",
    price: 299.9,
    promo_price: 249.9,
    images: ["https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=400"],
    category: "camisas-de-time",
  },
  {
    id: "2",
    name: "Conjunto Nike Tech Fleece",
    price: 599.9,
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400"],
    category: "conjuntos",
  },
  {
    id: "3",
    name: "Shorts Adidas Originals",
    price: 149.9,
    promo_price: 99.9,
    images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=400"],
    category: "shorts",
    is_sold_out: true,
  },
  {
    id: "4",
    name: "Relógio Casio G-Shock",
    price: 899.9,
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400"],
    category: "relogios",
  },
  {
    id: "5",
    name: "Camisa Real Madrid 24/25",
    price: 349.9,
    images: ["https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=400"],
    category: "camisas-de-time",
  },
  {
    id: "6",
    name: "Boné New Era NY",
    price: 199.9,
    promo_price: 159.9,
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=400"],
    category: "bones",
  }
];

function ShopPage() {
  const { category, sale, sort } = Route.useSearch();
  
  const filteredProducts = mockProducts.filter(p => {
    if (category && p.category !== category) return false;
    if (sale && !p.promo_price) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <ShopSidebar currentCategory={category} />
        </aside>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold uppercase">
              {category ? category.replace(/-/g, ' ') : sale ? 'Liquidação' : 'Todos os Produtos'}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{filteredProducts.length} produtos</span>
              <select 
                className="border p-2 text-sm bg-white"
                value={sort}
                onChange={(e) => {/* Handle sort change */}}
              >
                <option value="az">A-Z</option>
                <option value="low">Menor preço</option>
                <option value="high">Maior preço</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground italic">Nenhum produto encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
