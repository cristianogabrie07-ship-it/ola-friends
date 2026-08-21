import { useState } from "react";
import { Link } from "@tanstack/react-router";

const categories = [
  { name: "Todas", slug: "" },
  { name: "Camisa de Time", slug: "camisas-de-time" },
  { name: "Conjuntos", slug: "conjuntos" },
  { name: "Bermudas", slug: "bermudas" },
  { name: "Shorts", slug: "shorts" },
  { name: "Bonés", slug: "bones" },
  { name: "Acessórios", slug: "acessorios" },
  { name: "Relógios", slug: "relogios" },
];

const sizes = ["P", "M", "G", "GG", "EXG"];

export function ShopSidebar({ currentCategory }: { currentCategory?: string }) {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  return (
    <aside className="w-full space-y-8">
      <div>
        <h3 className="font-bold mb-4 uppercase text-sm border-b pb-2">Categorias</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                to="/shop"
                search={{ category: cat.slug || undefined }}
                className={`text-sm hover:text-primary transition-colors ${
                  (currentCategory === cat.slug || (!currentCategory && !cat.slug)) ? "text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-bold mb-4 uppercase text-sm border-b pb-2">Tamanhos</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              className="w-10 h-10 border border-border flex items-center justify-center text-xs font-bold hover:border-primary hover:text-primary transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4 uppercase text-sm border-b pb-2">Faixa de Preço</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="De"
              className="w-full border border-border p-2 text-xs"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Até"
              className="w-full border border-border p-2 text-xs"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
            />
          </div>
          <button className="w-full bg-primary text-white py-2 text-xs font-bold uppercase hover:opacity-90 transition-opacity">
            Filtrar
          </button>
        </div>
      </div>
    </aside>
  );
}
