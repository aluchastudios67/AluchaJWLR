import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { store, type AuditLog } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/audit-logs")({
  component: AdminAuditLogsViewer,
});

function AdminAuditLogsViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLogs(store.getAuditLogs());
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-neutral-800" /> Audit Logs
        </h1>
        <p className="text-[12px] text-neutral-500 mt-1">
          Review system audit trails, logins, edits, and staff modifications.
        </p>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-[#E1E3E5] rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            <p className="text-xs text-neutral-500 mt-3 tracking-widest uppercase">Loading security logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 text-xs">
            No audit logs captured in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E1E3E5] bg-neutral-50 text-neutral-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                  <th className="py-3 px-4 font-semibold">Entity</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F1F2] font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50">
                    <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString(undefined, {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-neutral-900 whitespace-nowrap">
                      {log.userName}
                      <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">ID: {log.userId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-sm font-semibold text-[9px] tracking-wider uppercase ${
                        log.action.includes("CREATE")
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : log.action.includes("UPDATE") || log.action.includes("SYNC")
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : log.action.includes("DELETE") || log.action.includes("ARCHIVE")
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 whitespace-nowrap font-sans">
                      {log.entity}
                      <span className="text-[9px] text-neutral-400 font-mono block mt-0.5">ID: {log.entityId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 font-sans leading-relaxed max-w-sm">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
