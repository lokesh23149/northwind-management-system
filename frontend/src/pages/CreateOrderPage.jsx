import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, ArrowLeft, AlertCircle, CheckCircle, Package } from 'lucide-react';

export default function CreateOrderPage({
  customers,
  products,
  employees,
  shippers,
  onBack,
  onSubmitOrder,
  submitting,
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedShipperId, setSelectedShipperId] = useState('');
  const [freight, setFreight] = useState('10.00');

  // Shipping Details
  const [shipName, setShipName] = useState('');
  const [shipAddress, setShipAddress] = useState('');
  const [shipCity, setShipCity] = useState('');
  const [shipRegion, setShipRegion] = useState('');
  const [shipPostalCode, setShipPostalCode] = useState('');
  const [shipCountry, setShipCountry] = useState('');

  // Cart Items
  const [items, setItems] = useState([
    { productId: '', quantity: 1, unitPrice: 0, discount: 0, availableStock: 0 },
  ]);

  const [formError, setFormError] = useState('');

  // Autofill address when customer changes
  useEffect(() => {
    if (selectedCustomerId) {
      const cust = customers.find((c) => String(c.custId) === String(selectedCustomerId));
      if (cust) {
        setShipName(cust.companyName || '');
        setShipAddress(cust.address || '');
        setShipCity(cust.city || '');
        setShipRegion(cust.region || '');
        setShipPostalCode(cust.postalCode || '');
        setShipCountry(cust.country || '');
      }
    }
  }, [selectedCustomerId, customers]);

  // Set default shipper if available
  useEffect(() => {
    if (shippers && shippers.length > 0 && !selectedShipperId) {
      setSelectedShipperId(String(shippers[0].shipperId));
    }
  }, [shippers, selectedShipperId]);

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0, discount: 0, availableStock: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleProductChange = (index, prodId) => {
    const prod = products.find((p) => String(p.productId) === String(prodId));
    const newItems = [...items];
    if (prod) {
      newItems[index] = {
        ...newItems[index],
        productId: prod.productId,
        unitPrice: Number(prod.unitPrice) || 0,
        availableStock: prod.unitsInStock || 0,
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        productId: '',
        unitPrice: 0,
        availableStock: 0,
      };
    }
    setItems(newItems);
  };

  const handleQuantityChange = (index, qty) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, Number(qty) || 1);
    setItems(newItems);
  };

  const handleDiscountChange = (index, disc) => {
    const newItems = [...items];
    const val = Math.min(100, Math.max(0, Number(disc) || 0));
    newItems[index].discount = val / 100;
    setItems(newItems);
  };

  // Calculations
  const calculateLineTotal = (item) => {
    const price = Number(item.unitPrice) || 0;
    const qty = Number(item.quantity) || 1;
    const disc = Number(item.discount) || 0;
    return price * qty * (1 - disc);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.productId ? calculateLineTotal(item) : 0), 0);
  const freightVal = Number(freight) || 0;
  const grandTotal = subtotal + freightVal;

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!selectedCustomerId) {
      setFormError('Please select a customer for this order.');
      return;
    }
    if (!selectedShipperId) {
      setFormError('Please select a shipping company.');
      return;
    }

    const validItems = items.filter((i) => i.productId);
    if (validItems.length === 0) {
      setFormError('Please add at least one product to the purchase order.');
      return;
    }

    // Check for stock shortages
    for (const item of validItems) {
      if (item.quantity > item.availableStock) {
        const prod = products.find((p) => p.productId === item.productId);
        setFormError(
          `Requested quantity (${item.quantity}) exceeds available stock (${item.availableStock}) for "${prod?.productName}".`
        );
        return;
      }
    }

    const payload = {
      custId: Number(selectedCustomerId),
      employeeId: selectedEmployeeId ? Number(selectedEmployeeId) : null,
      shipperId: Number(selectedShipperId),
      freight: freightVal,
      shipName,
      shipAddress,
      shipCity,
      shipRegion,
      shipPostalCode,
      shipCountry,
      items: validItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discount: i.discount,
      })),
    };

    onSubmitOrder(payload);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </button>

        <h3 className="text-lg font-bold text-slate-800">New Purchase Order</h3>
      </div>

      {formError && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Customer & Logistics Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
            Customer & Logistics
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Select Customer <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">-- Choose Customer --</option>
                {customers.map((c) => (
                  <option key={c.custId} value={c.custId}>
                    {c.companyName} ({c.contactName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Shipping Carrier <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedShipperId}
                onChange={(e) => setSelectedShipperId(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">-- Choose Shipper --</option>
                {shippers.map((s) => (
                  <option key={s.shipperId} value={s.shipperId}>
                    {s.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Sales Employee</label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">-- Optional / None --</option>
                {employees.map((e) => (
                  <option key={e.employeeId} value={e.employeeId}>
                    {e.firstname} {e.lastname} ({e.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shipping Address Inputs */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Destination Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Recipient Name (Ship Name)"
                  value={shipName}
                  onChange={(e) => setShipName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={shipAddress}
                  onChange={(e) => setShipAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="City"
                  value={shipCity}
                  onChange={(e) => setShipCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Region / State"
                  value={shipRegion}
                  onChange={(e) => setShipRegion(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={shipPostalCode}
                  onChange={(e) => setShipPostalCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Country"
                  value={shipCountry}
                  onChange={(e) => setShipCountry(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Multi-Product Purchase Cart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">2</span>
              Product Line Items & Inventory
            </h4>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Product</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const lineTotal = calculateLineTotal(item);
              const isOverStock = item.productId && item.quantity > item.availableStock;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isOverStock ? 'bg-rose-50/40 border-rose-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Product Selection */}
                    <div className="col-span-12 md:col-span-5">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Product</label>
                      <select
                        value={item.productId}
                        onChange={(e) => handleProductChange(idx, e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="">-- Choose Product --</option>
                        {products
                          .filter((p) => p.discontinued !== '1')
                          .map((p) => (
                            <option key={p.productId} value={p.productId}>
                              {p.productName} (${Number(p.unitPrice).toFixed(2)}) - {p.unitsInStock} in stock
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(idx, e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-center font-bold"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Unit Price ($)</label>
                      <input
                        type="text"
                        disabled
                        value={`$${Number(item.unitPrice).toFixed(2)}`}
                        className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-right"
                      />
                    </div>

                    {/* Discount */}
                    <div className="col-span-4 md:col-span-1">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Disc %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(item.discount * 100)}
                        onChange={(e) => handleDiscountChange(idx, e.target.value)}
                        className="w-full px-2 py-2 text-xs bg-white border border-slate-200 rounded-lg text-center"
                      />
                    </div>

                    {/* Line Total & Remove */}
                    <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-4">
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-400">Total</span>
                        <span className="font-bold text-sm text-slate-800">${lineTotal.toFixed(2)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={items.length === 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded-lg hover:bg-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stock status indicator */}
                  {item.productId && (
                    <div className="mt-2 text-[11px] flex items-center gap-2">
                      {isOverStock ? (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Stock Error: Only {item.availableStock} units available in warehouse!
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          In Stock: {item.availableStock} available
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pricing Totals & Freight */}
          <div className="pt-4 border-t border-slate-100 flex flex-col items-end gap-2 text-sm">
            <div className="flex justify-between w-72 text-slate-500">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between w-72 text-slate-500">
              <span className="flex items-center gap-1">Freight Fee ($):</span>
              <input
                type="number"
                step="0.50"
                min="0"
                value={freight}
                onChange={(e) => setFreight(e.target.value)}
                className="w-24 px-2.5 py-1 text-xs text-right bg-white border border-slate-200 rounded-lg font-semibold text-slate-800"
              />
            </div>

            <div className="flex justify-between w-72 border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
              <span>Order Grand Total:</span>
              <span className="text-blue-600 text-lg">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || items.every((i) => !i.productId)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{submitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
