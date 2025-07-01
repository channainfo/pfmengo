"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { loadFromStorage } from "../lib/features/auth/authSlice";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitialized: authStateInitialized } = useAppSelector((state) => state.auth);
  
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Load auth state from storage immediately
    dispatch(loadFromStorage());
    setAuthInitialized(true);
  }, [isClient, dispatch]);

  useEffect(() => {
    // Wait for both local initialization and Redux state initialization
    if (!authInitialized || !authStateInitialized) return;
    
    const token = localStorage.getItem('token');
    
    // No token means not authenticated
    if (!token || !user) {
      setIsLoading(false);
      router.push('/auth/login');
      return;
    }
    
    // We have both token and user - auth is ready
    setIsLoading(false);
  }, [authInitialized, authStateInitialized, user, router]);

  // During SSR, just show loading
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Still loading auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // No user after loading - redirect to login
  if (!user && !isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  return <>{children}</>;
}