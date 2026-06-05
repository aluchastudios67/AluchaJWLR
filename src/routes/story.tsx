import { createFileRoute, Link } from "@tanstack/react-router";
import story from "@/assets/story.jpg";
import craft from "@/assets/craft.jpg";
import { useLanguage } from "@/components/LanguageProvider";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Alucha Studios" },
      {
        name: "description",
        content: "The story behind Alucha Studios — meaningful modern jewelry, made by hand.",
      },
      { property: "og:title", content: "Our Story — Alucha Studios" },
      { property: "og:description", content: "Made by hand. Worn with meaning." },
      { property: "og:url", content: "/story" },
      { property: "og:image", content: story },
    ],
    links: [{ rel: "canonical", href: "/story" }],
  }),
  component: Story,
});

function Story() {
  const { t } = useLanguage();
  return (
    <div className="pt-32 md:pt-40">
      <div className="container-luxury max-w-3xl text-center">
        <p className="eyebrow">{t("nav_story")}</p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl">{t("story_title")}</h1>
        <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
          {t("story_p1")}
        </p>
      </div>
      <div className="container-luxury mt-20">
        <img
          src={story}
          alt="Layered gold chains"
          width={1400}
          height={1600}
          className="w-full aspect-[16/10] object-cover"
        />
      </div>
      <div className="container-luxury max-w-3xl py-24 md:py-36 space-y-10 text-lg leading-relaxed">
        <p>
          {t("story_p2")}
        </p>
        <p className="font-serif italic text-2xl text-gold">
          {t("story_quote")}
        </p>
        <p>
          {t("story_p3")}
        </p>
      </div>
      <div className="container-luxury">
        <img
          src={craft}
          alt="Artisan crafting a gold ring"
          loading="lazy"
          width={1600}
          height={1100}
          className="w-full aspect-[16/9] object-cover"
        />
      </div>
      <div className="text-center py-24">
        <Link
          to="/shop"
          className="inline-block px-8 py-4 bg-foreground text-background text-[11px] tracking-[0.25em] uppercase hover:bg-gold transition-colors"
        >
          {t("hero_btn_shop")}
        </Link>
      </div>
    </div>
  );
}
