import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="group relative">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block overflow-hidden bg-secondary aspect-[4/5] relative"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1000}
          className="h-full w-full object-cover hover-zoom-img"
        />
        <button
          aria-label="Quick add"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background text-foreground border border-border px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-foreground hover:text-background flex items-center gap-2"
        >
          <Plus className="h-3 w-3" /> Quick add
        </button>
      </Link>
      <button
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => setLiked((v) => !v)}
        className="absolute top-3 right-3 p-2 text-foreground/70 hover:text-gold transition-colors"
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-gold text-gold" : ""}`} />
      </button>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <Link to="/product/$id" params={{ id: product.id }} className="link-underline">
          <h3 className="font-serif text-lg leading-tight">{product.name}</h3>
        </Link>
        <span className="text-sm tabular-nums text-muted-foreground">${product.price}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground tracking-wider uppercase">{product.material}</p>
    </div>
  );
}
