import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, User } from 'lucide-react';

const StaffTable = () => {
  const staffData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Employee',
      status: 'Active',
      email: 'sarah.johnson@enarxi.com',
      joinDate: '2023-01-15',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Employee',
      status: 'Active',
      email: 'michael.chen@enarxi.com',
      joinDate: '2023-03-22',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Intern',
      status: 'Active',
      email: 'emily.rodriguez@enarxi.com',
      joinDate: '2024-01-10',
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Employee',
      status: 'Inactive',
      email: 'david.thompson@enarxi.com',
      joinDate: '2022-11-05',
    },
    {
      id: 5,
      name: 'Jessica Park',
      role: 'Intern',
      status: 'Active',
      email: 'jessica.park@enarxi.com',
      joinDate: '2024-02-01',
    },
  ];

  const handleModify = (staffId, staffName) => {
    console.log(`Modify action for staff ID: ${staffId}, Name: ${staffName}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1524] mb-2">Staff Management</h2>
          <p className="text-gray-600">Manage your team members and their roles.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <User className="h-4 w-4 mr-2" />
          Add Staff
        </motion.button>
      </div>

      <motion.div
        className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <motion.tbody
              className="bg-white divide-y divide-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {staffData.map((staff) => (
                <motion.tr
                  key={staff.id}
                  variants={rowVariants}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#0A1524]">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      staff.role === 'Employee' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      staff.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(staff.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <motion.button
                      onClick={() => handleModify(staff.id, staff.name)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-900 flex items-center transition-colors duration-200"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Modify
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      {/* Staff Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#0A1524]">
            {staffData.filter(staff => staff.status === 'Active').length}
          </div>
          <div className="text-sm text-gray-600">Active Staff</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#0A1524]">
            {staffData.filter(staff => staff.role === 'Employee').length}
          </div>
          <div className="text-sm text-gray-600">Employees</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#0A1524]">
            {staffData.filter(staff => staff.role === 'Intern').length}
          </div>
          <div className="text-sm text-gray-600">Interns</div>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffTable;
