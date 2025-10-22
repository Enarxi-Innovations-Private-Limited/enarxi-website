import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase user
  const [firebaseUser, setFirebaseUser] = useState(null); // Firebase user
  const [role, setRole] = useState(null); // Role from Firestore
  const [loading, setLoading] = useState(true);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Set basic user info immediately
          setUser(firebaseUser);
          
          try {
            // Try to get role from Firestore
            const userRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setRole(userData.role || null);
              setFirebaseUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || userData.name || null,
                name: userData.name || null,
                role: userData.role || null,
                status: userData.status || null,
              });
            } else {
              // User document doesn't exist, set basic info
              setFirebaseUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || null,
                name: null,
                role: null,
                status: null,
              });
            }
          } catch (firestoreError) {
            // Handle Firestore errors (offline, permission denied, etc.)
            console.warn('⚠️ Failed to fetch user data from Firestore:', firestoreError.message);
            
            // Set basic user info from auth even if Firestore fails
            setFirebaseUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || null,
              name: null,
              role: null,
              status: null,
            });
            
            // If offline, try to get cached data
            if (firestoreError.code === 'unavailable') {
              console.log('📡 Device is offline. Using cached data if available.');
            }
          }
        } else {
          setUser(null);
          setRole(null);
          setFirebaseUser(null);
        }
      } catch (error) {
        console.error('❌ Auth state change error:', error);
        setUser(null);
        setRole(null);
        setFirebaseUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOnline) {
      console.warn("⚠️ You are offline. Firebase will use cache mode.");
    }
  }, [isOnline]);
  return (
    <AuthContext.Provider value={{ user, role, loading, firebaseUser, isOnline }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
