import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import BlogSkeleton from "@/components/shared/BlogSkeleton";
import { createFullSlug } from "@/utils/slugUtils";
import { Eye } from "lucide-react";

export default function Blog() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          where("isAdminAccepted", "==", true),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const blogData = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            // console.log(data);

            // Handle both old format (string) and new format (object with url)
            let imageUrl = "/blogs/default.jpg";
            if (data.images && data.images.length > 0) {
              const firstImage = data.images[0];
              // Check if it's the new format (object with url property)
              if (typeof firstImage === "object" && firstImage.url) {
                imageUrl = firstImage.url;
              }
              // Check if it's a Cloudinary URL (string)
              else if (
                typeof firstImage === "string" &&
                firstImage.includes("cloudinary")
              ) {
                imageUrl = firstImage;
              }
              // Fallback to old format (local path)
              else if (typeof firstImage === "string") {
                imageUrl = `/blogs/${firstImage}`;
              }
            }

            return {
              id: doc.id,
              title: data.title || "Untitled Blog",
              desc: data.content || "",
              date: data.createdAt?.toDate().toLocaleDateString() || "",
              img: imageUrl,
              images: data.images || [], // Store all images for modal
              authorName: data.authorName || "Anonymous",
              authorRole: data.authorRole || "Staff",
              visibility: data.visibility, // Include visibility field
              views: data.views || 0,
              slug: data.slug || "",
            };
          })
          // Filter to show only visible blogs (visibility === true OR visibility field doesn't exist)
          .filter((blog) => blog.visibility !== false);

        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching blogs:", error);

        // Check if it's an index error
        if (
          error.code === "failed-precondition" ||
          error.message?.includes("index")
        ) {
          console.error(
            "Firestore index required. Check console for index creation URL."
          );
          console.error("Index URL:", error.message);
        }

        // Set empty array so UI doesn't break
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleBlogClick = (blog) => {
    const slug = blog.slug || createFullSlug(blog.title, blog.id);
    navigate(`/blog/${slug}`);
  };

  return (
    <section className="w-[90%] mx-auto py-12 min-h-[60vh]">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold font-oswald">
          Our Blogs
        </h2>
      </div>

      {/* Blog grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          // Show skeleton loaders while loading
          <>
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              // transition={{ delay: (index % 4) * 0.1}}
              >
                <BlogSkeleton />
              </motion.div>
            ))}
          </>
        ) : blogs.length === 0 ? (
          // Show empty state
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No blogs available at the moment.</p>
          </div>
        ) : (
          // Show actual blogs with fade-in animation
          blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              // initial={{ opacity: 0, y: 20 }}
              // animate={{ opacity: 1, y: 0 }}
              // transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer group"
              onClick={() => handleBlogClick(blog)}
            >
              <div className="w-full aspect-video overflow-hidden">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 flex flex-col h-full">
                <h3 className="text-base font-semibold mb-2 line-clamp-2 leading-tight">{blog.title}</h3>
                <p
                  className="text-xs text-gray-600 mb-2 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: blog.desc.slice(0, 100) + "...",
                  }}
                />
                <p className="text-xs text-gray-500 mb-1">By <span className="font-medium">{blog.authorName}</span></p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">{blog.date}</p>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Eye size={14} />
                    <span className="text-xs">{blog.views}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
