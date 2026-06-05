import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, Heart, X, Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "./LanguageProvider";
import { type translations } from "@/lib/translations";

type TranslationKey = keyof typeof translations.en;

const nav = [
  { to: "/shop", key: "nav_shop" as TranslationKey },
  { to: "/collections", key: "nav_collections" as TranslationKey },
  { to: "/story", key: "nav_story" as TranslationKey },
  { to: "/craftsmanship", key: "nav_craftsmanship" as TranslationKey },
  { to: "/journal", key: "nav_journal" as TranslationKey },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

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
              {t(n.key)}
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
                {t(n.key)}
              </Link>
            ))}
          </nav>
          <button aria-label={t("search")} className="p-2 hover:text-gold transition-colors hidden md:block">
            <Search className="h-4 w-4" />
          </button>
          
          {/* Theme Toggle */}
          <button aria-label={theme === "light" ? t("theme_dark") : t("theme_light")} onClick={toggle} className="p-2 hover:text-gold transition-colors">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Elegant Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Select language" 
              className="p-2 text-[10px] md:text-xs tracking-wider md:tracking-widest uppercase hover:text-gold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language === "ka" ? "ქარ" : language === "en" ? "EN" : "RU"}</span>
            </button>
            {langOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setLangOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-background border border-border shadow-lg py-1.5 min-w-[110px] z-50 rounded-sm">
                  {[
                    { code: "ka", label: "ქართული" },
                    { code: "en", label: "English" },
                    { code: "ru", label: "Русский" }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[11px] hover:bg-secondary/80 hover:text-gold transition-colors block cursor-pointer ${
                        language === lang.code ? "text-gold font-medium" : "text-foreground/80"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link to="/wishlist" aria-label={t("wishlist")} className="p-2 hover:text-gold transition-colors hidden md:block">
            <Heart className="h-4 w-4" />
          </Link>
          <Link to="/cart" aria-label={t("cart")} className="p-2 hover:text-gold transition-colors relative">
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
              {t(n.key)}
            </Link>
          ))}
          
          {/* Mobile Language Switcher */}
          <div className="border-t border-border mt-6 pt-6 flex gap-4">
            {[
              { code: "ka", label: "ქარ" },
              { code: "en", label: "EN" },
              { code: "ru", label: "RU" }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as any);
                  setOpen(false);
                }}
                className={`px-3 py-1.5 border text-xs tracking-widest uppercase transition-colors ${
                  language === lang.code 
                    ? "border-gold text-gold font-medium" 
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
