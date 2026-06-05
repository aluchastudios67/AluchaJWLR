import { createFileRoute } from "@tanstack/react-router";
import { db, type Collection } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export const Route = createFileRoute("/api/collections")({
  server: {
    handlers: {
      GET: async () => {
        const collections = db.getCollections();
        return new Response(JSON.stringify({ collections }), {
          headers: { "Content-Type": "application/json" },
        });
      },
      POST: async ({ request }) => {
        const user = getAuthenticatedUser(request);
        if (!user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const body = await request.json();
          const { id, name, description, slug, isFeatured = false, productIds = [] } = body;

          if (!name || !name.en || !name.ka || !name.ru || !slug) {
            return new Response(
              JSON.stringify({ error: "Missing required fields" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const finalId = id || slug.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const existing = db.getCollectionById(finalId);

          if (existing) {
            // Update existing collection
            const updated = db.updateCollection(user.id, user.name, finalId, {
              name,
              description,
              slug,
              isFeatured,
              productIds,
            });
            return new Response(JSON.stringify({ collection: updated }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          const newCollection: Collection = {
            id: finalId,
            name,
            description,
            slug,
            isFeatured,
            productIds,
            createdAt: new Date().toISOString(),
          };

          db.createCollection(user.id, user.name, newCollection);

          return new Response(JSON.stringify({ collection: newCollection }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error saving collection:", error);
          return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
