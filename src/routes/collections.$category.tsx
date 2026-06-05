import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/lib/translations";
import { getProductsFn } from "@/lib/api/db.functions";

type TranslationKey = keyof typeof translations.en;

const valid = ["rings", "necklaces", "earrings", "bracelets"] as const;
type Cat = (typeof valid)[number];

export const Route = createFileRoute("/collections/$category")({
  loader: async () => {
    return { dbProducts: await getProductsFn() };
  },
  head: ({ params }) => {
    const cat = params.category;
    const catKey = ("shop_cats_" + cat) as TranslationKey;
    const title = translations.ka[catKey] || cat.charAt(0).toUpperCase() + cat.slice(1);
    
    return {
      meta: [
        { title: `${title} — Alucha Studios` },
        { name: "description", content: `Shop Alucha Studios ${cat}. Handcrafted modern heirlooms.` },
        { property: "og:title", content: `${title} — Alucha Studios` },
        { property: "og:description", content: `Handcrafted ${cat}, made to last.` },
        { property: "og:url", content: `/collections/${cat}` },
      ],
      links: [{ rel: "canonical", href: `/collections/${cat}` }],
    };
  },
  component: Category,
});

function Category() {
  const { category } = Route.useParams();
  const { t } = useLanguage();
  const { dbProducts } = Route.useLoaderData();
  const cat = category as Cat;
  
  const catKey = ("shop_cats_" + cat) as TranslationKey;
  const title = t(catKey);
  
  const filtered = valid.includes(cat)
    ? dbProducts.filter((p) => p.category.toLowerCase() === cat)
    : [];
  
  const display = filtered;

  return (
    <div className="pt-32 md:pt-40">
      <div className="container-luxury">
        <p className="eyebrow">{t("collection_title")}</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
          {t("collection_desc", { category: title.toLowerCase() })}
        </p>
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-16 md:gap-x-8">
          {display.map((p, i) => (
            <ProductCard key={p.id + i} product={p} />
          ))}
        </div>
        <div className="mt-20 text-center">
          <Link to="/shop" className="link-underline text-sm tracking-[0.2em] uppercase">
            {t("browse_all_collections")}
          </Link>
        </div>
      </div>
    </div>
  );
}
