import React, { useState, useEffect } from "react";
import logout from "@/assets/logout.png";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "./admin/Sidebar";
import DashboardStats from "./admin/DashboardStats";
import StaffTable from "./admin/StaffTable";
import TeamTable from "./admin/TeamTable";
import BlogsTable from "./admin/BlogsTable";
import ReviewsTable from "./admin/ReviewsTable";
import GalleryTable from "./admin/GalleryTable";

import { useAuth } from "@/AuthProvider";
import Logout from "@/routers/admin/Logout";
import BrandedLoader from "@/components/shared/BrandedLoader";
import AccessDenied from "@/components/shared/AccessDenied";
import OfflineIndicator from "@/components/shared/OfflineIndicator";

const AdminPortal = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, firebaseUser, role, loading, isOnline } = useAuth();

  // Handle navigation from quick actions
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveSection(location.state.activeTab);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  // Show loader while checking auth
  if (loading) {
    return <BrandedLoader message="Loading Admin Portal..." isOffline={!isOnline} />;
  }

  // Show access denied if not admin
  if (!loading && role !== 'admin') {
    return (
      <AccessDenied
        title="Access Denied"
        message="Not an admin. Please login as an admin."
        backPath="/admin-login"
        backText="Go to Admin Login"
      />
    );
  }


  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardStats setActiveSection={setActiveSection} />;
      case "staff":
        return <StaffTable setActiveSection={setActiveSection} />;
      case "team":
        return <TeamTable setActiveSection={setActiveSection} />;
      case "blogs":
        return <BlogsTable setActiveSection={setActiveSection} />;
      case "reviews":
        return <ReviewsTable setActiveSection={setActiveSection} />;
      case "gallery":
        return <GalleryTable setActiveSection={setActiveSection} />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <>
      {/* Offline Indicator */}
      <OfflineIndicator />

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
                <h1 className="text-2xl text-poppins text-weight-600 text-[#0A1524] ml-2 lg:ml-0">
                  {activeSection === "dashboard" && "Dashboard"}
                  {activeSection === "staff" && "Staff Management"}
                  {activeSection === "team" && "Team Members"}
                  {activeSection === "blogs" && "Blog Management"}
                  {activeSection === "reviews" && "Customer Reviews"}
                  {activeSection === "gallery" && "Gallery Management"}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                {user && (
                  <span className="text-sm text-poppins text-weight-500 text-gray-700">
                    {firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin'}
                  </span>
                )}
                <div className="text-sm text-poppins text-weight-500 text-gray-500">Admin Portal</div>
                {user && <Logout />}
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
    </>
  );
};

export default AdminPortal;
