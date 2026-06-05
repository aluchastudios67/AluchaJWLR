import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="bg-secondary/60 py-24 md:py-32">
      <div className="container-luxury max-w-2xl text-center">
        <p className="eyebrow">The Atelier Letter</p>
        <h2 className="mt-5 font-serif text-4xl md:text-5xl">
          Quiet correspondence,<br />exceptional access.
        </h2>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          Be first to receive new collections, limited editions, and invitations to our private viewings.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setSent(true);
          }}
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            aria-label="Email address"
            className="flex-1 bg-transparent border-b border-foreground/40 px-1 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
          />
          <button
            type="submit"
            className="px-7 py-3 bg-foreground text-background text-[11px] tracking-[0.22em] uppercase hover:bg-gold transition-colors"
          >
            {sent ? "Welcome" : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
