import React, { useState, useEffect, useCallback, memo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/AuthProvider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { getImageDimensions, isAspectRatio16x9, validateImageFile } from "@/utils/imageCropUtils";
import CropImageModal from "@/components/CropImageModal";
// import MultiImageUploadModal from "@/components/MultiImageUploadModal";
import MultiImageUploadModal from "../Components/MultiImageUploadModal";
import { isYouTubeUrl } from "@/utils/youtubeUtils";
// import { useMediaStaging } from "@/hooks/useMediaStaging";
import { useMediaStaging } from "@/hooks/useMediaStaging";
import { Youtube, Image, Bold, Italic, Heading1, Heading2, List, ListOrdered, Type, Save, User, Briefcase, FileImage } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// --- Import all required Tiptap extensions for customization ---
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Link from "@tiptap/extension-link";
// import { ImageBlock } from "@/extensions/ImageBlock";
import { ImageBlock } from "@/extensions/ImageBlock";
// import { YouTubeEmbed } from "@/extensions/YouTubeEmbed";
import { YouTubeEmbed } from "@/extensions/YouTubeEmbed";

// --- Import the CSS file ---
import "./tiptap.css";

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

    editor.chain().focus().setYouTubeEmbed(selectedText.trim()).run();
  };

  return (
    <div className="menu-bar">
      <div className="toolbar-group">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
          title="Bold (Ctrl+B)"
        >
          <Bold />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
          title="Italic (Ctrl+I)"
        >
          <Italic />
        </button>
      </div>

      <div className="toolbar-group">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
          title="Normal Text"
        >
          <Type />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
          title="Heading 1"
        >
          <Heading1 />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
          title="Heading 2"
        >
          <Heading2 />
        </button>
      </div>

      <div className="toolbar-group">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          title="Bullet List"
        >
          <List />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
          title="Numbered List"
        >
          <ListOrdered />
        </button>
      </div>

      <div className="toolbar-group">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onInsertImageBlock}
          title="Insert Images"
        >
          <Image />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleYouTubeEmbed}
          className={editor.isActive("youtubeEmbed") ? "is-active" : ""}
          title="Embed YouTube Video"
        >
          <Youtube />
        </button>
      </div>
    </div>
  );
});

//======================================================================
//  MEMOIZED AUTHOR DETAILS COMPONENT
//======================================================================
const AuthorDetails = memo(({ formData }) => {
  return (
    <div className="doc-author-section">
      <div className="doc-author-item">
        <User size={16} />
        <span className="font-semibold text-gray-900">{formData.authorName}</span>
      </div>
      <div className="doc-author-item">
        <Briefcase size={16} />
        <span className="capitalize">{formData.authorRole}</span>
      </div>
    </div>
  );
});

//======================================================================
//  FINAL MAIN BLOG FORM COMPONENT
//======================================================================
const StaffBlogs = () => {
  const { user, role, firebaseUser } = useAuth(); // Get authenticated user and role
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

  // Crop modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");

  // Multi-image blocks state with staging
  const [showMultiImageModal, setShowMultiImageModal] = useState(false);
  const mediaStaging = useMediaStaging();

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
      toast.error(validation.error);
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
      toast.error('Failed to process image. Please try again.');
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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editor || !user) return;

      setLoading(true);
      const finalHtmlContent = editor.getHTML();

      if (finalHtmlContent === "<p></p>") {
        toast.error("Blog content cannot be empty.");
        setLoading(false);
        return;
      }

      const toastId = toast.loading("Preparing blog for submission...");

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
            toast.error(`Image "${imageFile.name}" is too large. Max size is 5MB.`, { id: toastId });
            setLoading(false);
            return;
          }

          toast.loading("Uploading featured image...", { id: toastId });

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
            toast.error(`Failed to upload image "${imageFile.name}". ${uploadError.message}`, { id: toastId });
            setLoading(false);
            return;
          }
        }

        // Step 3: Upload all staged image block files to Cloudinary
        toast.loading("Uploading image blocks...", { id: toastId });

      let uploadedImageBlocks = {};

      try {
        uploadedImageBlocks = await mediaStaging.flushUploads(
          uploadToCloudinary,
          ({ current, total, fileName }) => {
            toast.loading(`Uploading image ${current}/${total}: ${fileName}...`, { id: toastId });
          }
        );

        console.log('✅ All image blocks uploaded:', uploadedImageBlocks);
      } catch (uploadError) {
        console.error('Error uploading image blocks:', uploadError);
        toast.error(uploadError.message, { id: toastId });
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
      toast.loading("Saving blog to database...", { id: toastId });

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

      toast.success(`Blog sended successfully!${imageMsg}${blockMsg}${ytMsg}`, { id: toastId, duration: 5000 });

      // Reset form after success
      setTimeout(() => {
        setImageFile(null);
        mediaStaging.clearAll();
        editor.commands.clearContent(true);
        setBlogContent("");
        setFormData(prev => ({ ...prev, title: '' }));

        // Clear file input
        const fileInput = e.target.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      }, 2000);
    } catch(error) {
      console.error("Error saving blog:", error);
      toast.error(`Failed to save blog: ${error.message}`);
    } finally {
    setLoading(false);
  }
},
  [editor, user, formData, imageFile, mediaStaging]
  );

if (!editor) return null;

return (
  <div className="min-h-screen bg-white">
    <form onSubmit={handleSubmit}>
      {/* Sticky Toolbar & Actions */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <MenuBar
              editor={editor}
              onInsertImageBlock={handleInsertImageBlock}
            />
          </div>
          <div className="px-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md font-semibold transition-all shadow-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : <><Save size={18} /> Submit Blog</>}
            </button>
          </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="editor-workspace">
        <div className="document-canvas">
          {/* Integrated Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            maxLength={100}
            required
            placeholder="Enter Blog Title..."
            className="doc-title-input"
          />

          {/* Author Details */}
          <AuthorDetails formData={formData} />

          {/* Editor Area */}
          <div className="relative">
            <EditorContent editor={editor} />
          </div>

          {/* Featured Image Section */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
              <FileImage size={16} /> Featured Image
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Upload Button */}
              <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200 rounded-xl px-6 py-4 transition-colors flex flex-col items-center gap-2">
                <FileImage className="text-gray-400" />
                <span className="text-xs font-medium text-gray-600">{imageFile ? "Change Image" : "Upload Thumbnail"}</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>

              {/* Preview Thumbnail */}
              {imageFile && (
                <div className="relative group">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt={imageFile.name}
                    className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md transition-transform scale-0 group-hover:scale-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-400">One high-quality 16:9 featured image is required.</p>
          </div>
        </div>
      </div>
    </form>

    {/* Modals */}
    <CropImageModal
      isOpen={showCropModal}
      imageSrc={imageToCrop}
      fileName={originalFileName}
      onCropComplete={handleCropComplete}
      onCancel={handleCropCancel}
    />

    <MultiImageUploadModal
      isOpen={showMultiImageModal}
      onSave={handleMultiImageSave}
      onCancel={handleMultiImageCancel}
    />

    <Toaster position="top-right" />
  </div>
);
};

export default StaffBlogs;
