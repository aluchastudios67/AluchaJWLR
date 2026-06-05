import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, Heart, X, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/story", label: "Our Story" },
  { to: "/craftsmanship", label: "Craftsmanship" },
  { to: "/journal", label: "Journal" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="container-luxury flex items-center justify-between h-16 md:h-20">
        <button
          aria-label="Open menu"
          className="md:hidden p-2 -ml-2"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden md:flex gap-9 text-[12px] tracking-[0.18em] uppercase font-medium">
          {nav.slice(0, 3).map((n) => (
            <Link key={n.to} to={n.to} className="link-underline hover:text-gold transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-serif text-xl md:text-2xl tracking-[0.35em] uppercase">
          Alucha
        </Link>

        <div className="flex items-center gap-1 md:gap-3">
          <nav className="hidden md:flex gap-9 text-[12px] tracking-[0.18em] uppercase font-medium mr-3">
            {nav.slice(3).map((n) => (
              <Link key={n.to} to={n.to} className="link-underline hover:text-gold transition-colors">
                {n.label}
              </Link>
            ))}
          </nav>
          <button aria-label="Search" className="p-2 hover:text-gold transition-colors hidden md:block">
            <Search className="h-4 w-4" />
          </button>
          <button aria-label="Toggle theme" onClick={toggle} className="p-2 hover:text-gold transition-colors">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="p-2 hover:text-gold transition-colors hidden md:block">
            <Heart className="h-4 w-4" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="p-2 hover:text-gold transition-colors relative">
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 bg-background transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <span className="font-serif text-xl tracking-[0.35em] uppercase">Alucha</span>
          <button aria-label="Close menu" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col p-8 gap-6">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="font-serif text-3xl"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
