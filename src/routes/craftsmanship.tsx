import { createFileRoute } from "@tanstack/react-router";
import craft from "@/assets/craft.jpg";
import { useLanguage } from "@/components/LanguageProvider";
import { type translations } from "@/lib/translations";

type TranslationKey = keyof typeof translations.en;

export const Route = createFileRoute("/craftsmanship")({
  head: () => ({
    meta: [
      { title: "Craftsmanship — Alucha Studios" },
      { name: "description", content: "Inside the Alucha atelier — materials, artisans, and process." },
      { property: "og:title", content: "Craftsmanship — Alucha Studios" },
      { property: "og:description", content: "Hours, not minutes. Hands, not machines." },
      { property: "og:url", content: "/craftsmanship" },
      { property: "og:image", content: craft },
    ],
    links: [{ rel: "canonical", href: "/craftsmanship" }],
  }),
  component: Craftsmanship,
});

const steps = [
  { n: "01", tKey: "craft_step1_title" as TranslationKey, dKey: "craft_step1_desc" as TranslationKey },
  { n: "02", tKey: "craft_step2_title" as TranslationKey, dKey: "craft_step2_desc" as TranslationKey },
  { n: "03", tKey: "craft_step3_title" as TranslationKey, dKey: "craft_step3_desc" as TranslationKey },
  { n: "04", tKey: "craft_step4_title" as TranslationKey, dKey: "craft_step4_desc" as TranslationKey },
] as const;

function Craftsmanship() {
  const { t } = useLanguage();
  return (
    <div className="pt-32 md:pt-40">
      <div className="container-luxury max-w-3xl">
        <p className="eyebrow">{t("nav_craftsmanship")}</p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl">{t("craft_title")}</h1>
        <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
          {t("craft_desc")}
        </p>
      </div>
      <div className="container-luxury mt-20">
        <img
          src={craft}
          alt="Goldsmith at workbench"
          width={1600}
          height={1100}
          className="w-full aspect-[21/9] object-cover"
        />
      </div>
      <div className="container-luxury py-24 md:py-36">
        <div className="grid md:grid-cols-2 gap-y-16 gap-x-20">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-border pt-8">
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-3xl">{t(s.tKey)}</h3>
                <span className="eyebrow text-gold">{s.n}</span>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">{t(s.dKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
