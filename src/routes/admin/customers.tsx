import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Eye, X, Loader2, Mail, MailMinus } from "lucide-react";
import { store, type Customer } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomersManager,
});

interface EnrichedCustomer extends Customer {
  orderCount: number;
  orders: Array<{ id: string; status: string; paymentStatus: string; totalAmount: number; createdAt: string; items: Array<{ name: string; quantity: number }> }>;
}

function AdminCustomersManager() {
  const [customers, setCustomers] = useState<EnrichedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Drawer state
  const [selectedCustomer, setSelectedCustomer] = useState<EnrichedCustomer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const rawCustomers = store.getCustomers();
    const allOrders = store.getOrders();
    const enriched: EnrichedCustomer[] = rawCustomers.map((c) => {
      const cOrders = allOrders.filter((o) => o.customerId === c.id);
      return {
        ...c,
        orderCount: cOrders.length,
        orders: cOrders.map((o) => ({
          id: o.id,
          status: o.status,
          paymentStatus: o.paymentStatus,
          totalAmount: o.totalAmount,
          createdAt: o.createdAt,
          items: o.items.map((it) => ({ name: it.name, quantity: it.quantity })),
        })),
      };
    });
    setCustomers(enriched);
    setLoading(false);
  }, []);

  // Client-side search filter
  const filteredCustomers = customers.filter((c) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(s) ||
      c.lastName.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s) ||
      (c.phone || "").toLowerCase().includes(s)
    );
  });

  const openCustomerDrawer = (c: EnrichedCustomer) => {
    setSelectedCustomer(c);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold">Customers</h1>
        <p className="text-[12px] text-neutral-500 mt-1">Review profiles, LTV, and historical order profiles.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E1E3E5] p-4 rounded-sm flex gap-4 items-center text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent border border-[#E1E3E5] rounded-sm focus:outline-none focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white border border-[#E1E3E5] rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            <p className="text-xs text-neutral-500 mt-3 tracking-widest uppercase">Loading directory...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 text-xs">
            No customers profiles registered.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E1E3E5] bg-neutral-50 text-neutral-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Customer Details</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Phone</th>
                  <th className="py-3 px-4 text-center font-semibold">Newsletter</th>
                  <th className="py-3 px-4 text-center font-semibold">Total Orders</th>
                  <th className="py-3 px-4 text-right font-semibold">Lifetime Value</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F1F2]">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50">
                    <td className="py-4 px-4 font-semibold text-neutral-900">
                      {c.firstName} {c.lastName}
                    </td>
                    <td className="py-4 px-4 font-mono text-neutral-600">{c.email}</td>
                    <td className="py-4 px-4 font-mono text-neutral-500">{c.phone || "—"}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="flex justify-center">
                        {c.acceptsMarketing ? (
                          <Mail className="h-4 w-4 text-green-600" title="Subscribed" />
                        ) : (
                          <MailMinus className="h-4 w-4 text-neutral-300" title="Not Subscribed" />
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-neutral-700">{c.orderCount}</td>
                    <td className="py-4 px-4 text-right font-semibold text-neutral-950">${c.lifetimeValue.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openCustomerDrawer(c)}
                        className="p-1.5 hover:bg-neutral-100 hover:text-neutral-950 rounded text-neutral-500 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Drawer Details */}
      {isDrawerOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 animate-fade-in" onClick={() => setIsDrawerOpen(false)}>
          <div
            className="w-full max-w-2xl bg-white h-full overflow-y-auto flex flex-col p-6 shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E1E3E5] pb-4 mb-6">
              <div>
                <h2 className="font-serif text-lg font-semibold uppercase tracking-wider">
                  Customer Profile
                </h2>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Registered since {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-950">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Info Summary */}
            <div className="space-y-6 text-xs pb-12">
              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 border border-[#E1E3E5] rounded-sm">
                <div>
                  <h4 className="text-neutral-400 font-semibold uppercase tracking-wider mb-1">Full Name</h4>
                  <p className="font-semibold text-neutral-900 text-[14px]">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </p>
                </div>
                <div>
                  <h4 className="text-neutral-400 font-semibold uppercase tracking-wider mb-1">Lifetime Value</h4>
                  <p className="font-semibold text-neutral-950 text-[14px] font-mono">
                    ${selectedCustomer.lifetimeValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-neutral-400 font-semibold uppercase tracking-wider mb-1">Email</h4>
                  <p className="font-mono text-neutral-600">{selectedCustomer.email}</p>
                </div>
                <div>
                  <h4 className="text-neutral-400 font-semibold uppercase tracking-wider mb-1">Phone</h4>
                  <p className="font-mono text-neutral-600">{selectedCustomer.phone || "—"}</p>
                </div>
                <div>
                  <h4 className="text-neutral-400 font-semibold uppercase tracking-wider mb-1">Newsletter Opt-In</h4>
                  <p className="font-medium text-neutral-700">
                    {selectedCustomer.acceptsMarketing ? "Subscribed to marketing correspondence" : "Unsubscribed / No consent"}
                  </p>
                </div>
                <div>
                  <h4 className="text-neutral-400 font-semibold uppercase tracking-wider mb-1">Orders Count</h4>
                  <p className="font-medium text-neutral-700">{selectedCustomer.orderCount} purchases placed</p>
                </div>
              </div>

              {/* Orders History List */}
              <div className="space-y-3">
                <h3 className="font-serif font-semibold text-[13px] border-b border-[#F0F1F2] pb-1">Purchase Log</h3>
                {selectedCustomer.orders.length === 0 ? (
                  <p className="text-[11px] text-neutral-400 py-10 text-center">No purchases recorded for this customer profile.</p>
                ) : (
                  <div className="border border-[#E1E3E5] rounded-sm overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#E1E3E5] bg-neutral-50 text-neutral-400 font-semibold uppercase tracking-wider">
                          <th className="py-2.5 px-3">Order ID</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Items Purchased</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-right">Total Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0F1F2]">
                        {selectedCustomer.orders.map((o) => (
                          <tr key={o.id}>
                            <td className="py-3 px-3 font-semibold font-mono text-neutral-900">{o.id}</td>
                            <td className="py-3 px-3 text-neutral-500">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-3 max-w-[200px] truncate text-neutral-700">
                              {o.items.map((it) => `${it.name} (x${it.quantity})`).join(", ")}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded-sm font-semibold tracking-wider uppercase text-[9px] ${
                                o.status === "delivered"
                                  ? "bg-green-50 text-green-700"
                                  : o.status === "shipped"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-neutral-100 text-neutral-600"
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right tabular-nums font-semibold text-neutral-950">${o.totalAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Close Drawer Button */}
              <div className="flex justify-end pt-4 border-t border-[#E1E3E5]">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 border border-[#E1E3E5] text-neutral-600 hover:bg-neutral-50 rounded-sm font-semibold uppercase tracking-wider"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
