import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminBottomNav from './AdminBottomNav';
import { useLocation } from 'react-router-dom';

export default function AdminLayout({ children, title }: { children: React.ReactNode, title?: string }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check window size for mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true); // Auto collapse on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="admin-theme min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex overflow-hidden transition-colors">
      
      {/* Desktop Sidebar (Hidden on Mobile) */}
      {!isMobile && (
        <AdminSidebar 
          isCollapsed={sidebarCollapsed} 
          setIsCollapsed={setSidebarCollapsed} 
        />
      )}

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out h-screen overflow-y-auto custom-scrollbar relative
          ${!isMobile ? (sidebarCollapsed ? 'ml-[80px]' : 'ml-[260px]') : 'mb-[70px]'}
        `}
      >
        {/* Desktop Header (Hidden on Mobile, or we can keep it for the User Profile) */}
        <AdminHeader 
          isMobile={isMobile}
          title={title}
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto pb-24 lg:pb-8">
          {title && !isMobile && (
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h1>
            </div>
          )}
          
          {/* Animated wrapper for smooth page transitions could go here */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Visible only on Mobile) */}
      {isMobile && (
        <AdminBottomNav currentPath={location.pathname} />
      )}

    </div>
  );
}
