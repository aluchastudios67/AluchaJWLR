import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-background mt-24">
      <div className="container-luxury py-20 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2 md:col-span-2">
          <Link to="/" className="font-serif text-2xl tracking-[0.3em] uppercase">
            Alucha
          </Link>
          <p className="mt-5 text-sm text-muted-foreground max-w-xs leading-relaxed">
            {t("footer_desc")}
          </p>
        </div>
        <FooterCol
          title={t("footer_shop")}
          links={[
            [t("shop_cats_rings"), "/collections/rings"],
            [t("shop_cats_necklaces"), "/collections/necklaces"],
            [t("shop_cats_earrings"), "/collections/earrings"],
            [t("shop_cats_bracelets"), "/collections/bracelets"],
          ]}
        />
        <FooterCol
          title={t("footer_house")}
          links={[
            [t("nav_story"), "/story"],
            [t("nav_craftsmanship"), "/craftsmanship"],
            [t("nav_journal"), "/journal"],
            [t("nav_sustainability"), "/sustainability"],
          ]}
        />
        <FooterCol
          title={t("footer_care")}
          links={[
            [t("nav_contact"), "/contact"],
            [t("nav_shipping"), "/shipping"],
            [t("nav_returns"), "/returns"],
            [t("nav_care"), "/care"],
          ]}
        />
      </div>
      <div className="border-t border-border">
        <div className="container-luxury py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground tracking-wider uppercase">
          <span>{t("footer_copy", { year: String(new Date().getFullYear()) })}</span>
          <span>{t("footer_crafted")}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="eyebrow mb-5">{title}</h4>
      <ul className="space-y-3 text-sm">
        {links.map(([l, to]) => (
          <li key={l}>
            <Link to={to} className="link-underline hover:text-foreground text-muted-foreground">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
