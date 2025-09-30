import React, { useState } from "react";
import { LayoutDashboard, PenSquare, LogOut } from "lucide-react";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

import StaffDashboard from "@/components/staff/StaffDashboard";
import StaffBlogs from "@/components/staff/StaffBlogs";

const StaffPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <StaffDashboard />;
      case "blogs":
        return <StaffBlogs />;
      default:
        return <StaffDashboard />;
    }
  };
      const logoutStaff = async () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (!confirmLogout) return;
      try {
        await signOut(auth);
        console.log("Staff logged out successfully.");
        // window.location.href = "/stafflogin";
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

  const NavItem = ({ id, icon, label, isLogout }) => (
    <li
      className={`cursor-pointer p-3 rounded-lg flex items-center transition-all duration-200 ${
        isLogout
          ? "text-red-600 hover:bg-red-100 hover:text-red-800"
          : activeTab === id
          ? "bg-blue-600 text-white shadow-lg"
          : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
      }`}
      onClick={() => {
        if (isLogout) {
          // TODO: hook in your logout logic here
          logoutStaff();
        } else {
          setActiveTab(id);
        }
      }}
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </li>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Staff Portal
        </h1>
        <nav className="flex-1">
          <ul className="space-y-2">
            <NavItem
              id="dashboard"
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
            />
            <NavItem id="blogs" icon={<PenSquare size={20} />} label="Blogs" />
          </ul>
        </nav>

        {/* Logout button fixed at bottom */}
        <nav>
          <ul>
            <NavItem
              id="logout"
              icon={<LogOut size={20} />}
              label="Logout"
              isLogout
            />
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

export default StaffPortal;
