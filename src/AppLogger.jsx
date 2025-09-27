import { useEffect } from 'react';
import { auth } from '@/lib/firebase'; // your Firebase setup
import { onAuthStateChanged } from 'firebase/auth';

export default function AppLogger() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Logged in user:', user.displayName || user.email);
      } else {
        console.log('No user logged in');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return null; // This component doesn't render anything
}
