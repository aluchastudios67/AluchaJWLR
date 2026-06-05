import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/components/LanguageProvider";
import { getBlogPostsFn } from "@/lib/api/db.functions";
import craft from "@/assets/craft.jpg";
import story from "@/assets/story.jpg";

export const Route = createFileRoute("/journal")({
  loader: async () => {
    return { posts: await getBlogPostsFn() };
  },
  head: () => ({
    meta: [
      { title: "Journal — Alucha Studios" },
      { name: "description", content: "Notes on craftsmanship, design philosophy, and the art of fine jewelry." },
    ],
  }),
  component: JournalPage,
});

/** Resolve cover image — DB stores path strings, assets are bundled imports */
function resolveImage(coverImage: string) {
  if (coverImage.includes("story")) return story;
  return craft;
}

function JournalPage() {
  const { language } = useLanguage();
  const { posts } = Route.useLoaderData();

  const allPosts = posts;

  const fmtDate = (iso: string | undefined) =>
    iso
      ? new Date(iso).toLocaleDateString(
          language === "en" ? "en-US" : language === "ka" ? "ka-GE" : "ru-RU",
          { year: "numeric", month: "long", day: "numeric" }
        )
      : "";

  return (
    <div className="pt-32 md:pt-40">
      <div className="container-luxury">
        <p className="eyebrow text-center">Journal</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl text-center">The Atelier Journal</h1>
        <p className="mt-6 text-muted-foreground text-center max-w-xl mx-auto leading-relaxed">
          Thoughts on design, slow craftsmanship, and the stories we carry close to the heart.
        </p>

        {/* Featured Post */}
        {allPosts.length > 0 && (
          <div className="mt-20 grid md:grid-cols-12 gap-10 md:gap-16 items-center border-b border-border pb-20">
            <div className="md:col-span-7 overflow-hidden bg-secondary aspect-[16/10]">
              <img
                src={resolveImage(allPosts[0].coverImage)}
                alt={allPosts[0].title[language]}
                className="w-full h-full object-cover hover-zoom-img"
              />
            </div>
            <div className="md:col-span-5">
              <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                {fmtDate(allPosts[0].publishedAt)}
              </span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">
                {allPosts[0].title[language]}
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed text-sm">
                {allPosts[0].excerpt[language]}
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed text-sm line-clamp-4">
                {allPosts[0].content[language]}
              </p>
              <div className="mt-8">
                <span className="link-underline text-xs tracking-[0.2em] uppercase font-semibold text-foreground cursor-pointer">
                  Read Article →
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pb-32">
          {allPosts.slice(1).map((post) => (
            <article key={post.id} className="group">
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={resolveImage(post.coverImage)}
                  alt={post.title[language]}
                  className="w-full h-full object-cover hover-zoom-img"
                  loading="lazy"
                />
              </div>
              <div className="mt-6">
                <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                  {fmtDate(post.publishedAt)}
                </span>
                <h3 className="mt-3 font-serif text-2xl group-hover:text-gold transition-colors leading-snug">
                  {post.title[language]}
                </h3>
                <p className="mt-4 text-muted-foreground text-xs leading-relaxed line-clamp-2">
                  {post.excerpt[language]}
                </p>
                <p className="mt-3 text-muted-foreground text-xs leading-relaxed line-clamp-3 opacity-70">
                  {post.content[language]}
                </p>
                <div className="mt-5">
                  <span className="link-underline text-[10px] tracking-[0.2em] uppercase font-semibold text-foreground cursor-pointer">
                    Read Article →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
