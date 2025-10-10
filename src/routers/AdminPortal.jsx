import React, { useState } from "react";
import logout from "@/assets/logout.png";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./admin/Sidebar";
import DashboardStats from "./admin/DashboardStats";
import StaffTable from "./admin/StaffTable";
import TeamTable from "./admin/TeamTable";
import BlogsTable from "./admin/BlogsTable";
import ReviewsTable from "./admin/ReviewsTable";

import { useAuth } from "@/AuthProvider";
import Logout from "@/Logout";

const AdminPortal = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {user} = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardStats />;
      case "staff":
        return <StaffTable />;
      case "team":
        return <TeamTable />;
      case "blogs":
        return <BlogsTable />;
      case "reviews":
        return <ReviewsTable />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-[#0A1524] ml-2 lg:ml-0">
                {activeSection === "dashboard" && "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {user && (
                <span className="text-sm font-medium text-gray-700">
                  {user.displayName || user.email?.split('@')[0] || 'Admin'}
                </span>
              )}
              <div className="text-sm text-gray-500">Admin Portal</div> 
              {user && <Logout/>}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;
