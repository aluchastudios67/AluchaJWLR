import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export const Route = createFileRoute("/api/customers")({
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
        const q = url.searchParams.get("q")?.toLowerCase();

        let customers = db.getCustomers();

        if (q) {
          customers = customers.filter(
            (c) =>
              c.email.toLowerCase().includes(q) ||
              c.firstName.toLowerCase().includes(q) ||
              c.lastName.toLowerCase().includes(q) ||
              (c.phone && c.phone.includes(q))
          );
        }

        // Map order histories
        const orders = db.getOrders();
        const customersWithOrders = customers.map((c) => {
          const customerOrders = orders.filter((o) => o.customerId === c.id);
          return {
            ...c,
            orderCount: customerOrders.length,
            lastOrderDate: customerOrders[0]?.createdAt || null,
            orders: customerOrders,
          };
        });

        return new Response(JSON.stringify({ customers: customersWithOrders }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
