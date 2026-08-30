export function TickerBar() {
  const items = [
    "COMPRA SEGURA",
    "TROCA FÁCIL EM 7 DIAS",
    "FRETE GRÁTIS ACIMA DE R$199",
    "PIX COM 10% OFF",
    "PARCELAMOS EM ATÉ 12X",
  ];
  
  const repeatedItems = [...items, ...items, ...items];
  
  return (
    <div className="w-full bg-[#E00000] overflow-hidden py-2">
      <div className="flex animate-[ticker_20s_linear_infinite] whitespace-nowrap">
        {repeatedItems.map((item, i) => (
          <span key={i} className="flex items-center mx-6 text-[#050505] font-bold text-xs md:text-sm uppercase tracking-wider">
            <span className="mr-4">•</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
