import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { auth } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Small artificial delay for UX feel
    await new Promise((r) => setTimeout(r, 300));

    const user = auth.login(email, password);
    if (user) {
      router.navigate({ to: "/admin" });
    } else {
      setError("Invalid email or password. Please try again.");
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F7] flex items-center justify-center px-4 font-sans antialiased text-neutral-800">
      <div className="max-w-md w-full bg-white border border-[#E1E3E5] shadow-sm p-8 rounded-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl tracking-widest uppercase font-semibold">Alucha</h1>
          <p className="text-xs text-neutral-500 tracking-widest uppercase mt-2">Atelier Administration</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-[11px] tracking-wider uppercase font-semibold text-neutral-500 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@alucha.com"
              className="w-full px-3 py-2.5 bg-transparent border border-[#E1E3E5] rounded-sm text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] tracking-wider uppercase font-semibold text-neutral-500 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-transparent border border-[#E1E3E5] rounded-sm text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-neutral-950 text-white text-[11px] tracking-[0.2em] uppercase py-3 font-semibold hover:bg-neutral-800 transition-colors rounded-sm disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E1E3E5] text-[11px] text-neutral-500 space-y-1">
          <p className="font-semibold text-neutral-600">Access Credentials:</p>
          <p>• Admin: <span className="font-mono bg-neutral-100 px-1 py-0.5 rounded">admin@alucha.com</span> / <span className="font-mono bg-neutral-100 px-1 py-0.5 rounded">admin123</span></p>
          <p>• Staff: <span className="font-mono bg-neutral-100 px-1 py-0.5 rounded">staff@alucha.com</span> / <span className="font-mono bg-neutral-100 px-1 py-0.5 rounded">staff123</span></p>
        </div>
      </div>
    </div>
  );
}
