import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export const Route = createFileRoute("/api/audit-logs")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = getAuthenticatedUser(request);
        if (!user || user.role !== "admin") {
          return new Response(
            JSON.stringify({ error: "Unauthorized. Admin access required." }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const logs = db.getAuditLogs();
        return new Response(JSON.stringify({ auditLogs: logs }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
