import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./Blog.module.css";
import { motion, AnimatePresence } from "framer-motion";
import BlogSkeleton from "@/components/shared/BlogSkeleton";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [selected, setSelected] = useState(null);
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
            console.log(data);

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

  useEffect(() => {
    console.log("This is the: ", selected?.desc);
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [selected]);

  return (
    <section className="w-[90%] mx-auto py-12 min-h-[60vh]">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold font-oswald">
          Our Blogs
        </h2>
      </div>

      {/* Blog grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Show skeleton loaders while loading
          <>
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="w-full aspect-w-16 aspect-h-9 overflow-hidden rounded-xl">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{blog.title}</h3>
                <p
                  className="text-sm text-gray-500 mb-3 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: blog.desc.slice(0, 120) + "...",
                  }}
                />
                <p className="text-xs text-gray-400">{blog.date}</p>
                <button
                  onClick={() => setSelected(blog)}
                  className="text-sm text-sky-500 font-medium mt-2 cursor-pointer underline"
                >
                  View Post
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Modal container */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 15,
                duration: 0.4,
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-white bg-black/75 p-2 cursor-pointer rounded-full z-10 float-right"
              >
                <X size={20} />
              </button>

              {/* Everything inside scrolls together */}
              <div className="p-4 flex flex-col items-center rounded-xl overflow-y-auto">
                {/* Image */}
                <div className="w-full flex justify-center rounded-xl items-center bg-gray-100 p-4">
                  <img
                    src={selected.img}
                    alt={selected.title}
                    className="w-full max-h-[35vh] object-contain rounded-lg"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/blogs/default.jpg";
                    }}
                  />
                </div>

                {/* Additional images */}
                {selected.images && selected.images.length > 1 && (
                  <div className="px-4 pb-4 flex gap-2 overflow-x-auto">
                    {selected.images.slice(1).map((imgData, idx) => {
                      const imgUrl =
                        typeof imgData === "object" ? imgData.url : imgData;
                      return (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt={`${selected.title} - ${idx + 2}`}
                          className="h-20 w-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Scrollable content (now part of the whole scroll) */}
                <div className="p-4">
                  <h2 className={styles.title}>{selected.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span>By {selected.authorName}</span>
                    <span>•</span>
                    <span>{selected.authorRole}</span>
                    <span>•</span>
                    <p className={styles.date}>{selected.date}</p>
                  </div>
                  <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: selected.desc }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
