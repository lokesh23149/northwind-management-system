import React from 'react';
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
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        stats={stats} 
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar 
          title={title} 
          onRefresh={onRefresh} 
          onNewOrder={onNewOrder}
          stats={stats} 
        />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
