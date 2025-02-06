"use client";
import AdminLayout from "./components/AdminLayout";
import Spinner from "@/components/common/Spinner";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

/**
 * AdminProtectedLayout Component
 *
 * Protects all admin routes by ensuring only authenticated admin users can access them.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components (admin pages).
 */
const AdminProtectedLayout = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not authenticated, redirect to login
        router.push('/login');
      } else if (!isAdmin) {
        // If authenticated but not an admin, redirect to home
        router.push('/');
      }
      // If authenticated and admin, do nothing
    }
  }, [user, isAdmin, loading, router]);
  // While checking authentication, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Replace with your own loading spinner if available */}
        <Spinner />
      </div>
    );
  }

  // If authenticated and admin, render the admin layout
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminProtectedLayout;
