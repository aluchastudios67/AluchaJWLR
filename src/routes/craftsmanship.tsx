import { createFileRoute } from "@tanstack/react-router";
import craft from "@/assets/craft.jpg";

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
  { n: "01", t: "Sketch", d: "Every piece begins as a drawing in our Paris studio — never a render." },
  { n: "02", t: "Carve", d: "The design is hand-carved in wax over the course of several days." },
  { n: "03", t: "Cast", d: "Lost-wax casting in 100% recycled 18k gold by master casters in Lisbon." },
  { n: "04", t: "Finish", d: "Each piece is hand-filed, sanded, and polished — a process measured in hours." },
];

function Craftsmanship() {
  return (
    <div className="pt-32 md:pt-40">
      <div className="container-luxury max-w-3xl">
        <p className="eyebrow">Craftsmanship</p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl">Slower, by design.</h1>
        <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
          A single Alucha ring passes through more than thirty steps and three pairs of hands
          before it reaches you. We measure success not in volume — but in quietness, precision,
          and the years a piece will be worn.
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
                <h3 className="font-serif text-3xl">{s.t}</h3>
                <span className="eyebrow text-gold">{s.n}</span>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
