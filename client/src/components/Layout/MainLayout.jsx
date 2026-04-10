import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './MainLayout.css';

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-wrapper">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="main-content">
        <Topbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        
        <main className="content-body">
          <div className="container-fluid">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default MainLayout;
