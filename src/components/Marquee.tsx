import { useLanguage } from "@/components/LanguageProvider";

export function Marquee() {
  const { t } = useLanguage();
  
  const items = [
    t("marquee_shipping"),
    t("marquee_guarantee"),
    t("marquee_batches"),
    t("marquee_materials"),
  ];
  
  return (
    <div className="bg-foreground text-background overflow-hidden border-y border-foreground">
      <div className="flex whitespace-nowrap py-2.5 animate-[marquee_38s_linear_infinite]">
        {[...items, ...items, ...items].map((t_text, i) => (
          <span key={i} className="mx-10 text-[11px] tracking-[0.3em] uppercase">
            · {t_text}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }`}</style>
    </div>
  );
}
