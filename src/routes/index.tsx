import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import hero from "@/assets/hero.jpg";
import rings from "@/assets/collection-rings.jpg";
import necklaces from "@/assets/collection-necklaces.jpg";
import earrings from "@/assets/collection-earrings.jpg";
import bracelets from "@/assets/collection-bracelets.jpg";
import craft from "@/assets/craft.jpg";
import story from "@/assets/story.jpg";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { Marquee } from "@/components/Marquee";
import { useLanguage } from "@/components/LanguageProvider";
import { type translations } from "@/lib/translations";

type TranslationKey = keyof typeof translations.en;

import { getProductsFn, getContentBlockByKeyFn } from "@/lib/api/db.functions";

export const Route = createFileRoute("/")({
  loader: async () => {
    return {
      dbProducts: await getProductsFn(),
      heroBlock: await getContentBlockByKeyFn({ data: "home_hero" }),
    };
  },
  head: () => ({
    meta: [
      { title: "Alucha Studios — Jewelry With Meaning" },
      {
        name: "description",
        content:
          "Modern heirloom jewelry crafted to celebrate stories, memories, and moments that last forever.",
      },
      { property: "og:title", content: "Alucha Studios — Jewelry With Meaning" },
      { property: "og:description", content: "Modern heirloom jewelry, crafted to last." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const collections = [
  { label: "Rings", img: rings, to: "/collections/rings", key: "shop_cats_rings" as TranslationKey },
  { label: "Necklaces", img: necklaces, to: "/collections/necklaces", key: "shop_cats_necklaces" as TranslationKey },
  { label: "Earrings", img: earrings, to: "/collections/earrings", key: "shop_cats_earrings" as TranslationKey },
  { label: "Bracelets", img: bracelets, to: "/collections/bracelets", key: "shop_cats_bracelets" as TranslationKey },
] as const;

function Home() {
  const { t, language } = useLanguage();
  const { dbProducts, heroBlock } = Route.useLoaderData();

  const heroData = heroBlock?.data || {};
  const heroEyebrow = heroData.eyebrow?.[language] || t("hero_eyebrow");
  const heroTitle1 = heroData.title_1?.[language] || t("hero_title_1");
  const heroTitle2 = heroData.title_2?.[language] || t("hero_title_2");
  const heroDesc = heroData.description?.[language] || t("hero_desc");

  const testimonials = [
    { qKey: "testimonial_1_quote" as TranslationKey, aKey: "testimonial_1_author" as TranslationKey },
    { qKey: "testimonial_2_quote" as TranslationKey, aKey: "testimonial_2_author" as TranslationKey },
    { qKey: "testimonial_3_quote" as TranslationKey, aKey: "testimonial_3_author" as TranslationKey },
  ] as const;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-dvh w-full overflow-hidden">
        <img
          src={hero}
          alt="A model wearing delicate gold rings, in warm natural light"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover animate-fade-in-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory/70 via-ivory/20 to-transparent dark:from-background/80 dark:via-background/30" />
        <div className="container-luxury relative z-10 flex min-h-dvh items-center pt-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow">{heroEyebrow}</p>
            <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.02em]">
              {heroTitle1}<br />
              <em className="italic font-light text-gold">{heroTitle2}</em>
            </h1>
            <p className="mt-8 max-w-md text-base md:text-lg text-foreground/80 leading-relaxed">
              {heroDesc}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-foreground text-background text-[11px] tracking-[0.25em] uppercase hover:bg-gold transition-colors inline-flex items-center gap-3"
              >
                {t("hero_btn_shop")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/story"
                className="px-8 py-4 border border-foreground text-foreground text-[11px] tracking-[0.25em] uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                {t("hero_btn_story")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* FEATURED COLLECTIONS */}
      <section className="container-luxury py-24 md:py-36">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="eyebrow">{t("collections_eyebrow")}</p>
            <h2 className="mt-4 font-serif text-5xl md:text-6xl">{t("collections_title")}</h2>
          </div>
          <Link to="/shop" className="link-underline text-sm tracking-[0.2em] uppercase">
            {t("view_all")}
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {collections.map((c, i) => (
            <Link
              key={c.key}
              to={c.to}
              className={`group relative block overflow-hidden bg-secondary ${
                i % 2 === 0 ? "aspect-[3/4] md:mt-12" : "aspect-[3/4]"
              }`}
            >
              <img
                src={c.img}
                alt={t(c.key)}
                loading="lazy"
                width={900}
                height={1100}
                className="h-full w-full object-cover hover-zoom-img"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-white">
                <p className="eyebrow text-white/70">{t("shop_now")}</p>
                <h3 className="mt-1 font-serif text-2xl md:text-3xl">{t(c.key)}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="bg-secondary/60">
        <div className="container-luxury py-24 md:py-36 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 relative">
            <img
              src={story}
              alt="Layered gold chains on warm fabric"
              loading="lazy"
              width={1400}
              height={1600}
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div className="md:col-span-5 md:pl-10">
            <p className="eyebrow">{t("story_section_eyebrow")}</p>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              {t("story_section_title_1")}<br />
              <em className="italic text-gold font-light">{t("story_section_title_2")}</em>
            </h2>
            <p className="mt-7 text-muted-foreground leading-relaxed">
              {t("story_section_desc_1")}
            </p>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              {t("story_section_desc_2")}
            </p>
            <Link to="/story" className="mt-9 inline-block link-underline text-sm tracking-[0.2em] uppercase">
              {t("story_section_link")}
            </Link>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container-luxury py-24 md:py-36">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="eyebrow">{t("bestsellers_eyebrow")}</p>
            <h2 className="mt-4 font-serif text-5xl md:text-6xl">{t("bestsellers_title")}</h2>
          </div>
          <Link to="/shop" className="link-underline text-sm tracking-[0.2em] uppercase">
            {t("shop_all_pieces")}
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8">
          {dbProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CRAFTSMANSHIP */}
      <section className="relative">
        <div className="grid md:grid-cols-2 min-h-[80vh]">
          <div className="bg-foreground text-background flex items-center">
            <div className="p-10 md:p-20 max-w-xl">
              <p className="eyebrow text-background/60">{t("craft_section_eyebrow")}</p>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl">
                {t("craft_section_title")}
              </h2>
              <p className="mt-7 text-background/70 leading-relaxed">
                {t("craft_section_desc")}
              </p>
              <div className="mt-12 grid grid-cols-3 gap-6 text-background">
                {[
                  [t("craft_section_stat1_num"), t("craft_section_stat1_lbl")],
                  [t("craft_section_stat2_num"), t("craft_section_stat2_lbl")],
                  [t("craft_section_stat3_num"), t("craft_section_stat3_lbl")],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-serif text-4xl text-gold">{n}</div>
                    <div className="mt-2 text-[11px] tracking-[0.2em] uppercase text-background/60">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/craftsmanship"
                className="mt-12 inline-block px-7 py-3.5 border border-background/40 text-[11px] tracking-[0.25em] uppercase hover:bg-background hover:text-foreground transition-colors"
              >
                {t("craft_section_btn")}
              </Link>
            </div>
          </div>
          <div className="relative min-h-[60vh] md:min-h-full">
            <img
              src={craft}
              alt="Goldsmith hand-finishing a ring at the workbench"
              loading="lazy"
              width={1600}
              height={1100}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-luxury py-24 md:py-36">
        <p className="eyebrow text-center">{t("testimonials_eyebrow")}</p>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl text-center max-w-3xl mx-auto">
          {t("testimonials_title")}
        </h2>
        <div className="mt-16 grid md:grid-cols-3 gap-10 md:gap-16">
          {testimonials.map((t_item, idx) => (
            <figure key={idx} className="text-center">
              <div className="flex justify-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-6 font-serif text-2xl leading-snug italic text-foreground/90">
                "{t(t_item.qKey)}"
              </blockquote>
              <figcaption className="mt-6 text-xs tracking-[0.22em] uppercase text-muted-foreground">
                {t(t_item.aKey)}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* COMMUNITY GALLERY */}
      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container-luxury">
          <div className="text-center">
            <p className="eyebrow">{t("community_eyebrow")}</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t("community_title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("community_desc")}</p>
          </div>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
            {[rings, necklaces, earrings, bracelets, story, craft].map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden bg-background group">
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover hover-zoom-img"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
