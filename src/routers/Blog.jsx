import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./Blog.module.css";
export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          where("isAdminAccepted", "==", true),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const blogData = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(data);
          return {
            id: doc.id,
            title: data.title || "Untitled Blog",
            desc: data.content || "",
            date: data.createdAt?.toDate().toLocaleDateString() || "",
            img: data.images?.length
              ? `/blogs/${data.images[0]}`
              : "/blogs/default.jpg",
          };
        });
        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        
        // Check if it's an index error
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
          console.error('Firestore index required. Check console for index creation URL.');
          console.error('Index URL:', error.message);
        }
        
        // Set empty array so UI doesn't break
        setBlogs([]);
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
    <section className="w-[90%] mx-auto py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold font-oswald">
          Our Blogs
        </h2>
      </div>

      {/* Blog grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
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
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-white bg-black/75 p-2 cursor-pointer rounded-full z-10"
            >
              <X size={20} />
            </button>

            {/* Image (fixed height) */}
            <div className="w-full flex justify-center items-center bg-gray-100 p-4 flex-shrink-0">
              <img
                src={selected.img}
                alt={selected.title}
                className="w-full max-h-[35vh] object-contain rounded-lg"
              />
            </div>

            {/* Scrollable content */}
            <div className="p-4 overflow-y-auto flex-1">
              <h2 className={styles.title}>{selected.title}</h2>
              <p className={styles.date}>{selected.date}</p>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: selected.desc }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
