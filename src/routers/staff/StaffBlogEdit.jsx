import React, { useState, useEffect, useCallback, memo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { db } from "@/lib/firebase";
import { useAuth } from "@/AuthProvider";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { getImageDimensions, isAspectRatio16x9, validateImageFile } from "@/utils/imageCropUtils";
import CropImageModal from "@/components/CropImageModal";
import { extractYouTubeLinks, isYouTubeUrl } from "@/utils/youtubeUtils";
import { Youtube, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Link from "@tiptap/extension-link";
import { YouTubeLink } from "@/extensions/YouTubeLink";
import "./tiptap.css"; // reuse same styles
import { updateBlog } from "@/lib/api";
// ── Reuse the same MenuBar from StaffBlogs ────────────────────────────────────
const MenuBar = memo(({ editor }) => {
    const [_, setForceUpdate] = useState(0);

    useEffect(() => {
        if (!editor) return;
        const handleUpdate = () => setForceUpdate((v) => v + 1);
        editor.on("transaction", handleUpdate);
        return () => editor.off("transaction", handleUpdate);
    }, [editor]);

    if (!editor) return null;

    const handleYouTubeLink = () => {
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, "");
        if (!selectedText) { alert("Please select a YouTube URL first"); return; }
        if (!isYouTubeUrl(selectedText.trim())) { alert("Selected text is not a valid YouTube URL"); return; }
        editor.chain().focus().setYouTubeLink(selectedText.trim()).run();
    };

    return (
        <div className="menu-bar">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""}>Bold</button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""}>Italic</button>
            <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive("paragraph") ? "is-active" : ""}>Paragraph</button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}>H1</button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}>H2</button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""}>List</button>
            <button type="button" onClick={handleYouTubeLink} className={editor.isActive("youtubeLink") ? "is-active" : ""} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Youtube size={16} /> YouTube
            </button>
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
    const [existingImage, setExistingImage] = useState(null); // current Cloudinary image
    const [imageFile, setImageFile] = useState(null);         // new local file to replace it
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [showCropModal, setShowCropModal] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [originalFileName, setOriginalFileName] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: false, listItem: false, orderedList: false, bulletList: false }),
            Heading.extend({ addKeyboardShortcuts() { return { Enter: () => this.editor.commands.splitBlock() }; } }),
            OrderedList,
            BulletList,
            ListItem.extend({ keepOnSplit: true }),
            Link.configure({ openOnClick: false }),
            YouTubeLink,
        ],
        content: "",
    });

    useEffect(() => () => editor?.destroy(), [editor]);

    // ── Fetch existing blog data ────────────────────────────────────────────────
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

                // Security: only the blog owner can edit
                if (data.userId !== user?.uid) {
                    setFetchError("You do not have permission to edit this blog.");
                    return;
                }

                // Security: only retry blogs should be editable here
                if (data.status !== "retry") {
                    setFetchError("This blog is not in retry status and cannot be edited here.");
                    return;
                }

                setRetryFeedback(data.retryFeedback || "");
                setFormData({
                    authorName: data.authorName || firebaseUser?.name || user?.email || "",
                    authorRole: data.authorRole || role || "",
                    title: data.title || "",
                });

                // Pre-fill existing image
                if (data.images && data.images.length > 0) {
                    const first = data.images[0];
                    setExistingImage(typeof first === "object" ? first : { url: first });
                }

                // Pre-fill editor content
                editor.commands.setContent(data.content || "");
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
        if (!validation.valid) { setMessage(`❌ ${validation.error}`); e.target.value = ""; return; }

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
            setMessage("❌ Failed to process image. Please try again.");
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

    // ── Submit (update, not create) ─────────────────────────────────────────────
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!editor || !user) return;

        const finalHtmlContent = editor.getHTML();
        if (finalHtmlContent === "<p></p>") {
            setMessage("Blog content cannot be empty.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // Extract YouTube links
            const youtubeLinks = extractYouTubeLinks(finalHtmlContent);
            let cleanedContent = finalHtmlContent;
            youtubeLinks.forEach((url, index) => {
                const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const patterns = [
                    new RegExp(`<a[^>]*href=["']${escapedUrl}["'][^>]*>.*?</a>`, "gi"),
                    new RegExp(`<span[^>]*data-youtube-url=["']${escapedUrl}["'][^>]*>.*?</span>`, "gi"),
                    new RegExp(`(?<!["'>])${escapedUrl}(?!["'<])`, "gi"),
                ];
                const placeholder = `<div id="yt${index}"></div>`;
                patterns.forEach((p) => { cleanedContent = cleanedContent.replace(p, placeholder); });
            });

            // Upload new image if selected, otherwise keep existing
            let uploadedImages = existingImage ? [existingImage] : [];

            if (imageFile) {
                if (imageFile.size > 5 * 1024 * 1024) {
                    setMessage("❌ Image is too large. Max size is 5MB.");
                    setLoading(false);
                    return;
                }
                setMessage("📤 Uploading new image...");
                const uploadResult = await uploadToCloudinary(imageFile);
                uploadedImages = [{
                    url: uploadResult.url,
                    publicId: uploadResult.publicId,
                    format: uploadResult.format,
                    width: uploadResult.width,
                    height: uploadResult.height,
                }];
            }

            // Update Firestore — reset status back to "pending" for admin to re-review
            setMessage("💾 Saving changes...");
            const blogRef = doc(db, "blogs", blogId);
            await updateBlog(blogId, {
                title: formData.title,
                content: cleanedContent,
                images: uploadedImages,
                ytlinks: youtubeLinks,
                status: "pending",
                retryFeedback: null,
                updatedAt: new Date(),
            });

            setMessage("✅ Blog resubmitted successfully! Waiting for admin review.");
            setTimeout(() => navigate("/staff"), 2000);
        } catch (err) {
            console.error("Error updating blog:", err);
            setMessage(`❌ Failed to update blog: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [editor, user, formData, imageFile, existingImage, blogId, navigate]);

    // ── Loading / error states ──────────────────────────────────────────────────
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

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-2xl">

                {/* Back button */}
                <button
                    onClick={() => navigate("/staff")}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-sm transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
                    Revise Blog Post
                </h1>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Make the requested changes and resubmit for admin review.
                </p>

                {/* Admin feedback banner */}
                {retryFeedback && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex gap-3">
                        <AlertTriangle size={20} className="text-orange-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-orange-800 mb-1">Admin Feedback</p>
                            <p className="text-sm text-orange-700">{retryFeedback}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Author details — read only */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Name</label>
                            <input type="text" value={formData.authorName} readOnly
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Role</label>
                            <input type="text" value={formData.authorRole} readOnly
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
                        <input
                            type="text" name="title" value={formData.title}
                            onChange={handleInputChange} maxLength={100} required
                            placeholder="Enter your blog title (max 100 characters)"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100 characters</p>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Blog Content</label>
                        <div className="editor-container">
                            <MenuBar editor={editor} />
                            <EditorContent editor={editor} />
                        </div>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>

                        {/* Show existing Cloudinary image */}
                        {existingImage && !imageFile && (
                            <div className="mb-3">
                                <p className="text-xs text-gray-500 mb-1">Current image:</p>
                                <div className="relative inline-block">
                                    <img src={existingImage.url} alt="Current"
                                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-md" />
                                    <button type="button" onClick={() => setExistingImage(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600 shadow-lg">
                                        ×
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Remove to upload a new image.</p>
                            </div>
                        )}

                        <input type="file" onChange={handleFileChange} accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        <p className="mt-1 text-xs text-gray-500">Upload a new image to replace the current one.</p>

                        {/* Preview new image */}
                        {imageFile && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-1">New image preview:</p>
                                <div className="relative inline-block">
                                    <img src={URL.createObjectURL(imageFile)} alt="New"
                                        className="w-32 h-32 object-cover rounded-lg border-2 border-indigo-300 shadow-md" />
                                    <button type="button" onClick={() => setImageFile(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600 shadow-lg">
                                        ×
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">{imageFile.name}</p>
                            </div>
                        )}
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm font-medium ${message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                            {message}
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className={`w-full py-3 mt-4 font-bold text-white rounded-lg shadow-md transition duration-300 ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                            }`}>
                        {loading ? "Resubmitting..." : "Resubmit for Review"}
                    </button>
                </form>
            </div>

            <CropImageModal
                isOpen={showCropModal} imageSrc={imageToCrop}
                fileName={originalFileName}
                onCropComplete={handleCropComplete}
                onCancel={handleCropCancel}
            />
        </div>
    );
};

export default StaffBlogEdit;