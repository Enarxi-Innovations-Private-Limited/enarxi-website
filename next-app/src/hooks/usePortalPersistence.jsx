import { useState, useEffect, useCallback } from 'react';

/**
 * usePortalPersistence Hook
 * Persists active section and scroll position across page reloads
 * 
 * @param {string} portalKey - Unique key for the portal (e.g., 'admin-portal', 'staff-portal')
 * @param {string} defaultSection - Default section to show if no saved state
 * @returns {Object} - { activeSection, setActiveSection, isRestoring }
 */
export const usePortalPersistence = (portalKey, defaultSection = 'dashboard') => {
  const [activeSection, setActiveSectionState] = useState(defaultSection);
  const [isRestoring, setIsRestoring] = useState(true);

  // Storage keys
  const SECTION_KEY = `${portalKey}-active-section`;
  const SCROLL_KEY = `${portalKey}-scroll-position`;

  /**
   * Load saved state on mount
   */
  useEffect(() => {
    try {
      const savedSection = sessionStorage.getItem(SECTION_KEY);
      const savedScroll = sessionStorage.getItem(SCROLL_KEY);

      if (savedSection) {
        setActiveSectionState(savedSection);
      }

      // Restore scroll position after a short delay to ensure content is rendered
      if (savedScroll) {
        const scrollPosition = parseInt(savedScroll, 10);
        
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          setTimeout(() => {
            window.scrollTo({
              top: scrollPosition,
              behavior: 'instant', // Use 'instant' for immediate scroll on reload
            });
            setIsRestoring(false);
          }, 100); // Small delay to ensure content is fully rendered
        });
      } else {
        setIsRestoring(false);
      }
    } catch (error) {
      console.error('Error restoring portal state:', error);
      setIsRestoring(false);
    }
  }, [SECTION_KEY, SCROLL_KEY]);

  /**
   * Save scroll position on scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      try {
        sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
      } catch (error) {
        console.error('Error saving scroll position:', error);
      }
    };

    // Throttle scroll events to avoid excessive storage writes
    let scrollTimeout;
    const throttledScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [SCROLL_KEY]);

  /**
   * Save section when it changes
   */
  const setActiveSection = useCallback((section) => {
    try {
      setActiveSectionState(section);
      sessionStorage.setItem(SECTION_KEY, section);
      
      // Reset scroll position when changing sections
      window.scrollTo({ top: 0, behavior: 'smooth' });
      sessionStorage.setItem(SCROLL_KEY, '0');
    } catch (error) {
      console.error('Error saving active section:', error);
      setActiveSectionState(section);
    }
  }, [SECTION_KEY, SCROLL_KEY]);

  /**
   * Clear saved state (useful for logout)
   */
  const clearPersistedState = useCallback(() => {
    try {
      sessionStorage.removeItem(SECTION_KEY);
      sessionStorage.removeItem(SCROLL_KEY);
    } catch (error) {
      console.error('Error clearing persisted state:', error);
    }
  }, [SECTION_KEY, SCROLL_KEY]);

  return {
    activeSection,
    setActiveSection,
    isRestoring,
    clearPersistedState,
  };
};
