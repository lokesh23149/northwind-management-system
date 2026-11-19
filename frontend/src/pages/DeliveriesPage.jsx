import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, MapPin, Calendar, Edit3, ArrowRight } from 'lucide-react';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';

export default function DeliveriesPage({
  deliveries,
  shippers,
  loading,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  onUpdateDeliveryStatus,
}) {
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [formData, setFormData] = useState({
    deliveryStatus: 'PENDING',
    shippedDate: '',
    shipAddress: '',
    shipCity: '',
    shipCountry: '',
    shipperId: '',
  });

  const statusFilters = [
    { id: '', label: 'All Shipments' },
    { id: 'PENDING', label: 'Pending Processing' },
    { id: 'SHIPPED', label: 'In Transit / Shipped' },
    { id: 'DELIVERED', label: 'Delivered' },
  ];

  const handleOpenEdit = (delivery) => {
    setEditingDelivery(delivery);
    setFormData({
      deliveryStatus: delivery.deliveryStatus || 'PENDING',
      shippedDate: delivery.shippedDate ? delivery.shippedDate.split('T')[0] : '',
      shipAddress: delivery.shipAddress || '',
      shipCity: delivery.shipCity || '',
      shipCountry: delivery.shipCountry || '',
      shipperId: delivery.shipperId ? String(delivery.shipperId) : '',
    });
  };

  const handleQuickStatusChange = (orderId, newStatus) => {
    const today = new Date().toISOString();
    onUpdateDeliveryStatus(orderId, {
      deliveryStatus: newStatus,
      shippedDate: newStatus === 'SHIPPED' ? today : undefined,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingDelivery) return;

    const payload = {
      deliveryStatus: formData.deliveryStatus,
      shippedDate: formData.shippedDate ? `${formData.shippedDate}T12:00:00` : null,
      shipAddress: formData.shipAddress,
      shipCity: formData.shipCity,
      shipCountry: formData.shipCountry,
      shipperId: formData.shipperId ? Number(formData.shipperId) : undefined,
    };

    onUpdateDeliveryStatus(editingDelivery.orderId, payload);
    setEditingDelivery(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, recipient, city..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex bg-slate-200/60 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          {statusFilters.map((st) => (
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

      {/* Deliveries Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Recipient & Address</th>
                  <th className="py-3.5 px-6">Carrier</th>
                  <th className="py-3.5 px-6">Milestones</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Quick Transition</th>
                  <th className="py-3.5 px-6 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {deliveries && deliveries.length > 0 ? (
                  deliveries.map((del) => {
                    const status = del.deliveryStatus || 'PENDING';
                    const isPending = status === 'PENDING';
                    const isShipped = status === 'SHIPPED';
                    const isDelivered = status === 'DELIVERED';

                    return (
                      <tr key={del.orderId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          #{del.orderId}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-800">{del.shipName || del.customerName}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{[del.shipAddress, del.shipCity, del.shipCountry].filter(Boolean).join(', ')}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs font-medium text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{del.shipperName || `Carrier #${del.shipperId}`}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">Order:</span>
                            <span>{del.orderDate ? new Date(del.orderDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          {del.shippedDate ? (
                            <div className="flex items-center gap-1 text-sky-700 font-medium">
                              <span>Shipped:</span>
                              <span>{new Date(del.shippedDate).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <div className="text-slate-400 italic">Not yet dispatched</div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Badge variant={status.toLowerCase()}>{status}</Badge>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <button
                                onClick={() => handleQuickStatusChange(del.orderId, 'SHIPPED')}
                                className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Truck className="w-3 h-3" />
                                <span>Dispatch</span>
                              </button>
                            )}
                            {isShipped && (
                              <button
                                onClick={() => handleQuickStatusChange(del.orderId, 'DELIVERED')}
                                className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Mark Delivered</span>
                              </button>
                            )}
                            {isDelivered && (
                              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Fulfilled
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleOpenEdit(del)}
                            title="Edit Shipping Details"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400 text-sm">
                      No shipments found matching the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Delivery Status Modal */}
      <Modal
        isOpen={!!editingDelivery}
        onClose={() => setEditingDelivery(null)}
        title={`Update Shipping & Delivery: #${editingDelivery?.orderId}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Delivery Status</label>
            <select
              value={formData.deliveryStatus}
              onChange={(e) => setFormData({ ...formData, deliveryStatus: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
            >
              <option value="PENDING">PENDING (Preparing / Not Shipped)</option>
              <option value="SHIPPED">SHIPPED (In Transit)</option>
              <option value="DELIVERED">DELIVERED (Fulfilled)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Shipped Date</label>
            <input
              type="date"
              value={formData.shippedDate}
              onChange={(e) => setFormData({ ...formData, shippedDate: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Carrier</label>
            <select
              value={formData.shipperId}
              onChange={(e) => setFormData({ ...formData, shipperId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Keep current carrier</option>
              {shippers.map((s) => (
                <option key={s.shipperId} value={s.shipperId}>
                  {s.companyName}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Update Address
            </span>
            <input
              type="text"
              placeholder="Street Address"
              value={formData.shipAddress}
              onChange={(e) => setFormData({ ...formData, shipAddress: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={formData.shipCity}
                onChange={(e) => setFormData({ ...formData, shipCity: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.shipCountry}
                onChange={(e) => setFormData({ ...formData, shipCountry: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingDelivery(null)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
            >
              Save Delivery Updates
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
