import { useEffect, useState } from 'react';
import { useAppSelector } from '../hooks';

export function useAuthReady() {
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Auth is ready when Redux state is initialized
    // This happens after loadFromStorage completes
    if (isInitialized) {
      setIsReady(true);
    }
  }, [isInitialized]);

  return {
    isAuthReady: isReady,
    user,
    isAuthenticated: !!user,
  };
}