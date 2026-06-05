import { createFileRoute, Outlet, Link, useRouter, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  ShoppingCart, 
  Users, 
  FileText, 
  ShieldAlert,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { auth, type AdminUser } from "@/lib/admin-store";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const location = useLocation();

  useEffect(() => {
    const currentUser = auth.getUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      if (location.pathname !== "/admin/login") {
        router.navigate({ to: "/admin/login" });
      }
    }
    setLoading(false);
  }, [location.pathname]);

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    router.navigate({ to: "/admin/login" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
          <p className="mt-4 text-xs text-neutral-500 tracking-widest uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page, just render the screen without layout
  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  // If not logged in and not on login page
  if (!user) {
    return <Outlet />;
  }

  const menuItems = [
    { label: "Overview", to: "/admin", icon: LayoutDashboard },
    { label: "Products", to: "/admin/products", icon: ShoppingBag },
    { label: "Collections", to: "/admin/collections", icon: Layers },
    { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
    { label: "Customers", to: "/admin/customers", icon: Users },
    { label: "Content (CMS)", to: "/admin/content", icon: FileText },
  ];

  if (user?.role === "admin") {
    menuItems.push({ label: "Audit Logs", to: "/admin/audit-logs", icon: ShieldAlert });
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] flex text-neutral-800 font-sans antialiased">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-[#E1E3E5] hidden md:flex flex-col z-20">
        <div className="h-16 px-6 border-b border-[#E1E3E5] flex items-center justify-between">
          <Link to="/admin" className="font-serif text-lg tracking-[0.25em] uppercase font-semibold">
            Alucha Admin
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded transition-colors ${
                  active
                    ? "bg-[#F0F1F2] text-neutral-950 font-semibold"
                    : "text-neutral-600 hover:bg-[#F9F9F9] hover:text-neutral-950"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E1E3E5]">
          <div className="px-3 py-2 mb-2 flex items-center justify-between">
            <div className="truncate">
              <p className="text-[12px] font-semibold text-neutral-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-neutral-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-white border-b border-[#E1E3E5] flex items-center justify-between px-4 z-30">
        <span className="font-serif text-sm tracking-[0.25em] uppercase font-semibold">
          Alucha Admin
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -mr-2 text-neutral-600"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-neutral-900/40 z-40 transition-opacity" onClick={() => setMobileMenuOpen(false)}>
          <aside 
            className="w-64 max-w-[80vw] h-full bg-white flex flex-col z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-14 border-b border-[#E1E3E5] flex items-center px-4">
              <span className="font-serif text-sm tracking-[0.25em] uppercase font-semibold">Alucha Admin</span>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded ${
                      active
                        ? "bg-[#F0F1F2] text-neutral-950 font-semibold"
                        : "text-neutral-600 hover:bg-[#F9F9F9]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[#E1E3E5]">
              <p className="text-[12px] font-semibold text-neutral-900">{user?.name}</p>
              <button
                onClick={handleLogout}
                className="w-full mt-3 flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-0 pt-14 md:pt-0">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
