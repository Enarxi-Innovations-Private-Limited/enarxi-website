import React from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, FileText, Star, X, Images } from "lucide-react";

const Sidebar = ({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "staff",
      label: "Staff Management",
      icon: Users,
    },
    {
      id: "team",
      label: "Our Team",
      icon: Users,
    },
    {
      id: "blogs",
      label: "Blog Review Section",
      icon: FileText,
    },
    {
      id: "reviews",
      label: "Customer Review Section",
      icon: Star,
    },
    {
      id: "gallery",
      label: "Gallery Management",
      icon: Images,
    },
  ];

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gray-900 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 py-6">
            <h2 className="text-xl text-poppins text-weight-700 text-white">Enarxi Admin</h2>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`group flex items-center px-2 py-2 text-sm text-poppins text-weight-500 rounded-md w-full text-left transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  {item.label}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 lg:hidden"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-6">
            <h2 className="text-xl text-poppins text-weight-700 text-white">Enarxi Admin</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`group flex items-center px-2 py-2 text-sm text-poppins text-weight-500 rounded-md w-full text-left transition-colors duration-200 ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  {item.label}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
