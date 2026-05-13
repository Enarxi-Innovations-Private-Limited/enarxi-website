import { db } from "../config/firebase.js"


export const updateBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, content, images, ytlinks, status, retryFeedback, updatedAt, imageBlocks } = req.body;

        const blogRef = db.collection("blogs").doc(blogId);
        const blogDoc = await blogRef.get();

        if (!blogDoc.exists) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Only the blog owner can update
        if (blogDoc.data().userId !== req.user.uid) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        await blogRef.update({
            title,
            content,
            images,
            ytlinks,
            status,
            retryFeedback,
            updatedAt: new Date(),
            imageBlocks
        });

        res.json({ success: true, message: "Blog updated successfully" });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}