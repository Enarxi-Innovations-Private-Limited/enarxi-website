import { useState,useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../AuthProvider";

export default function Login() {
  const {role,loading}=useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && role === "admin") {
      navigate("/admin");
    }
  }, [ role,loading]);
  if (loading || role === "admin") {
    return <div className="text-black text-center">Loading...</div>;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin"); // ✅ Just navigate directly
    } catch (err) {
      setError("Invalid credentials");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      <motion.form
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleLogin}
        className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-extrabold text-center text-gray-800 mb-6"
        >
          Admin Login
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
          Admin Login, not staff 
        </motion.button>
      </motion.form>
    </div>
  );
}
