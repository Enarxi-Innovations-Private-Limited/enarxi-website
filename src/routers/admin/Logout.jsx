import { useState } from "react";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import logout from "@/assets/logout.png";
import ConfirmModal from "@/components/shared/ConfirmModal";

const Logout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      console.log("Admin logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <button onClick={() => setShowLogoutModal(true)}>
        <img src={logout} alt="logout" className="w-10 h-10 rounded-full cursor-pointer" />
      </button>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logoutAdmin}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
};

export default Logout;
