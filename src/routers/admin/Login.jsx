import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../AuthProvider";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";

export default function Login() {
  const {role,loading}=useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setError("");
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleLogin}
          className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20"
        >
          {/* Header with icon */}
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl mb-4 shadow-lg"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h2>
            <p className="text-gray-500 text-sm">Sign in to access your dashboard</p>
          </motion.div>

          {/* Error message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-red-600 text-sm font-medium text-center">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email input */}
          <motion.div variants={itemVariants} className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </motion.div>

          {/* Password input */}
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            </div>
          </motion.div>

          {/* Submit button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>

          {/* Footer note */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Administrator access only. Unauthorized access is prohibited.
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
