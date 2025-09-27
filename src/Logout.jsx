
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';

const Logout = () => {
  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      console.log('Admin logged out successfully.');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button onClick={logoutAdmin}>Logout</button>
  );
};

export default Logout;
