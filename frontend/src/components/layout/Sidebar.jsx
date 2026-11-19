import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Building2, 
  ShoppingCart, 
  Truck,
  Layers,
  X
} from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, stats, isOpen, onClose }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users, count: stats?.totalEmployees },
    { id: 'products', label: 'Products & Stock', icon: Package, count: stats?.totalProducts, alert: stats?.lowStockProducts > 0 },
    { id: 'customers', label: 'Customers', icon: Building2, count: stats?.totalCustomers },
    { id: 'orders', label: 'Orders & Purchases', icon: ShoppingCart, count: stats?.totalOrders },
    { id: 'deliveries', label: 'Deliveries & Shipping', icon: Truck, count: stats?.pendingDeliveries, pending: true },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none
        transform transition-transform duration-200 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 sm:px-6 gap-3 border-b border-slate-800 bg-slate-950/40 shrink-0">
        <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-white text-base leading-tight tracking-tight">Northwind</h1>
          <p className="text-[11px] text-blue-400 font-medium">Business Management</p>
        </div>
        {/* Close button – mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 sm:p-4 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          Core Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 active:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span
                  className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : item.alert
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 text-xs text-slate-400 space-y-1 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Database:</span>
          <span className="font-mono text-slate-300 font-semibold">MySQL 8.0</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Backend:</span>
          <span className="text-emerald-400 font-semibold">Spring Boot 3</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Frontend:</span>
          <span className="text-sky-400 font-semibold">React + Vite</span>
        </div>
      </div>
    </aside>
  );
}
