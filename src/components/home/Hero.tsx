import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroAsset from "@/assets/martins-logo-hero.png.asset.json";

const slides = [
  {
    image: heroAsset.url,
    title: "BEM-VINDO",
    subtitle: "MARTINS MULTIMARCAS",
    store: "STORE",
    backgroundSize: "120%",
    opacity: "opacity-100"
  },
  {
    image: "https://images.unsplash.com/photo-1511746015096-145fcb3d42e8?auto=format&fit=crop&q=80&w=1200",
    title: "NOVA COLEÇÃO",
    subtitle: "ESTILO E CONFORTO",
    store: "CONFIRA",
    backgroundSize: "cover",
    opacity: "opacity-40"
  }
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-neutral-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`absolute inset-0 bg-no-repeat bg-center ${slide.opacity}`}
            style={{ 
              backgroundImage: `url(${slide.image})`,
              backgroundSize: slide.backgroundSize || 'cover'
            }}
          />
          {slide.image === heroAsset.url && (
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/60" />
          )}
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start text-white">
            <h2 className="text-4xl md:text-6xl font-bungee tracking-tighter mb-2 animate-in fade-in slide-in-from-left duration-700">
              {slide.title}
            </h2>
            <h1 className="text-5xl md:text-8xl font-bungee tracking-tighter mb-4 text-primary animate-in fade-in slide-in-from-left duration-1000">
              {slide.subtitle}
            </h1>
            <p className="text-2xl font-bungee tracking-tighter animate-in fade-in slide-in-from-bottom duration-700">
              {slide.store}
            </p>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
}
