import React, { memo } from "react";
import { EditorContent } from "@tiptap/react";
import { 
  Youtube, Image, Bold, Italic, Heading1, Heading2, Heading3, 
  List, ListOrdered, Save, User, Briefcase, FileImage, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, X, Minus, 
  Loader2, Eye 
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import CropImageModal from "@/components/CropImageModal";
import MultiImageUploadModal from "@/layout/MultiImageUploadModal";
import BlogPreviewModal from "@/components/BlogPreviewModal";
import { isYouTubeUrl } from "@/utils/youtubeUtils";
import "@/pages/staff/tiptap.css";

const ToolbarButton = ({ onClick, isActive, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={`p-2 rounded-md transition-colors w-8 h-8 flex items-center justify-center ${
      isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-600 hover:bg-gray-200'
    }`}
    title={title}
  >
    {children}
  </button>
);

const MenuBar = memo(({ editor, onInsertImageBlock }) => {
  if (!editor) return null;

  const handleYouTubeEmbed = () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');
    if (!selectedText || !isYouTubeUrl(selectedText.trim())) {
      alert('Please select a valid YouTube URL first');
      return;
    }
    editor.chain().focus().setYouTubeEmbed(selectedText.trim()).run();
  };

  return (
    <div className="flex items-center gap-4 py-2 overflow-x-auto w-full">
      <div className="flex items-center gap-1 border-r border-gray-300 pr-4">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold"><Bold size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic"><Italic size={16} /></ToolbarButton>
      </div>
      <div className="flex items-center gap-1 border-r border-gray-300 pr-4">
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} title="H1"><Heading1 size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} title="H2"><Heading2 size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} title="H3"><Heading3 size={16} /></ToolbarButton>
      </div>
      <div className="flex items-center gap-1 border-r border-gray-300 pr-4">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet List"><List size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Ordered List"><ListOrdered size={16} /></ToolbarButton>
      </div>
      <div className="flex items-center gap-1 border-r border-gray-300 pr-4">
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Left"><AlignLeft size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Center"><AlignCenter size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Right"><AlignRight size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify"><AlignJustify size={16} /></ToolbarButton>
      </div>
      <div className="flex items-center gap-1">
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={16} /></ToolbarButton>
        <ToolbarButton onClick={onInsertImageBlock} title="Images"><Image size={16} /></ToolbarButton>
        <ToolbarButton onClick={handleYouTubeEmbed} isActive={editor.isActive("youtubeEmbed")} title="YouTube"><Youtube size={16} /></ToolbarButton>
      </div>
    </div>
  );
});

export const StaffBlogsView = ({
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
  previewData,
  editingBlock,
  mediaStaging,
  setFeaturedImageAlt,
  setShowPreview,
  handleInputChange,
  handleFileChange,
  handleCropComplete,
  handleCropCancel,
  handleRemoveImage,
  handleMultiImageSave,
  handleMultiImageCancel,
  handleInsertImageBlock,
  handleSubmit
}) => {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      
      <form onSubmit={handleSubmit} className="flex flex-col h-full w-full">
        {/* Toolbar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-2 shrink-0">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 overflow-x-auto no-scrollbar">
              <MenuBar editor={editor} onInsertImageBlock={handleInsertImageBlock} />
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-semibold transition-all hover:bg-gray-100 border border-gray-200 text-sm"
              >
                <Eye size={18} />
                <span>Preview</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold transition-all hover:bg-blue-700 shadow-lg disabled:opacity-50 text-sm"
              >
                {loading ? <><Loader2 className="animate-spin" size={18} /><span>Uploading...</span></> : <><Save size={18} /><span>Submit Blog</span></>}
              </button>
            </div>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto px-6 py-12 scrollbar-hide">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Title Section */}
            <div className="space-y-2">
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter Blog Title..."
                className="w-full text-3xl font-bold text-gray-900 border-none p-0 focus:ring-0 placeholder:text-gray-300 font-oswald focus:outline-none"
                required
              />
              <div className="flex items-center gap-6 text-sm text-gray-500 font-poppins">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span>{formData.authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-400" />
                  <span className="capitalize">{formData.authorRole}</span>
                </div>
              </div>
            </div>

            {/* Editor Area */}
            <div className="border-2 border-blue-400 rounded-2xl bg-white overflow-hidden min-h-[500px] shadow-sm">
              <div className="p-2 prose prose-lg max-w-none">
                <EditorContent editor={editor} className="outline-none" />
              </div>
            </div>

            <div className="h-[1px] bg-gray-100 w-full" />

            {/* Thumbnail Section */}
            <div className="space-y-4 pb-20">
              <h3 className="text-xl font-bold text-gray-900 font-oswald">Thumbnail Image</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="relative aspect-video rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden group">
                  {imageFile ? (
                    <>
                      <img src={URL.createObjectURL(imageFile)} alt="Thumbnail" className="w-full h-full object-cover" />
                      <button type="button" onClick={handleRemoveImage} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"><X size={16} /></button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100 transition-all group">
                      <div className="p-4 bg-gray-100 rounded-2xl group-hover:bg-blue-50 transition-colors mb-4">
                        <FileImage className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <span className="text-blue-600 font-bold text-lg mb-1">Upload Thumbnail</span>
                      <span className="text-sm text-gray-400 px-8 text-center">One high-quality 16:9 thumbnail image is required.</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">SEO Alt Text</label>
                    <textarea
                      value={featuredImageAlt}
                      onChange={(e) => setFeaturedImageAlt(e.target.value)}
                      placeholder="Describe this image for SEO and accessibility (min 3 words)..."
                      className="w-full text-base text-gray-700 border-2 border-gray-100 rounded-xl p-4 focus:border-blue-400 focus:ring-0 transition-colors h-32 resize-none"
                    />
                  </div>
                </div>
              </div>
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
        onCancel={handleMultiImageCancel}
        onSave={handleMultiImageSave}
        initialData={editingBlock ? (mediaStaging.stagedBlocks[editingBlock] || []) : []}
        editingBlockId={editingBlock}
      />

      <BlogPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={formData.title}
        content={previewData?.content || ''}
        authorName={formData.authorName}
        authorRole={formData.authorRole}
        featuredImage={imageFile ? URL.createObjectURL(imageFile) : '/blogs/default.jpg'}
        ytlinks={previewData?.ytlinks || []}
        imageBlocks={previewData?.imageBlocks || {}}
      />
    </div>
  );
};
