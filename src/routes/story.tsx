import { createFileRoute, Link } from "@tanstack/react-router";
import story from "@/assets/story.jpg";
import craft from "@/assets/craft.jpg";

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
  return (
    <div className="pt-32 md:pt-40">
      <div className="container-luxury max-w-3xl text-center">
        <p className="eyebrow">Our Story</p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl">A house of quiet things.</h1>
        <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
          Alucha Studios was founded in 2019 by designer Mariel Alucha, between an art studio in
          Paris and a small jewelry bench in Lisbon. The brief was simple — make pieces worth
          keeping forever.
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
          We design jewelry the way a writer keeps a notebook — slowly, attentively, with reverence
          for the small things. Every piece begins as a sketch on paper, becomes a wax carving by
          hand, and is finally cast in recycled gold by artisans we have worked with for years.
        </p>
        <p className="font-serif italic text-2xl text-gold">
          "We don't make jewelry for occasions. We make jewelry for lives."
        </p>
        <p>
          Our collections are small by intention. We release only what feels essential, and we
          maintain every piece we make — forever. A jewel from Alucha is not a transaction. It is
          the beginning of a long relationship.
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
          Shop the Collection
        </Link>
      </div>
    </div>
  );
}
