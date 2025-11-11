import React, { useState, useEffect, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { db } from "@/lib/firebase";
import { useAuth } from "@/AuthProvider";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { getImageDimensions, isAspectRatio16x9, validateImageFile } from "@/utils/imageCropUtils";
import CropImageModal from "@/components/CropImageModal";
import MultiImageUploadModal from "@/components/MultiImageUploadModal";
import { extractYouTubeLinks, isYouTubeUrl } from "@/utils/youtubeUtils";
import { useMediaStaging } from "@/hooks/useMediaStaging";
import { Youtube, Image, Eye, ArrowLeft, Loader2, Link as LinkIcon } from "lucide-react";
import BlogPreviewModal from "@/components/BlogPreviewModal";

// Import Tiptap extensions
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Link from "@tiptap/extension-link";
import { ImageBlock } from "@/extensions/ImageBlock";
import { YouTubeEmbed } from "@/extensions/YouTubeEmbed";

import "./tiptap.css";

// MenuBar component (same as StaffBlogs)
const MenuBar = memo(({ editor, onInsertImageBlock }) => {
  const [_, setForceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => setForceUpdate((val) => val + 1);
    editor.on("transaction", handleUpdate);
    return () => editor.off("transaction", handleUpdate);
  }, [editor]);

  if (!editor) return null;

  const handleYouTubeEmbed = () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');
    
    if (!selectedText) {
      alert('Please select a YouTube URL first');
      return;
    }
    
    if (!isYouTubeUrl(selectedText.trim())) {
      alert('Selected text is not a valid YouTube URL');
      return;
    }
    
    editor.chain().focus().deleteSelection().setYouTubeEmbed(selectedText.trim()).run();
  };

  const handleSetLink = () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');
    
    if (!selectedText) {
      alert('Please select text first to convert it to a link');
      return;
    }
    
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleUnsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="menu-bar">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive("paragraph") ? "is-active" : ""}>Paragraph</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}>H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}>H2</button>
      <button type="button" onClick={handleSetLink} className={editor.isActive("link") ? "is-active" : ""} title="Add hyperlink"><LinkIcon size={16} /> Link</button>
      {editor.isActive("link") && (
        <button type="button" onClick={handleUnsetLink} className="unlink-button" title="Remove link">Unlink</button>
      )}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""}>Bullet List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "is-active" : ""}>Ordered List</button>
      <button type="button" onClick={handleYouTubeEmbed} className="youtube-button" title="Convert selected YouTube URL to embed"><Youtube size={16} /> YouTube</button>
      <button type="button" onClick={onInsertImageBlock} className="image-block-button" title="Insert Image Block"><Image size={16} /> Image Block</button>
    </div>
  );
});

const StaffBlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [originalBlog, setOriginalBlog] = useState(null);
  const [formData, setFormData] = useState({ title: "", authorName: "", authorRole: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingFeaturedImage, setExistingFeaturedImage] = useState(null);
  const [featuredImageChanged, setFeaturedImageChanged] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageForCrop, setTempImageForCrop] = useState(null);
  const [showImageBlockModal, setShowImageBlockModal] = useState(false);
  const [currentImageBlockId, setCurrentImageBlockId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const mediaStaging = useMediaStaging();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1, 2] }),
      ListItem,
      OrderedList,
      BulletList,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      ImageBlock,
      YouTubeEmbed,
    ],
    content: "",
    editorProps: {
      attributes: { class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none" },
    },
  });

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      if (!user || !id) return;

      try {
        setLoading(true);
        const blogRef = doc(db, 'blogs', id);
        const blogSnap = await getDoc(blogRef);

        if (!blogSnap.exists()) {
          setMessage("Blog not found");
          setLoading(false);
          return;
        }

        const data = blogSnap.data();

        // Check if this blog belongs to the current user
        if (data.userId !== user.uid) {
          setMessage("You don't have permission to edit this blog");
          setLoading(false);
          return;
        }

        setOriginalBlog({ id: blogSnap.id, ...data });

        // Set form data
        setFormData({
          title: data.title || "",
          authorName: data.authorName || "",
          authorRole: data.authorRole || "",
        });

        // Set featured image
        if (data.images && data.images.length > 0) {
          const firstImage = data.images[0];
          const imageUrl = typeof firstImage === 'object' ? firstImage.url : firstImage;
          setExistingFeaturedImage(imageUrl);
          setImagePreview(imageUrl);
        }

        // Load content into editor with YouTube and image blocks restored
        if (editor && data.content) {
          let contentWithPlaceholders = data.content;

          // Restore YouTube embeds
          if (data.ytlinks && data.ytlinks.length > 0) {
            data.ytlinks.forEach((url, index) => {
              const placeholder = `<div id="yt${index}"></div>`;
              const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1] || '';
              const youtubeNode = `<div data-type="youtube-embed" data-url="${url}" data-video-id="${videoId}"></div>`;
              contentWithPlaceholders = contentWithPlaceholders.replace(placeholder, youtubeNode);
            });
          }

          // Restore image blocks with staged items
          if (data.imageBlocks) {
            Object.keys(data.imageBlocks).forEach((blockId) => {
              const images = data.imageBlocks[blockId];
              
              // Convert Cloudinary URLs to staged items
              const stagedItems = images && images.length > 0 ? images.map((img, idx) => ({
                id: `existing-${blockId}-${idx}`,
                file: null,
                previewUrl: typeof img === 'object' ? img.url : img,
                status: 'uploaded',
                isExisting: true,
                cloudinaryData: img,
                width: typeof img === 'object' ? img.width : 800,
                height: typeof img === 'object' ? img.height : 600,
                format: typeof img === 'object' ? img.format : 'jpg',
                fileName: typeof img === 'object' ? `image-${idx}.${img.format || 'jpg'}` : `image-${idx}.jpg`,
              })) : [];
              
              // Update media staging
              if (stagedItems.length > 0) {
                mediaStaging.updateStagedFiles(blockId, stagedItems);
              }
              
              // Replace placeholder with image block node including staged items
              const placeholder = `<div class="image-block" id="${blockId}"></div>`;
              const stagedItemsJson = JSON.stringify(stagedItems).replace(/"/g, '&quot;');
              const imageBlockNode = `<div data-type="image-block" data-id="${blockId}" data-staged-items="${stagedItemsJson}"></div>`;
              contentWithPlaceholders = contentWithPlaceholders.replace(placeholder, imageBlockNode);
            });
          }

          editor.commands.setContent(contentWithPlaceholders);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setMessage("Failed to load blog");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, user, editor]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      e.target.value = '';
      return;
    }

    try {
      const dimensions = await getImageDimensions(file);
      if (isAspectRatio16x9(dimensions.width, dimensions.height)) {
        const newPreview = URL.createObjectURL(file);
        // Revoke old preview URL to prevent memory leaks
        if (imagePreview && featuredImageChanged) {
          URL.revokeObjectURL(imagePreview);
        }
        setImageFile(file);
        setImagePreview(newPreview);
        setFeaturedImageChanged(true);
      } else {
        setTempImageForCrop(file);
        setShowCropModal(true);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedFile) => {
    const newPreview = URL.createObjectURL(croppedFile);
    // Revoke old preview URL
    if (imagePreview && featuredImageChanged) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(croppedFile);
    setImagePreview(newPreview);
    setFeaturedImageChanged(true);
    setShowCropModal(false);
    setTempImageForCrop(null);
  };

  const handleInsertImageBlock = () => {
    if (!editor) return;
    const blockId = `image-block-${Date.now()}`;
    editor.chain().focus().setImageBlock(blockId).run();
    setCurrentImageBlockId(blockId);
    setShowImageBlockModal(true);
  };

  const handleImageBlockComplete = (selectedImages) => {
    if (selectedImages && selectedImages.length > 0) {
      mediaStaging.stageFiles(currentImageBlockId, selectedImages);
    }
    setShowImageBlockModal(false);
    setCurrentImageBlockId(null);
  };

  const handlePreview = () => {
    if (!formData.title.trim()) {
      alert("Please enter a blog title before previewing");
      return;
    }
    if (!editor || editor.isEmpty) {
      alert("Please add some content before previewing");
      return;
    }
    setShowPreview(true);
  };

  const getPreviewData = useCallback(() => {
    if (!editor) return null;

    const editorJson = editor.getJSON();
    const youtubeLinks = [];
    const previewImageBlocks = {};
    
    const traverseNodes = (node) => {
      if (node.type === 'youtubeEmbed') {
        youtubeLinks.push(node.attrs.url);
      } else if (node.type === 'imageBlock') {
        const blockId = node.attrs.id;
        const stagedFiles = mediaStaging.getStagedBlock(blockId);
        if (stagedFiles && stagedFiles.length > 0) {
          previewImageBlocks[blockId] = stagedFiles;
        }
      }
      
      if (node.content) {
        node.content.forEach(traverseNodes);
      }
    };
    
    editorJson.content?.forEach(traverseNodes);
    
    let previewContent = editor.getHTML();
    
    youtubeLinks.forEach((url, index) => {
      const ytPattern = /<div[^>]*data-type="youtube-embed"[^>]*>.*?<\/div>/gi;
      previewContent = previewContent.replace(ytPattern, `<div id="yt${index}"></div>`);
    });
    
    Object.keys(previewImageBlocks).forEach((blockId) => {
      const imgPattern = new RegExp(`<div[^>]*data-type="image-block"[^>]*data-id="${blockId}"[^>]*>.*?<\/div>`, 'gi');
      previewContent = previewContent.replace(imgPattern, `<div class="image-block" id="${blockId}"></div>`);
    });

    return {
      title: formData.title,
      authorName: formData.authorName,
      authorRole: formData.authorRole,
      content: previewContent,
      featuredImage: imagePreview,
      imageBlocks: previewImageBlocks,
      ytlinks: youtubeLinks,
    };
  }, [editor, formData, imagePreview, mediaStaging]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("❌ You must be logged in to update a blog.");
      return;
    }

    if (!formData.title.trim() || !formData.authorName.trim() || !formData.authorRole.trim()) {
      setMessage("❌ Please fill in all required fields.");
      return;
    }

    if (!editor || editor.isEmpty) {
      setMessage("❌ Blog content cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setMessage("⏳ Updating blog...");

    try {
      // Step 1: Upload featured image if changed
      let uploadedImages = originalBlog.images || [];
      if (featuredImageChanged && imageFile) {
        setMessage("📤 Uploading thumbnail...");
        const result = await uploadToCloudinary(imageFile, "blogs");
        uploadedImages = [{
          url: result.url,
          publicId: result.publicId,
          width: result.width,
          height: result.height,
          format: result.format,
        }];
      }

      // Step 2: Upload image blocks
      setMessage("📤 Uploading image blocks...");
      const uploadedImageBlocks = {};
      const stagedBlocks = mediaStaging.stagedBlocks;

      for (const [blockId, stagedItems] of Object.entries(stagedBlocks)) {
        const blockImages = [];
        
        for (const item of stagedItems) {
          if (item.isExisting && item.cloudinaryData) {
            // Keep existing Cloudinary image
            blockImages.push(item.cloudinaryData);
          } else if (item.file) {
            // Upload new image
            const result = await uploadToCloudinary(item.file, "blogs");
            blockImages.push({
              url: result.url,
              publicId: result.publicId,
              width: result.width,
              height: result.height,
              format: result.format,
            });
          }
        }
        
        if (blockImages.length > 0) {
          uploadedImageBlocks[blockId] = blockImages;
        }
      }

      // Step 3: Extract YouTube links and clean content
      const editorJson = editor.getJSON();
      
      // Extract YouTube links from editor JSON
      const youtubeLinks = [];
      const traverseForYouTube = (node) => {
        if (node.type === 'youtubeEmbed' && node.attrs?.url) {
          youtubeLinks.push(node.attrs.url);
        }
        if (node.content) {
          node.content.forEach(traverseForYouTube);
        }
      };
      editorJson.content?.forEach(traverseForYouTube);
      
      let cleanedContent = editor.getHTML();
      
      // Replace YouTube embeds with placeholders
      if (youtubeLinks && youtubeLinks.length > 0) {
        youtubeLinks.forEach((url, index) => {
          const ytPattern = /<div[^>]*data-type="youtube-embed"[^>]*>.*?<\/div>/i;
          cleanedContent = cleanedContent.replace(ytPattern, `<div id="yt${index}"></div>`);
        });
      }
      
      // Replace image blocks with placeholders
      if (uploadedImageBlocks && Object.keys(uploadedImageBlocks).length > 0) {
        Object.keys(uploadedImageBlocks).forEach((blockId) => {
          const imgPattern = new RegExp(`<div[^>]*data-type="image-block"[^>]*data-id="${blockId}"[^>]*>.*?<\/div>`, 'i');
          cleanedContent = cleanedContent.replace(imgPattern, `<div class="image-block" id="${blockId}"></div>`);
        });
      }

      // Step 4: Update blog in Firestore
      setMessage("💾 Updating blog in database...");
      
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, {
        title: formData.title,
        authorName: formData.authorName,
        authorRole: formData.authorRole,
        content: cleanedContent,
        images: uploadedImages,
        ytlinks: youtubeLinks,
        imageBlocks: uploadedImageBlocks,
        status: 'pending', // Reset to pending for re-review
        updatedAt: serverTimestamp(),
      });

      setMessage("✅ Blog updated successfully! Redirecting...");
      mediaStaging.clearAll();
      
      setTimeout(() => {
        navigate('/staff');
      }, 1500);
    } catch (error) {
      console.error("Error updating blog:", error);
      setMessage(`❌ Error: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (message && !originalBlog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{message}</h1>
        <button
          onClick={() => navigate('/staff')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Staff Portal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/staff')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Back to My Blogs
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Edit Blog Post</h2>
          
          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.includes('✅') ? 'bg-green-100 text-green-800' :
              message.includes('❌') ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter blog title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Name *</label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Role *</label>
                <input
                  type="text"
                  name="authorRole"
                  value={formData.authorRole}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your role"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail (16:9 ratio)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">{featuredImageChanged ? 'New thumbnail:' : 'Current thumbnail:'}</p>
                  <img 
                    key={imagePreview}
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-md rounded-lg shadow" 
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blog Content *</label>
              <MenuBar editor={editor} onInsertImageBlock={handleInsertImageBlock} />
              <EditorContent editor={editor} className="border border-gray-300 rounded-lg p-4 min-h-[400px]" />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePreview}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Eye size={20} />
                Preview Blog
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? "Updating..." : "Update Blog Post"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showCropModal && tempImageForCrop && (
        <CropImageModal
          imageFile={tempImageForCrop}
          onCropComplete={handleCropComplete}
          onClose={() => {
            setShowCropModal(false);
            setTempImageForCrop(null);
          }}
        />
      )}

      {showImageBlockModal && (
        <MultiImageUploadModal
          onClose={() => {
            setShowImageBlockModal(false);
            setCurrentImageBlockId(null);
          }}
          onComplete={handleImageBlockComplete}
          blockId={currentImageBlockId}
          existingImages={mediaStaging.getStagedBlock(currentImageBlockId)}
        />
      )}

      {showPreview && (
        <BlogPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          previewData={getPreviewData()}
        />
      )}
    </div>
  );
};

export default StaffBlogEdit;
