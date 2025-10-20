import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Calendar, X } from "lucide-react";
import { db } from "@lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setUser(null);
      setBlogs([]);

      const queryName = username.toLowerCase();

      try {
        let userSnap;

        // Step 1: Try the primary, case-insensitive 'searchableName' field first.
        const userQueryPrimary = query(
          collection(db, "users"),
          where("searchableName", ">=", queryName),
          where("searchableName", "<", queryName + '\uf8ff')
        );
        userSnap = await getDocs(userQueryPrimary);

        // Step 2: If that fails, fall back to the legacy 'name' field.
        if (userSnap.empty) {
          console.log(`No user found with 'searchableName'. Trying legacy 'name' field...`);
          const userQueryLegacy = query(
            collection(db, "users"),
            where("name", ">=", queryName),
            where("name", "<", queryName + '\uf8ff')
          );
          userSnap = await getDocs(userQueryLegacy);
        }
        
        // If still not found, exit.
        if (userSnap.empty) {
          console.log(`User matching "${queryName}" not found in either field.`);
          setLoading(false);
          return;
        }

        const userData = userSnap.docs[0].data();
        const userId = userSnap.docs[0].id;

        // Fetch team member image using the same two-step logic
        let profileImageUrl = null;
        let teamMemberSnap;

        const teamMemberQueryPrimary = query(
          collection(db, "teamMembers"),
          where("searchableName", ">=", queryName),
          where("searchableName", "<", queryName + '\uf8ff')
        );
        teamMemberSnap = await getDocs(teamMemberQueryPrimary);

        if (teamMemberSnap.empty) {
          const teamMemberQueryLegacy = query(
            collection(db, "teamMembers"),
            where("name", ">=", queryName),
            where("name", "<", queryName + '\uf8ff')
          );
          teamMemberSnap = await getDocs(teamMemberQueryLegacy);
        }

        if (!teamMemberSnap.empty) {
          const teamMemberData = teamMemberSnap.docs[0].data();
          profileImageUrl = teamMemberData.images?.[0]?.url;
        }

        // Set the user state so the profile renders immediately
        setUser({
          ...userData,
          profileImage: profileImageUrl,
        });

        // --- Fetch Blogs ---
        const blogsQuery = query(collection(db, "blogs"), where("userId", "==", userId));
        const blogsSnap = await getDocs(blogsQuery);
        const userBlogs = blogsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setBlogs(userBlogs);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (loading) {
    return (
      <section className="w-[90%] max-w-7xl mx-auto py-12 min-h-[60vh]">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-8 mb-12 items-start bg-gray-50 p-8 rounded-xl">
            <div className="w-48 h-48 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-4 pt-4">
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="w-[90%] max-w-7xl mx-auto py-12 min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">User Not Found</h2>
          <p className="text-gray-500 mt-2">Could not find a user with the name "{username}".</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-[90%] max-w-7xl mx-auto py-12 min-h-[60vh]">
        {/* --- Profile Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-[#dff4ff] to-white rounded-xl shadow-sm p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name.split(' ').join('+')}&background=random`}
              alt={user.name}
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
            />
            <div className="flex-grow">
              <h1 className="text-4xl md:text-5xl/12 font-bold font-oswald text-gray-900 mb-3 capitalize">
                {user.name}
              </h1>
              <p className="text-base text-gray-600 mb-4 font-poppins">
                {user.email}
              </p>
              {user.createdAt && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar size={16} />
                  <span className="font-poppins">
                    Joined on {new Date(user.createdAt.toDate()).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {user.description && (
                <p className="text-sm text-gray-700 leading-relaxed font-poppins max-w-2xl mt-4 pt-4 border-t border-gray-200">
                  {user.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* --- Blogs Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-oswald text-gray-900 mb-8 capitalize">
            Blogs by {user.name.split(" ")[0]}
          </h2>
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  onClick={() => setSelectedBlog(blog)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden group transition hover:shadow-md cursor-pointer"
                >
                  <div className="w-full aspect-video overflow-hidden">
                    <img
                      src={blog.images?.[0]?.url || 'https://picsum.photos/seed/fallback/400/250'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3 className="text-base font-semibold font-oswald text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {blog.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg font-poppins capitalize">
                {user.name.split(" ")[0]} has not published any blogs yet.
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* --- MODAL --- */}
    <AnimatePresence>
        {selectedBlog && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setSelectedBlog(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 120, damping: 15, duration: 0.4 }}
            >
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-3 right-3 text-white bg-black/75 p-2 cursor-pointer rounded-full z-10 hover:bg-black transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-4 w-full flex flex-col items-center rounded-xl overflow-y-auto">
                <div className="w-full flex justify-center rounded-xl items-center bg-gray-100 p-4 mb-4">
                  <img
                    src={selectedBlog.images?.[0]?.url || "/blogs/default.jpg"}
                    alt={selectedBlog.title}
                    className="w-full max-h-[40vh] object-contain rounded-lg"
                  />
                </div>
                
                <div className="p-4 w-full">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between items-center text-gray-600 mb-4 pb-4 border-b">
                    <h2 className="text-2xl lg:text-3xl font-bold font-oswald text-black text-center sm:text-left">
                      {selectedBlog.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm whitespace-nowrap">
                      <span>By <Link to={`/users/${user.name}`} className="font-semibold text-blue-600 hover:underline">{user.name}</Link></span>
                    </div>
                  </div>
                  <div
                    className="prose lg:prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content || "" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}