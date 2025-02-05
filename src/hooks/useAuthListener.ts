import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from 'src/firebase';

export function useAuthListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is not authenticated, redirect to sign-in page
        navigate('/sign-in', { replace: true });
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);
}