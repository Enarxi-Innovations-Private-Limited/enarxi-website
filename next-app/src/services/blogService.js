import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { incrementBlogViews } from "@/lib/api";

/**
 * Normalizes blog data from Firestore format to UI format
 */
const normalizeBlog = (docSnap) => {
  const data = docSnap.data();
  const id = docSnap.id;

  let imageUrl = "/blogs/default.jpg";
  if (data.images && data.images.length > 0) {
    const firstImage = data.images[0];
    if (typeof firstImage === "object" && firstImage.url) {
      imageUrl = firstImage.url;
    } else if (typeof firstImage === "string" && firstImage.includes("cloudinary")) {
      imageUrl = firstImage;
    } else if (typeof firstImage === "string") {
      imageUrl = `/blogs/${firstImage}`;
    }
  }

  return {
    id,
    title: data.title || "Untitled Blog",
    desc: data.content || "",
    content: data.content || "",
    date: data.createdAt?.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }) || "",
    img: imageUrl,
    images: data.images || [],
    authorName: data.authorName || "Anonymous",
    authorRole: data.authorRole || "Staff",
    visibility: data.visibility !== false,
    views: data.views || 0,
    slug: data.slug || "",
    ytlinks: data.ytlinks || [],
    imageBlocks: data.imageBlocks || {},
    isAdminAccepted: data.isAdminAccepted || false,
    createdAt: data.createdAt,
  };
};

export const blogService = {
  /**
   * Fetch all approved and visible blogs
   */
  async getApprovedBlogs() {
    const q = query(
      collection(db, "blogs"),
      where("isAdminAccepted", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(normalizeBlog)
      .filter(blog => blog.visibility);
  },

  /**
   * Fetch a single blog by slug
   */
  async getBlogBySlug(slug) {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return normalizeBlog(querySnapshot.docs[0]);
    }
    return null;
  },

  /**
   * Fetch a single blog by ID (legacy support)
   */
  async getBlogById(id) {
    const blogRef = doc(db, "blogs", id);
    const blogSnap = await getDoc(blogRef);
    if (blogSnap.exists()) {
      return normalizeBlog(blogSnap);
    }
    return null;
  },

  /**
   * Create a new blog entry
   */
  async createBlog(blogData) {
    return await addDoc(collection(db, "blogs"), {
      ...blogData,
      isAdminAccepted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Increment view count for a blog
   */
  async incrementViews(blogId) {
    return await incrementBlogViews(blogId);
  }
};
