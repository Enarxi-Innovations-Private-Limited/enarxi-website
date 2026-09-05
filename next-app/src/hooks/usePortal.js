import { useState, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/AuthProvider";
import { usePortalPersistence } from "@/hooks/usePortalPersistence";

export const usePortal = (portalKey, defaultTab) => {
  const { activeSection, setActiveSection, clearPersistedState } = usePortalPersistence(portalKey, defaultTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, role, loading, isOnline, firebaseUser } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      clearPersistedState();
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, [clearPersistedState]);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return {
    activeTab: activeSection,
    setActiveTab: setActiveSection,
    isSidebarOpen,
    setIsSidebarOpen,
    showLogoutModal,
    setShowLogoutModal,
    user,
    role,
    loading,
    isOnline,
    firebaseUser,
    toggleSidebar,
    closeSidebar,
    handleLogout,
  };
};
