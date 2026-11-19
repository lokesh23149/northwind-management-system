import React, { useState } from 'react';
import { Search, Plus, Eye, Ban, ShoppingCart, Calendar, MapPin, Truck } from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';

export default function OrdersPage({
  orders,
  loading,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  onOpenCreateOrder,
  onCancelOrder,
}) {
  const [viewingOrder, setViewingOrder] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);

  const statuses = [
    { id: '', label: 'All Orders' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'SHIPPED', label: 'Shipped' },
    { id: 'DELIVERED', label: 'Delivered' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Customer, Destination..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            />
          </div>

          <div className="flex bg-slate-200/60 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            {statuses.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatus === st.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenCreateOrder}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Order</span>
        </button>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Customer</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden sm:table-cell">Order Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden md:table-cell">Shipper</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right hidden lg:table-cell">Freight</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Grand Total</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {orders && orders.length > 0 ? (
                  orders.map((ord) => (
                    <tr key={ord.orderId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                        #{ord.orderId}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-semibold text-slate-800">{ord.customerName || `Customer #${ord.custId}`}</div>
                        <div className="text-xs text-slate-400">{ord.shipCity ? `${ord.shipCity}, ${ord.shipCountry}` : ''}</div>
                        <div className="text-xs text-slate-400 sm:hidden mt-0.5">
                          {ord.orderDate ? new Date(ord.orderDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-xs text-slate-500 hidden sm:table-cell">
                        {ord.orderDate ? new Date(ord.orderDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-center">
                        <Badge variant={ord.deliveryStatus ? ord.deliveryStatus.toLowerCase() : 'default'}>
                          {ord.deliveryStatus}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-xs text-slate-600 font-medium hidden md:table-cell">
                        {ord.shipperName || `Shipper #${ord.shipperId}`}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right text-xs text-slate-500 hidden lg:table-cell">
                        ${ord.freight ? Number(ord.freight).toFixed(2) : '0.00'}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right font-bold text-slate-800 text-sm sm:text-base">
                        ${ord.grandTotal ? Number(ord.grandTotal).toFixed(2) : '0.00'}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingOrder(ord)}
                            title="View Order Details"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {ord.deliveryStatus !== 'DELIVERED' && (
                            <button
                              onClick={() => setCancelConfirm(ord)}
                              title="Cancel Order & Restore Stock"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400 text-sm">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>

      {/* View Order Details Modal */}
      <Modal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        title={`Order Details: #${viewingOrder?.orderId}`}
        maxWidth="max-w-3xl"
      >
        {viewingOrder && (
          <div className="space-y-6">
            {/* Header Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Customer:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{viewingOrder.customerName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Order Date:</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {viewingOrder.orderDate ? new Date(viewingOrder.orderDate).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Delivery Status:</span>
                <div className="mt-0.5">
                  <Badge variant={viewingOrder.deliveryStatus ? viewingOrder.deliveryStatus.toLowerCase() : 'default'}>
                    {viewingOrder.deliveryStatus}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Carrier:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{viewingOrder.shipperName}</p>
              </div>
            </div>

            {/* Shipping Destination */}
            <div className="p-4 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Ship To:</span>
              <p className="font-semibold text-slate-800">{viewingOrder.shipName}</p>
              <p>{viewingOrder.shipAddress}, {viewingOrder.shipCity}, {viewingOrder.shipCountry} {viewingOrder.shipPostalCode}</p>
              {viewingOrder.shippedDate && (
                <p className="text-emerald-600 font-medium pt-1">
                  Shipped on: {new Date(viewingOrder.shippedDate).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Order Items Table */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3">Purchased Items</h4>
              <div className="border border-slate-100 rounded-xl overflow-x-auto">
                <table className="w-full min-w-[440px] text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Product</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Price</th>
                      <th className="py-2.5 px-4 text-right">Discount</th>
                      <th className="py-2.5 px-4 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {viewingOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-4 font-medium">{item.productName || `Product #${item.productId}`}</td>
                        <td className="py-2.5 px-4 text-center font-bold">{item.quantity}</td>
                        <td className="py-2.5 px-4 text-right">${Number(item.unitPrice).toFixed(2)}</td>
                        <td className="py-2.5 px-4 text-right">{Number(item.discount * 100).toFixed(0)}%</td>
                        <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                          ${Number(item.lineTotal).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price Breakdown Footer */}
            <div className="flex flex-col items-end gap-1.5 pt-2 text-sm">
              <div className="flex justify-between w-full sm:w-64 text-slate-500">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-800">${Number(viewingOrder.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-64 text-slate-500">
                <span>Freight Shipping:</span>
                <span className="font-medium text-slate-800">${Number(viewingOrder.freight || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-64 border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                <span>Grand Total:</span>
                <span className="text-blue-600">${Number(viewingOrder.grandTotal || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Order Confirmation */}
      <ConfirmDialog
        isOpen={!!cancelConfirm}
        onClose={() => setCancelConfirm(null)}
        onConfirm={() => onCancelOrder(cancelConfirm.orderId)}
        title="Cancel Order"
        confirmText="Cancel Order & Restore Stock"
        message={`Are you sure you want to cancel Order #${cancelConfirm?.orderId}? All reserved product quantities will be immediately restored to warehouse stock.`}
      />
    </div>
  );
}
