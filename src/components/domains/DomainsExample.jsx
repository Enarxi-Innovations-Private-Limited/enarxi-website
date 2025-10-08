import React from 'react';
import DomainsCluster from './DomainsCluster';

/**
 * Example usage of DomainsCluster component
 * This demonstrates how to integrate the component with your data
 */

// Example domain data
const exampleDomains = [
  {
    id: 'iot',
    title: 'Industrial IoT',
    description: 'Connecting machines, sensors, and software to create intelligent, data-driven industrial ecosystems.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    href: '/domains/iot',
    size: 'large',
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    id: 'drone',
    title: 'Drone & UAV',
    description: 'Advanced aerial systems combining precision engineering and real-time data processing.',
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    href: '/domains/drone',
    size: 'medium',
    gradient: 'from-purple-600 to-pink-500',
  },
  {
    id: 'wearable',
    title: 'Wearables',
    description: 'Smart, connected devices that integrate seamlessly with human activity.',
    imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80',
    href: '/domains/wearable',
    size: 'small',
    gradient: 'from-green-600 to-emerald-500',
  },
  {
    id: 'rapid-prototyping',
    title: 'Rapid Prototyping',
    description: 'Fast, precise, and cost-effective product development from concept to model.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    href: '/domains/rapid-prototyping',
    size: 'small',
    gradient: 'from-orange-600 to-red-500',
  },
  {
    id: 'security',
    title: 'Security Devices',
    description: 'Advanced protection and intelligent monitoring solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    href: '/domains/security',
    size: 'large',
    gradient: 'from-indigo-600 to-blue-500',
  },
  {
    id: 'ml-ai',
    title: 'ML & AI',
    description: 'Intelligent algorithms driving predictive analytics and automation.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    href: '/domains/ml-ai',
    size: 'small',
    gradient: 'from-violet-600 to-purple-500',
  },
  {
    id: 'home-automation',
    title: 'Home Automation',
    description: 'Intelligence, comfort, and energy efficiency for modern living spaces.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    href: '/domains/home-automation',
    size: 'medium',
    gradient: 'from-pink-600 to-rose-500',
  },
  {
    id: 'biometric',
    title: 'Biometric Devices',
    description: 'Secure, accurate identity verification and access control systems.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    href: '/domains/biometric',
    size: 'large',
    gradient: 'from-teal-600 to-cyan-500',
  },
  {
    id: 'ev',
    title: 'Electric Vehicles',
    description: 'Intelligent electronic modules and battery management systems.',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    href: '/domains/ev',
    size: 'small',
    gradient: 'from-lime-600 to-green-500',
  },
  {
    id: 'healthcare',
    title: 'Healthcare Devices',
    description: 'Connected medical systems improving diagnostics and patient care.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    href: '/domains/healthcare',
    size: 'large',
    gradient: 'from-red-600 to-pink-500',
  },
  {
    id: 'ar-vr',
    title: 'AR & VR',
    description: 'Immersive experiences for training, visualization, and education.',
    imageUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80',
    href: '/domains/ar-vr',
    size: 'large',
    gradient: 'from-fuchsia-600 to-purple-500',
  },
  {
    id: 'biomedical',
    title: 'Biomedical Equipment',
    description: 'Engineering precision merged with medical innovation.',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80',
    href: '/domains/biomedical',
    size: 'medium',
    gradient: 'from-sky-600 to-blue-500',
  },
  {
    id: 'industrial-automation',
    title: 'Industrial Automation',
    description: 'IoT and control systems optimizing manufacturing processes.',
    imageUrl: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80',
    href: '/domains/industrial-automation',
    size: 'large',
    gradient: 'from-amber-600 to-orange-500',
  },
];

/**
 * Example Component
 */
const DomainsExample = () => {
  /**
   * Handle card click
   * Hook for analytics or custom navigation
   */
  const handleCardClick = (domain) => {
    console.log('Card clicked:', domain);
    
    // Example: Track analytics
    // analytics.track('domain_card_clicked', {
    //   domain_id: domain.id,
    //   domain_title: domain.title,
    // });

    // Example: Custom navigation
    // if (domain.href) {
    //   router.push(domain.href);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Working Domains
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our expertise across cutting-edge technologies and industries
        </p>
      </div>

      {/* Domains Cluster */}
      <div className="max-w-7xl mx-auto">
        <DomainsCluster
          domains={exampleDomains}
          initialIndex={0}
          onCardClick={handleCardClick}
          className="mb-16"
        />
      </div>
    </div>
  );
};

export default DomainsExample;

/**
 * INTEGRATION GUIDE
 * ==================
 * 
 * 1. Basic Usage:
 * ```jsx
 * import DomainsCluster from '@/components/domains/DomainsCluster';
 * 
 * function MyPage() {
 *   const domains = [
 *     {
 *       id: 'unique-id',
 *       title: 'Domain Title',
 *       description: 'Short description',
 *       imageUrl: 'https://example.com/image.jpg',
 *       href: '/link',
 *       size: 'medium', // 'small' | 'medium' | 'large'
 *       gradient: 'from-blue-500 to-purple-600',
 *     },
 *     // ... more domains
 *   ];
 * 
 *   return <DomainsCluster domains={domains} />;
 * }
 * ```
 * 
 * 2. With Cloudinary Images:
 * ```jsx
 * const domains = [
 *   {
 *     id: 'iot',
 *     title: 'Industrial IoT',
 *     // Cloudinary URL with transformations
 *     imageUrl: 'https://res.cloudinary.com/your-cloud/image/upload/w_800,q_auto,f_auto/v1/domains/iot.jpg',
 *     // ... other props
 *   },
 * ];
 * ```
 * 
 * 3. With Click Handler:
 * ```jsx
 * const handleClick = (domain) => {
 *   // Track analytics
 *   analytics.track('domain_viewed', { id: domain.id });
 *   
 *   // Navigate
 *   router.push(domain.href);
 * };
 * 
 * <DomainsCluster domains={domains} onCardClick={handleClick} />
 * ```
 * 
 * 4. Progressive Image Loading (Cloudinary):
 * ```jsx
 * const getImageUrl = (path, options = {}) => {
 *   const { width = 800, quality = 'auto', format = 'auto' } = options;
 *   return `https://res.cloudinary.com/your-cloud/image/upload/w_${width},q_${quality},f_${format}/v1/${path}`;
 * };
 * 
 * const domains = [
 *   {
 *     id: 'iot',
 *     title: 'Industrial IoT',
 *     imageUrl: getImageUrl('domains/iot.jpg'),
 *     // ... other props
 *   },
 * ];
 * ```
 * 
 * 5. Environment Variables (Optional):
 * ```env
 * VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
 * VITE_CLOUDINARY_BASE_URL=https://res.cloudinary.com/your-cloud-name/image/upload
 * ```
 * 
 * Then use:
 * ```jsx
 * const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;
 * const imageUrl = `${CLOUDINARY_BASE}/w_800,q_auto,f_auto/v1/domains/iot.jpg`;
 * ```
 */
