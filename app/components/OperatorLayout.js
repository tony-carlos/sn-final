"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header/page";
import ProtectedRoute from "./ProtectedRoute";

const OperatorLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar is hidden on mobile by default

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col bg-gray-100 transition-all duration-300 ${
            sidebarOpen ? "ml-0" : "ml-0 md:ml-0" // Ensure no margin-left is applied
          } pt-16`}
        >
          {/* Header */}
          <Header onToggleSidebar={toggleSidebar} />

          {/* Page Content */}
          <main className="p-6 flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OperatorLayout;
