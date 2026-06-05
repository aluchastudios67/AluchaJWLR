import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Eye, X, Loader2, Truck, Edit } from "lucide-react";
import { store, auth, type Order } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersManager,
});

function AdminOrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Detail Drawer State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fulfillment & Status fields
  const [orderStatus, setOrderStatus] = useState<Order["status"]>("pending");
  const [paymentStatus, setPaymentStatus] = useState<Order["paymentStatus"]>("unpaid");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const loadOrders = () => {
    setOrders(store.getOrders());
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openDetailDrawer = (o: Order) => {
    setSelectedOrder(o);
    setOrderStatus(o.status);
    setPaymentStatus(o.paymentStatus);
    setTrackingNumber(o.trackingNumber || "");
    setTrackingUrl(o.trackingUrl || "");
    setNotes(o.notes || "");
    setIsDrawerOpen(true);
  };

  const handleUpdateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSaving(true);
    const user = auth.getUser();
    if (!user) { setSaving(false); return; }

    store.updateOrder(user, selectedOrder.id, {
      status: orderStatus,
      paymentStatus,
      trackingNumber: trackingNumber || undefined,
      trackingUrl: trackingUrl || undefined,
      notes: notes || undefined,
    });

    const updated = store.getOrderById(selectedOrder.id);
    if (updated) setSelectedOrder(updated);
    loadOrders();
    setSaving(false);
  };

  const filteredOrders = orders.filter((o) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(searchLower) ||
      o.customerName?.toLowerCase().includes(searchLower) ||
      o.customerEmail?.toLowerCase().includes(searchLower) ||
      o.shippingAddress.firstName.toLowerCase().includes(searchLower) ||
      o.shippingAddress.lastName.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold">Orders</h1>
        <p className="text-[12px] text-neutral-500 mt-1">Fulfill packages, track shipments, and process refunds.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E1E3E5] p-4 rounded-sm flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by order ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent border border-[#E1E3E5] rounded-sm focus:outline-none focus:border-neutral-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="bg-white border border-[#E1E3E5] rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            <p className="text-xs text-neutral-500 mt-3 tracking-widest uppercase">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 text-xs">
            No orders found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E1E3E5] bg-neutral-50 text-neutral-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 text-center font-semibold">Status</th>
                  <th className="py-3 px-4 text-center font-semibold">Payment</th>
                  <th className="py-3 px-4 text-right font-semibold">Total</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F1F2]">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50">
                    <td className="py-4 px-4 font-semibold font-mono text-neutral-900">{o.id}</td>
                    <td className="py-4 px-4 text-neutral-500">
                      {new Date(o.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-neutral-900">
                        {o.shippingAddress.firstName} {o.shippingAddress.lastName}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{o.shippingAddress.city}, {o.shippingAddress.country}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-sm font-semibold tracking-wider uppercase text-[9px] ${
                        o.status === "delivered"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : o.status === "shipped"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : o.status === "processing"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : o.status === "cancelled" || o.status === "refunded"
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-sm font-semibold tracking-wider uppercase text-[9px] ${
                        o.paymentStatus === "paid"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : o.paymentStatus === "refunded"
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-neutral-950">${o.totalAmount}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openDetailDrawer(o)}
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

      {/* Order Details Drawer */}
      {isDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 animate-fade-in" onClick={() => setIsDrawerOpen(false)}>
          <div
            className="w-full max-w-2xl bg-white h-full overflow-y-auto flex flex-col p-6 shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E1E3E5] pb-4 mb-6">
              <div>
                <h2 className="font-serif text-lg font-semibold uppercase tracking-wider">
                  Order Details: {selectedOrder.id}
                </h2>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-950">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Layout Split */}
            <div className="flex-1 space-y-6 text-xs pb-12">
              {/* Customer & Shipping addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-50 p-4 border border-[#E1E3E5] rounded-sm">
                <div>
                  <h3 className="font-serif font-semibold text-[13px] border-b border-[#E1E3E5] pb-1.5 mb-2">Shipping Information</h3>
                  <p className="font-semibold">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                  {selectedOrder.shippingAddress.company && <p className="text-neutral-500">{selectedOrder.shippingAddress.company}</p>}
                  <p className="text-neutral-600 mt-1">{selectedOrder.shippingAddress.address1}</p>
                  {selectedOrder.shippingAddress.address2 && <p className="text-neutral-600">{selectedOrder.shippingAddress.address2}</p>}
                  <p className="text-neutral-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                  <p className="text-neutral-600 font-medium">{selectedOrder.shippingAddress.country}</p>
                  <p className="text-neutral-500 font-mono mt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[13px] border-b border-[#E1E3E5] pb-1.5 mb-2">Customer</h3>
                  <p className="font-semibold">{selectedOrder.customerName}</p>
                  <p className="text-neutral-500 mt-0.5">{selectedOrder.customerEmail}</p>
                  <p className="text-neutral-500 mt-1">Method: {selectedOrder.shippingMethod}</p>
                  {selectedOrder.trackingNumber && <p className="font-mono text-neutral-600 mt-1">Tracking: {selectedOrder.trackingNumber}</p>}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="font-serif font-semibold text-[13px] border-b border-[#F0F1F2] pb-1">Items List</h3>
                <div className="border border-[#E1E3E5] rounded-sm overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E1E3E5] bg-neutral-50 text-neutral-400 font-semibold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Product details</th>
                        <th className="py-2.5 px-3 text-right">Price</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F1F2]">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-neutral-900">{item.name}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">ID: {item.productId}</p>
                          </td>
                          <td className="py-3 px-3 text-right tabular-nums text-neutral-600">${item.price}</td>
                          <td className="py-3 px-3 text-center tabular-nums text-neutral-600">{item.quantity}</td>
                          <td className="py-3 px-3 text-right tabular-nums font-semibold text-neutral-900">${item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Totals Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 border-t border-[#E1E3E5] pt-3 text-[13px]">
                  <div className="flex justify-between text-neutral-500">
                    <span>Tax:</span>
                    <span className="tabular-nums font-mono">${selectedOrder.taxAmount}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Shipping:</span>
                    <span className="tabular-nums font-mono">${selectedOrder.shippingAmount}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-neutral-950 border-t border-[#F0F1F2] pt-2">
                    <span>Grand Total:</span>
                    <span className="tabular-nums font-mono">${selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Admin Updates Section */}
              <form onSubmit={handleUpdateOrder} className="border-t border-[#E1E3E5] pt-6 space-y-4">
                <h3 className="font-serif font-semibold text-[13px] border-b border-[#F0F1F2] pb-1">Order Management</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Fulfillment Status</label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm focus:outline-none"
                    >
                      <option value="pending">Pending (Unfulfilled)</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm focus:outline-none"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1 flex items-center gap-1">
                      <Truck className="h-3 w-3" /> Shipping Carrier Tracking SKU
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. DHL123456789"
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Tracking URL</label>
                    <input
                      type="text"
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                      placeholder="e.g. https://www.dhl.com/track"
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-500 font-semibold mb-1 flex items-center gap-1">
                    <Edit className="h-3 w-3" /> Internal Staff Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about packaging, customization or customer refunds..."
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E1E3E5]">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-4 py-2 border border-[#E1E3E5] text-neutral-600 hover:bg-neutral-50 rounded-sm font-semibold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-neutral-950 text-white px-5 py-2.5 rounded-sm hover:bg-neutral-850 flex items-center gap-2 font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Update Order"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
