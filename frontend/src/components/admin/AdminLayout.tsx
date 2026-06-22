import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children, title }: { children: React.ReactNode, title?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-theme min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
