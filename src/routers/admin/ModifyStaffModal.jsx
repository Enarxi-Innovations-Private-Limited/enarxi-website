import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

const ModifyStaffModal = ({ isOpen, onClose, staffMember, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    status: 'active',
  });

  useEffect(() => {
    if (staffMember) {
      setFormData({
        name: staffMember.name || '',
        email: staffMember.email || '',
        role: staffMember.role || 'employee',
        status: staffMember.status || 'active',
      });
    } else {
      // Reset form when modal closes
      setFormData({
        name: '',
        email: '',
        role: 'employee',
        status: 'active',
      });
    }
  }, [staffMember]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(staffMember.id, formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-[#0A1524] mb-6">Modify Staff: {staffMember.name}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                disabled
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <AlertTriangle size={16} className="text-yellow-500" title="Email cannot be changed from the client." />
              </div>
            </div>

            <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                    type="password" 
                    placeholder="********" 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" 
                    disabled 
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertTriangle size={16} className="text-yellow-500" title="Password cannot be changed from the client for security reasons." />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="employee">Employee</option>
                  <option value="intern">Intern</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* <div className="flex justify-between items-center pt-6"> */}
              {/* <button
                type="button"
                onClick={() => onDelete(staffMember.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete User
              </button> */}
              <div className="flex justify-between items-center pt-6 gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Changes
                </button>
              </div>
            {/* </div> */}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModifyStaffModal;
