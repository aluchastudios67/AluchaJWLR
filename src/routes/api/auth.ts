import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/db";

export const Route = createFileRoute("/api/auth")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cookieHeader = request.headers.get("cookie") ?? "";
        const sessionCookie = getCookie(cookieHeader, "alucha-session");
        
        if (!sessionCookie) {
          return new Response(JSON.stringify({ user: null }), {
            headers: { "Content-Type": "application/json" },
          });
        }
        
        try {
          const session = JSON.parse(decodeURIComponent(sessionCookie));
          const user = db.getUsers().find((u) => u.id === session.id);
          
          if (!user) {
            return new Response(JSON.stringify({ user: null }), {
              headers: { "Content-Type": "application/json" },
            });
          }
          
          return new Response(
            JSON.stringify({
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              },
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch {
          return new Response(JSON.stringify({ user: null }), {
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      POST: async ({ request }) => {
        try {
          const { email, password } = await request.json();
          const user = db.getUserByEmail(email);
          
          if (!user || !db.verifyPassword(user, password)) {
            return new Response(JSON.stringify({ error: "Invalid email or password" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }
          
          const session = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
          const sessionString = encodeURIComponent(JSON.stringify(session));
          
          db.log(user.id, user.name, "LOGIN", "User", user.id, `Logged in successfully.`);
          
          return new Response(JSON.stringify({ user: session }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": `alucha-session=${sessionString}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
            },
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: "Invalid request body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      DELETE: async () => {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `alucha-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
          },
        });
      },
    },
  },
});

function getCookie(cookieHeader: string, name: string): string | null {
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const parts = pair.split("=");
    const k = parts[0]?.trim();
    const v = parts.slice(1).join("=");
    if (k === name) return v.trim();
  }
  return null;
}
