import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function StaffLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check user role in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'employee' || userData.role === 'intern') {
          navigate('/staff'); // Success, navigate to staff portal
        } else {
          await signOut(auth); // Not a staff member, sign out
          setError('Access denied. Not a staff member.');
        }
      } else {
        await signOut(auth); // No user record, sign out
        setError('User profile not found.');
      }
    } catch (err) {
      setError('Incorrect credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      <motion.form
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        onSubmit={handleLogin}
        className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-extrabold text-center text-gray-800 mb-6"
        >
          Staff Login
        </motion.h2>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mb-4 text-center"
          >
            {error}
          </motion.p>
        )}

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all p-3 w-full mb-4 rounded-lg outline-none"
        />

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all p-3 w-full mb-6 rounded-lg outline-none"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold w-full py-3 rounded-lg shadow-md"
        >
          Login
        </motion.button>
      </motion.form>
    </div>
  );
}
