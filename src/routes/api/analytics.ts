import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export const Route = createFileRoute("/api/analytics")({
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

        const orders = db.getOrders();
        const paidOrders = orders.filter((o) => o.paymentStatus === "paid" || o.status === "delivered");
        const products = db.getProducts();
        const variants = db.getRaw().variants;

        // 1. Core KPIs
        const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
        const conversionRate = 2.4; // Mock conversion rate metric %

        // 2. Inventory Alert: quantities <= 10
        const lowStockVariants = variants
          .filter((v) => v.inventoryQuantity <= 10)
          .map((v) => {
            const product = products.find((p) => p.id === v.productId);
            return {
              variantId: v.id,
              productName: product ? product.name.en : "Unknown Product",
              variantName: v.name,
              sku: v.sku,
              quantity: v.inventoryQuantity,
            };
          });

        // 3. Top-selling products
        const salesByProduct: Record<string, { id: string; name: string; quantity: number; revenue: number }> = {};
        orders.forEach((o) => {
          if (o.status !== "cancelled") {
            o.items.forEach((item) => {
              if (!salesByProduct[item.productId]) {
                salesByProduct[item.productId] = {
                  id: item.productId,
                  name: item.name,
                  quantity: 0,
                  revenue: 0,
                };
              }
              salesByProduct[item.productId].quantity += item.quantity;
              salesByProduct[item.productId].revenue += item.price * item.quantity;
            });
          }
        });
        const topSelling = Object.values(salesByProduct).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

        // 4. Sales timeline (Last 6 months)
        const timeline: Record<string, { month: string; revenue: number; orders: number }> = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Populate last 6 months placeholders
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          timeline[key] = {
            month: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
            revenue: 0,
            orders: 0,
          };
        }

        // Aggregate orders in timeline
        orders.forEach((o) => {
          if (o.status !== "cancelled") {
            const date = new Date(o.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (timeline[key]) {
              timeline[key].revenue += o.totalAmount;
              timeline[key].orders += 1;
            }
          }
        });

        const salesHistory = Object.keys(timeline).sort().map((k) => timeline[k]);

        // 5. Customer insights
        const customers = db.getCustomers();
        const topCustomers = customers
          .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
          .slice(0, 5)
          .map((c) => ({
            id: c.id,
            email: c.email,
            name: `${c.firstName} ${c.lastName}`,
            ltv: c.lifetimeValue,
          }));

        return new Response(
          JSON.stringify({
            kpis: {
              totalRevenue,
              totalOrders,
              averageOrderValue,
              conversionRate,
            },
            lowStock: lowStockVariants,
            topSelling,
            salesHistory,
            topCustomers,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      },
    },
  },
});
