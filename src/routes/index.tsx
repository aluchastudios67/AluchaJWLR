import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import hero from "@/assets/hero.jpg";
import rings from "@/assets/collection-rings.jpg";
import necklaces from "@/assets/collection-necklaces.jpg";
import earrings from "@/assets/collection-earrings.jpg";
import bracelets from "@/assets/collection-bracelets.jpg";
import craft from "@/assets/craft.jpg";
import story from "@/assets/story.jpg";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { Marquee } from "@/components/Marquee";

export const Route = createFileRoute("/")({
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
  { label: "Rings", img: rings, to: "/collections/rings" },
  { label: "Necklaces", img: necklaces, to: "/collections/necklaces" },
  { label: "Earrings", img: earrings, to: "/collections/earrings" },
  { label: "Bracelets", img: bracelets, to: "/collections/bracelets" },
] as const;

function Home() {
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
            <p className="eyebrow">The Spring Edit · 2026</p>
            <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.02em]">
              Jewelry<br />
              <em className="italic font-light text-gold">With Meaning.</em>
            </h1>
            <p className="mt-8 max-w-md text-base md:text-lg text-foreground/80 leading-relaxed">
              Crafted to celebrate stories, memories, and moments that last forever — by hand, in
              small numbers, from recycled gold.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-foreground text-background text-[11px] tracking-[0.25em] uppercase hover:bg-gold transition-colors inline-flex items-center gap-3"
              >
                Shop Collection <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/story"
                className="px-8 py-4 border border-foreground text-foreground text-[11px] tracking-[0.25em] uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                Explore Our Story
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
            <p className="eyebrow">Collections</p>
            <h2 className="mt-4 font-serif text-5xl md:text-6xl">An archive of intention.</h2>
          </div>
          <Link to="/shop" className="link-underline text-sm tracking-[0.2em] uppercase">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {collections.map((c, i) => (
            <Link
              key={c.label}
              to={c.to}
              className={`group relative block overflow-hidden bg-secondary ${
                i % 2 === 0 ? "aspect-[3/4] md:mt-12" : "aspect-[3/4]"
              }`}
            >
              <img
                src={c.img}
                alt={c.label}
                loading="lazy"
                width={900}
                height={1100}
                className="h-full w-full object-cover hover-zoom-img"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-white">
                <p className="eyebrow text-white/70">Shop</p>
                <h3 className="mt-1 font-serif text-2xl md:text-3xl">{c.label}</h3>
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
            <p className="eyebrow">The House</p>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              Worn close.<br />
              <em className="italic text-gold font-light">Made to last.</em>
            </h2>
            <p className="mt-7 text-muted-foreground leading-relaxed">
              Alucha Studios began as a quiet conversation between an artist and a goldsmith — a
              shared belief that the things we wear closest should mean the most. Every piece is
              drawn by hand, cast in small numbers, and finished in our Paris atelier.
            </p>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              We work only with recycled gold and traceable stones, because heirlooms should never
              cost the earth.
            </p>
            <Link to="/story" className="mt-9 inline-block link-underline text-sm tracking-[0.2em] uppercase">
              Read the full story →
            </Link>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container-luxury py-24 md:py-36">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="eyebrow">Most Loved</p>
            <h2 className="mt-4 font-serif text-5xl md:text-6xl">The bestsellers.</h2>
          </div>
          <Link to="/shop" className="link-underline text-sm tracking-[0.2em] uppercase">
            Shop all pieces →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CRAFTSMANSHIP */}
      <section className="relative">
        <div className="grid md:grid-cols-2 min-h-[80vh]">
          <div className="bg-foreground text-background flex items-center">
            <div className="p-10 md:p-20 max-w-xl">
              <p className="eyebrow text-background/60">Craftsmanship</p>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl">
                Hours, not minutes. Hands, not machines.
              </h2>
              <p className="mt-7 text-background/70 leading-relaxed">
                Every Alucha piece passes through the hands of three artisans — from the first wax
                carving to the final polish. Slower, by design.
              </p>
              <div className="mt-12 grid grid-cols-3 gap-6 text-background">
                {[
                  ["18k", "Recycled gold"],
                  ["3", "Artisans per piece"],
                  ["∞", "Lifetime repair"],
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
                Inside the Atelier
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
        <p className="eyebrow text-center">In their words</p>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl text-center max-w-3xl mx-auto">
          Pieces that become part of a life.
        </h2>
        <div className="mt-16 grid md:grid-cols-3 gap-10 md:gap-16">
          {[
            {
              q: "The signet ring arrived in the most beautiful packaging — it feels like a piece I will pass on to my daughter.",
              n: "Elena R.",
              c: "Milan",
            },
            {
              q: "Wearing my Soleil pendant every day for two years. Still looks the day I bought it. Genuinely heirloom quality.",
              n: "Camille D.",
              c: "Paris",
            },
            {
              q: "There is a quiet confidence to everything Alucha makes. Not loud. Not trendy. Just exquisite.",
              n: "Sofía M.",
              c: "New York",
            },
          ].map((t) => (
            <figure key={t.n} className="text-center">
              <div className="flex justify-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-6 font-serif text-2xl leading-snug italic text-foreground/90">
                "{t.q}"
              </blockquote>
              <figcaption className="mt-6 text-xs tracking-[0.22em] uppercase text-muted-foreground">
                {t.n} · {t.c}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* COMMUNITY GALLERY */}
      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container-luxury">
          <div className="text-center">
            <p className="eyebrow">#WornByYou</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">From our community.</h2>
            <p className="mt-4 text-muted-foreground">Tag @alucha.studios to be featured.</p>
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
