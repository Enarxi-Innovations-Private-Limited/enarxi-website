import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Calendar } from "lucide-react";
import { db } from "@lib/firebase";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";

export default function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setUser(null);
      setBlogs([]);

      const queryName = username.toLowerCase();

      try {
        // --- Part 1: Fetch the User and Profile Image ---
        let userSnap;

        // Step 1: Try the primary, case-insensitive search field first.
        const userQueryPrimary = query(
          collection(db, "users"),
          where("searchableName", ">=", queryName),
          where("searchableName", "<", queryName + '\uf8ff')
        );
        userSnap = await getDocs(userQueryPrimary);

        // Step 2: If the primary search fails, try the legacy 'name' field as a fallback.
        if (userSnap.empty) {
          console.log(`No user found with 'searchableName'. Trying legacy 'name' field...`);
          const userQueryLegacy = query(
            collection(db, "users"),
            where("name", ">=", queryName),
            where("name", "<", queryName + '\uf8ff')
          );
          userSnap = await getDocs(userQueryLegacy);
        }
        
        // If still not found after both attempts, exit.
        if (userSnap.empty) {
          console.log(`User matching "${queryName}" not found in either field.`);
          setLoading(false);
          return;
        }

        const userData = userSnap.docs[0].data();
        const userId = userSnap.docs[0].id;
        const actualName = userData.name; // Get the correctly cased name from the document

        // Fetch team member image using the same two-step query logic
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

        setUser({
          ...userData,
          profileImage: profileImageUrl,
        });

        // --- Part 2: Fetch the Blogs ---
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
        {/* Loading Skeleton Here */}
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
            src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
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
          Blogs by {user.name}
        </h2>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
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
                  <h3 className="text-base font-semibold font-oswald text-gray-900 mb-2 line-clamp-2 leading-tight flex-grow">
                    {blog.title}
                  </h3>
                  <div
                    className="text-xs text-gray-600 mb-3 line-clamp-2 font-poppins"
                    dangerouslySetInnerHTML={{ __html: blog.content || "" }}
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span className="font-poppins">{blog.views || 0}</span>
                    </div>
                    {blog.createdAt && (
                      <span className="font-poppins">
                        {new Date(blog.createdAt.toDate()).toLocaleDateString()}
                      </span>
                    )}
                  </div>
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
  );
}