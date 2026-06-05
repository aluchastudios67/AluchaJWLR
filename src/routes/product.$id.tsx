import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { getProductByIdFn, getProductsFn } from "@/lib/api/db.functions";
import { ProductCard } from "@/components/ProductCard";
import { useLanguage } from "@/components/LanguageProvider";
import { type translations } from "@/lib/translations";

type TranslationKey = keyof typeof translations.en;

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const [product, dbProducts] = await Promise.all([
      getProductByIdFn({ data: params.id }),
      getProductsFn(),
    ]);
    if (!product) throw notFound();
    return { product, dbProducts };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name.ka} — Alucha Studios` },
          { name: "description", content: loaderData.product.story.ka },
          { property: "og:title", content: `${loaderData.product.name.ka} — Alucha Studios` },
          { property: "og:description", content: loaderData.product.story.ka },
          { property: "og:type", content: "product" },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => {
    const { t } = useLanguage();
    return (
      <div className="pt-40 container-luxury text-center">
        <h1 className="font-serif text-4xl">{t("piece_not_found")}</h1>
        <Link to="/shop" className="link-underline mt-6 inline-block">
          {t("return_to_shop")}
        </Link>
      </div>
    );
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, dbProducts } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const { t, language } = useLanguage();
  const related = dbProducts.filter((p) => p.id !== product.id).slice(0, 4);

  // Map product categories to translation key
  const categoryKey = ("shop_cats_" + product.category.toLowerCase()) as TranslationKey;

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-luxury grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="bg-secondary aspect-[4/5] overflow-hidden">
            <img
              src={product.image}
              alt={product.name[language]}
              width={800}
              height={1000}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[product.image, product.image, product.image].map((src, i) => (
              <div key={i} className="aspect-square bg-secondary overflow-hidden">
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="md:sticky md:top-28 md:self-start md:pt-10">
          <p className="eyebrow">{t(categoryKey)}</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">{product.name[language]}</h1>
          <p className="mt-4 text-2xl font-light tabular-nums">${product.price}</p>

          <p className="mt-8 text-muted-foreground leading-relaxed italic font-serif text-lg">
            "{product.story[language]}"
          </p>

          <div className="mt-10">
            <p className="eyebrow mb-3">{t("material")}</p>
            <p className="text-sm">{product.material[language]}</p>
          </div>

          <div className="mt-8">
            <p className="eyebrow mb-3">{t("size")}</p>
            <div className="flex gap-2">
              {["XS", "S", "M", "L"].map((s) => (
                <button
                  key={s}
                  className="w-12 h-12 border border-border hover:border-foreground text-sm transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-stretch gap-3">
            <div className="flex items-center border border-border">
              <button
                aria-label="Decrease"
                className="px-4 h-12"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                aria-label="Increase"
                className="px-4 h-12"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <button className="flex-1 bg-foreground text-background text-[11px] tracking-[0.25em] uppercase hover:bg-gold transition-colors">
              {t("add_to_bag")}
            </button>
            <button
              aria-label={t("add_to_wishlist")}
              className="w-12 border border-border flex items-center justify-center hover:text-gold transition-colors"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-12 space-y-4 text-sm border-t border-border pt-8">
            {([
              [Truck, t("product_shipping")],
              [ShieldCheck, t("product_guarantee")],
              [RotateCcw, t("product_returns")],
            ] as const).map(([Icon, text]) => (
              <div key={text} className="flex items-center gap-4 text-muted-foreground">
                <Icon className="h-4 w-4 text-gold" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="container-luxury py-24 md:py-36">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-serif text-3xl md:text-4xl">{t("product_related")}</h2>
          <Link to="/shop" className="link-underline text-sm tracking-[0.2em] uppercase">
            {t("view_all")}
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
