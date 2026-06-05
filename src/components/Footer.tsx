import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-24">
      <div className="container-luxury py-20 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2 md:col-span-2">
          <Link to="/" className="font-serif text-2xl tracking-[0.3em] uppercase">
            Alucha
          </Link>
          <p className="mt-5 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Modern heirlooms, made by hand in small numbers — for the stories worth keeping.
          </p>
        </div>
        <FooterCol
          title="Shop"
          links={[
            ["Rings", "/collections/rings"],
            ["Necklaces", "/collections/necklaces"],
            ["Earrings", "/collections/earrings"],
            ["Bracelets", "/collections/bracelets"],
          ]}
        />
        <FooterCol
          title="House"
          links={[
            ["Our Story", "/story"],
            ["Craftsmanship", "/craftsmanship"],
            ["Journal", "/journal"],
            ["Sustainability", "/sustainability"],
          ]}
        />
        <FooterCol
          title="Care"
          links={[
            ["Contact", "/contact"],
            ["Shipping", "/shipping"],
            ["Returns", "/returns"],
            ["Jewelry Care", "/care"],
          ]}
        />
      </div>
      <div className="border-t border-border">
        <div className="container-luxury py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground tracking-wider uppercase">
          <span>© {new Date().getFullYear()} Alucha Studios</span>
          <span>Crafted with intention · Paris · New York</span>
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
