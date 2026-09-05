import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const adminService = {
  /**
   * Listen to pending blogs
   */
  subscribeToPendingBlogs(callback) {
    const q = query(
      collection(db, "blogs"),
      where("isAdminAccepted", "==", false)
    );
    return onSnapshot(q, (snapshot) => {
      const allPending = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const retryCount = allPending.filter(blog => blog.status === "retry").length;
      const trulyPending = allPending.length - retryCount;
      callback({ trulyPending, retryCount });
    });
  },

  /**
   * Listen to pending reviews
   */
  subscribeToPendingReviews(callback) {
    const q = query(
      collection(db, "testimonials"),
      where("status", "==", "pending")
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.size);
    }, (error) => {
      console.error("Error subscribing to reviews:", error);
      callback(0);
    });
  },

  /**
   * Listen to total users
   */
  subscribeToTotalUsers(callback) {
    return onSnapshot(collection(db, "users"), (snapshot) => {
      callback(snapshot.size);
    });
  },

  /**
   * Listen to recent admin activities
   */
  subscribeToRecentActivities(callback, activityLimit = 5) {
    const q = query(
      collection(db, "adminActivities"),
      orderBy("timestamp", "desc"),
      limit(activityLimit)
    );
    return onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(activities);
    }, (error) => {
      console.error("Error subscribing to activities:", error);
      callback([]);
    });
  },

  /**
   * Log an admin activity
   */
  async logActivity(adminName, action, description) {
    return await addDoc(collection(db, "adminActivities"), {
      adminName,
      action,
      description,
      timestamp: serverTimestamp(),
    });
  }
};
