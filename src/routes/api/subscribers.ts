import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/db";

export const Route = createFileRoute("/api/subscribers")({
  server: {
    handlers: {
      GET: async () => {
        // Safe placeholder
        return new Response(JSON.stringify({ message: "Newsletter API Active" }), {
          headers: { "Content-Type": "application/json" },
        });
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { email } = body;

          if (!email || !email.includes("@")) {
            return new Response(JSON.stringify({ error: "Invalid email address" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const success = db.subscribeEmail(email);
          if (!success) {
            return new Response(
              JSON.stringify({ message: "Already subscribed", status: "exists" }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          return new Response(
            JSON.stringify({ message: "Subscribed successfully", status: "success" }),
            {
              status: 201,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          console.error("Subscriber API Error:", error);
          return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
