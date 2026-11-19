import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Toast from '../common/Toast';

export default function Layout({ 
  children, 
  currentPage, 
  setCurrentPage, 
  title, 
  onRefresh, 
  onNewOrder,
  toast, 
  setToast,
  stats 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false); // close sidebar on mobile after navigation
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={handleNav} 
        stats={stats}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar 
          title={title} 
          onRefresh={onRefresh} 
          onNewOrder={onNewOrder}
          stats={stats}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
