// context/AuthContext.js

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/app/lib/firebase'; // Import Firebase Authentication
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

/**
 * AuthProvider Component
 *
 * Provides authentication state and user data to the application.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user object
  const [loading, setLoading] = useState(true); // Loading state
  const [isAdmin, setIsAdmin] = useState(false); // Admin status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check if the user's email matches the admin email
        setIsAdmin(currentUser.email === 'serengetinexus@gmail.com');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 *
 * Allows components to access authentication state.
 *
 * @returns {object} - Authentication state and user data.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
