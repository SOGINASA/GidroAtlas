import React from 'react';
import GuestDesktopSidebar from './GuestDesktopSidebar';
import GuestBottomNav from './GuestBottomNav';

const GuestLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Desktop Sidebar */}
      <GuestDesktopSidebar />

      {/* Main Content */}
      <div className="lg:pl-72 pb-[90px] lg:pb-0 w-full overflow-x-hidden">
        <main>{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <GuestBottomNav />
    </div>
  );
};

export default GuestLayout;