import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast, Toaster } from 'react-hot-toast';
import { deleteFromCloudinary } from '@/utils/uploadToCloudinary';
import GalleryTile from './gallery/GalleryTile';
import AddPostTile from './gallery/AddPostTile';
import GalleryForm from './gallery/GalleryForm';
import DeleteConfirmModal from './gallery/DeleteConfirmModal';
import { logAdminActivity } from '@/utils/adminActivityLogger';
import { useAuth } from '@/AuthProvider';

const GalleryTable = () => {
  const { firebaseUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);

  // Real-time listener for gallery posts
  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const galleryPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(galleryPosts);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching gallery posts:', error);
        toast.error('Failed to load gallery posts');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Toggle visibility
  const handleToggleVisibility = async (post) => {
    try {
      const postRef = doc(db, 'gallery', post.id);
      await updateDoc(postRef, {
        visibility: !post.visibility,
        updatedAt: serverTimestamp(),
      });
      
      // Log activity
      if (firebaseUser) {
        await logAdminActivity(
          firebaseUser.uid,
          firebaseUser.displayName || firebaseUser.email,
          'updated_gallery_visibility',
          `${!post.visibility ? 'Showed' : 'Hidden'} gallery post: ${post.title}`,
          { postId: post.id, postTitle: post.title, visibility: !post.visibility }
        );
      }
      
      toast.success(
        `Gallery post ${!post.visibility ? 'shown' : 'hidden'} successfully`
      );
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  // Handle delete with atomic Cloudinary deletion
  const handleDeleteConfirm = async () => {
    if (!deletingPost) return;

    const toastId = toast.loading('Starting deletion process...');

    try {
      const imagesToDelete = [];
      
      // Collect all images (thumbnail + images array)
      if (deletingPost.thumbnail?.public_id) {
        imagesToDelete.push({
          public_id: deletingPost.thumbnail.public_id,
          type: 'thumbnail'
        });
      }
      
      if (deletingPost.images && deletingPost.images.length > 0) {
        deletingPost.images.forEach((img, idx) => {
          if (img.public_id) {
            imagesToDelete.push({
              public_id: img.public_id,
              type: 'image',
              index: idx
            });
          }
        });
      }

      // Step 1: Delete all images from Cloudinary FIRST
      if (imagesToDelete.length > 0) {
        toast.loading(`Deleting ${imagesToDelete.length} image(s) from Cloudinary...`, { id: toastId });
        
        let deletedCount = 0;
        let failedCount = 0;
        
        for (let i = 0; i < imagesToDelete.length; i++) {
          const { public_id, type } = imagesToDelete[i];
          
          try {
            toast.loading(`Deleting ${type} ${i + 1}/${imagesToDelete.length}...`, { id: toastId });
            
            const result = await deleteFromCloudinary(public_id);
            
            if (result.success) {
              deletedCount++;
              console.log(`✅ Deleted ${type} from Cloudinary: ${public_id}`);
            } else {
              failedCount++;
              console.warn(`⚠️ Failed to delete ${type}: ${public_id}`, result);
            }
          } catch (imgError) {
            failedCount++;
            console.error(`❌ Error deleting ${type} from Cloudinary:`, imgError);
          }
        }
        
        // If all images failed to delete, abort Firestore deletion
        if (failedCount > 0 && deletedCount === 0) {
          toast.dismiss(toastId);
          toast.error(
            `Failed to delete ${failedCount} image(s) from Cloudinary. Post was NOT deleted to maintain data integrity.`,
            { duration: 6000 }
          );
          setDeletingPost(null);
          return;
        }
        
        if (failedCount > 0) {
          console.warn(`⚠️ ${failedCount} image(s) failed to delete from Cloudinary`);
        }
      }

      // Step 2: Delete post from Firestore (only after Cloudinary deletion)
      toast.loading('Deleting post from database...', { id: toastId });
      await deleteDoc(doc(db, 'gallery', deletingPost.id));
      console.log(`✅ Deleted post from Firestore: ${deletingPost.id}`);

      // Log activity
      if (firebaseUser) {
        await logAdminActivity(
          firebaseUser.uid,
          firebaseUser.displayName || firebaseUser.email,
          'deleted_gallery_post',
          `Deleted gallery post: ${deletingPost.title}`,
          { 
            postId: deletingPost.id, 
            postTitle: deletingPost.title,
            imagesDeleted: imagesToDelete.length 
          }
        );
      }

      toast.dismiss(toastId);
      toast.success(
        `Gallery post "${deletingPost.title}" and ${imagesToDelete.length} image(s) deleted successfully!`,
        { duration: 4000 }
      );
      
      setDeletingPost(null);
    } catch (error) {
      console.error('Error during deletion:', error);
      toast.dismiss(toastId);
      toast.error(`Failed to delete: ${error.message}`);
      setDeletingPost(null);
    }
  };

  // Open form for add
  const handleAdd = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  // Open form for edit
  const handleEdit = (post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  // Open delete confirmation
  const handleDelete = (post) => {
    setDeletingPost(post);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const tileVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1524] mb-2">Gallery Management</h2>
            <p className="text-gray-600">Manage gallery posts showcasing your work.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Add New Post Tile */}
              <motion.div variants={tileVariants}>
                <AddPostTile onClick={handleAdd} />
              </motion.div>

              {/* Gallery Post Tiles */}
              {posts.map((post) => (
                <motion.div key={post.id} variants={tileVariants}>
                  <GalleryTile
                    post={post}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleVisibility={handleToggleVisibility}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Gallery Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <div className="text-2xl font-bold text-[#0A1524]">
                  {posts.length}
                </div>
                <div className="text-sm text-gray-600">Total Gallery Posts</div>
              </div>
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <div className="text-2xl font-bold text-[#0A1524]">
                  {posts.filter((p) => p.visibility).length}
                </div>
                <div className="text-sm text-gray-600">Visible on Website</div>
              </div>
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <div className="text-2xl font-bold text-[#0A1524]">
                  {posts.reduce((acc, post) => acc + (post.images?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Images</div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <GalleryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPost(null);
        }}
        post={editingPost}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        onConfirm={handleDeleteConfirm}
        postTitle={deletingPost?.title}
        imageCount={
          (deletingPost?.thumbnail ? 1 : 0) + 
          (deletingPost?.images?.length || 0)
        }
      />
    </>
  );
};

export default GalleryTable;
