import React, { useState, useEffect } from "react";
import { useAuth } from "@/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { Book, CheckCircle, Clock, RefreshCw, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}
  >
    <div className="flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </motion.div>
);

// Card for each individual retry blog
const RetryBlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm flex items-start justify-between gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
            Needs Revision
          </span>
        </div>
        <p className="text-gray-800 font-semibold truncate">{blog.title}</p>
        {blog.retryFeedback && (
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-600">Admin feedback: </span>
            {blog.retryFeedback}
          </p>
        )}
      </div>
      <button
        onClick={() => navigate(`/staff/blogs/${blog.id}/edit`)}
        className="flex items-center gap-1.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors px-3 py-2 rounded-lg shrink-0"
      >
        <Pencil size={14} />
        Edit
      </button>
    </motion.div>
  );
};

const StaffDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    retry: 0,
  });
  const [retryBlogs, setRetryBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let total = 0;
        let accepted = 0;
        let pending = 0;
        let retry = 0;
        const retryList = [];

        querySnapshot.forEach((doc) => {
          const blog = { id: doc.id, ...doc.data() };
          total++;

          if (blog.status === "approved") {
            accepted++;
          } else if (blog.status === "retry") {
            retry++;
            retryList.push(blog);
          } else {
            // covers "pending" and any other status
            pending++;
          }
        });

        setStats({ total, accepted, pending, retry });
        setRetryBlogs(retryList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching blog stats: ", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Dashboard</h1>

      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Book size={32} className="text-blue-500" />}
              title="Blogs Written"
              value={stats.total}
              color="border-blue-500"
            />
            <StatCard
              icon={<CheckCircle size={32} className="text-green-500" />}
              title="Blogs Accepted"
              value={stats.accepted}
              color="border-green-500"
            />
            <StatCard
              icon={<Clock size={32} className="text-yellow-500" />}
              title="Pending Approval"
              value={stats.pending}
              color="border-yellow-500"
            />
            <StatCard
              icon={<RefreshCw size={32} className="text-orange-500" />}
              title="Needs Revision"
              value={stats.retry}
              color="border-orange-500"
            />
          </div>

          {/* Retry Blogs Section */}
          {retryBlogs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <RefreshCw size={20} className="text-orange-500" />
                Blogs Needing Revision
              </h2>
              <div className="flex flex-col gap-3">
                {retryBlogs.map((blog) => (
                  <RetryBlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StaffDashboard;