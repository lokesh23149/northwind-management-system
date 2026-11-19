import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import CreateOrderPage from './pages/CreateOrderPage';
import DeliveriesPage from './pages/DeliveriesPage';

import { employeeService } from './services/employeeService';
import { productService } from './services/productService';
import { customerService } from './services/customerService';
import { orderService } from './services/orderService';
import { deliveryService } from './services/deliveryService';
import { dashboardService } from './services/dashboardService';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toast, setToast] = useState(null);

  // Global State
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  // Loaders & Submitting
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Search & Filter States
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [deliverySearch, setDeliverySearch] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await dashboardService.getStats();
      if (res && res.data) setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Fetch Reference Data (Categories & Shippers)
  const fetchReferenceData = useCallback(async () => {
    try {
      const [catsRes, shipsRes] = await Promise.all([
        productService.getCategories(),
        orderService.getShippers(),
      ]);
      if (catsRes && catsRes.data) setCategories(catsRes.data);
      if (shipsRes && shipsRes.data) setShippers(shipsRes.data);
    } catch (err) {
      console.error('Error fetching references:', err);
    }
  }, []);

  // Fetch Employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await employeeService.getAll(employeeSearch);
      if (res && res.data) setEmployees(res.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [employeeSearch]);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (productSearch) params.search = productSearch;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (lowStockOnly) params.lowStock = true;

      const res = await productService.getAll(params);
      if (res && res.data) setProducts(res.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [productSearch, selectedCategory, lowStockOnly]);

  // Fetch Customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await customerService.getAll(customerSearch);
      if (res && res.data) setCustomers(res.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [customerSearch]);

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (orderStatus) params.status = orderStatus;
      if (orderSearch) params.search = orderSearch;

      const res = await orderService.getAll(params);
      if (res && res.data) setOrders(res.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [orderStatus, orderSearch]);

  // Fetch Deliveries
  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (deliveryStatus) params.status = deliveryStatus;
      if (deliverySearch) params.search = deliverySearch;

      const res = await deliveryService.getAll(params);
      if (res && res.data) setDeliveries(res.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [deliveryStatus, deliverySearch]);

  // Load initial data and page-specific triggers
  useEffect(() => {
    fetchStats();
    fetchReferenceData();
  }, [fetchStats, fetchReferenceData]);

  useEffect(() => {
    if (currentPage === 'employees') {
      fetchEmployees();
    } else if (currentPage === 'products') {
      fetchProducts();
    } else if (currentPage === 'customers') {
      fetchCustomers();
    } else if (currentPage === 'orders') {
      fetchOrders();
    } else if (currentPage === 'deliveries') {
      fetchDeliveries();
    } else if (currentPage === 'create-order') {
      fetchCustomers();
      fetchProducts();
      fetchEmployees();
    } else if (currentPage === 'dashboard') {
      fetchStats();
      fetchOrders();
      fetchProducts();
    }
  }, [
    currentPage,
    fetchEmployees,
    fetchProducts,
    fetchCustomers,
    fetchOrders,
    fetchDeliveries,
    fetchStats,
  ]);

  const handleGlobalRefresh = () => {
    fetchStats();
    if (currentPage === 'employees') fetchEmployees();
    else if (currentPage === 'products') fetchProducts();
    else if (currentPage === 'customers') fetchCustomers();
    else if (currentPage === 'orders') fetchOrders();
    else if (currentPage === 'deliveries') fetchDeliveries();
    else if (currentPage === 'dashboard') {
      fetchOrders();
      fetchProducts();
    }
    showToast('Data refreshed');
  };

  // --- CRUD Handlers ---

  // Employee Handlers
  const handleSaveEmployee = async (payload, id) => {
    try {
      if (id) {
        await employeeService.update(id, payload);
        showToast('Employee updated successfully');
      } else {
        await employeeService.create(payload);
        showToast('Employee created successfully');
      }
      fetchEmployees();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await employeeService.delete(id);
      showToast('Employee deleted successfully');
      fetchEmployees();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Product Handlers
  const handleSaveProduct = async (payload, id) => {
    try {
      if (id) {
        await productService.update(id, payload);
        showToast('Product updated successfully');
      } else {
        await productService.create(payload);
        showToast('Product added successfully');
      }
      fetchProducts();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      await productService.updateStock(id, newStock);
      showToast('Stock quantity updated');
      fetchProducts();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productService.delete(id);
      showToast('Product deleted successfully');
      fetchProducts();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Customer Handlers
  const handleSaveCustomer = async (payload, id) => {
    try {
      if (id) {
        await customerService.update(id, payload);
        showToast('Customer details updated');
      } else {
        await customerService.create(payload);
        showToast('Customer registered successfully');
      }
      fetchCustomers();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await customerService.delete(id);
      showToast('Customer removed successfully');
      fetchCustomers();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Order Handlers
  const handleSubmitPurchaseOrder = async (orderPayload) => {
    try {
      setSubmitting(true);
      const res = await orderService.create(orderPayload);
      showToast(`Order #${res?.data?.orderId || ''} placed successfully! Inventory updated.`);
      fetchStats();
      setCurrentPage('orders');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.cancel(orderId);
      showToast(`Order #${orderId} cancelled and reserved stock restored.`);
      fetchOrders();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Delivery Handlers
  const handleUpdateDeliveryStatus = async (orderId, payload) => {
    try {
      await deliveryService.updateStatus(orderId, payload);
      showToast(`Shipping status updated for Order #${orderId}`);
      fetchDeliveries();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Determine current page title
  const pageTitles = {
    dashboard: 'Business Dashboard',
    employees: 'Employee Management',
    products: 'Product & Stock Management',
    customers: 'Customer Directory',
    orders: 'Customer Purchase Orders',
    'create-order': 'New Customer Purchase',
    deliveries: 'Delivery & Shipping Management',
  };

  return (
    <Layout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      title={pageTitles[currentPage] || 'Northwind Management'}
      onRefresh={handleGlobalRefresh}
      onNewOrder={currentPage !== 'create-order' ? () => setCurrentPage('create-order') : null}
      toast={toast}
      setToast={setToast}
      stats={stats}
    >
      {currentPage === 'dashboard' && (
        <DashboardPage
          stats={stats}
          recentOrders={orders}
          lowStockProducts={products.filter((p) => p.unitsInStock <= p.reorderLevel)}
          setCurrentPage={setCurrentPage}
          onQuickRestock={(prod) => {
            setCurrentPage('products');
            setProductSearch(prod.productName);
          }}
          onViewOrder={(order) => {
            setCurrentPage('orders');
            setOrderSearch(String(order.orderId));
          }}
        />
      )}

      {currentPage === 'employees' && (
        <EmployeesPage
          employees={employees}
          loading={loading}
          searchQuery={employeeSearch}
          setSearchQuery={setEmployeeSearch}
          onSaveEmployee={handleSaveEmployee}
          onDeleteEmployee={handleDeleteEmployee}
        />
      )}

      {currentPage === 'products' && (
        <ProductsPage
          products={products}
          categories={categories}
          loading={loading}
          searchQuery={productSearch}
          setSearchQuery={setProductSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          lowStockOnly={lowStockOnly}
          setLowStockOnly={setLowStockOnly}
          onSaveProduct={handleSaveProduct}
          onUpdateStock={handleUpdateStock}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {currentPage === 'customers' && (
        <CustomersPage
          customers={customers}
          loading={loading}
          searchQuery={customerSearch}
          setSearchQuery={setCustomerSearch}
          onSaveCustomer={handleSaveCustomer}
          onDeleteCustomer={handleDeleteCustomer}
        />
      )}

      {currentPage === 'orders' && (
        <OrdersPage
          orders={orders}
          loading={loading}
          searchQuery={orderSearch}
          setSearchQuery={setOrderSearch}
          selectedStatus={orderStatus}
          setSelectedStatus={setOrderStatus}
          onOpenCreateOrder={() => setCurrentPage('create-order')}
          onCancelOrder={handleCancelOrder}
        />
      )}

      {currentPage === 'create-order' && (
        <CreateOrderPage
          customers={customers}
          products={products}
          employees={employees}
          shippers={shippers}
          onBack={() => setCurrentPage('orders')}
          onSubmitOrder={handleSubmitPurchaseOrder}
          submitting={submitting}
        />
      )}

      {currentPage === 'deliveries' && (
        <DeliveriesPage
          deliveries={deliveries}
          shippers={shippers}
          loading={loading}
          searchQuery={deliverySearch}
          setSearchQuery={setDeliverySearch}
          selectedStatus={deliveryStatus}
          setSelectedStatus={setDeliveryStatus}
          onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
        />
      )}
    </Layout>
  );
}
