import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const valid = ["rings", "necklaces", "earrings", "bracelets"] as const;
type Cat = (typeof valid)[number];

export const Route = createFileRoute("/collections/$category")({
  head: ({ params }) => {
    const cat = params.category;
    const title = cat.charAt(0).toUpperCase() + cat.slice(1);
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
  const cat = category as Cat;
  const title = cat.charAt(0).toUpperCase() + cat.slice(1);
  const filtered = valid.includes(cat)
    ? products.filter((p) => p.category.toLowerCase() === cat)
    : [];
  // pad
  const display = [...filtered, ...products, ...products].slice(0, 8);

  return (
    <div className="pt-32 md:pt-40">
      <div className="container-luxury">
        <p className="eyebrow">Collection</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
          A curated edit of {cat} from the Alucha archive. Each piece hand-finished in our atelier.
        </p>
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-16 md:gap-x-8">
          {display.map((p, i) => (
            <ProductCard key={p.id + i} product={p} />
          ))}
        </div>
        <div className="mt-20 text-center">
          <Link to="/shop" className="link-underline text-sm tracking-[0.2em] uppercase">
            Browse all collections →
          </Link>
        </div>
      </div>
    </div>
  );
}
