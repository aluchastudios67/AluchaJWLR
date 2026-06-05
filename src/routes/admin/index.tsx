import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { store } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardHome,
});

function AdminDashboardHome() {
  const [data, setData] = useState<ReturnType<typeof store.getAnalytics> | null>(null);

  useEffect(() => {
    setData(store.getAnalytics());
  }, []);

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white border border-[#E1E3E5] animate-pulse rounded-sm"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-[#E1E3E5] animate-pulse rounded-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  const kpis = data.kpis;
  const maxRevenue = Math.max(...data.salesHistory.map((h) => h.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold">Overview</h1>
          <p className="text-[12px] text-neutral-500 mt-1">Store performance metrics and inventory status.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white border border-[#E1E3E5] p-5 rounded-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] tracking-wider uppercase font-semibold text-neutral-500">
              Total Revenue
            </span>
            <p className="text-2xl font-semibold mt-2 tabular-nums">${kpis.totalRevenue.toLocaleString()}</p>
            <span className="text-[10px] text-green-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> +12.4% vs last month
            </span>
          </div>
          <div className="bg-neutral-50 p-2.5 rounded-sm text-neutral-500 border border-[#E1E3E5]">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-[#E1E3E5] p-5 rounded-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] tracking-wider uppercase font-semibold text-neutral-500">
              Total Orders
            </span>
            <p className="text-2xl font-semibold mt-2 tabular-nums">{kpis.totalOrders}</p>
            <span className="text-[10px] text-green-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> +8.2% vs last month
            </span>
          </div>
          <div className="bg-neutral-50 p-2.5 rounded-sm text-neutral-500 border border-[#E1E3E5]">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white border border-[#E1E3E5] p-5 rounded-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] tracking-wider uppercase font-semibold text-neutral-500">
              Avg. Order Value
            </span>
            <p className="text-2xl font-semibold mt-2 tabular-nums">${kpis.averageOrderValue}</p>
            <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3" /> -1.8% vs last month
            </span>
          </div>
          <div className="bg-neutral-50 p-2.5 rounded-sm text-neutral-500 border border-[#E1E3E5]">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white border border-[#E1E3E5] p-5 rounded-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] tracking-wider uppercase font-semibold text-neutral-500">
              Conversion Rate
            </span>
            <p className="text-2xl font-semibold mt-2 tabular-nums">{kpis.conversionRate}%</p>
            <span className="text-[10px] text-green-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> +0.4% vs last month
            </span>
          </div>
          <div className="bg-neutral-50 p-2.5 rounded-sm text-neutral-500 border border-[#E1E3E5]">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Timeline Graph */}
        <div className="lg:col-span-2 bg-white border border-[#E1E3E5] p-6 rounded-sm">
          <h3 className="font-serif text-lg font-semibold">Sales Over Time</h3>
          <p className="text-[12px] text-neutral-500">Total monthly revenue performance.</p>

          <div className="mt-8 flex items-end justify-between h-56 gap-2 md:gap-4 border-b border-[#E1E3E5] pb-2">
            {data.salesHistory.map((history) => {
              const heightPercent = Math.max(8, Math.round((history.revenue / maxRevenue) * 100));
              return (
                <div key={history.month} className="flex-1 flex flex-col items-center group relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 bg-neutral-900 text-white text-[10px] px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap shadow-md">
                    <p className="font-semibold">{history.month}</p>
                    <p className="text-neutral-300">Revenue: ${history.revenue.toLocaleString()}</p>
                    <p className="text-neutral-300">Orders: {history.orders}</p>
                  </div>
                  
                  {/* Bar */}
                  <div 
                    style={{ height: `${heightPercent}%` }} 
                    className="w-full bg-[#1F1F1F] group-hover:bg-[#B89A63] transition-colors rounded-t-sm"
                  />
                  
                  {/* Label */}
                  <span className="text-[10px] text-neutral-500 mt-2 text-center select-none truncate max-w-full">
                    {history.month.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-[#E1E3E5] p-6 rounded-sm flex flex-col">
          <h3 className="font-serif text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Stock Alerts
          </h3>
          <p className="text-[12px] text-neutral-500">Variants requiring inventory replenishment.</p>

          <div className="mt-5 space-y-4 flex-1 overflow-y-auto max-h-[240px] pr-1">
            {data.lowStock.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center py-8">
                <p className="text-[13px] text-neutral-400">All products have adequate stock levels.</p>
              </div>
            ) : (
              data.lowStock.map((item) => (
                <div key={item.variantId} className="flex items-center justify-between py-2 border-b border-[#F0F1F2] last:border-0 text-xs">
                  <div>
                    <h4 className="font-semibold text-neutral-900 truncate max-w-[170px]">{item.productName}</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{item.variantName} · SKU: {item.sku}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-sm font-semibold tabular-nums ${
                    item.quantity === 0
                      ? "bg-red-50 text-red-700 border border-red-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {item.quantity} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Sellers & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white border border-[#E1E3E5] p-6 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold">Top Selling Products</h3>
            <Link to="/admin/products" className="text-xs text-neutral-500 hover:text-neutral-950 flex items-center gap-1">
              All Products <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E1E3E5] text-neutral-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold text-right">Units</th>
                  <th className="pb-3 font-semibold text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F1F2]">
                {data.topSelling.length === 0 ? (
                  <tr><td colSpan={3} className="py-6 text-center text-neutral-400">No sales data yet</td></tr>
                ) : data.topSelling.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50">
                    <td className="py-3 font-medium text-neutral-950">{item.name}</td>
                    <td className="py-3 text-right tabular-nums text-neutral-600">{item.quantity}</td>
                    <td className="py-3 text-right tabular-nums font-semibold text-neutral-950">${item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white border border-[#E1E3E5] p-6 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold">Top Customers (LTV)</h3>
            <Link to="/admin/customers" className="text-xs text-neutral-500 hover:text-neutral-950 flex items-center gap-1">
              Customer Directory <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E1E3E5] text-neutral-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold text-right">Lifetime Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F1F2]">
                {data.topCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-neutral-50">
                    <td className="py-3">
                      <p className="font-medium text-neutral-950">{cust.name}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{cust.email}</p>
                    </td>
                    <td className="py-3 text-right tabular-nums font-semibold text-neutral-950">${cust.ltv.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
