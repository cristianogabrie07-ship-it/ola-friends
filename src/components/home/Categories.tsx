import { Link } from "@tanstack/react-router";

const categories = [
  { name: "Camisa de Time", slug: "camisas-de-time", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=200" },
  { name: "Conjuntos", slug: "conjuntos", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200" },
  { name: "Bermudas", slug: "bermudas", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=200" },
  { name: "Shorts", slug: "shorts", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=200" },
  { name: "Bonés", slug: "bones", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=200" },
  { name: "Acessórios", slug: "acessorios", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=200" },
  { name: "Relógios", slug: "relogios", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=200" },
];

export function Categories() {
  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12 uppercase">Acesse nossas categorias</h2>
      <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide justify-start md:justify-center">
        {categories.map((cat, index) => (
          <Link
            key={index}
            to="/shop"
            search={{ category: cat.slug }}
            className="flex-shrink-0 flex flex-col items-center group"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary overflow-hidden mb-3 group-hover:scale-110 transition-transform duration-300">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-bold uppercase text-center">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
