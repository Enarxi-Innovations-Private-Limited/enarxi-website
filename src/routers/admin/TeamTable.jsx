import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Eye, EyeOff, GripVertical, Loader2 } from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  writeBatch,
  addDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast, Toaster } from 'react-hot-toast';
import { extractPublicId, deleteFromCloudinary } from '@/utils/uploadToCloudinary';
import AddEditTeamModal from './AddEditTeamModal';
import { logAdminActivity } from '@/utils/adminActivityLogger';
import { useAuth } from '@/AuthProvider';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Row Component
const SortableRow = ({ member, onEdit, onDelete, onToggleVisibility }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="hover:bg-gray-50 transition-colors duration-200"
    >
      {/* Drag Handle */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="h-5 w-5" />
        </div>
      </td>

      {/* Employee Name */}
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-[#0A1524]">
          {member.name || 'Unnamed'}
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">{member.role || 'N/A'}</div>
      </td>

      {/* Visibility Toggle */}
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onToggleVisibility(member)}
          className="flex items-center space-x-2"
        >
          {member.visibility ? (
            <Eye className="h-5 w-5 text-green-600" />
          ) : (
            <EyeOff className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </td>

      {/* Updated At */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(member.updatedAt)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => onEdit(member)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-blue-600 hover:text-blue-900 flex items-center transition-colors duration-200"
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </motion.button>
          <span className="text-gray-300">|</span>
          <motion.button
            onClick={() => onDelete(member)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-red-600 hover:text-red-900 flex items-center transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </motion.button>
        </div>
      </td>
    </tr>
  );
};

const TeamTable = () => {
  const { firebaseUser } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'teamMembers'), orderBy('order', 'asc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const members = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeamMembers(members);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching team members:', error);
        toast.error('Failed to load team members');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = teamMembers.findIndex((m) => m.id === active.id);
    const newIndex = teamMembers.findIndex((m) => m.id === over.id);

    const reorderedMembers = arrayMove(teamMembers, oldIndex, newIndex);

    // Optimistically update UI
    setTeamMembers(reorderedMembers);

    // Persist to Firestore
    try {
      const batch = writeBatch(db);
      reorderedMembers.forEach((member, index) => {
        const memberRef = doc(db, 'teamMembers', member.id);
        batch.update(memberRef, {
          order: index,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
      // Revert on error
      setTeamMembers(teamMembers);
    }
  };

  // Toggle visibility
  const handleToggleVisibility = async (member) => {
    try {
      const memberRef = doc(db, 'teamMembers', member.id);
      await updateDoc(memberRef, {
        visibility: !member.visibility,
        updatedAt: serverTimestamp(),
      });
      
      // Log activity
      if (firebaseUser) {
        await logAdminActivity(
          firebaseUser.uid,
          firebaseUser.displayName || firebaseUser.email,
          'updated_team_visibility',
          `${!member.visibility ? 'Showed' : 'Hidden'} team member: ${member.name}`,
          { memberId: member.id, memberName: member.name, visibility: !member.visibility }
        );
      }
      
      toast.success(
        `Team member ${!member.visibility ? 'shown' : 'hidden'} successfully`
      );
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  // Handle delete with atomic Cloudinary deletion
  const handleDelete = async (member) => {
    const confirmMessage = `Are you sure you want to delete "${member.name}"? This will permanently delete the image from Cloudinary and the member from the database.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    const toastId = toast.loading('Starting deletion process...');

    try {
      // Step 1: Delete image from Cloudinary FIRST
      if (member.images && member.images.length > 0) {
        toast.loading('Deleting image from Cloudinary...', { id: toastId });

        const imageData = member.images[0];
        const publicId = imageData.publicId || extractPublicId(imageData.url);

        if (!publicId) {
          toast.dismiss(toastId);
          toast.error('Could not extract image public_id. Aborting deletion.');
          return;
        }

        const result = await deleteFromCloudinary(publicId);

        if (!result.success) {
          toast.dismiss(toastId);
          toast.error(
            `Failed to delete image from Cloudinary. Member was NOT deleted to maintain data integrity.`
          );
          return;
        }

        console.log(`✅ Deleted image from Cloudinary: ${publicId}`);
      }

      // Step 2: Delete member from Firestore
      toast.loading('Deleting member from database...', { id: toastId });
      await deleteDoc(doc(db, 'teamMembers', member.id));
      console.log(`✅ Deleted member from Firestore: ${member.id}`);

      // Log activity
      if (firebaseUser) {
        await logAdminActivity(
          firebaseUser.uid,
          firebaseUser.displayName || firebaseUser.email,
          'deleted_team_member',
          `Deleted team member: ${member.name}`,
          { memberId: member.id, memberName: member.name, role: member.role }
        );
      }

      toast.dismiss(toastId);
      toast.success(`Team member "${member.name}" deleted successfully!`);
    } catch (error) {
      console.error('Error during deletion:', error);
      toast.dismiss(toastId);
      toast.error(`Failed to delete: ${error.message}`);
    }
  };

  // Open modal for add
  const handleAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1524] mb-2">Our Team</h2>
            <p className="text-gray-600">Manage your team members displayed on the About Us page.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No team members yet. Add your first member!</p>
          </div>
        ) : (
          <motion.div
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="overflow-x-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {/* Drag handle column */}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visibility
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <SortableContext
                    items={teamMembers.map((m) => m.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <motion.tbody
                      className="bg-white divide-y divide-gray-200"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {teamMembers.map((member) => (
                        <SortableRow
                          key={member.id}
                          member={member}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onToggleVisibility={handleToggleVisibility}
                        />
                      ))}
                    </motion.tbody>
                  </SortableContext>
                </table>
              </DndContext>
            </div>
          </motion.div>
        )}

        {/* Team Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-2xl font-bold text-[#0A1524]">
              {teamMembers.length}
            </div>
            <div className="text-sm text-gray-600">Total Team Members</div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-2xl font-bold text-[#0A1524]">
              {teamMembers.filter((m) => m.visibility).length}
            </div>
            <div className="text-sm text-gray-600">Visible on Website</div>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      <AddEditTeamModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMember(null);
        }}
        member={editingMember}
        existingMembersCount={teamMembers.length}
      />
    </>
  );
};

export default TeamTable;
