import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, User, Loader2, Plus } from 'lucide-react';
import { useStaff } from '@/hooks/useStaff';
import AddStaffModal from './AddStaffModal';
import ModifyStaffModal from './ModifyStaffModal';
import { toast, Toaster } from 'react-hot-toast';

const StaffTable = () => {
  const { staff, loading, error, fetchStaff, updateStaff } = useStaff();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Debug: Log staff state changes

  const handleModify = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsModifyModalOpen(true);
  };

  const handleUpdateStaff = async (staffId, updatedData) => {
    await updateStaff(staffId, updatedData);
    setIsModifyModalOpen(false);
  };

  const handleDeleteStaff = (staffId) => {
    console.warn(
      `Delete action for ${staffId} requires a backend implementation (e.g., Firebase Cloud Function) for security.`
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6 text-poppins">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1524] mb-2">Staff Management</h2>
            <p className="text-gray-600">Manage your team members and their roles.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Staff
          </motion.button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
            {error}
          </div>
        ) : (
          <>
            {/* Staff Table */}
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Joined On</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staff.length > 0 ? (
                    staff.map((member, idx) => {
                      return (
                        <tr key={member.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900">{member.name || "N/A"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{member.email || "N/A"}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                              member.role === 'employee'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {member.role || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                              member.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {member.status || "inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {member.createdAt?.toDate ? member.createdAt.toDate().toLocaleDateString() : "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleModify(member)}
                              className="text-blue-600 hover:text-blue-900 flex items-center transition-colors duration-200 font-medium"
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Modify
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-gray-400 py-8">
                        <div className="space-y-2">
                          <p className="font-medium">No staff members found</p>
                          <p className="text-sm">Only users with role "employee" or "intern" are shown here.</p>
                          <p className="text-sm">Click "Add Staff" to create a new staff member.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

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
          </>
        )}
      </div>

      {/* Modals */}
      <AddStaffModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {selectedStaff && (
        <ModifyStaffModal
          isOpen={isModifyModalOpen}
          onClose={() => setIsModifyModalOpen(false)}
          staffMember={selectedStaff}
          onUpdate={handleUpdateStaff}
          onDelete={handleDeleteStaff}
        />
      )}
    </>
  );
};

export default StaffTable;