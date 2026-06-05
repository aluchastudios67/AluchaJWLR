import { createFileRoute } from "@tanstack/react-router";
import { db, type Product, type ProductVariant } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q")?.toLowerCase();
        const category = url.searchParams.get("category");
        const status = url.searchParams.get("status") || "active";
        const tag = url.searchParams.get("tag");
        const sortBy = url.searchParams.get("sortBy") || "createdAt-desc";
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const limit = parseInt(url.searchParams.get("limit") || "20", 10);

        let products = db.getProducts();

        // 1. Filter by status
        if (status !== "all") {
          products = products.filter((p) => p.status === status);
        }

        // 2. Filter by category
        if (category && category !== "All") {
          products = products.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
          );
        }

        // 3. Filter by tag
        if (tag) {
          products = products.filter((p) => p.tags.includes(tag));
        }

        // 4. Search query
        if (q) {
          products = products.filter(
            (p) =>
              p.name.en.toLowerCase().includes(q) ||
              p.name.ka.toLowerCase().includes(q) ||
              p.name.ru.toLowerCase().includes(q) ||
              p.story.en.toLowerCase().includes(q) ||
              p.story.ka.toLowerCase().includes(q) ||
              p.story.ru.toLowerCase().includes(q) ||
              p.sku.toLowerCase().includes(q)
          );
        }

        // 5. Sort products
        products.sort((a, b) => {
          if (sortBy === "price-asc") return a.price - b.price;
          if (sortBy === "price-desc") return b.price - a.price;
          if (sortBy === "name-asc") return a.name.en.localeCompare(b.name.en);
          if (sortBy === "name-desc") return b.name.en.localeCompare(a.name.en);
          // Default: newest first
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        // 6. Pagination
        const totalItems = products.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = products.slice(startIndex, endIndex);

        // Include variants for each product
        const itemsWithVariants = paginatedProducts.map((p) => ({
          ...p,
          variants: db.getVariantsByProductId(p.id),
        }));

        return new Response(
          JSON.stringify({
            products: itemsWithVariants,
            pagination: {
              page,
              limit,
              totalItems,
              totalPages,
            },
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
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
          const {
            name,
            category,
            price,
            image,
            material,
            story,
            sku,
            tracksInventory,
            tags = [],
            isFeatured = false,
            variants = [],
          } = body;

          // Simple Validation
          if (!name || !name.en || !name.ka || !name.ru || !category || !price || !sku) {
            return new Response(
              JSON.stringify({ error: "Missing required fields" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const id = name.en.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          
          // Verify ID uniqueness
          const existing = db.getProductById(id);
          const finalId = existing ? `${id}-${Date.now()}` : id;

          const newProduct: Product = {
            id: finalId,
            name,
            category,
            price,
            image: image || "/placeholder.jpg",
            material,
            story,
            status: "active",
            sku,
            tracksInventory: !!tracksInventory,
            tags,
            isFeatured: !!isFeatured,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Save Product
          db.createProduct(user.id, user.name, newProduct);

          // Save Variants
          const newVariants: ProductVariant[] = variants.map((v: any, idx: number) => ({
            id: `var-${finalId}-${idx}-${Date.now()}`,
            productId: finalId,
            name: v.name || `Option ${idx + 1}`,
            price: v.price || price,
            sku: v.sku || `${sku}-${idx}`,
            inventoryQuantity: typeof v.inventoryQuantity === "number" ? v.inventoryQuantity : 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));

          db.setVariants(user.id, user.name, finalId, newVariants);

          return new Response(
            JSON.stringify({
              product: {
                ...newProduct,
                variants: newVariants,
              },
            }),
            {
              status: 201,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          console.error("Error creating product:", error);
          return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
