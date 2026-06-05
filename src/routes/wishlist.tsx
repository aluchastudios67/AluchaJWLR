import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/components/LanguageProvider";
import { Heart, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Alucha Studios" },
      { name: "description", content: "Your saved fine jewelry pieces." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { t } = useLanguage();

  return (
    <div className="pt-32 md:pt-40 min-h-[70vh] flex flex-col justify-center">
      <div className="container-luxury max-w-xl text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-secondary flex items-center justify-center rounded-full mb-8 text-gold animate-fade-in">
          <Heart className="h-6 w-6" />
        </div>
        <p className="eyebrow">{t("wishlist")}</p>
        <h1 className="mt-4 font-serif text-4xl md:text-5xl">Your Wishlist is Empty</h1>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          Save pieces you love to your wishlist, and they will appear here so you can easily review them later.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            to="/shop"
            className="px-8 py-4 bg-foreground text-background text-[11px] tracking-[0.25em] uppercase hover:bg-gold transition-colors inline-flex items-center justify-center gap-3"
          >
            Explore the Collections <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
