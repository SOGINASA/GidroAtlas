import React from 'react';
import AdminDesktopSidebar from './AdminDesktopSidebar';
import AdminBottomNav from './AdminBottomNav';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AdminDesktopSidebar />

      {/* Main Content - отступ слева на desktop, отступ снизу на mobile */}
      <div className="lg:pl-72 pb-[90px] lg:pb-0 w-full overflow-x-hidden">
        
        <main className="min-h-screen w-full max-w-full">
          {children}
        </main>
      </div>

      <AdminBottomNav />
    </div>
  );
};

export default AdminLayout;