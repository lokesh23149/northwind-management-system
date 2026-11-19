import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, SlidersHorizontal, AlertTriangle, Layers, DollarSign } from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';

export default function ProductsPage({
  products,
  categories,
  loading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  lowStockOnly,
  setLowStockOnly,
  onSaveProduct,
  onUpdateStock,
  onDeleteProduct,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const initialForm = {
    productName: '',
    categoryId: '',
    supplierId: '1',
    quantityPerUnit: '',
    unitPrice: '',
    unitsInStock: 0,
    unitsOnOrder: 0,
    reorderLevel: 10,
    discontinued: '0',
  };

  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      productName: prod.productName || '',
      categoryId: prod.categoryId || '',
      supplierId: prod.supplierId || '1',
      quantityPerUnit: prod.quantityPerUnit || '',
      unitPrice: prod.unitPrice !== undefined ? prod.unitPrice : '',
      unitsInStock: prod.unitsInStock !== undefined ? prod.unitsInStock : 0,
      unitsOnOrder: prod.unitsOnOrder !== undefined ? prod.unitsOnOrder : 0,
      reorderLevel: prod.reorderLevel !== undefined ? prod.reorderLevel : 10,
      discontinued: prod.discontinued || '0',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenStockModal = (prod) => {
    setStockModalProduct(prod);
    setNewStockVal(prod.unitsInStock);
  };

  const handleSaveStock = (e) => {
    e.preventDefault();
    if (stockModalProduct && newStockVal !== '') {
      onUpdateStock(stockModalProduct.productId, Number(newStockVal));
      setStockModalProduct(null);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.productName.trim()) errors.productName = 'Product name is required';
    if (formData.unitPrice === '' || Number(formData.unitPrice) < 0) {
      errors.unitPrice = 'Valid non-negative price is required';
    }
    if (formData.unitsInStock === '' || Number(formData.unitsInStock) < 0) {
      errors.unitsInStock = 'Stock cannot be negative';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      supplierId: formData.supplierId ? Number(formData.supplierId) : null,
      unitPrice: Number(formData.unitPrice),
      unitsInStock: Number(formData.unitsInStock),
      unitsOnOrder: Number(formData.unitsOnOrder),
      reorderLevel: Number(formData.reorderLevel),
    };

    onSaveProduct(payload, editingProduct?.productId);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm text-slate-700"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          {/* Low Stock Filter Button */}
          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl border whitespace-nowrap transition-all ${
              lowStockOnly
                ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${lowStockOnly ? 'text-rose-600' : 'text-slate-400'}`} />
            <span>Low Stock Only</span>
          </button>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[620px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Product</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden sm:table-cell">Category</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Price</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Stock Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center hidden md:table-cell">Reorder Level</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">State</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {products && products.length > 0 ? (
                  products.map((prod) => {
                    const isLow = prod.lowStock || (prod.unitsInStock <= prod.reorderLevel);
                    const isDiscontinued = prod.discontinued === '1';

                    return (
                      <tr key={prod.productId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-semibold text-slate-800">{prod.productName}</div>
                            <div className="sm:hidden mt-1"><span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">{prod.categoryName || 'General'}</span></div>
                            <div className="text-xs text-slate-400">
                              ID: #{prod.productId} {prod.quantityPerUnit ? `• ${prod.quantityPerUnit}` : ''}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                            {prod.categoryName || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-semibold text-slate-800">
                          ${prod.unitPrice ? Number(prod.unitPrice).toFixed(2) : '0.00'}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center gap-2">
                            <span className={`font-bold text-sm ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>
                              {prod.unitsInStock} units
                            </span>
                            <button
                              onClick={() => handleOpenStockModal(prod)}
                              title="Adjust Stock"
                              className="px-2 py-0.5 text-[11px] font-medium text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                            >
                              Adjust
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-center text-xs text-slate-500 font-mono hidden md:table-cell">
                          {prod.reorderLevel}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {isDiscontinued ? (
                            <Badge variant="danger">Discontinued</Badge>
                          ) : isLow ? (
                            <Badge variant="warning">Low Stock</Badge>
                          ) : (
                            <Badge variant="success">Active</Badge>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              title="Edit Product"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(prod)}
                              title="Delete Product"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400 text-sm">
                      No products match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit Product: ${editingProduct.productName}` : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className={`w-full px-3 py-2 text-sm bg-white border rounded-xl focus:ring-2 focus:ring-blue-500/20 ${
                formErrors.productName ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {formErrors.productName && <p className="text-[11px] text-rose-500 mt-1">{formErrors.productName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Packaging / Quantity Per Unit</label>
              <input
                type="text"
                placeholder="e.g. 10 boxes x 20 bags"
                value={formData.quantityPerUnit}
                onChange={(e) => setFormData({ ...formData, quantityPerUnit: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Unit Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-xl focus:ring-2 focus:ring-blue-500/20 ${
                  formErrors.unitPrice ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
              {formErrors.unitPrice && <p className="text-[11px] text-rose-500 mt-1">{formErrors.unitPrice}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Units in Stock <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.unitsInStock}
                onChange={(e) => setFormData({ ...formData, unitsInStock: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Reorder Level</label>
              <input
                type="number"
                min="0"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.discontinued === '1'}
                onChange={(e) => setFormData({ ...formData, discontinued: e.target.checked ? '1' : '0' })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Mark as Discontinued</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition-all"
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Adjust Stock Modal */}
      <Modal
        isOpen={!!stockModalProduct}
        onClose={() => setStockModalProduct(null)}
        title={`Adjust Stock: ${stockModalProduct?.productName}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveStock} className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 mb-3">
              Enter the new inventory count for this product. Current stock: <strong className="text-slate-800">{stockModalProduct?.unitsInStock}</strong> units.
            </p>
            <label className="block text-xs font-semibold text-slate-600 mb-1">New Units In Stock</label>
            <input
              type="number"
              min="0"
              required
              value={newStockVal}
              onChange={(e) => setNewStockVal(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStockModalProduct(null)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
            >
              Update Stock
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => onDeleteProduct(deleteConfirm.productId)}
        title="Delete Product"
        message={`Are you sure you want to delete ${deleteConfirm?.productName}? This will fail if the product is linked to existing order records.`}
      />
    </div>
  );
}
