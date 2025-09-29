import React, { useState } from 'react';
import { LayoutDashboard, PenSquare } from 'lucide-react';

import StaffDashboard from '@/components/staff/StaffDashboard';
import StaffBlogs from '@/components/staff/StaffBlogs';

const StaffPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StaffDashboard />;
      case 'blogs':
        return <StaffBlogs />;
      default:
        return <StaffDashboard />;
    }
  };

  const NavItem = ({ id, icon, label }) => (
    <li
      className={`cursor-pointer p-3 rounded-lg flex items-center transition-all duration-200 ${
        activeTab === id
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
      }`}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </li>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md p-4 space-y-2">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Staff Portal</h1>
        <nav>
          <ul>
            <NavItem id="dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem id="blogs" icon={<PenSquare size={20} />} label="Blogs" />
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default StaffPortal;
