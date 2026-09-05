"use client";
import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Loader2 } from "lucide-react";

const GalleryItem = ({ images, thumbnail, title, imageCount, onClick }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let interval;
    if (hovered && images && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 1200);
    } else {
      setCurrentImage(0);
    }
    return () => clearInterval(interval);
  }, [hovered, images]);

  return (
    <div
      className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-700 hover:-translate-y-2 md:hover:-translate-y-3 hover:shadow-2xl shadow-md md:shadow-lg border border-gray-100"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
        {images && images.length > 0 ? (
          images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={img.title || title}
              className={`absolute top-0 left-0 w-full h-full object-contain transition-all duration-700 ${
                idx === currentImage ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
            />
          ))
        ) : (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-contain transition-all duration-700"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Image counter indicator */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 md:px-3 rounded-full font-medium">
          {images && images.length > 1 ? `${currentImage + 1} / ${images.length}` : `${imageCount} ${imageCount === 1 ? 'Image' : 'Images'}`}
        </div>
      </div>
      
      <div className="p-4 md:p-5">
        <h3 className="text-gray-800 font-semibold text-sm md:text-base leading-relaxed group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        <div className="mt-2 flex items-center text-xs md:text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
          <span>View Details</span>
          <svg className="w-3 h-3 md:w-4 md:h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Fetch gallery posts from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'gallery'),
      where('visibility', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGalleries(posts);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching gallery posts:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedPost !== null) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedPost]);

  // Keyboard navigation for gallery posts
  useEffect(() => {
    if (selectedPost === null) return;

    const handleKeyDown = (e) => {
      const currentIndex = galleries.findIndex(g => g.id === selectedPost.id);
      
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setSelectedPost(galleries[currentIndex - 1]);
        setModalImageIndex(0);
      } else if (e.key === 'ArrowRight' && currentIndex < galleries.length - 1) {
        setSelectedPost(galleries[currentIndex + 1]);
        setModalImageIndex(0);
      } else if (e.key === 'Escape') {
        setSelectedPost(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost, galleries]);

  // Touch swipe handlers for mobile navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const currentIndex = galleries.findIndex(g => g.id === selectedPost?.id);

    if (isLeftSwipe && currentIndex < galleries.length - 1) {
      setSelectedPost(galleries[currentIndex + 1]);
      setModalImageIndex(0);
    }
    if (isRightSwipe && currentIndex > 0) {
      setSelectedPost(galleries[currentIndex - 1]);
      setModalImageIndex(0);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-oswald mb-3 md:mb-4 tracking-tight">
          Gallery
        </h1>
        {/* <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full" /> */}
        <p className="mt-3 md:mt-4 text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4">
          Showcasing the Core of Our Creations
        </p>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        </div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No gallery posts available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 w-[90%] max-w-7xl mx-auto">
          {galleries.map((item) => (
            <GalleryItem 
              key={item.id}
              images={item.images}
              thumbnail={item.thumbnail?.url} 
              title={item.title} 
              imageCount={item.images?.length || 0}
              onClick={() => { 
                setSelectedPost(item); 
                setModalImageIndex(0);
              }} 
            />
          ))}
        </div>
      )}

      {/* Premium Modal */}
      {selectedPost !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 md:p-4 animate-fadeIn overflow-hidden"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-white w-full max-w-6xl h-[92vh] md:h-[85vh] flex flex-col md:flex-row rounded-2xl md:rounded-3xl overflow-hidden relative shadow-2xl transform transition-all duration-500 scale-100"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            
            {/* Left: Image Carousel */}
            <div className="w-full md:w-3/5 h-[30vh] md:h-full relative bg-gradient-to-br from-gray-900 to-gray-800 flex-shrink-0">
              <img
                src={selectedPost.images[modalImageIndex]?.url}
                alt={selectedPost.images[modalImageIndex]?.title || selectedPost.title}
                className="w-full h-full object-contain transition-all duration-500"
              />
              
              {/* Image navigation arrows */}
              {selectedPost.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImageIndex((prev) => (prev - 1 + selectedPost.images.length) % selectedPost.images.length);
                    }}
                    className="absolute cursor-pointer left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 md:p-2 shadow-lg transition-all duration-300 z-10"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImageIndex((prev) => (prev + 1) % selectedPost.images.length);
                    }}
                    className="absolute cursor-pointer right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 md:p-2 shadow-lg transition-all duration-300 z-10"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-3 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium">
                {modalImageIndex + 1} / {selectedPost.images.length}
              </div>
            </div>

            {/* Right: Description */}
            <div className="w-full md:w-2/5 p-5 md:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50 overflow-y-auto flex-1 min-h-0">
              <div key={`${selectedPost.id}-${modalImageIndex}`} className="animate-fadeIn">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
                  {selectedPost.title}
                </h2>
                <h3 className="text-lg md:text-xl font-semibold text-blue-600 mb-3 md:mb-4 transition-all duration-300">
                  {selectedPost.images[modalImageIndex]?.title}
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {selectedPost.images[modalImageIndex]?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 md:top-6 md:right-6 cursor-pointer bg-white/90 hover:bg-white rounded-full p-1.5 md:p-2 shadow-lg transition-all duration-300 hover:scale-110 z-20"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* External Navigation Arrows - Outside Modal (Instagram Style) */}
          {/* Left Arrow - Previous Post - Hidden on mobile */}
          {galleries.findIndex(g => g.id === selectedPost.id) > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = galleries.findIndex(g => g.id === selectedPost.id);
                setSelectedPost(galleries[currentIndex - 1]);
                setModalImageIndex(0);
              }}
              className="hidden md:flex absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 md:p-3 shadow-xl transition-all duration-300 hover:scale-110 z-10 group cursor-pointer items-center justify-center"
              aria-label="Previous gallery item"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow - Next Post - Hidden on mobile */}
          {galleries.findIndex(g => g.id === selectedPost.id) < galleries.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = galleries.findIndex(g => g.id === selectedPost.id);
                setSelectedPost(galleries[currentIndex + 1]);
                setModalImageIndex(0);
              }}
              className="hidden md:flex absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 md:p-3 shadow-xl transition-all duration-300 hover:scale-110 z-10 group cursor-pointer items-center justify-center"
              aria-label="Next gallery item"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
