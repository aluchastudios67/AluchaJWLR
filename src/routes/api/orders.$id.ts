import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export const Route = createFileRoute("/api/orders/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { id } = params;
        const user = getAuthenticatedUser(request);
        if (!user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const order = db.getOrderById(id);
        if (!order) {
          return new Response(JSON.stringify({ error: "Order not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ order }), {
          headers: { "Content-Type": "application/json" },
        });
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

        const order = db.getOrderById(id);
        if (!order) {
          return new Response(JSON.stringify({ error: "Order not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const body = await request.json();
          const {
            status,
            paymentStatus,
            trackingNumber,
            trackingUrl,
            notes,
          } = body;

          const updatedOrder = db.updateOrder(user.id, user.name, id, {
            status,
            paymentStatus,
            trackingNumber,
            trackingUrl,
            notes,
          });

          return new Response(JSON.stringify({ order: updatedOrder }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error updating order:", error);
          return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
