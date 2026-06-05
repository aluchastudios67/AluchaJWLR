import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { useLanguage } from "@/components/LanguageProvider";
import { type translations } from "@/lib/translations";
import { getProductsFn } from "@/lib/api/db.functions";

type TranslationKey = keyof typeof translations.en;

export const Route = createFileRoute("/shop")({
  loader: async () => {
    return { dbProducts: await getProductsFn() };
  },
  head: () => ({
    meta: [
      { title: "Shop — Alucha Studios" },
      { name: "description", content: "Shop the full Alucha Studios collection of fine jewelry." },
      { property: "og:title", content: "Shop — Alucha Studios" },
      { property: "og:description", content: "The full collection of Alucha fine jewelry." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

const cats = [
  { key: "shop_cats_all" as TranslationKey, to: "/shop" },
  { key: "shop_cats_rings" as TranslationKey, to: "/collections/rings" },
  { key: "shop_cats_necklaces" as TranslationKey, to: "/collections/necklaces" },
  { key: "shop_cats_earrings" as TranslationKey, to: "/collections/earrings" },
  { key: "shop_cats_bracelets" as TranslationKey, to: "/collections/bracelets" },
] as const;

function Shop() {
  const { t } = useLanguage();
  const { dbProducts } = Route.useLoaderData();
  
  return (
    <div className="pt-32 md:pt-40">
      <div className="container-luxury">
        <p className="eyebrow">{t("collection_title")}</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl max-w-3xl">{t("shop_title")}</h1>
        <nav className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-b border-border pb-5">
          {cats.map((c) => (
            <Link
              key={c.key}
              to={c.to}
              className="text-[11px] tracking-[0.22em] uppercase link-underline text-muted-foreground hover:text-foreground"
            >
              {t(c.key)}
            </Link>
          ))}
        </nav>
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-16 md:gap-x-8">
          {dbProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
