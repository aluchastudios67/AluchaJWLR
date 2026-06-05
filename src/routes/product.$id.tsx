import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { getProduct, products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Alucha Studios` },
          { name: "description", content: loaderData.product.story },
          { property: "og:title", content: `${loaderData.product.name} — Alucha Studios` },
          { property: "og:description", content: loaderData.product.story },
          { property: "og:type", content: "product" },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="pt-40 container-luxury text-center">
      <h1 className="font-serif text-4xl">Piece not found</h1>
      <Link to="/shop" className="link-underline mt-6 inline-block">
        Return to shop
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-luxury grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="bg-secondary aspect-[4/5] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
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
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl font-light tabular-nums">${product.price}</p>

          <p className="mt-8 text-muted-foreground leading-relaxed italic font-serif text-lg">
            "{product.story}"
          </p>

          <div className="mt-10">
            <p className="eyebrow mb-3">Material</p>
            <p className="text-sm">{product.material}</p>
          </div>

          <div className="mt-8">
            <p className="eyebrow mb-3">Size</p>
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
              Add to bag
            </button>
            <button
              aria-label="Add to wishlist"
              className="w-12 border border-border flex items-center justify-center hover:text-gold transition-colors"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-12 space-y-4 text-sm border-t border-border pt-8">
            {([
              [Truck, "Complimentary shipping & gift wrap"],
              [ShieldCheck, "Lifetime craftsmanship guarantee"],
              [RotateCcw, "30-day considered returns"],
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
          <h2 className="font-serif text-3xl md:text-4xl">You may also love</h2>
          <Link to="/shop" className="link-underline text-sm tracking-[0.2em] uppercase">
            Shop all →
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
