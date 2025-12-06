import React from 'react';
import ExpertDesktopSidebar from './ExpertDesktopSidebar';
import ExpertBottomNav from './ExpertBottomNav';

const ExpertLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Desktop Sidebar - показывается только на lg+ */}
      <ExpertDesktopSidebar />

      {/* Main Content - отступ слева на desktop, отступ снизу на mobile */}
      <div className="lg:pl-72 pb-[90px] lg:pb-0 w-full overflow-x-hidden">
        <main className="min-h-screen w-full max-w-full">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - показывается только на мобильных */}
      <ExpertBottomNav />
    </div>
  );
};

export default ExpertLayout;