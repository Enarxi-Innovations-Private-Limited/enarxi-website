"use client";
import { motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import logo from '@/assets/images/logo.svg';

const BrandedLoader = ({ message = 'Loading...', isOffline = false }) => {
  return (
    <div className={`fixed inset-0 ${
      isOffline ? 'bg-orange-50/90' : 'bg-white/80'
    } backdrop-blur-md flex items-center justify-center z-50`}>
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Logo or Offline Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          className="relative"
        >
          {/* Pulsing Ring */}
          <motion.div
            className={`absolute inset-0 rounded-full ${
              isOffline ? 'bg-orange-500/20' : 'bg-blue-500/20'
            }`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Logo Container or Offline Icon */}
          {isOffline ? (
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-4 shadow-2xl flex items-center justify-center"
            >
              <WifiOff className="w-10 h-10 text-white" />
            </motion.div>
          ) : (
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-4 shadow-2xl"
            >
              <img 
                src={logo} 
                alt="Enarxi Logo" 
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-md px-4"
        >
          <h3 className={`text-xl font-semibold text-poppins mb-2 ${
            isOffline ? 'text-orange-900' : 'text-gray-900'
          }`}>
            {message}
          </h3>
          
          {isOffline && (
            <p className="text-sm text-orange-700 mt-2">
              Working in offline mode. Changes will sync when you're back online.
            </p>
          )}
          
          {/* Animated Dots */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  isOffline ? 'bg-orange-600' : 'bg-blue-600'
                }`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BrandedLoader;
