// app/admin/login/page.js

'use client';

import React, { useState } from 'react';
import { auth, db } from '@/app/lib/firebase'; // Import Firebase and Firestore
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext'; // Import AuthContext

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, role } = useAuth();

  // Helper function to check if user exists in Firestore
  const checkUserExists = async (email) => {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    // Return the first document if the user exists
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0];
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Check if user exists in Firestore before logging in
      const userDoc = await checkUserExists(email);
      if (!userDoc) {
        // User does not exist, redirect to operator login
        toast.error("User not found. Redirecting to operator login.");
        setLoading(false);
        setTimeout(() => {
          router.push('/');
        }, 3000); // Give time for the error message to be displayed before redirect
        return;
      }

      // Step 2: Extract user data to check their role
      const userData = userDoc.data();

      // Step 3: Handle login with Firebase authentication
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Step 4: Check if the user is an admin
        if (userData.role === 'admin') {
          // Redirect to admin dashboard if the user is an admin
          toast.success("Login successful. Redirecting to admin dashboard...");
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 2000); // Delay for toast to display
        } else {
          // If the user is not an admin (operator), redirect them
          toast.error("This account is not allowed here. Redirecting to operator login.");
          setTimeout(() => {
            router.push('/');
          }, 3000); // Delay for toast to display and redirect
        }
      } catch (authError) {
        if (authError.code === 'auth/wrong-password') {
          toast.error("Incorrect password. Please try again.");
        } else if (authError.code === 'auth/user-not-found') {
          toast.error("User not found. Redirecting to operator login.");
          setTimeout(() => {
            router.push('/operator/login');
          }, 3000);
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      }

    } catch (error) {
      console.error("Login Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">Karibu Sana</h2>
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="relative mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          <span
            className="absolute right-4 top-10 cursor-pointer text-gray-500"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    
    </div>
  );
};

export default AdminLogin;
