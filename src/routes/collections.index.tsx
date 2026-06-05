import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/components/LanguageProvider";
import { type translations } from "@/lib/translations";
import ringsImg from "@/assets/collection-rings.jpg";
import necklacesImg from "@/assets/collection-necklaces.jpg";
import earringsImg from "@/assets/collection-earrings.jpg";
import braceletsImg from "@/assets/collection-bracelets.jpg";

type TranslationKey = keyof typeof translations.en;

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — Alucha Studios" },
      { name: "description", content: "Explore the curated collections of Alucha Studios fine jewelry." },
      { property: "og:title", content: "Collections — Alucha Studios" },
      { property: "og:description", content: "Explore handcrafted collections of modern heirlooms." },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: CollectionsPage,
});

const collectionsData = [
  { key: "rings", titleKey: "shop_cats_rings" as TranslationKey, img: ringsImg, to: "/collections/rings" },
  { key: "necklaces", titleKey: "shop_cats_necklaces" as TranslationKey, img: necklacesImg, to: "/collections/necklaces" },
  { key: "earrings", titleKey: "shop_cats_earrings" as TranslationKey, img: earringsImg, to: "/collections/earrings" },
  { key: "bracelets", titleKey: "shop_cats_bracelets" as TranslationKey, img: braceletsImg, to: "/collections/bracelets" },
];

function CollectionsPage() {
  const { t } = useLanguage();

  return (
    <div className="pt-32 md:pt-40 pb-24 animate-fade-in">
      <div className="container-luxury">
        <p className="eyebrow">{t("collections_eyebrow")}</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl max-w-3xl">{t("collections_title")}</h1>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {collectionsData.map((c) => {
            const title = t(c.titleKey);
            return (
              <Link
                key={c.key}
                to={c.to}
                className="group block overflow-hidden bg-secondary relative aspect-[4/3] md:aspect-[16/10]"
              >
                <img
                  src={c.img}
                  alt={title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white flex flex-col justify-end">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-white/70 mb-2">{t("shop_now")}</p>
                  <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
                  <p className="mt-2 text-xs text-white/80 max-w-md line-clamp-2 font-light tracking-wide leading-relaxed">
                    {t("collection_desc", { category: title.toLowerCase() })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
