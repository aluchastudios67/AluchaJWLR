import { createFileRoute } from "@tanstack/react-router";
import { db, type Order } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export const Route = createFileRoute("/api/orders")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = getAuthenticatedUser(request);
        if (!user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const url = new URL(request.url);
        const status = url.searchParams.get("status");
        const q = url.searchParams.get("q")?.toLowerCase();

        let orders = db.getOrders();

        if (status && status !== "all") {
          orders = orders.filter((o) => o.status === status);
        }

        if (q) {
          orders = orders.filter(
            (o) =>
              o.id.toLowerCase().includes(q) ||
              o.customerId.toLowerCase().includes(q) ||
              o.shippingAddress.firstName.toLowerCase().includes(q) ||
              o.shippingAddress.lastName.toLowerCase().includes(q)
          );
        }

        return new Response(JSON.stringify({ orders }), {
          headers: { "Content-Type": "application/json" },
        });
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const {
            customerId,
            shippingAddress,
            billingAddress,
            shippingMethod,
            items = [],
            notes,
            shippingAmount = 0,
            taxAmount = 0,
            totalAmount,
          } = body;

          // Customer Checkout Validation
          if (!customerId || !shippingAddress || !billingAddress || items.length === 0 || !totalAmount) {
            return new Response(
              JSON.stringify({ error: "Missing required checkout fields" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Verify stock levels before checkout
          const dbRaw = db.getRaw();
          for (const item of items) {
            const variant = dbRaw.variants.find((v) => v.id === item.variantId);
            if (!variant) {
              return new Response(
                JSON.stringify({ error: `Variant not found: ${item.name}` }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                }
              );
            }
            if (variant.inventoryQuantity < item.quantity) {
              return new Response(
                JSON.stringify({
                  error: `Insufficient stock for ${item.name}. Only ${variant.inventoryQuantity} left.`,
                }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                }
              );
            }
          }

          const newOrder = db.createOrder({
            customerId,
            status: "pending",
            paymentStatus: "paid", // Assume successful payment demo
            shippingAddress,
            billingAddress,
            shippingMethod,
            totalAmount,
            taxAmount,
            shippingAmount,
            notes,
            items,
          });

          return new Response(JSON.stringify({ order: newOrder }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error creating order:", error);
          return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
