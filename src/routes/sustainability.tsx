import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/components/LanguageProvider";
import craft from "@/assets/craft.jpg";
import story from "@/assets/story.jpg";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability — Alucha Studios" },
      { name: "description", content: "Our commitment to ethical sourcing, recycled gold, and traceable stones." },
    ],
  }),
  component: SustainabilityPage,
});

function SustainabilityPage() {
  const { t } = useLanguage();

  const practices = [
    {
      title: "100% Recycled Gold",
      desc: "We work exclusively with certified recycled 18k and 14k gold. By bypassing the traditional mining process, we reduce carbon emissions and ecological disruption, ensuring that our heirlooms do not cost the earth.",
    },
    {
      title: "Traceable Gemstones",
      desc: "Every diamond and pearl we use is conflict-free and ethically sourced. We partner with suppliers who guarantee complete transparency in their supply chain, supporting fair wages and safe working conditions.",
    },
    {
      title: "Made in Small Batches",
      desc: "To eliminate waste, we do not mass produce. Our pieces are made to order or cast in very small batches in our Paris atelier. Slower production means better quality and minimal environmental impact.",
    },
    {
      title: "Lifetime Care",
      desc: "We believe in the longevity of objects. That is why we offer a lifetime repair guarantee on all Alucha jewelry. A piece of fine jewelry should be worn, loved, and passed down through generations.",
    },
  ];

  return (
    <div className="pt-32 md:pt-40">
      <div className="container-luxury max-w-3xl text-center">
        <p className="eyebrow">{t("nav_sustainability")}</p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl">Designed for Longevity</h1>
        <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
          At Alucha Studios, sustainability is not a marketing concept. It is an operational necessity. We believe that true luxury lies in objects that carry meaning, respect the hands that craft them, and preserve the earth.
        </p>
      </div>

      <div className="container-luxury mt-20">
        <img
          src={story}
          alt="Fine gold chains on a warm linen background representing slow luxury"
          width={1400}
          height={800}
          className="w-full aspect-[21/9] object-cover"
        />
      </div>

      {/* Sustainability pillars */}
      <section className="container-luxury py-24 md:py-36 grid md:grid-cols-2 gap-x-16 gap-y-20">
        {practices.map((practice, index) => (
          <div key={index} className="space-y-4">
            <span className="text-[11px] tracking-[0.25em] uppercase text-gold font-semibold">
              0{index + 1} . {practice.title}
            </span>
            <h2 className="font-serif text-3xl">{practice.title}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {practice.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Craftsmanship callout */}
      <div className="bg-secondary/40 py-24 md:py-32">
        <div className="container-luxury grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 md:pr-10">
            <span className="eyebrow">The Atelier</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl leading-tight">
              Honoring the <br />
              <em className="italic text-gold font-light">Craft</em>
            </h2>
            <p className="mt-7 text-muted-foreground leading-relaxed text-sm">
              By keeping our production close to home and working with family-owned casting facilities in Lisbon and our own workshop in Paris, we maintain a footprint that is as light as it is meaningful.
            </p>
            <Link
              to="/craftsmanship"
              className="mt-8 inline-block link-underline text-xs tracking-[0.2em] uppercase font-semibold"
            >
              Inside the Atelier →
            </Link>
          </div>
          <div className="md:col-span-7">
            <img
              src={craft}
              alt="Hands of an artisan workspace"
              loading="lazy"
              width={1000}
              height={600}
              className="w-full aspect-[16/10] object-cover"
            />
          </div>
        </div>
      </div>

      <div className="text-center py-24">
        <Link
          to="/shop"
          className="inline-block px-8 py-4 bg-foreground text-background text-[11px] tracking-[0.25em] uppercase hover:bg-gold transition-colors"
        >
          Shop Ethical Fine Jewelry
        </Link>
      </div>
    </div>
  );
}
