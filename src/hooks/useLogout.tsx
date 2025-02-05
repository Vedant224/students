import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { auth } from 'src/firebase';


export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear any local storage or state
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      // Redirect to the sign-in page and replace the history entry
      navigate('/sign-in', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return logout;
};