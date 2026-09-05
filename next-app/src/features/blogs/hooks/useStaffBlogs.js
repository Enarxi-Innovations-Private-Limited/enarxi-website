"use client";
import { useState, useEffect, useCallback } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import toast from "react-hot-toast";

import { useAuth } from "@/AuthProvider";
import { useMediaStaging } from "@/hooks/useMediaStaging";
import { ImageBlock } from "@/extensions/ImageBlock";
import { YouTubeEmbed } from "@/extensions/YouTubeEmbed";
import { blogService } from "@/services/blogService";
import { cloudinaryService } from "@/services/cloudinaryService";
import { resolveUniqueSlug } from "@/utils/slugUtils";
import { generateSeoFileName, validateAltText } from "@/utils/seoUtils";
import { 
  getImageDimensions, 
  isAspectRatio16x9, 
  validateImageFile 
} from "@/utils/imageCropUtils";

export const useStaffBlogs = () => {
  const { user, role, firebaseUser } = useAuth();
  const mediaStaging = useMediaStaging();

  // Form State
  const [formData, setFormData] = useState({ authorName: "", authorRole: "", title: "" });
  const [blogContent, setBlogContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal & Edit States
  const [editingBlock, setEditingBlock] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [showMultiImageModal, setShowMultiImageModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Initialize Editor
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
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => setBlogContent(editor.getHTML()),
  });

  // Pre-fill Author Info
  useEffect(() => {
    if (user && role) {
      setFormData(prev => ({
        ...prev,
        authorName: firebaseUser?.name || user.email || "",
        authorRole: role,
      }));
    }
  }, [user, role, firebaseUser]);

  // Draft Logic
  useEffect(() => {
    if (!editor) return;
    const savedDraft = localStorage.getItem("blog_draft");
    if (savedDraft) {
      try {
        const { formData: savedForm, content: savedContent, featuredImageAlt: savedAlt } = JSON.parse(savedDraft);
        if (savedForm?.title) setFormData(prev => ({ ...prev, title: savedForm.title }));
        if (savedAlt) setFeaturedImageAlt(savedAlt);
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
    if (formData.title || (blogContent && blogContent !== "<p></p>")) {
      localStorage.setItem("blog_draft", JSON.stringify({ formData, content: blogContent, featuredImageAlt }));
    }
  }, [formData.title, blogContent, featuredImageAlt]);

  // Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback(async (e) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      e.target.value = "";
      return;
    }

    try {
      const dimensions = await getImageDimensions(file);
      if (isAspectRatio16x9(dimensions.width, dimensions.height)) {
        setImageFile(file);
      } else {
        setOriginalFileName(file.name);
        setImageToCrop(URL.createObjectURL(file));
        setShowCropModal(true);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image.");
      e.target.value = "";
    }
  }, []);

  const handleCropComplete = useCallback((croppedFile) => {
    setImageFile(croppedFile);
    setShowCropModal(false);
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
      setImageToCrop(null);
    }
  }, [imageToCrop]);

  const handleCropCancel = useCallback(() => {
    setShowCropModal(false);
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
      setImageToCrop(null);
    }
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  }, [imageToCrop]);

  const handleMultiImageSave = useCallback(({ id, stagedItems }) => {
    mediaStaging.updateStagedFiles(id, stagedItems);
    if (editor) {
      const existingNode = editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "imageBlock" && node.attrs.id === id) {
          editor.chain().focus().command(({ tr }) => {
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, stagedItems });
            return true;
          }).run();
          return false;
        }
      });
      if (!existingNode) {
        editor.chain().focus().insertContent({ type: "imageBlock", attrs: { id, stagedItems } }).run();
      }
    }
    setEditingBlock(null);
    setShowMultiImageModal(false);
  }, [editor, mediaStaging]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!editor || !user) return;

    if (imageFile) {
      const altValidation = validateAltText(featuredImageAlt, 3);
      if (!altValidation.valid) {
        toast.error(altValidation.error);
        return;
      }
    }

    const finalHtmlContent = editor.getHTML();
    if (finalHtmlContent === "<p></p>") {
      toast.error("Blog content cannot be empty.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Preparing blog for submission...");

    try {
      // Extraction
      const editorJson = editor.getJSON();
      const youtubeLinks = [];
      const imageBlockIds = [];
      const traverseNodes = (node) => {
        if (node.type === "youtubeEmbed") youtubeLinks.push(node.attrs.url);
        else if (node.type === "imageBlock") imageBlockIds.push(node.attrs.id);
        if (node.content) node.content.forEach(traverseNodes);
      };
      editorJson.content?.forEach(traverseNodes);

      // Featured Image Upload
      let uploadedImages = [];
      if (imageFile) {
        if (imageFile.size > 5 * 1024 * 1024) throw new Error("Thumbnail is too large (max 5MB)");
        toast.loading("Uploading thumbnail...", { id: toastId });
        const seoName = generateSeoFileName(featuredImageAlt, imageFile.name);
        const seoFile = new File([imageFile], seoName, { type: imageFile.type });
        const uploadResult = await cloudinaryService.uploadImage(seoFile);
        uploadedImages.push({
          ...uploadResult,
          altText: featuredImageAlt,
        });
      }

      // Image Blocks Upload
      toast.loading("Uploading image blocks...", { id: toastId });
      const activeBlocks = {};
      imageBlockIds.forEach(id => {
        const items = mediaStaging.stagedBlocks[id] || [];
        if (items.length > 0) activeBlocks[id] = items;
      });

      const uploadedImageBlocks = await mediaStaging.flushUploads(
        cloudinaryService.uploadImage,
        ({ current, total, fileName }) => {
          toast.loading(`Uploading image ${current}/${total}: ${fileName}...`, { id: toastId });
        },
        activeBlocks
      );

      // Content Sanitization
      let cleanedContent = finalHtmlContent;
      youtubeLinks.forEach((url, idx) => {
        const ytPattern = /<div[^>]*data-type="youtube-embed"[^>]*>.*?<\/div>/gi;
        cleanedContent = cleanedContent.replace(ytPattern, `<div id="yt${idx}"></div>`);
      });
      imageBlockIds.forEach(id => {
        const imgPattern = new RegExp(`<div[^>]*data-id=["']${id}["'][^>]*>.*?</div>`, "i");
        cleanedContent = cleanedContent.replace(imgPattern, `<div class="image-block" id="${id}"></div>`);
      });

      // Persist to DB
      const slug = await resolveUniqueSlug(formData.title);
      await blogService.createBlog({
        userId: user.uid,
        title: formData.title,
        slug,
        authorName: formData.authorName,
        authorRole: formData.authorRole,
        content: cleanedContent,
        images: uploadedImages,
        ytlinks: youtubeLinks,
        imageBlocks: uploadedImageBlocks,
      });

      toast.success("Blog submitted for approval!", { id: toastId });
      
      // Cleanup
      setTimeout(() => {
        setImageFile(null);
        mediaStaging.clearAll();
        editor.commands.clearContent(true);
        setBlogContent("");
        setFormData(prev => ({ ...prev, title: "" }));
        setFeaturedImageAlt("");
        localStorage.removeItem("blog_draft");
      }, 2000);

    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const getPreviewData = useCallback(() => {
    if (!editor) return { content: "", ytlinks: [], imageBlocks: {} };

    const previewImageBlocks = {};
    const youtubeLinks = [];

    editor.state.doc.descendants((node) => {
      if (node.type.name === "youtubeEmbed") {
        youtubeLinks.push(node.attrs.url);
      } else if (node.type.name === "imageBlock") {
        const id = node.attrs.id;
        const stagedItems = Array.isArray(node.attrs.stagedItems) && node.attrs.stagedItems.length > 0
          ? node.attrs.stagedItems
          : null;
        const images = Array.isArray(node.attrs.images) && node.attrs.images.length > 0
          ? node.attrs.images
          : null;
        const items = stagedItems || images || [];
        
        if (items.length > 0) {
          previewImageBlocks[id] = items.map(item => ({
            ...item,
            url: item.url || item.previewUrl,
          }));
        }
      }
    });

    let htmlContent = editor.getHTML();
    youtubeLinks.forEach((url, index) => {
      const pattern = new RegExp(
        `<div[^>]*data-type=["']youtube-embed["'][^>]*data-url="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>.*?</div>`,
        "gi"
      );
      htmlContent = htmlContent.replace(pattern, `<div id="yt${index}"></div>`);
    });

    Object.keys(previewImageBlocks).forEach((blockId) => {
      const escapedBlockId = blockId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const openTagPattern = new RegExp(`<div[^>]*data-id=["']${escapedBlockId}["'][^>]*>`, "i");
      const match = htmlContent.match(openTagPattern);

      if (match) {
        const startIndex = htmlContent.indexOf(match[0]);
        const afterOpenTag = startIndex + match[0].length;
        let depth = 1;
        let i = afterOpenTag;

        while (i < htmlContent.length && depth > 0) {
          if ((htmlContent.slice(i, i + 5) === "<div " || htmlContent.slice(i, i + 5) === "<div>") &&
            htmlContent.charCodeAt(i + 4) !== 47) {
            depth++;
            i += 5;
          } else if (htmlContent.slice(i, i + 6) === "</div>") {
            depth--;
            if (depth === 0) break;
            i += 6;
          } else {
            i++;
          }
        }
        const endIndex = i + 6;
        const replacement = `<div class="image-block" id="${blockId}"></div>`;
        htmlContent = htmlContent.slice(0, startIndex) + replacement + htmlContent.slice(endIndex);
      }
    });

    return { content: htmlContent, ytlinks: youtubeLinks, imageBlocks: previewImageBlocks };
  }, [editor]);

  // Event Listeners
  useEffect(() => {
    const handleInsertImageEvent = (e) => {
      setEditingBlock(e.detail || null);
      setShowMultiImageModal(true);
    };
    window.addEventListener("insert-image-block", handleInsertImageEvent);
    return () => window.removeEventListener("insert-image-block", handleInsertImageEvent);
  }, []);

  useEffect(() => {
    const handleSyncStaged = (e) => {
      const { id, stagedItems } = e.detail;
      mediaStaging.updateStagedFiles(id, stagedItems);
    };
    window.addEventListener("sync-staged-block", handleSyncStaged);
    return () => window.removeEventListener("sync-staged-block", handleSyncStaged);
  }, [mediaStaging]);

  return {
    editor,
    formData,
    loading,
    imageFile,
    featuredImageAlt,
    showCropModal,
    imageToCrop,
    originalFileName,
    showMultiImageModal,
    showPreview,
    editingBlock,
    mediaStaging,
    previewData: showPreview ? getPreviewData() : null,
    setFormData,
    setFeaturedImageAlt,
    setShowPreview,
    setShowMultiImageModal,
    setEditingBlock,
    handleInputChange,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleRemoveImage: () => setImageFile(null),
    handleMultiImageSave,
    handleMultiImageCancel: () => {
      setEditingBlock(null);
      setShowMultiImageModal(false);
    },
    handleInsertImageBlock: () => {
      setEditingBlock(null);
      setShowMultiImageModal(true);
    },
    handleSubmit,
  };
};
