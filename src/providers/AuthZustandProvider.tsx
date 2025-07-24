// src/providers/AuthZustandProvider.tsx
'use client'; // This component MUST be a client component

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore'; // Adjust path as needed

export default function AuthZustandProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // This effect hook ensures initializeAuth runs only on the client side
    // after the component mounts.
    initializeAuth();
  }, [initializeAuth]); // Depend on initializeAuth to avoid re-running unnecessarily

  return <>{children}</>;
}