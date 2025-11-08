import React, { useState, useEffect, useCallback, memo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/AuthProvider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { getImageDimensions, isAspectRatio16x9, validateImageFile } from "@/utils/imageCropUtils";
import CropImageModal from "@/components/CropImageModal";
import MultiImageUploadModal from "@/components/MultiImageUploadModal";
import { extractYouTubeLinks, isYouTubeUrl } from "@/utils/youtubeUtils";
import { useMediaStaging } from "@/hooks/useMediaStaging";
import { Youtube, Image, Eye, Copy, X } from "lucide-react";
import { toast, Toaster } from 'react-hot-toast';

// --- Import all required Tiptap extensions for customization ---
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Link from "@tiptap/extension-link";
import { ImageBlock } from "@/extensions/ImageBlock";
import { YouTubeEmbed } from "@/extensions/YouTubeEmbed";

// --- Import the CSS file ---
import "./tiptap.css";
import parse from 'html-react-parser';

//======================================================================
//  BLOG PREVIEW MODAL COMPONENT
//======================================================================
const BlogPreviewModal = memo(({ isOpen, onClose, title, content, authorName, authorRole, imageFile }) => {
  const [isCopying, setIsCopying] = useState(false);
  
  if (!isOpen) return null;

  const handleCopyLink = async () => {
    // Generate unique preview ID
    const previewId = `preview_${Date.now()}`;
    
    setIsCopying(true);
    
    try {
      // Upload image to Cloudinary if exists
      let cloudinaryUrl = null;
      if (imageFile) {
        toast.info('Uploading image to cloud...');
        const uploadResult = await uploadToCloudinary(imageFile);
        cloudinaryUrl = uploadResult.url;
        console.log('✅ Image uploaded for preview:', cloudinaryUrl);
      }
      
      // Store draft data in localStorage with Cloudinary URL
      const draftData = {
        title: title,
        content: content,
        authorName: authorName,
        authorRole: authorRole,
        imageUrl: cloudinaryUrl,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // Expires in 24 hours
      };
      
      localStorage.setItem(previewId, JSON.stringify(draftData));
      
      // Generate shareable preview link
      const previewLink = `${window.location.origin}/blog/preview/${previewId}`;
      
      await navigator.clipboard.writeText(previewLink);
      toast.success('Preview link copied! Valid for 24 hours.');
    } catch (error) {
      console.error('Error storing preview:', error);
      toast.error('Failed to create preview link');
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-800">Blog Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              disabled={isCopying}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                isCopying
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isCopying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Link
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-8">
          {/* Featured Image Preview */}
          {imageFile && (
            <div className="mb-6 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Featured"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Blog Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-oswald">
            {title || 'Untitled Blog Post'}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="font-medium">{authorName || 'Anonymous'}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{authorRole || 'Staff'}</span>
            </div>
          </div>

          {/* Blog Content with Styling */}
          <div className="blog-preview-content">
            {content ? parse(content) : <p className="text-gray-400 italic">No content yet...</p>}
          </div>
        </div>
      </div>

      {/* Inline Styles for Preview Content */}
      <style>{`
        .blog-preview-content h1 {
          font-size: 2em;
          line-height: 1.2;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        
        .blog-preview-content h2 {
          font-size: 1.5em;
          line-height: 1.3;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        
        .blog-preview-content h3 {
          font-size: 1.17em;
          line-height: 1.4;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        
        .blog-preview-content ul,
        .blog-preview-content ol {
          padding-left: 1.75rem;
          margin-top: 0.75em;
          margin-bottom: 0.75em;
        }
        
        .blog-preview-content ul {
          list-style-type: disc;
        }
        
        .blog-preview-content ol {
          list-style-type: decimal;
        }
        
        .blog-preview-content li {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }
        
        .blog-preview-content p {
          margin-top: 0.75em;
          margin-bottom: 0.75em;
          line-height: 1.6;
        }
        
        .blog-preview-content strong {
          font-weight: 600;
        }
        
        .blog-preview-content em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
});

//======================================================================
//  FINAL MEMOIZED MENU BAR COMPONENT
//======================================================================
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
    
    // Delete the selected text and insert YouTube embed
    editor.chain().focus().deleteSelection().setYouTubeEmbed(selectedText.trim()).run();
  };

  return (
    <div className="menu-bar">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
        title="Bold"
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
        title="Italic"
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
        title="Paragraph"
      >
        Paragraph
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
        title="Bullet List"
      >
        List
      </button>
      <button
        type="button"
        onClick={handleYouTubeEmbed}
        className={editor.isActive("youtubeEmbed") ? "is-active" : ""}
        title="Insert YouTube Embed"
        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        <Youtube size={16} />
        YouTube
      </button>
      <button
        type="button"
        onClick={onInsertImageBlock}
        title="Insert Image Block"
        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        <Image size={16} />
        Images
      </button>
    </div>
  );
});

//======================================================================
//  MEMOIZED AUTHOR DETAILS COMPONENT
//======================================================================
const AuthorDetails = memo(({ formData, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Your Name
        </label>
        <input
          type="text"
          name="authorName"
          value={formData.authorName}
          onChange={onChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed"
          placeholder="e.g., Jane Doe"
          required
          readOnly
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Your Role
        </label>
        <input
          type="text"
          name="authorRole"
          value={formData.authorRole}
          onChange={onChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed"
          placeholder="e.g., Software Engineer"
          required
          readOnly
        />
      </div>user
    </div>
  );
});

//======================================================================
//  FINAL MAIN BLOG FORM COMPONENT
//======================================================================
const StaffBlogs = () => {
  const { user, role,firebaseUser } = useAuth(); // Get authenticated user and role
  const [formData, setFormData] = useState({ authorName: "", authorRole: "", title: "" });

  useEffect(() => {
    // Pre-fill author details from the authenticated user context
    if (user && role) {
      setFormData({
        authorName: firebaseUser.name || user.email || '',
        authorRole: role,
        title: '',
      });
    }
  }, [user, role]);

  const [blogContent, setBlogContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Crop modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");
  
  // Multi-image blocks state with staging
  const [showMultiImageModal, setShowMultiImageModal] = useState(false);
  const mediaStaging = useMediaStaging();
  
  // Preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        listItem: false,
        orderedList: false,
        bulletList: false,
        link: false, // Disable link from StarterKit to avoid duplicate
      }),
      Heading.extend({
        addKeyboardShortcuts() {
          return { Enter: () => this.editor.commands.splitBlock() };
        },
      }),
      OrderedList,
      BulletList,
      ListItem.extend({ keepOnSplit: true }),
      Link.configure({
        openOnClick: false,
      }),
      ImageBlock,
      YouTubeEmbed,
    ],
    content: "",
    onUpdate: ({ editor }) => setBlogContent(editor.getHTML()),
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  const handleInputChange = useCallback((e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleFileChange = useCallback(async (e) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setMessage(`❌ ${validation.error}`);
      e.target.value = ''; // Clear input
      return;
    }
    
    try {
      // Get image dimensions
      const dimensions = await getImageDimensions(file);
      console.log('📐 Image dimensions:', dimensions);
      
      // Check if image is 16:9
      const is16x9 = isAspectRatio16x9(dimensions.width, dimensions.height);
      
      if (is16x9) {
        // Image is already 16:9, use it directly
        console.log('✅ Image is 16:9, no cropping needed');
        setImageFile(file);
        setMessage('');
      } else {
        // Image needs cropping
        console.log('⚠️ Image is not 16:9, opening crop modal');
        setOriginalFileName(file.name);
        setImageToCrop(URL.createObjectURL(file));
        setShowCropModal(true);
        setMessage('');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setMessage('❌ Failed to process image. Please try again.');
      e.target.value = ''; // Clear input
    }
  }, []);
  
  /**
   * Handle cropped image from modal
   */
  const handleCropComplete = useCallback((croppedFile) => {
    console.log('✅ Cropped image received:', croppedFile);
    setImageFile(croppedFile);
    setShowCropModal(false);
    setMessage('');
    
    // Clean up object URL
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
      setImageToCrop(null);
    }
  }, [imageToCrop]);
  
  /**
   * Handle crop cancel
   */
  const handleCropCancel = useCallback(() => {
    setShowCropModal(false);
    
    // Clean up object URL
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
      setImageToCrop(null);
    }
    
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  }, [imageToCrop]);

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
  }, []);

  /**
   * Handle insert image block button click
   */
  const handleInsertImageBlock = useCallback(() => {
    setShowMultiImageModal(true);
  }, []);

  /**
   * Handle multi-image modal save
   */
  const handleMultiImageSave = useCallback(({ id, stagedItems }) => {
    // Store staged files in media staging
    mediaStaging.updateStagedFiles(id, stagedItems);

    // Insert ImageBlock node in editor with staged items
    if (editor) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'imageBlock',
          attrs: { id, stagedItems },
        })
        .run();
    }

    setShowMultiImageModal(false);
  }, [editor, mediaStaging]);

  /**
   * Handle multi-image modal cancel
   */
  const handleMultiImageCancel = useCallback(() => {
    setShowMultiImageModal(false);
  }, []);

  /**
   * Handle preview button click
   */
  const handlePreview = useCallback(() => {
    if (!blogContent || blogContent === '<p></p>') {
      toast.error('Please add some content to preview');
      return;
    }
    setShowPreviewModal(true);
  }, [blogContent]);

  /**
   * Handle preview modal close
   */
  const handlePreviewClose = useCallback(() => {
    setShowPreviewModal(false);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editor || !user) return;
  
      setLoading(true);
      setMessage("");
      const finalHtmlContent = editor.getHTML();
  
      if (finalHtmlContent === "<p></p>") {
        setMessage("Blog content cannot be empty.");
        setLoading(false);
        return;
      }
  
      try {
        // Step 1: Extract YouTube embeds and image blocks from editor JSON
        const editorJson = editor.getJSON();
        const youtubeLinks = [];
        const imageBlockIds = [];
        
        // Traverse the editor JSON to extract YouTube embeds and image blocks
        const traverseNodes = (node) => {
          if (node.type === 'youtubeEmbed') {
            youtubeLinks.push(node.attrs.url);
          } else if (node.type === 'imageBlock') {
            imageBlockIds.push(node.attrs.id);
          }
          
          if (node.content) {
            node.content.forEach(traverseNodes);
          }
        };
        
        editorJson.content?.forEach(traverseNodes);
        
        console.log('📺 Extracted YouTube links:', youtubeLinks);
        console.log('🖼️ Extracted image block IDs:', imageBlockIds);
        
        // Step 2: Upload featured image to Cloudinary if present
        let uploadedImages = [];
        
        if (imageFile) {
          // Validate file size (max 5MB)
          if (imageFile.size > 5 * 1024 * 1024) {
            setMessage(`❌ Image "${imageFile.name}" is too large. Max size is 5MB.`);
            setLoading(false);
            return;
          }
          
          setMessage("📤 Uploading featured image to Cloudinary...");
          
          try {
            const uploadResult = await uploadToCloudinary(imageFile);
            uploadedImages.push({
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              format: uploadResult.format,
              width: uploadResult.width,
              height: uploadResult.height,
            });
          } catch (uploadError) {
            console.error(`Error uploading ${imageFile.name}:`, uploadError);
            setMessage(`❌ Failed to upload image "${imageFile.name}". ${uploadError.message}`);
            setLoading(false);
            return;
          }
        }

        // Step 3: Upload all staged image block files to Cloudinary
        setMessage("📤 Uploading image blocks to Cloudinary...");
        
        let uploadedImageBlocks = {};
        
        try {
          uploadedImageBlocks = await mediaStaging.flushUploads(
            uploadToCloudinary,
            ({ current, total, fileName }) => {
              setMessage(`📤 Uploading image ${current}/${total}: ${fileName}...`);
            }
          );
          
          console.log('✅ All image blocks uploaded:', uploadedImageBlocks);
        } catch (uploadError) {
          console.error('Error uploading image blocks:', uploadError);
          setMessage(`❌ ${uploadError.message}`);
          setLoading(false);
          return;
        }
        
        // Step 4: Replace YouTube embeds and image blocks with div placeholders in HTML
        let cleanedContent = finalHtmlContent;
        
        // Replace YouTube embed divs with simple placeholders
        youtubeLinks.forEach((url, index) => {
          const ytPattern = /<div[^>]*data-type="youtube-embed"[^>]*>.*?<\/div>/gi;
          cleanedContent = cleanedContent.replace(ytPattern, `<div id="yt${index}"></div>`);
        });
        
        // Replace image block divs with simple placeholders
        imageBlockIds.forEach((blockId) => {
          const imgPattern = new RegExp(`<div[^>]*data-type="image-block"[^>]*data-id="${blockId}"[^>]*>.*?<\/div>`, 'gi');
          cleanedContent = cleanedContent.replace(imgPattern, `<div class="image-block" id="${blockId}"></div>`);
        });
        
        console.log('💾 Cleaned content with placeholders:', cleanedContent);

        // Step 5: Save blog to Firestore with Cloudinary URLs and YouTube links
        setMessage("💾 Saving blog to database...");
        
        await addDoc(collection(db, "blogs"), {
          userId: user.uid,
          isAdminAccepted: false,
          title: formData.title,
          authorName: formData.authorName,
          authorRole: formData.authorRole,
          content: cleanedContent, // Store cleaned content without YouTube links
          images: uploadedImages, // Store featured image Cloudinary URL and metadata
          ytlinks: youtubeLinks, // Store YouTube links array
          imageBlocks: uploadedImageBlocks, // Store uploaded multi-image blocks
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
  
        // ✅ Success message
        const imageMsg = uploadedImages.length > 0 ? ` Featured image uploaded.` : '';
        const blockMsg = Object.keys(uploadedImageBlocks).length > 0 ? ` ${Object.keys(uploadedImageBlocks).length} image block(s) uploaded.` : '';
        const ytMsg = youtubeLinks.length > 0 ? ` ${youtubeLinks.length} YouTube link(s) detected.` : '';
        setMessage(`✅ Blog saved successfully!${imageMsg}${blockMsg}${ytMsg}`);
  
        // Reset form after success
        setTimeout(() => {
          setImageFile(null);
          mediaStaging.clearAll();
          editor.commands.clearContent(true);
          setBlogContent("");
          setFormData(prev => ({ ...prev, title: '' }));
          setMessage("");
  
          // Clear file input
          const fileInput = e.target.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = "";
        }, 2000);
      } catch (error) {
        console.error("Error saving blog:", error);
        setMessage(`❌ Failed to save blog: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    [editor, user, formData, imageFile, mediaStaging]
  );
  

  if (!editor) return null;

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Staff Blog Post Submission
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          Use the toolbar to format your content.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthorDetails formData={formData} onChange={handleInputChange} />

          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={100}
              required
              placeholder="Enter your blog title (max 100 characters)"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length}/100 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content
            </label>
            <div className="editor-container">
              <MenuBar editor={editor} onInsertImageBlock={handleInsertImageBlock} />
              <EditorContent editor={editor} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image (Single)
            </label>
            <input
              type="file"
              name="imageFile"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="mt-1 text-xs text-gray-500">Only one image can be uploaded per blog post.</p>

            {/* Preview selected image */}
            {imageFile && (
              <div className="mt-3">
                <div className="relative inline-block">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt={imageFile.name}
                    className="w-32 h-32 object-cover rounded-lg border-2 border-indigo-300 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors shadow-lg"
                  >
                    ×
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-600">{imageFile.name}</p>
              </div>
            )}
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* Preview Button */}
          <button
            type="button"
            onClick={handlePreview}
            className="w-full py-3 mt-4 font-bold text-indigo-600 bg-indigo-50 rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-indigo-100 flex items-center justify-center gap-2"
          >
            <Eye size={20} />
            Preview Blog Post
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-3 font-bold text-white rounded-lg shadow-md transition duration-300 ease-in-out ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Blog Post"}
          </button>
        </form>
        </div>
      </div>

      {/* Crop Image Modal */}
      <CropImageModal
        isOpen={showCropModal}
        imageSrc={imageToCrop}
        fileName={originalFileName}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />

      {/* Multi-Image Upload Modal */}
      <MultiImageUploadModal
        isOpen={showMultiImageModal}
        onSave={handleMultiImageSave}
        onCancel={handleMultiImageCancel}
      />

      {/* Blog Preview Modal */}
      <BlogPreviewModal
        isOpen={showPreviewModal}
        onClose={handlePreviewClose}
        title={formData.title}
        content={blogContent}
        authorName={formData.authorName}
        authorRole={formData.authorRole}
        imageFile={imageFile}
      />
    </>
  );
};

export default StaffBlogs;
