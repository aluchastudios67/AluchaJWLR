import { createFileRoute } from "@tanstack/react-router";
import { db, type ProductVariant } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export const Route = createFileRoute("/api/products/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id } = params;
        const product = db.getProductById(id);

        if (!product) {
          return new Response(JSON.stringify({ error: "Product not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        const variants = db.getVariantsByProductId(id);

        return new Response(
          JSON.stringify({
            product: {
              ...product,
              variants,
            },
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      },
      PUT: async ({ request, params }) => {
        const { id } = params;
        const user = getAuthenticatedUser(request);
        if (!user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const product = db.getProductById(id);
        if (!product) {
          return new Response(JSON.stringify({ error: "Product not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const body = await request.json();
          const {
            name,
            category,
            price,
            image,
            material,
            story,
            sku,
            tracksInventory,
            tags,
            isFeatured,
            status,
            variants = [],
          } = body;

          // Update product fields
          const updatedProduct = db.updateProduct(user.id, user.name, id, {
            name,
            category,
            price,
            image,
            material,
            story,
            sku,
            tracksInventory: tracksInventory !== undefined ? !!tracksInventory : undefined,
            tags,
            isFeatured: isFeatured !== undefined ? !!isFeatured : undefined,
            status,
          });

          // Sync variants
          if (variants.length > 0) {
            const currentVariants = db.getVariantsByProductId(id);
            
            const syncedVariants: ProductVariant[] = variants.map((v: any, idx: number) => {
              // Try to preserve existing variant ID if matches SKU or size
              const match = currentVariants.find((cv) => cv.sku === v.sku || cv.name === v.name);
              return {
                id: match ? match.id : `var-${id}-${idx}-${Date.now()}`,
                productId: id,
                name: v.name,
                price: v.price || price,
                sku: v.sku,
                inventoryQuantity: typeof v.inventoryQuantity === "number" ? v.inventoryQuantity : 0,
                createdAt: match ? match.createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
            });
            db.setVariants(user.id, user.name, id, syncedVariants);
          }

          const variantsList = db.getVariantsByProductId(id);

          return new Response(
            JSON.stringify({
              product: {
                ...updatedProduct,
                variants: variantsList,
              },
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          console.error("Error updating product:", error);
          return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      DELETE: async ({ request, params }) => {
        const { id } = params;
        const user = getAuthenticatedUser(request);
        if (!user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const success = db.archiveProduct(user.id, user.name, id);
        if (!success) {
          return new Response(JSON.stringify({ error: "Product not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
