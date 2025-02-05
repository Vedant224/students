import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Perform logout actions (e.g., clear tokens, user data, etc.)
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    // Redirect to the sign-in page
    navigate('/sign-in', { replace: true }); // `replace: true` prevents going back
  };

  return logout;
};