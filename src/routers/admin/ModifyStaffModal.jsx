import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { updateUserEmail, updateUserPassword, deleteUser } from '@/lib/api';
import { toast } from 'react-hot-toast';

const ModifyStaffModal = ({ isOpen, onClose, staffMember, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    status: 'active',
  });
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);

  useEffect(() => {
    if (staffMember) {
      setFormData({
        name: staffMember.name || '',
        email: staffMember.email || '',
        role: staffMember.role || 'employee',
        status: staffMember.status || 'active',
      });
      setNewEmail(staffMember.email || '');
    } else {
      // Reset form when modal closes
      setFormData({
        name: '',
        email: '',
        role: 'employee',
        status: 'active',
      });
      setNewEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setShowEmailEdit(false);
      setShowPasswordEdit(false);
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

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === staffMember.email) {
      toast.error('Please enter a different email');
      return;
    }

    setIsUpdatingEmail(true);
    try {
      await updateUserEmail(staffMember.id, newEmail);
      toast.success('Email updated successfully');
      setShowEmailEdit(false);
      // Update local form data
      setFormData(prev => ({ ...prev, email: newEmail }));
      // Refresh the staff list
      if (onUpdate) {
        onUpdate(staffMember.id, { email: newEmail });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update email');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 12) {
      toast.error('Password must be at least 12 characters long');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateUserPassword(staffMember.id, newPassword);
      toast.success('Password updated successfully');
      setShowPasswordEdit(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm(`Are you sure you want to delete ${staffMember.name}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUser(staffMember.id);
      toast.success('User deleted successfully');
      onClose();
      // Refresh the staff list
      if (onDelete) {
        onDelete(staffMember.id);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
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

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {!showEmailEdit ? (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={formData.email}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                    disabled
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailEdit(true)}
                    className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new email"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUpdateEmail}
                      disabled={isUpdatingEmail}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isUpdatingEmail && <Loader2 className="w-4 h-4 animate-spin" />}
                      Update Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmailEdit(false);
                        setNewEmail(staffMember.email);
                      }}
                      disabled={isUpdatingEmail}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              {!showPasswordEdit ? (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value="********"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                    disabled
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordEdit(true)}
                    className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password (min 12 chars)"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUpdatePassword}
                      disabled={isUpdatingPassword}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isUpdatingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordEdit(false);
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      disabled={isUpdatingPassword}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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

            <div className="flex justify-between items-center pt-6 gap-4">
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete User
              </button>
              <div className="flex gap-2">
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
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModifyStaffModal;
