import React, { useState, useEffect } from 'react';
import { useAuth } from '@/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Book, CheckCircle, Clock } from 'lucide-react';

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
    <div className="flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </motion.div>
);

const StaffDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let total = 0;
      let accepted = 0;
      let pending = 0;

      querySnapshot.forEach((doc) => {
        const blog = doc.data();
        total++;
        if (blog.isAdminAccepted) {
          accepted++;
        } else {
          pending++;
        }
      });

      setStats({ total, accepted, pending });
      setLoading(false);
    }, (error) => {
      console.error("Error fetching blog stats: ", error);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Dashboard</h1>
      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
