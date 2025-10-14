import { motion } from 'framer-motion';

const BlogSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Thumbnail Skeleton */}
      <div className="w-full aspect-w-16 aspect-h-9 overflow-hidden rounded-xl">
        <motion.div
          className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <motion.div
            className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 100%',
              width: '90%',
            }}
          />
          <motion.div
            className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.1,
            }}
            style={{
              backgroundSize: '200% 100%',
              width: '60%',
            }}
          />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <motion.div
            className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.2,
            }}
            style={{
              backgroundSize: '200% 100%',
            }}
          />
          <motion.div
            className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.3,
            }}
            style={{
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Date Skeleton */}
        <motion.div
          className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            delay: 0.4,
          }}
          style={{
            backgroundSize: '200% 100%',
            width: '40%',
          }}
        />

        {/* Button Skeleton */}
        <motion.div
          className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            delay: 0.5,
          }}
          style={{
            backgroundSize: '200% 100%',
            width: '30%',
          }}
        />
      </div>
    </div>
  );
};

export default BlogSkeleton;
