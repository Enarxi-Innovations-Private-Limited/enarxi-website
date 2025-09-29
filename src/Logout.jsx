import { auth } from "./lib/firebase";
import { signOut } from "firebase/auth";
import logout from "@/assets/logout.png";

const Logout = () => {
    const logoutAdmin = async () => {
      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (!confirmLogout) return;
    try {
      await signOut(auth);
      console.log("Admin logged out successfully.");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button onClick={()=>logoutAdmin()}>
      <img src={logout} alt="logout" className="w-10 h-10 rounded-full" />
    </button>
  );
};

export default Logout;
