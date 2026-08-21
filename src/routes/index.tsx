import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { ProductCard } from "@/components/shop/ProductCard";

export const Route = createFileRoute("/")({
  component: Index,
});

const mockProducts = [
  {
    id: "1",
    name: "Camisa Brasil Titular 2024",
    price: 299.9,
    promo_price: 249.9,
    images: ["https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=400"],
    is_sold_out: false,
  },
  {
    id: "2",
    name: "Conjunto Nike Tech Fleece",
    price: 599.9,
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400"],
    is_sold_out: false,
  },
  {
    id: "3",
    name: "Shorts Adidas Originals",
    price: 149.9,
    promo_price: 99.9,
    images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=400"],
    is_sold_out: true,
  },
  {
    id: "4",
    name: "Relógio Casio G-Shock",
    price: 899.9,
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400"],
    is_sold_out: false,
  },
];

function Index() {
  return (
    <div className="w-full">
      <Hero />
      <Categories />
      
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 uppercase">Destaques</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
