import { createContext, useContext, useEffect, useState, startTransition } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    firebaseUser: null,
    role: null,
    loading: true,
  });

  const isOnline = useOnlineStatus();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Initial state with just the basic user
          let role = null;
          let extendedUserData = null;
          
          try {
            // Try to get role from Firestore
            const userRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              const userData = userSnap.data();
              role = userData.role || null;
              extendedUserData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || userData.name || null,
                name: userData.name || null,
                role: userData.role || null,
                status: userData.status || null,
              };
            } else {
              // User document doesn't exist, set basic info
              extendedUserData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || null,
                name: null,
                role: null,
                status: null,
              };
            }
          } catch (firestoreError) {
            console.warn('⚠️ Failed to fetch user data from Firestore:', firestoreError.message);
            extendedUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || null,
              name: null,
              role: null,
              status: null,
            };
          }

          // Final consolidated update wrapped in startTransition to avoid flushSync warnings
          startTransition(() => {
            setAuthState({
              user: firebaseUser,
              firebaseUser: extendedUserData,
              role: role,
              loading: false,
            });
          });
        } else {
          startTransition(() => {
            setAuthState({
              user: null,
              role: null,
              firebaseUser: null,
              loading: false,
            });
          });
        }
      } catch (error) {
        console.error('❌ Auth state change error:', error);
        startTransition(() => {
          setAuthState({
            user: null,
            role: null,
            firebaseUser: null,
            loading: false,
          });
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const { user, role, loading, firebaseUser } = authState;

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
