import React, { useState, useEffect, useCallback, memo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { db } from "@/lib/firebase";
import { useAuth } from "@/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { getImageDimensions, isAspectRatio16x9, validateImageFile } from "@/utils/imageCropUtils";
import CropImageModal from "@/components/CropImageModal";
import { Youtube, AlertTriangle, ArrowLeft, Loader2, Bold, Italic, Heading1, Heading2, List, ListOrdered, Type, Save, User, Briefcase, FileImage, X } from "lucide-react";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Link from "@tiptap/extension-link";
// import { extractYouTubeLinks, isYouTubeUrl } from "@/utils/youtubeUtils";
// import { YouTubeLink } from "@/extensions/YouTubeLink";
import "./tiptap.css";
import { updateBlog } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

import { isYouTubeUrl } from "@/utils/youtubeUtils";
import { YouTubeEmbed, extractYouTubeId } from "@/extensions/YouTubeEmbed";
import { ImageBlock } from "@/extensions/ImageBlock";
import { useMediaStaging } from "@/hooks/useMediaStaging";
import MultiImageUploadModal from "../Components/MultiImageUploadModal";
import { Image as ImageIcon } from "lucide-react";

// ── MenuBar ───────────────────────────────────────────────────────────────────
const MenuBar = memo(({ editor }) => {
  const [_, setForceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => setForceUpdate((v) => v + 1);
    editor.on("transaction", handleUpdate);
    return () => editor.off("transaction", handleUpdate);
  }, [editor]);

  if (!editor) return null;

  const handleYouTubeEmbed = () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, "");
    if (!selectedText) { alert("Please select a YouTube URL first"); return; }
    if (!isYouTubeUrl(selectedText.trim())) { alert("Selected text is not a valid YouTube URL"); return; }
    editor.chain().focus().setYouTubeEmbed(selectedText.trim()).run();
  }

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
          onClick={() => window.dispatchEvent(new CustomEvent('insert-image-block'))}
          title="Insert Images"
        >
          <ImageIcon />
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

// ── Main Edit Component ───────────────────────────────────────────────────────
const StaffBlogEdit = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { user, role, firebaseUser } = useAuth();

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [retryFeedback, setRetryFeedback] = useState("");

  const [formData, setFormData] = useState({ authorName: "", authorRole: "", title: "" });
  const [existingImage, setExistingImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  

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
        link: false,
      }),
      Heading.extend({
        addKeyboardShortcuts() {
          return { Enter: () => this.editor.commands.splitBlock() };
        },
      }),
      OrderedList,
      BulletList,
      ListItem.extend({ keepOnSplit: true }),
      Link.configure({ openOnClick: false }),
      ImageBlock,
      YouTubeEmbed,
    ],
    content: "",
  });

  useEffect(() => {
    const handleInsertImageEvent = () => setShowMultiImageModal(true);
    window.addEventListener('insert-image-block', handleInsertImageEvent);
    return () => window.removeEventListener('insert-image-block', handleInsertImageEvent);
  }, []);

  const mediaStaging = useMediaStaging();
  const [showMultiImageModal, setShowMultiImageModal] = useState(false);

  const handleMultiImageSave = useCallback(({ id, stagedItems }) => {
    mediaStaging.updateStagedFiles(id, stagedItems);
    if (editor) {
      editor.chain().focus().insertContent({
        type: 'imageBlock',
        attrs: { id, stagedItems },
      }).run();
    }
    setShowMultiImageModal(false);
  }, [editor, mediaStaging]);

  const handleMultiImageCancel = useCallback(() => {
    setShowMultiImageModal(false);
  }, []);

  useEffect(() => () => editor?.destroy(), [editor]);

  // ── Fetch existing blog data ──────────────────────────────────────────────
  useEffect(() => {
    if (!blogId || !editor) return;

    const fetchBlog = async () => {
      try {
        setFetchLoading(true);
        const blogRef = doc(db, "blogs", blogId);
        const blogSnap = await getDoc(blogRef);

        if (!blogSnap.exists()) {
          setFetchError("Blog not found.");
          return;
        }

        const data = blogSnap.data();

        // Only the blog owner can edit
        if (data.userId !== user?.uid) {
          setFetchError("You do not have permission to edit this blog.");
          return;
        }

        // Only retry blogs are editable here
        if (data.status !== "retry") {
          setFetchError("This blog is not in retry status and cannot be edited here.");
          return;
        }

        setRetryFeedback(data.retryFeedback || "");
        console.log("content:", data.content);
        console.log("ytlinks:", data.ytlinks);
        setFormData({
          authorName: data.authorName || firebaseUser?.name || user?.email || "",
          authorRole: data.authorRole || role || "",
          title: data.title || "",
        });

        if (data.images && data.images.length > 0) {
          const first = data.images[0];
          setExistingImage(typeof first === "object" ? first : { url: first });
        }

        // editor.commands.setContent(data.content || "");
        // const editorJson = editor.getJSON();
        // const youtubeLinks = [];

        // const traverseNodes = (node) => {
        //   if (node.type === 'youtubeEmbed') {
        //     youtubeLinks.push(node.attrs.url);
        //   }
        //   if (node.content) {
        //     node.content.forEach(traverseNodes);
        //   }
        // };
        // editorJson.content?.forEach(traverseNodes);

        // let cleanedContent = editor.getHTML();
        // youtubeLinks.forEach((url, index) => {
        //   const ytPattern = /<div[^>]*data-type="youtube-embed"[^>]*>.*?<\/div>/gi;
        //   cleanedContent = cleanedContent.replace(ytPattern, `<div id="yt${index}"></div>`);
        // });

        // editor.commands.setContent(cleanedContent);
        let contentToLoad = data.content || "";
        
        // Restore YouTube embeds
        if (data.ytlinks && data.ytlinks.length > 0) {
          data.ytlinks.forEach((url, index) => {
            const videoId = extractYouTubeId(url);
            const placeholder = `<div id="yt${index}"></div>`;
            const embedDiv = `<div data-type="youtube-embed" data-url="${url}" data-video-id="${videoId}" class="youtube-embed"></div>`;
            contentToLoad = contentToLoad.replace(placeholder, embedDiv);
          });
        }

        // Restore Image blocks
        if (data.imageBlocks && Object.keys(data.imageBlocks).length > 0) {
          Object.entries(data.imageBlocks).forEach(([blockId, images]) => {
            const placeholder = `<div class="image-block" id="${blockId}"></div>`;
            const imageBlockDiv = `<div data-type="image-block" data-id="${blockId}" data-images='${JSON.stringify(images)}'></div>`;
            contentToLoad = contentToLoad.replace(placeholder, imageBlockDiv);
          });
        }

        editor.commands.setContent(contentToLoad);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setFetchError("Failed to load blog.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, editor, user]);

  const handleInputChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleFileChange = useCallback(async (e) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const validation = validateImageFile(file);
    if (!validation.valid) { toast.error(validation.error); e.target.value = ""; return; }

    try {
      const dimensions = await getImageDimensions(file);
      if (isAspectRatio16x9(dimensions.width, dimensions.height)) {
        setImageFile(file);
        setMessage("");
      } else {
        setOriginalFileName(file.name);
        setImageToCrop(URL.createObjectURL(file));
        setShowCropModal(true);
        setMessage("");
      }
    } catch {
      toast.error("❌ Failed to process image. Please try again.");
      e.target.value = "";
    }
  }, []);

  const handleCropComplete = useCallback((croppedFile) => {
    setImageFile(croppedFile);
    setShowCropModal(false);
    if (imageToCrop) { URL.revokeObjectURL(imageToCrop); setImageToCrop(null); }
  }, [imageToCrop]);

  const handleCropCancel = useCallback(() => {
    setShowCropModal(false);
    if (imageToCrop) { URL.revokeObjectURL(imageToCrop); setImageToCrop(null); }
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  }, [imageToCrop]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!editor || !user) return;

    const finalHtmlContent = editor.getHTML();
    if (finalHtmlContent === "<p></p>") {
      toast.error("Blog content cannot be empty.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Preparing blog update...");

    try {
      const editorJson = editor.getJSON();
      const youtubeLinks = [];
      const imageBlockIds = [];
      
      const traverseNodes = (node) => {
        if (node.type === 'youtubeEmbed') {
          youtubeLinks.push(node.attrs.url);
        } else if (node.type === 'imageBlock') {
          imageBlockIds.push(node.attrs.id);
        }
        if (node.content) node.content.forEach(traverseNodes);
      };
      editorJson.content?.forEach(traverseNodes);

      let cleanedContent = editor.getHTML();
      
      // Clean YouTube embeds
      youtubeLinks.forEach((url, index) => {
        const ytPattern = /<div[^>]*data-type="youtube-embed"[^>]*>.*?<\/div>/gi;
        cleanedContent = cleanedContent.replace(ytPattern, `<div id="yt${index}"></div>`);
      });

      // Clean Image blocks
      imageBlockIds.forEach((blockId) => {
        const imgPattern = new RegExp(`<div[^>]*data-type="image-block"[^>]*data-id="${blockId}"[^>]*>.*?<\/div>`, 'gi');
        cleanedContent = cleanedContent.replace(imgPattern, `<div class="image-block" id="${blockId}"></div>`);
      });



      let uploadedImages = existingImage ? [existingImage] : [];

      if (imageFile) {
        if (imageFile.size > 5 * 1024 * 1024) {
          toast.error("❌ Image is too large. Max size is 5MB.", { id: toastId });
          setLoading(false);
          return;
        }
        toast.loading("📤 Uploading new image...", { id: toastId });
        const uploadResult = await uploadToCloudinary(imageFile);
        uploadedImages = [{
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          format: uploadResult.format,
          width: uploadResult.width,
          height: uploadResult.height,
        }];
      }

      // Upload image blocks
      toast.loading("📤 Uploading image blocks...", { id: toastId });
      let uploadedImageBlocks = {};
      try {
        uploadedImageBlocks = await mediaStaging.flushUploads(
          uploadToCloudinary,
          ({ current, total, fileName }) => {
            toast.loading(`📤 Uploading image ${current}/${total}: ${fileName}...`, { id: toastId });
          }
        );
      } catch (uploadError) {
        console.error('Error uploading image blocks:', uploadError);
        toast.error(uploadError.message, { id: toastId });
        setLoading(false);
        return;
      }

      toast.loading("💾 Saving changes...", { id: toastId });
      await updateBlog(blogId, {
        title: formData.title,
        content: cleanedContent,
        images: uploadedImages,
        ytlinks: youtubeLinks,
        imageBlocks: uploadedImageBlocks,
        status: "pending",
        retryFeedback: null,
        updatedAt: new Date(),
      });

      toast.success("Blog updated successfully and sent for review!", { id: toastId, duration: 5000 });
      setTimeout(() => navigate("/staff"), 2000);
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(`Failed to update blog: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  }, [editor, user, formData, imageFile, existingImage, blogId, navigate, mediaStaging]);

  // ── Loading / error states ────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
        <p className="text-red-600 font-semibold text-lg">{fetchError}</p>
        <button onClick={() => navigate("/staff")} className="flex items-center gap-2 text-indigo-600 hover:underline">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>
    );
  }

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-white">
      <form onSubmit={handleSubmit}>
        {/* Sticky Toolbar & Actions */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => navigate("/staff")}
                className="p-3 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft size={20} />
              </button>
              <MenuBar editor={editor} />
            </div>
            <div className="px-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md font-semibold transition-all shadow-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed`}
              >
                {loading ? "Saving..." : <><Save size={18} /> Resubmit Blog</>}
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Area */}
        <div className="editor-workspace">
          <div className="document-canvas">
            {/* Admin feedback banner */}
            {retryFeedback && (
              <div className="mb-10 p-5 bg-orange-50 border border-orange-100 rounded-lg flex gap-4">
                <AlertTriangle size={24} className="text-orange-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-orange-900 mb-1 uppercase tracking-wider">Requested Revisions</p>
                  <p className="text-base text-orange-800 leading-relaxed">{retryFeedback}</p>
                </div>
              </div>
            )}

            {/* Title Section */}
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={100}
              required
              placeholder="Blog Title..."
              className="doc-title-input"
            />

            {/* Author Section */}
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

            {/* Content Area */}
            <div className="relative">
              <EditorContent editor={editor} />
            </div>

            {/* Featured Image Section - Integrated subtly */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
                <FileImage size={16} /> Featured Image
              </label>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Existing Image */}
                {existingImage && !imageFile && (
                  <div className="relative group">
                    <img
                      src={existingImage.url}
                      alt="Current"
                      className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setExistingImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md transition-transform scale-0 group-hover:scale-100"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200 rounded-xl px-6 py-4 transition-colors flex flex-col items-center gap-2">
                  <FileImage className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">{existingImage ? "Replace Image" : "Choose Image"}</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>

                {/* New Image Preview */}
                {imageFile && (
                  <div className="relative group">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="New"
                      className="w-32 h-32 object-cover rounded-xl border border-blue-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md transition-transform scale-0 group-hover:scale-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-400">Updating the featured image will replace the current one.</p>
            </div>
          </div>
        </div>
      </form>

      <MultiImageUploadModal
        isOpen={showMultiImageModal}
        onSave={handleMultiImageSave}
        onCancel={handleMultiImageCancel}
      />

      <CropImageModal
        isOpen={showCropModal}
        imageSrc={imageToCrop}
        fileName={originalFileName}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />

      <Toaster position="top-right" />
    </div>
  );
};

export default StaffBlogEdit;