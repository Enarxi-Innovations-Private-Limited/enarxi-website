import React, { useState, useEffect, useCallback, memo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/AuthProvider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { getImageDimensions, isAspectRatio16x9, validateImageFile } from "@/utils/imageCropUtils";
import CropImageModal from "@/components/CropImageModal";
import { extractYouTubeLinks, isYouTubeUrl } from "@/utils/youtubeUtils";
import { Youtube } from "lucide-react";

// --- Import all required Tiptap extensions for customization ---
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Link from "@tiptap/extension-link";
import { YouTubeLink } from "@/extensions/YouTubeLink";

// --- Import the CSS file ---
import "./tiptap.css";

//======================================================================
//  FINAL MEMOIZED MENU BAR COMPONENT
//======================================================================
const MenuBar = memo(({ editor }) => {
  const [_, setForceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => setForceUpdate((val) => val + 1);
    editor.on("transaction", handleUpdate);
    return () => editor.off("transaction", handleUpdate);
  }, [editor]);

  if (!editor) return null;

  const handleYouTubeLink = () => {
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
    
    // Mark the selected text as a YouTube link
    editor.chain().focus().setYouTubeLink(selectedText.trim()).run();
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
        onClick={handleYouTubeLink}
        className={editor.isActive("youtubeLink") ? "is-active" : ""}
        title="Mark as YouTube Link"
        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        <Youtube size={16} />
        YouTube
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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        listItem: false,
        orderedList: false,
        bulletList: false,
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
      YouTubeLink,
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
        // Step 1: Extract YouTube links from content
        const youtubeLinks = extractYouTubeLinks(finalHtmlContent);
        console.log('📺 Extracted YouTube links:', youtubeLinks);
        
        // Step 2: Upload image to Cloudinary if present
        let uploadedImages = [];
        
        if (imageFile) {
          // Validate file size (max 5MB)
          if (imageFile.size > 5 * 1024 * 1024) {
            setMessage(`❌ Image "${imageFile.name}" is too large. Max size is 5MB.`);
            setLoading(false);
            return;
          }
          
          setMessage("📤 Uploading image to Cloudinary...");
          
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

        // Step 3: Save blog to Firestore with Cloudinary URL and YouTube links
        setMessage("💾 Saving blog to database...");
        
        await addDoc(collection(db, "blogs"), {
          userId: user.uid,
          isAdminAccepted: false,
          title: formData.title,
          authorName: formData.authorName,
          authorRole: formData.authorRole,
          content: finalHtmlContent,
          images: uploadedImages, // Store Cloudinary URL and metadata
          ytlinks: youtubeLinks, // Store YouTube links array
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
  
        // ✅ Success message
        const imageMsg = uploadedImages.length > 0 ? ` Image uploaded to Cloudinary.` : '';
        const ytMsg = youtubeLinks.length > 0 ? ` ${youtubeLinks.length} YouTube link(s) detected.` : '';
        setMessage(`✅ Blog saved successfully!${imageMsg}${ytMsg}`);
  
        // Reset form after success
        setTimeout(() => {
          setImageFile(null);
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
    [editor, user, formData, imageFile]
  );
  

  if (!editor) return null;

  return (
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
              <MenuBar editor={editor} />
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 font-bold text-white rounded-lg shadow-md transition duration-300 ease-in-out ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Blog Post"}
          </button>
        </form>
      </div>

      {/* Crop Image Modal */}
      <CropImageModal
        isOpen={showCropModal}
        imageSrc={imageToCrop}
        fileName={originalFileName}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    </div>
  );
};

export default StaffBlogs;
