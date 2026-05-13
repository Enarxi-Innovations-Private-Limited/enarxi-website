import React, { useState, useEffect, useCallback, memo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/AuthProvider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { getImageDimensions, isAspectRatio16x9, validateImageFile } from "@/utils/imageCropUtils";
import CropImageModal from "@/components/CropImageModal";
import { generateSeoFileName, validateAltText } from "@/utils/seoUtils";
import { resolveUniqueSlug } from "@/utils/slugUtils";
// import MultiImageUploadModal from "@/components/MultiImageUploadModal";
import MultiImageUploadModal from "../Components/MultiImageUploadModal";
import { isYouTubeUrl } from "@/utils/youtubeUtils";
// import { useMediaStaging } from "@/hooks/useMediaStaging";
import { useMediaStaging } from "@/hooks/useMediaStaging";
import { Youtube, Image, Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Type, Save, User, Briefcase, FileImage, AlignLeft, AlignCenter, AlignRight, AlignJustify, X, Minus, Loader2, Eye } from "lucide-react";
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
import { YouTubeEmbed, extractYouTubeId } from "@/extensions/YouTubeEmbed";
import BlogPreviewModal from "@/components/BlogPreviewModal";
import TextAlign from '@tiptap/extension-text-align';

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

  const ToolbarButton = ({ onClick, isActive, title, children }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`p-2 rounded-md transition-colors w-8 h-8 flex items-center justify-center ${isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-600 hover:bg-gray-200'
        }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-4 py-2 overflow-x-auto w-full">
      {/* Bold / Italic */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-4">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-4">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-4">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-4">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <AlignJustify size={16} />
        </ToolbarButton>
      </div>

      {/* Media */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          isActive={false}
          title="Add Divider Line"
        >
          <Minus size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={onInsertImageBlock} isActive={false} title="Insert Images">
          <Image size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={handleYouTubeEmbed} isActive={editor.isActive("youtubeEmbed")} title="Embed YouTube Video">
          <Youtube size={16} />
        </ToolbarButton>
      </div>
    </div>
  );
});

//======================================================================
//  MEMOIZED AUTHOR DETAILS COMPONENT
//======================================================================
const AuthorDetails = memo(({ formData }) => {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
      <div className="flex items-center gap-1.5">
        <User size={16} />
        <span className="font-medium text-gray-900">{formData.authorName}</span>
      </div>
      <div className="flex items-center gap-1.5">
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
  const [editingBlock, setEditingBlock] = useState(null);

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
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [loading, setLoading] = useState(false);

  // Crop modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");

  const [showMultiImageModal, setShowMultiImageModal] = useState(false);
  const mediaStaging = useMediaStaging();
  const [showPreview, setShowPreview] = useState(false);

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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => setBlogContent(editor.getHTML()),
  });

  // --- Local Storage Auto-Save Logic ---
  useEffect(() => {
    if (!editor) return;
    const savedDraft = localStorage.getItem("blog_draft");
    if (savedDraft) {
      try {
        const { formData: savedForm, content: savedContent, featuredImageAlt: savedAlt } = JSON.parse(savedDraft);
        // Only restore the title, as author info might have changed or been updated by auth useEffect
        if (savedForm?.title) {
          setFormData(prev => ({ ...prev, title: savedForm.title }));
        }
        if (savedAlt) {
          setFeaturedImageAlt(savedAlt);
        }
        if (savedContent) {
          editor.commands.setContent(savedContent);
          setBlogContent(savedContent);
        }
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, [editor]);

  useEffect(() => {
    // Only save if there's actual content to avoid saving empty state over a draft
    if (formData.title || (blogContent && blogContent !== '<p></p>')) {
      localStorage.setItem("blog_draft", JSON.stringify({ formData, content: blogContent, featuredImageAlt }));
    }
  }, [formData.title, blogContent, featuredImageAlt]);

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
      } else {
        // Image needs cropping
        console.log('⚠️ Image is not 16:9, opening crop modal');
        setOriginalFileName(file.name);
        setImageToCrop(URL.createObjectURL(file));
        setShowCropModal(true);
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
  useEffect(() => {
    const handleInsertImageEvent = (e) => {
      setEditingBlock(e.detail || null);
      setShowMultiImageModal(true);
    };
    window.addEventListener('insert-image-block', handleInsertImageEvent);
    return () => window.removeEventListener('insert-image-block', handleInsertImageEvent);
  }, []);

  const handleInsertImageBlock = useCallback(() => {
    setEditingBlock(null); // fresh insert
    setShowMultiImageModal(true);
  }, []);

  /**
   * Handle multi-image modal save
   */
  const handleMultiImageSave = useCallback(({ id, stagedItems }) => {
    mediaStaging.updateStagedFiles(id, stagedItems);

    if (editor) {
      if (editingBlock) {
        // Update existing node in-place
        let updated = false;
        editor.state.doc.descendants((node, pos) => {
          if (node.type.name === 'imageBlock' && node.attrs.id === id) {
            editor.chain().focus().command(({ tr }) => {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, stagedItems });
              return true;
            }).run();
            updated = true;
            return false;
          }
        });
        if (!updated) {
          editor.chain().focus().insertContent({
            type: 'imageBlock',
            attrs: { id, stagedItems },
          }).run();
        }
      } else {
        // Fresh insert
        editor.chain().focus().insertContent({
          type: 'imageBlock',
          attrs: { id, stagedItems },
        }).run();
      }
    }

    setEditingBlock(null);
    setShowMultiImageModal(false);
  }, [editor, mediaStaging, editingBlock]);

  /**
   * Handle multi-image modal cancel
   */
  const handleMultiImageCancel = useCallback(() => {
    setEditingBlock(null);
    setShowMultiImageModal(false);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editor || !user) return;

      if (imageFile) {
        const altValidation = validateAltText(featuredImageAlt, 3);
        if (!altValidation.valid) {
          toast.error(altValidation.error);
          return;
        }
      }

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

          toast.loading("Uploading thumbnail image...", { id: toastId });

          try {
            const seoName = generateSeoFileName(featuredImageAlt, imageFile.name);
            const seoFile = new File([imageFile], seoName, { type: imageFile.type });
            const uploadResult = await uploadToCloudinary(seoFile);
            uploadedImages.push({
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              format: uploadResult.format,
              width: uploadResult.width,
              height: uploadResult.height,
              altText: featuredImageAlt,
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
          // Build activeBlocks only from blocks still present in the editor
          const activeBlocks = {};
          imageBlockIds.forEach((blockId) => {
            const hookItems = mediaStaging.stagedBlocks[blockId] || [];
            if (hookItems.length > 0) {
              activeBlocks[blockId] = hookItems;
            }
          });

          uploadedImageBlocks = await mediaStaging.flushUploads(
            uploadToCloudinary,
            ({ current, total, fileName }) => {
              toast.loading(`Uploading image ${current}/${total}: ${fileName}...`, { id: toastId });
            },
            activeBlocks
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
          // Match by unique blockId to handle any attribute order produced by TipTap
          const imgPattern = new RegExp(`<div[^>]*data-id=["']${blockId}["'][^>]*>.*?</div>`, 'i');
          cleanedContent = cleanedContent.replace(imgPattern, `<div class="image-block" id="${blockId}"></div>`);
        });

        console.log('💾 Cleaned content with placeholders:', cleanedContent);

        // Step 5: Save blog to Firestore with Cloudinary URLs and YouTube links
        toast.loading("Saving blog to database...", { id: toastId });

        const slug = await resolveUniqueSlug(formData.title);

        await addDoc(collection(db, "blogs"), {
          userId: user.uid,
          isAdminAccepted: false,
          title: formData.title,
          slug,
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
        const imageMsg = uploadedImages.length > 0 ? ` Thumbnail image uploaded.` : '';
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
          setFeaturedImageAlt("");

          // Clear file input
          const fileInput = e.target.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = "";

          // Clear local storage draft
          localStorage.removeItem("blog_draft");
        }, 2000);
      } catch (error) {
        console.error("Error saving blog:", error);
        toast.error(`Failed to save blog: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    [editor, user, formData, imageFile, mediaStaging]
  );

  useEffect(() => {
    const handleSyncStaged = (e) => {
      const { id, stagedItems } = e.detail;
      mediaStaging.updateStagedFiles(id, stagedItems);
    };
    window.addEventListener('sync-staged-block', handleSyncStaged);
    return () => window.removeEventListener('sync-staged-block', handleSyncStaged);
  }, [mediaStaging]);



  const getPreviewData = useCallback(() => {
    if (!editor) return { content: '', ytlinks: [], imageBlocks: {} };

    const previewImageBlocks = {};
    const youtubeLinks = [];

    // Use editor.state.doc.descendants instead of getJSON()
    // because getJSON() serializes File objects to {} losing previewUrl/file data
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'youtubeEmbed') {
        youtubeLinks.push(node.attrs.url);
      } else if (node.type.name === 'imageBlock') {
        const id = node.attrs.id;
        // Get items from live node attrs (not serialized JSON)
        const stagedItems = Array.isArray(node.attrs.stagedItems) && node.attrs.stagedItems.length > 0
          ? node.attrs.stagedItems
          : null;
        const images = Array.isArray(node.attrs.images) && node.attrs.images.length > 0
          ? node.attrs.images
          : null;
        const items = stagedItems || images || [];

        // Debug logging
        console.log(`🔍 Preview: Found imageBlock ID="${id}", items=${items.length}, stagedItems=${stagedItems ? stagedItems.length : 0}, images=${images ? images.length : 0}`);

        if (items.length > 0) {
          previewImageBlocks[id] = items.map(item => ({
            ...item,
            url: item.url || item.previewUrl,
          }));
        } else {
          console.warn(`⚠️  Preview: Image block "${id}" has NO items! stagedItems=${JSON.stringify(stagedItems)}, images=${JSON.stringify(images)}`);
        }
      }
    });

    console.log(`📊 Preview: Total blocks found: ${Object.keys(previewImageBlocks).length}`, Object.keys(previewImageBlocks));

    let htmlContent = editor.getHTML();

    youtubeLinks.forEach((url, index) => {
      const pattern = new RegExp(
        `<div[^>]*data-type=["']youtube-embed["'][^>]*data-url="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>.*?</div>`,
        'gi'
      );
      htmlContent = htmlContent.replace(pattern, `<div id="yt${index}"></div>`);
    });

    Object.keys(previewImageBlocks).forEach((blockId) => {
      // Escape blockId for safe regex use
      const escapedBlockId = blockId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Find the opening tag
      const openTagPattern = new RegExp(
        `<div[^>]*data-id=["']${escapedBlockId}["'][^>]*>`,
        'i'
      );
      const match = htmlContent.match(openTagPattern);

      if (match) {
        const startIndex = htmlContent.indexOf(match[0]);
        const afterOpenTag = startIndex + match[0].length;

        // Count div depth to find the CORRECT closing tag
        let depth = 1;
        let i = afterOpenTag;

        while (i < htmlContent.length && depth > 0) {
          // Check for opening div tag
          // Both <div > and <div> are 5 chars, need to check both
          if ((htmlContent.slice(i, i + 5) === '<div ' || htmlContent.slice(i, i + 5) === '<div>') &&
            htmlContent.charCodeAt(i + 4) !== 47) { // Make sure it's not </div
            depth++;
            i += 5; // FIXED: advance by 5, not 4
          }
          // Check for closing div tag
          else if (htmlContent.slice(i, i + 6) === '</div>') {
            depth--;
            if (depth === 0) break;
            i += 6;
          }
          else {
            i++;
          }
        }

        const endIndex = i + 6; // include </div>
        const replacement = `<div class="image-block" id="${blockId}"></div>`;
        htmlContent = htmlContent.slice(0, startIndex) + replacement + htmlContent.slice(endIndex);

        console.log(`✅ Preview: Replaced imageBlock "${blockId}" (was chars ${startIndex}-${endIndex})`);
      } else {
        console.warn(`❌ Preview: Could NOT find imageBlock "${blockId}"`);
      }
    });

    return {
      content: htmlContent,
      ytlinks: youtubeLinks,
      imageBlocks: previewImageBlocks,
    };
  }, [editor]);

  if (!editor) return null;
  const previewData = showPreview ? getPreviewData() : null;

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <form onSubmit={handleSubmit} className="flex flex-col h-full w-full">
        {/* Combined Fixed Header (Toolbar + Actions) */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-2 shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Toolbar Area */}
            <div className="flex-1 overflow-x-auto no-scrollbar">
              <MenuBar editor={editor} onInsertImageBlock={handleInsertImageBlock} />
            </div>

            {/* Action Area */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold transition-all hover:bg-gray-200 border border-gray-200 text-sm"
              >
                <Eye size={18} />
                <span>Preview</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold transition-all hover:bg-blue-700 shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Submit Blog</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-transparent">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">

            <div className="space-y-4">
              {/* A. Title Input */}
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={100}
                required
                placeholder="Enter Blog Title..."
                className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 px-0"
              />

              {/* Author Details */}
              <AuthorDetails formData={formData} />
            </div>

            {/* B. Rich Text Editor */}
            <div className="relative min-h-[500px] border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all bg-white shadow-sm overflow-hidden [&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:p-6 [&_.ProseMirror]:focus:outline-none">
              <EditorContent editor={editor} />
            </div>

            {/* D. Featured Image Section */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Thumbnail Image</h2>

              {/* Upload Area */}
              <div className="flex flex-col gap-4">
                {!imageFile ? (
                  <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-10 transition-colors hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-full text-gray-500">
                      <FileImage size={24} />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-blue-600">Upload Thumbnail</span>
                      <p className="mt-1 text-xs text-gray-500">One high-quality 16:9 thumbnail image is required.</p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex flex-col gap-4 w-full max-w-2xl">
                    <div className="relative group rounded-xl overflow-hidden border border-gray-200 w-full aspect-video bg-gray-100 flex items-center justify-center shadow-sm">
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt={imageFile.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md"
                        >
                          <X size={16} /> Remove Image
                        </button>
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Alt Text (Mandatory for SEO)
                      </label>
                      <input
                        type="text"
                        value={featuredImageAlt}
                        onChange={(e) => setFeaturedImageAlt(e.target.value)}
                        placeholder="Describe the image (e.g., 'Authentication workflow using JWT')"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Make it descriptive (minimum 3 words) to help search engines understand this image.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Modals */}
      {/* Preview Modal */}
      <BlogPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={formData.title}
        content={previewData?.content}
        authorName={formData.authorName}
        authorRole={formData.authorRole}
        featuredImage={imageFile}
        ytlinks={previewData?.ytlinks}
        imageBlocks={previewData?.imageBlocks}
      />

      <MultiImageUploadModal
        isOpen={showMultiImageModal}
        onCancel={handleMultiImageCancel}
        onSave={handleMultiImageSave}
        existingBlock={editingBlock}
      />
      <CropImageModal
        isOpen={showCropModal}
        imageSrc={imageToCrop}
        fileName={originalFileName}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
        aspect={16 / 9}
      />
      <Toaster position="top-right" />
    </div>
  );
};

export default StaffBlogs;
