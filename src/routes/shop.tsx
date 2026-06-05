import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/shop")({
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

const cats = ["All", "Rings", "Necklaces", "Earrings", "Bracelets"] as const;

function Shop() {
  return (
    <div className="pt-32 md:pt-40">
      <div className="container-luxury">
        <p className="eyebrow">The Collection</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl max-w-3xl">All pieces, considered.</h1>
        <nav className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-b border-border pb-5">
          {cats.map((c) => (
            <Link
              key={c}
              to="/shop"
              className="text-[11px] tracking-[0.22em] uppercase link-underline text-muted-foreground hover:text-foreground"
            >
              {c}
            </Link>
          ))}
        </nav>
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-16 md:gap-x-8">
          {products.concat(products).map((p, i) => (
            <ProductCard key={p.id + i} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
