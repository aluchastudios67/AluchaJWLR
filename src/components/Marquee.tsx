export function Marquee() {
  const items = [
    "Complimentary worldwide shipping over $250",
    "Lifetime craftsmanship guarantee",
    "Made in small batches",
    "Recycled gold · ethically sourced stones",
  ];
  return (
    <div className="bg-foreground text-background overflow-hidden border-y border-foreground">
      <div className="flex whitespace-nowrap py-2.5 animate-[marquee_38s_linear_infinite]">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="mx-10 text-[11px] tracking-[0.3em] uppercase">
            · {t}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }`}</style>
    </div>
  );
}
