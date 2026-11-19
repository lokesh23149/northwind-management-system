import React from 'react';
import { 
  Users, 
  Package, 
  Building2, 
  ShoppingCart, 
  Truck, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import Badge from '../components/common/Badge';

export default function DashboardPage({ 
  stats, 
  recentOrders, 
  lowStockProducts, 
  setCurrentPage, 
  onQuickRestock,
  onViewOrder 
}) {
  const statCards = [
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue ? `$${Number(stats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00',
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => setCurrentPage('orders'),
    },
    {
      title: 'Pending Deliveries',
      value: stats?.pendingDeliveries || 0,
      icon: Truck,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      onClick: () => setCurrentPage('deliveries'),
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'bg-rose-500',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      alert: stats?.lowStockProducts > 0,
      onClick: () => setCurrentPage('products'),
    },
    {
      title: 'Active Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      onClick: () => setCurrentPage('products'),
    },
    {
      title: 'Registered Customers',
      value: stats?.totalCustomers || 0,
      icon: Building2,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => setCurrentPage('customers'),
    },
    {
      title: 'Total Employees',
      value: stats?.totalEmployees || 0,
      icon: Users,
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      onClick: () => setCurrentPage('employees'),
    },
    {
      title: 'Completed Deliveries',
      value: stats?.deliveredDeliveries || 0,
      icon: TrendingUp,
      color: 'bg-sky-500',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      onClick: () => setCurrentPage('deliveries'),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.onClick}
              className={`bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-sm transition-all duration-150 ${
                card.onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 active:scale-[0.98]' : ''
              }`}
            >
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider leading-tight">{card.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1 truncate">{card.value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl shrink-0 ${card.bgColor} ${card.textColor}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500 hidden sm:block">Latest purchase orders and shipping milestones</p>
            </div>
            <button
              onClick={() => setCurrentPage('orders')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[480px] px-4 sm:px-0">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3 hidden sm:table-cell">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Total</th>
                    <th className="pb-3 text-right hidden sm:table-cell">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {recentOrders && recentOrders.length > 0 ? (
                    recentOrders.slice(0, 5).map((order) => (
                      <tr key={order.orderId} className="hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-slate-800">#{order.orderId}</td>
                        <td className="py-3 font-medium text-slate-800 max-w-[120px] truncate">{order.customerName || 'N/A'}</td>
                        <td className="py-3 text-xs text-slate-500 hidden sm:table-cell">
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3">
                          <Badge variant={order.deliveryStatus ? order.deliveryStatus.toLowerCase() : 'default'}>
                            {order.deliveryStatus}
                          </Badge>
                        </td>
                        <td className="py-3 text-right font-semibold text-slate-800">
                          ${order.grandTotal ? Number(order.grandTotal).toFixed(2) : '0.00'}
                        </td>
                        <td className="py-3 text-right hidden sm:table-cell">
                          <button
                            onClick={() => onViewOrder && onViewOrder(order)}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 text-sm">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts (1 Column) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">Inventory Alerts</h3>
              <p className="text-xs text-slate-500 hidden sm:block">Products at or below reorder level</p>
            </div>
            <button
              onClick={() => setCurrentPage('products')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts && lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 6).map((prod) => (
                <div
                  key={prod.productId}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-800 truncate">{prod.productName}</p>
                    <p className="text-[11px] text-slate-500">
                      Stock: <span className="text-rose-600 font-bold">{prod.unitsInStock}</span> / Reorder: {prod.reorderLevel}
                    </p>
                  </div>
                  <button
                    onClick={() => onQuickRestock && onQuickRestock(prod)}
                    className="shrink-0 px-2.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors touch-manipulation"
                  >
                    Restock
                  </button>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm">
                All inventory levels are healthy!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
