import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, User, Loader2 } from 'lucide-react';
import { useStaff } from '@/hooks/useStaff';
import AddStaffModal from './AddStaffModal';

const StaffTable = () => {
  const { staff, loading, error, fetchStaff } = useStaff();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleModify = (staffId, staffName) => {
    console.log(`Modify action for staff ID: ${staffId}, Name: ${staffName}`);
    // Future implementation: Open an edit modal here
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1524] mb-2">Staff Management</h2>
            <p className="text-gray-600">Manage your team members and their roles.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
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
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <motion.tbody
                className="bg-white divide-y divide-gray-200"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-500 mx-auto" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : (
                  staff.map((staffMember) => (
                    <motion.tr
                      key={staffMember.id}
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
                            <div className="text-sm font-medium text-[#0A1524]">{staffMember.name}</div>
                            <div className="text-sm text-gray-500">{staffMember.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          staffMember.role === 'employee'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {staffMember.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          staffMember.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {staffMember.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {staffMember.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <motion.button
                          onClick={() => handleModify(staffMember.id, staffMember.name)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-600 hover:text-blue-900 flex items-center transition-colors duration-200"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Modify
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                )}
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
              {staff.filter(s => s.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Staff</div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-2xl font-bold text-[#0A1524]">
              {staff.filter(s => s.role === 'employee').length}
            </div>
            <div className="text-sm text-gray-600">Employees</div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-2xl font-bold text-[#0A1524]">
              {staff.filter(s => s.role === 'intern').length}
            </div>
            <div className="text-sm text-gray-600">Interns</div>
          </div>
        </motion.div>
      </div>
      <AddStaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default StaffTable;